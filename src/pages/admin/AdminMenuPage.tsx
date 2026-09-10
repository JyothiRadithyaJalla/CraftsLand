import React from 'react';
import { MetaTags } from '../../components/common/MetaTags';

export const AdminMenuPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      <MetaTags title="Admin Menu Management | L'Étoile Noir" />
      <h1 className="font-serif text-3xl font-bold text-gold-gradient">Menu Item Management</h1>
      <div className="glass-panel p-6 rounded-2xl text-xs text-gray-400">
        CRUD editor table for categories, dish prices, availability toggles, and modifiers.
      </div>
    </div>
  );
};
