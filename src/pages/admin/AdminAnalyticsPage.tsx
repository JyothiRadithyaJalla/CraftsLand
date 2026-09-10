import React from 'react';
import { MetaTags } from '../../components/common/MetaTags';

export const AdminAnalyticsPage: React.FC = () => (
  <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
    <MetaTags title="Admin Analytics | L'Étoile Noir" />
    <h1 className="font-serif text-3xl font-bold text-gold-gradient">Detailed Analytics & Sales Reports</h1>
    <div className="glass-panel p-6 rounded-2xl text-xs text-gray-400">Hourly sales traffic, peak hour metrics, and revenue breakdown.</div>
  </div>
);
