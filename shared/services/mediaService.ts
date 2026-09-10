import { env } from '../config/env';

export class MediaService {
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
}
