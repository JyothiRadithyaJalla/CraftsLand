import React from 'react';
import { MetaTags } from '../../components/common/MetaTags';

export const AdminCustomersPage: React.FC = () => (
  <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
    <MetaTags title="Admin Customer CRM | L'Étoile Noir" />
    <h1 className="font-serif text-3xl font-bold text-gold-gradient">Customer Directory (CRM)</h1>
    <div className="glass-panel p-6 rounded-2xl text-xs text-gray-400">Registered guest directory and dining history.</div>
  </div>
);

export const AdminReviewsPage: React.FC = () => (
  <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
    <MetaTags title="Admin Reviews | L'Étoile Noir" />
    <h1 className="font-serif text-3xl font-bold text-gold-gradient">Review Moderation</h1>
    <div className="glass-panel p-6 rounded-2xl text-xs text-gray-400">Moderate customer ratings and published feedback.</div>
  </div>
);

export const AdminOffersPage: React.FC = () => (
  <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
    <MetaTags title="Admin Offers | L'Étoile Noir" />
    <h1 className="font-serif text-3xl font-bold text-gold-gradient">Promo Codes & Offers</h1>
    <div className="glass-panel p-6 rounded-2xl text-xs text-gray-400">Manage promotional discount codes and validity dates.</div>
  </div>
);

export const AdminEventsPage: React.FC = () => (
  <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
    <MetaTags title="Admin Events | L'Étoile Noir" />
    <h1 className="font-serif text-3xl font-bold text-gold-gradient">Private Event Requests</h1>
    <div className="glass-panel p-6 rounded-2xl text-xs text-gray-400">VIP Private Vault event inquiries and requests.</div>
  </div>
);

export const AdminGalleryPage: React.FC = () => (
  <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
    <MetaTags title="Admin Media Gallery | L'Étoile Noir" />
    <h1 className="font-serif text-3xl font-bold text-gold-gradient">Media Gallery Asset Manager</h1>
    <div className="glass-panel p-6 rounded-2xl text-xs text-gray-400">Cloudflare R2 image and video asset manager.</div>
  </div>
);

export const AdminAnalyticsPage: React.FC = () => (
  <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
    <MetaTags title="Admin Analytics | L'Étoile Noir" />
    <h1 className="font-serif text-3xl font-bold text-gold-gradient">Detailed Analytics & Sales Reports</h1>
    <div className="glass-panel p-6 rounded-2xl text-xs text-gray-400">Hourly sales traffic, peak hour metrics, and revenue breakdown.</div>
  </div>
);

export const AdminSettingsPage: React.FC = () => (
  <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
    <MetaTags title="Admin Settings | L'Étoile Noir" />
    <h1 className="font-serif text-3xl font-bold text-gold-gradient">Restaurant Settings</h1>
    <div className="glass-panel p-6 rounded-2xl text-xs text-gray-400">Configure operating hours, tax rate, delivery fees, and open/closed store status.</div>
  </div>
);
