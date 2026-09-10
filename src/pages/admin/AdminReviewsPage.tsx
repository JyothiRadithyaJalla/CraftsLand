import React from 'react';
import { MetaTags } from '../../components/common/MetaTags';

export const AdminReviewsPage: React.FC = () => (
  <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
    <MetaTags title="Admin Reviews | L'Étoile Noir" />
    <h1 className="font-serif text-3xl font-bold text-gold-gradient">Review Moderation</h1>
    <div className="glass-panel p-6 rounded-2xl text-xs text-gray-400">Moderate customer ratings and published feedback.</div>
  </div>
);
