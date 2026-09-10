import React from 'react';
import { MetaTags } from '../../components/common/MetaTags';

export const AdminOffersPage: React.FC = () => (
  <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
    <MetaTags title="Admin Offers | L'Étoile Noir" />
    <h1 className="font-serif text-3xl font-bold text-gold-gradient">Promo Codes & Offers</h1>
    <div className="glass-panel p-6 rounded-2xl text-xs text-gray-400">Manage promotional discount codes and validity dates.</div>
  </div>
);
