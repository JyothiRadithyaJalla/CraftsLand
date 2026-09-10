import React from 'react';
import { MetaTags } from '../../components/common/MetaTags';

export const AdminSettingsPage: React.FC = () => (
  <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
    <MetaTags title="Admin Settings | L'Étoile Noir" />
    <h1 className="font-serif text-3xl font-bold text-gold-gradient">Restaurant Platform Settings</h1>
    <div className="glass-panel p-6 rounded-2xl text-xs text-gray-400">Configure operating hours, tax rate, delivery fees, and open/closed store status.</div>
  </div>
);
