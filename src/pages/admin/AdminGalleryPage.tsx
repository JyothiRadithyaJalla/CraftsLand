import React from 'react';
import { MetaTags } from '../../components/common/MetaTags';

export const AdminGalleryPage: React.FC = () => (
  <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
    <MetaTags title="Admin Media Gallery | L'Étoile Noir" />
    <h1 className="font-serif text-3xl font-bold text-gold-gradient">Media Gallery Asset Manager</h1>
    <div className="glass-panel p-6 rounded-2xl text-xs text-gray-400">Cloudflare R2 image and video asset manager.</div>
  </div>
);
