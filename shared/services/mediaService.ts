import { env } from '../config/env';
import { supabase } from './supabaseClient';

export interface VideoTransformOptions {
  width?: number;
  quality?: 'auto' | 'low' | 'good' | 'best';
  format?: 'auto' | 'mp4' | 'webm';
}

export interface VideoValidationResult {
  valid: boolean;
  error?: string;
  file?: File;
  fileSizeMb?: number;
}

export interface CloudinaryUploadResult {
  videoUrl: string;
  videoPublicId: string;
  videoPosterUrl: string;
  videoDuration: number;
  videoStatus: 'READY';
  rawResponse?: any;
}

export interface VideoUploadProgress {
  loaded: number;
  total: number;
  percent: number;
}

export class MediaService {
  static readonly ALLOWED_MIME_TYPES = [
    'video/mp4',
    'video/webm',
    'video/quicktime',
    'video/ogg',
    'video/x-m4v',
  ];

  static readonly MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024; // 50 MB

  /**
   * Validates local video file format and file size limit.
   */
  static validateVideoFile(file: File): VideoValidationResult {
    if (!file) {
      return { valid: false, error: 'No video file selected.' };
    }

    const fileSizeMb = Number((file.size / (1024 * 1024)).toFixed(2));
    const fileType = (file.type || '').toLowerCase();
    const fileName = (file.name || '').toLowerCase();

    const isAllowedMime =
      this.ALLOWED_MIME_TYPES.includes(fileType) ||
      (fileType.startsWith('video/') &&
        (fileName.endsWith('.mp4') ||
          fileName.endsWith('.webm') ||
          fileName.endsWith('.mov') ||
          fileName.endsWith('.ogg') ||
          fileName.endsWith('.m4v')));

    if (!isAllowedMime) {
      return {
        valid: false,
        error: `Invalid file format (${file.type || 'unknown'}). Please upload a valid food video in MP4, WebM, or MOV format.`,
        fileSizeMb,
      };
    }

    if (file.size > this.MAX_FILE_SIZE_BYTES) {
      return {
        valid: false,
        error: `File size exceeds the 50 MB production limit (${fileSizeMb} MB). Please compress the video before uploading.`,
        fileSizeMb,
      };
    }

    return { valid: true, file, fileSizeMb };
  }

  /**
   * Extracts duration and dimensions from a local video file.
   */
  static async getVideoMetadata(file: File): Promise<{ duration: number; width: number; height: number }> {
    return new Promise((resolve) => {
      if (typeof window === 'undefined' || typeof document === 'undefined') {
        return resolve({ duration: 0, width: 0, height: 0 });
      }

      try {
        const video = document.createElement('video');
        video.preload = 'metadata';
        const objectUrl = URL.createObjectURL(file);

        video.onloadedmetadata = () => {
          URL.revokeObjectURL(objectUrl);
          resolve({
            duration: Number((video.duration || 0).toFixed(2)),
            width: video.videoWidth || 0,
            height: video.videoHeight || 0,
          });
        };

        video.onerror = () => {
          URL.revokeObjectURL(objectUrl);
          resolve({ duration: 0, width: 0, height: 0 });
        };

        video.src = objectUrl;
      } catch {
        resolve({ duration: 0, width: 0, height: 0 });
      }
    });
  }

  /**
   * Uploads a validated video to Cloudinary via server-signed upload (or unsigned preset fallback).
   */
  static async uploadVideoToCloudinary(
    file: File,
    options: {
      onProgress?: (progress: VideoUploadProgress) => void;
      signal?: AbortSignal;
      folder?: string;
    } = {}
  ): Promise<CloudinaryUploadResult> {
    const validation = this.validateVideoFile(file);
    if (!validation.valid) {
      throw new Error(validation.error || 'Video validation failed.');
    }

    if (options.signal?.aborted) {
      throw new DOMException('Upload aborted by user', 'AbortError');
    }

    let cloudName = env.cloudinaryCloudName;
    let apiKey = env.cloudinaryApiKey;
    let timestamp: number | undefined;
    let signature: string | undefined;
    let uploadPreset = env.cloudinaryUploadPreset;
    let folder = options.folder || 'craftsland/dishes';

    // Request secure signature from Supabase Edge Function
    try {
      const { data: sigData, error: sigError } = await supabase.functions.invoke(
        'create-cloudinary-signature',
        {
          body: { folder },
        }
      );

      if (!sigError && sigData?.signature && sigData?.cloudName) {
        signature = sigData.signature;
        timestamp = sigData.timestamp;
        apiKey = sigData.apiKey;
        cloudName = sigData.cloudName;
        folder = sigData.folder || folder;
      } else if (sigData?.code === 'CLOUDINARY_NOT_CONFIGURED') {
        if (!uploadPreset || !cloudName) {
          throw new Error(
            'Cloudinary is not configured on the server. Please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in Supabase secrets.'
          );
        }
      }
    } catch (invokeErr: any) {
      if (invokeErr.name === 'AbortError') throw invokeErr;
      if (!uploadPreset || !cloudName) {
        throw new Error(
          invokeErr.message || 'Failed to generate secure upload signature. Please ensure Admin is authenticated.'
        );
      }
    }

    if (!cloudName) {
      throw new Error('Cloudinary cloud name is missing from configuration.');
    }

    const formData = new FormData();
    formData.append('file', file);

    if (signature && apiKey && timestamp) {
      formData.append('api_key', apiKey);
      formData.append('timestamp', String(timestamp));
      formData.append('signature', signature);
      formData.append('folder', folder);
    } else if (uploadPreset) {
      formData.append('upload_preset', uploadPreset);
      formData.append('folder', folder);
    } else {
      throw new Error('No valid signature or upload preset available for Cloudinary upload.');
    }

    const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/video/upload`;

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', uploadUrl);

      if (options.signal) {
        options.signal.addEventListener('abort', () => {
          xhr.abort();
          reject(new DOMException('Upload aborted by user', 'AbortError'));
        });
      }

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable && options.onProgress) {
          const percent = Math.min(100, Math.round((event.loaded / event.total) * 100));
          options.onProgress({
            loaded: event.loaded,
            total: event.total,
            percent,
          });
        }
      };

      xhr.onload = () => {
        let responseJson: any;
        try {
          responseJson = JSON.parse(xhr.responseText);
        } catch {
          return reject(new Error(`Failed to parse Cloudinary response (HTTP ${xhr.status})`));
        }

        if (xhr.status >= 200 && xhr.status < 300) {
          if (!responseJson.secure_url || !responseJson.public_id) {
            return reject(new Error('Cloudinary response missing secure_url or public_id'));
          }

          const videoUrl = responseJson.secure_url;
          const videoPublicId = responseJson.public_id;
          const videoDuration = Number((responseJson.duration || 0).toFixed(2));
          const videoPosterUrl = MediaService.getVideoPosterUrl(videoUrl);

          resolve({
            videoUrl,
            videoPublicId,
            videoPosterUrl,
            videoDuration,
            videoStatus: 'READY',
            rawResponse: responseJson,
          });
        } else {
          const errMsg = responseJson?.error?.message || `Cloudinary upload failed with status ${xhr.status}`;
          reject(new Error(errMsg));
        }
      };

      xhr.onerror = () => {
        reject(new Error('Network error during video upload to Cloudinary. Please check your internet connection.'));
      };

      xhr.ontimeout = () => {
        reject(new Error('Video upload timed out. Please try again.'));
      };

      xhr.send(formData);
    });
  }

  /**
   * Safely deletes an old Cloudinary asset through the backend Edge Function.
   */
  static async destroyCloudinaryAsset(publicId: string): Promise<boolean> {
    if (!publicId) return false;
    try {
      const { data, error } = await supabase.functions.invoke('create-cloudinary-signature', {
        body: { action: 'destroy_asset', public_id: publicId },
      });
      return !error && data?.success;
    } catch {
      return false;
    }
  }

  /**
   * Resolves image or media asset URL.
   */
  static resolveMediaUrl(pathOrUrl: string): string {
    if (!pathOrUrl) return '/media/placeholder-food.jpg';
    if (pathOrUrl.startsWith('http://') || pathOrUrl.startsWith('https://')) {
      return pathOrUrl;
    }
    if (env.isProduction && env.mediaBaseUrl) {
      return `${env.mediaBaseUrl.replace(/\/$/, '')}/${pathOrUrl.replace(/^\//, '')}`;
    }
    return pathOrUrl;
  }

  /**
   * Generates a bandwidth-optimized Cloudinary delivery URL for food videos.
   * Injects automatic quality compression (q_auto), codec optimization (vc_auto),
   * and auto format selection (f_auto).
   */
  static getOptimizedVideoUrl(urlOrPublicId: string, options: VideoTransformOptions = {}): string {
    if (!urlOrPublicId) return '';
    const resolved = this.resolveMediaUrl(urlOrPublicId);

    // If it is a Cloudinary video URL, inject optimal transformation flags
    if (resolved.includes('res.cloudinary.com') && resolved.includes('/video/upload/')) {
      // Check if transformation has already been applied
      if (resolved.includes('/video/upload/q_auto')) {
        return resolved;
      }
      const { width = 720, quality = 'auto', format = 'auto' } = options;
      const transform = `q_${quality},vc_auto,f_${format}${width ? `,w_${width}` : ''}`;
      return resolved.replace('/video/upload/', `/video/upload/${transform}/`);
    }

    return resolved;
  }

  /**
   * Generates a fast first-paint poster frame from a Cloudinary video URL.
   */
  static getVideoPosterUrl(videoUrl: string): string {
    if (!videoUrl) return '/media/placeholder-food.jpg';
    if (videoUrl.includes('res.cloudinary.com') && videoUrl.includes('/video/upload/')) {
      if (videoUrl.includes('/video/upload/so_0')) {
        return videoUrl;
      }
      // Cloudinary allows extracting frame at offset 0s as jpg
      return videoUrl
        .replace('/video/upload/', '/video/upload/so_0,f_jpg,q_auto,w_720/')
        .replace(/\.[a-zA-Z0-9]+$/, '.jpg');
    }
    return videoUrl;
  }
}
