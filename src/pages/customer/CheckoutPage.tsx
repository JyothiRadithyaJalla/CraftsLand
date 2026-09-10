import React from 'react';
import { MetaTags } from '../../components/common/MetaTags';

export const CheckoutPage: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 space-y-6 text-center">
      <MetaTags title="Checkout | L'Étoile Noir" />
      <div className="glass-panel p-8 rounded-2xl space-y-4">
        <h1 className="font-serif text-3xl font-bold text-gold-gradient">Checkout Portal</h1>
        <p className="text-gray-400 text-sm">Select order mode (Dine-In, Pickup, Delivery) and finalize payment authentication.</p>
      </div>
    </div>
  );
};
