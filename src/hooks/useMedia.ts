import { MediaService } from '../services/mediaService';

export const useMedia = () => {
  const getMediaUrl = (pathOrUrl: string) => {
    return MediaService.resolveMediaUrl(pathOrUrl);
  };

  return { getMediaUrl };
};
