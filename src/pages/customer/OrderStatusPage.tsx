import React from 'react';
import { useParams } from 'react-router-dom';
import { MetaTags } from '../../components/common/MetaTags';
import { Clock, CheckCircle2 } from 'lucide-react';

export const OrderStatusPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 space-y-6 text-center">
      <MetaTags title="Order Status Tracking | L'Étoile Noir" />
      <div className="glass-panel p-8 rounded-2xl space-y-4">
        <div className="w-12 h-12 rounded-full bg-[#D4AF37]/10 text-[#D4AF37] flex items-center justify-center mx-auto">
          <Clock className="w-6 h-6" />
        </div>
        <h1 className="font-serif text-3xl font-bold text-gold-gradient">Live Culinary Progress</h1>
        <p className="text-gray-400 text-sm">Tracking order ticket: <span className="font-mono text-[#D4AF37]">{id || '#LNO-8921'}</span></p>

        <div className="flex justify-between items-center max-w-md mx-auto pt-6 text-xs text-gray-400">
          <div className="flex flex-col items-center text-[#D4AF37] font-semibold"><CheckCircle2 className="w-5 h-5 mb-1" /> Placed</div>
          <div className="flex flex-col items-center text-[#D4AF37] font-semibold"><CheckCircle2 className="w-5 h-5 mb-1" /> Accepted</div>
          <div className="flex flex-col items-center text-[#D4AF37] font-semibold animate-pulse"><Clock className="w-5 h-5 mb-1" /> Kitchen Prep</div>
          <div className="flex flex-col items-center opacity-40"><CheckCircle2 className="w-5 h-5 mb-1" /> Ready</div>
        </div>
      </div>
    </div>
  );
};
