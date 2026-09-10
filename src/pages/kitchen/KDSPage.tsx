import React from 'react';
import { useKDS } from '../../hooks/useKDS';
import { MetaTags } from '../../components/common/MetaTags';
import { Clock, ChefHat } from 'lucide-react';

export const KDSPage: React.FC = () => {
  const { newOrders, acceptedOrders, preparingOrders, readyOrders, updateOrderStatus } = useKDS();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      <MetaTags title="Kitchen Display System (KDS) | L'Étoile Noir" />
      <div className="flex justify-between items-center border-b border-[#D4AF37]/20 pb-4">
        <div className="flex items-center gap-3">
          <ChefHat className="w-8 h-8 text-[#D4AF37]" />
          <div>
            <h1 className="font-serif text-3xl font-bold text-gold-gradient">Kitchen Display System (KDS)</h1>
            <p className="text-xs text-gray-400">Realtime kitchen prep stream & elapsed order tickets</p>
          </div>
        </div>
      </div>

      {/* Kanban Board Columns */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        
        {/* New / Incoming Column */}
        <div className="glass-panel p-4 rounded-xl space-y-3">
          <h3 className="font-serif font-bold text-xs uppercase tracking-wider text-blue-400 flex justify-between">
            <span>New Orders</span>
            <span className="bg-blue-400/20 px-2 py-0.5 rounded-full">{newOrders.length}</span>
          </h3>
          {newOrders.map((o) => (
            <div key={o.id} className="glass-card p-3 rounded-lg border-l-4 border-blue-400 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="font-bold text-white">{o.orderNumber}</span>
                <span className="text-[#D4AF37] font-mono">{o.orderType}</span>
              </div>
              <button onClick={() => updateOrderStatus(o.id, 'ACCEPTED')} className="w-full py-1 bg-blue-500/20 text-blue-400 text-xs rounded hover:bg-blue-500/30 cursor-pointer">
                Accept Order
              </button>
            </div>
          ))}
        </div>

        {/* Accepted Column */}
        <div className="glass-panel p-4 rounded-xl space-y-3">
          <h3 className="font-serif font-bold text-xs uppercase tracking-wider text-purple-400 flex justify-between">
            <span>Accepted</span>
            <span className="bg-purple-400/20 px-2 py-0.5 rounded-full">{acceptedOrders.length}</span>
          </h3>
          {acceptedOrders.map((o) => (
            <div key={o.id} className="glass-card p-3 rounded-lg border-l-4 border-purple-400 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="font-bold text-white">{o.orderNumber}</span>
              </div>
              <button onClick={() => updateOrderStatus(o.id, 'PREPARING')} className="w-full py-1 bg-purple-500/20 text-purple-400 text-xs rounded hover:bg-purple-500/30 cursor-pointer">
                Start Prep
              </button>
            </div>
          ))}
        </div>

        {/* Preparing Column */}
        <div className="glass-panel p-4 rounded-xl space-y-3">
          <h3 className="font-serif font-bold text-xs uppercase tracking-wider text-[#D4AF37] flex justify-between">
            <span>In Preparation</span>
            <span className="bg-[#D4AF37]/20 px-2 py-0.5 rounded-full">{preparingOrders.length}</span>
          </h3>
          {preparingOrders.map((o) => (
            <div key={o.id} className="glass-card p-3 rounded-lg border-l-4 border-[#D4AF37] space-y-2">
              <div className="flex justify-between text-xs">
                <span className="font-bold text-white">{o.orderNumber}</span>
                <span className="text-xs text-[#D4AF37] flex items-center gap-1"><Clock className="w-3 h-3" /> Prep</span>
              </div>
              <button onClick={() => updateOrderStatus(o.id, 'READY')} className="w-full py-1 bg-[#D4AF37]/20 text-[#D4AF37] text-xs rounded hover:bg-[#D4AF37]/30 cursor-pointer">
                Mark Ready
              </button>
            </div>
          ))}
        </div>

        {/* Ready Column */}
        <div className="glass-panel p-4 rounded-xl space-y-3">
          <h3 className="font-serif font-bold text-xs uppercase tracking-wider text-emerald-400 flex justify-between">
            <span>Ready for Pass</span>
            <span className="bg-emerald-400/20 px-2 py-0.5 rounded-full">{readyOrders.length}</span>
          </h3>
          {readyOrders.map((o) => (
            <div key={o.id} className="glass-card p-3 rounded-lg border-l-4 border-emerald-400 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="font-bold text-white">{o.orderNumber}</span>
              </div>
              <button onClick={() => updateOrderStatus(o.id, 'COMPLETED')} className="w-full py-1 bg-emerald-500/20 text-emerald-400 text-xs rounded hover:bg-emerald-500/30 cursor-pointer">
                Complete Order
              </button>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};
