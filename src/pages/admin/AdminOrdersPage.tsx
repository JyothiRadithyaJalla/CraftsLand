import React from 'react';
import { MetaTags } from '../../components/common/MetaTags';

export const AdminOrdersPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      <MetaTags title="Admin Orders Queue | L'Étoile Noir" />
      <h1 className="font-serif text-3xl font-bold text-gold-gradient">Order Queue & Ticket History</h1>
      <div className="glass-panel p-6 rounded-2xl text-xs text-gray-400">
        Live incoming orders stream with manual status overrides.
      </div>
    </div>
  );
};
