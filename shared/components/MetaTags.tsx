import React, { useEffect } from 'react';

interface MetaTagsProps {
  title?: string;
  description?: string;
}

export const MetaTags: React.FC<MetaTagsProps> = ({
  title = "L'Étoile Noir — Haute Cuisine & Sensory Dining",
  description = "An extraordinary culinary destination featuring haute cuisine, artisanal cocktails, private dining experiences, and sensory gastronomy.",
}) => {
  useEffect(() => {
    document.title = title;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', description);
    }
  }, [title, description]);

  return null;
};
