import React, { useState, useEffect } from 'react';
import { useKDS, type KDSFilter } from '@shared/hooks/useKDS';
import { KDSTicketCard } from '../components/KDSTicketCard';
import { MetaTags } from '@shared/components/MetaTags';
import { useAuth } from '@shared/hooks/useAuth';
import {
  ChefHat, Clock, Volume2, VolumeX, RefreshCw, Search, Filter,
  Wifi, PlusCircle, LogOut, CheckCircle2, Utensils, Store, Truck, Flame
} from 'lucide-react';

export const KDSPage: React.FC = () => {
  const { logout } = useAuth();
  const {
    incomingOrders,
    acceptedOrders,
    preparingOrders,
    readyOrders,
    totalActiveCount,
    soundEnabled,
    setSoundEnabled,
    filter,
    setFilter,
    searchQuery,
    setSearchQuery,
    connectionStatus,
    updateOrderStatus,
    refreshOrders,
    simulateNewOrder,
  } = useKDS();

  // Live Clock State (HH:MM:SS)
  const [currentTime, setCurrentTime] = useState<string>(() => new Date().toLocaleTimeString());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[#0B0C10] text-[#F4F1EA] flex flex-col p-4 sm:p-6 space-y-6">
      <MetaTags title="Kitchen Display System (KDS) | L'Étoile Noir" />

      {/* Header Bar */}
      <header className="glass-panel p-4 rounded-2xl flex flex-col lg:flex-row items-center justify-between gap-4 border border-[#D4AF37]/30 bg-[#12141C]/90 shadow-xl">
        {/* Left: Branding & Clock */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[#D4AF37] flex items-center justify-center shadow-lg">
            <ChefHat className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif text-2xl font-bold text-gold-gradient tracking-wide">
                L'Étoile Noir
              </h1>
              <span className="text-[10px] font-mono uppercase bg-[#D4AF37]/20 text-[#D4AF37] px-2 py-0.5 rounded-full font-bold">
                Pass & KDS
              </span>
            </div>
            <p className="text-xs text-gray-400 font-mono flex items-center gap-2">
              <span className="flex items-center gap-1 text-white font-bold"><Clock className="w-3.5 h-3.5 text-[#D4AF37]" /> {currentTime}</span>
              <span>•</span>
              <span>Active Tickets: <strong className="text-[#D4AF37]">{totalActiveCount}</strong></span>
            </p>
          </div>
        </div>

        {/* Right: Controls (Realtime, Audio, Refresh, Demo, Logout) */}
        <div className="flex flex-wrap items-center gap-3 text-xs">
          {/* Connection Badge */}
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-mono font-semibold border ${
            connectionStatus === 'Connected'
              ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
              : connectionStatus === 'Connecting'
              ? 'bg-amber-500/15 border-amber-500/30 text-amber-400'
              : 'bg-red-500/15 border-red-500/30 text-red-400'
          }`}>
            <Wifi className="w-3.5 h-3.5 animate-pulse" />
            <span>{connectionStatus}</span>
          </div>

          {/* Sound Toggle */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border transition-all cursor-pointer ${
              soundEnabled
                ? 'bg-[#D4AF37]/20 border-[#D4AF37] text-[#D4AF37] font-bold'
                : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
            }`}
            title={soundEnabled ? 'Disable Order Sound Chime' : 'Enable Order Sound Chime'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            <span className="hidden sm:inline">{soundEnabled ? 'Chime ON' : 'Chime Muted'}</span>
          </button>

          {/* Refresh / Reconnect Button */}
          <button
            onClick={() => refreshOrders()}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-white/15 bg-white/5 text-gray-300 hover:text-white cursor-pointer transition-colors"
            title="Refresh Order Stream"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          {/* Demo Order Simulator */}
          <button
            onClick={() => simulateNewOrder()}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#D4AF37] text-[#0B0C10] font-bold text-xs uppercase tracking-wider hover:opacity-90 cursor-pointer shadow-md"
            title="Inject Mock Demo Ticket"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>+ Demo Ticket</span>
          </button>

          {/* Exit / Logout Button */}
          <button
            onClick={() => logout()}
            className="p-2 rounded-full border border-white/10 text-gray-400 hover:text-red-400 cursor-pointer transition-colors"
            title="Logout of Kitchen Display"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Filter Bar & Search */}
      <div className="glass-panel p-3.5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs bg-[#12141C]/80">
        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          <span className="text-gray-400 font-semibold flex items-center gap-1 mr-1">
            <Filter className="w-3.5 h-3.5 text-[#D4AF37]" /> Filter:
          </span>

          {[
            { id: 'ALL', label: 'All Active', icon: ChefHat },
            { id: 'DINE_IN', label: 'Dine-In', icon: Utensils },
            { id: 'PICKUP', label: 'Pickup', icon: Store },
            { id: 'DELIVERY', label: 'Delivery', icon: Truck },
            { id: 'URGENT', label: 'Urgent (>10m)', icon: Flame },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = filter === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setFilter(item.id as KDSFilter)}
                className={`px-3 py-1.5 rounded-xl border flex items-center gap-1.5 transition-all cursor-pointer font-semibold whitespace-nowrap ${
                  isActive
                    ? 'bg-[#D4AF37] border-[#D4AF37] text-[#0B0C10] shadow-md font-bold'
                    : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" /> {item.label}
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search ticket # or dish..."
            className="w-full bg-[#0B0C10] border border-white/15 rounded-xl pl-9 pr-4 py-1.5 text-xs text-[#F4F1EA] focus:outline-none focus:border-[#D4AF37]"
          />
        </div>
      </div>

      {/* 4-Column Kanban Board */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 overflow-x-auto min-h-[500px]">
        {/* Column 1: Incoming Orders (PENDING) */}
        <div className="glass-panel p-4 rounded-2xl space-y-4 border-t-4 border-t-blue-500 bg-[#12141C]/80 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-blue-500 animate-pulse" />
                <h3 className="font-serif font-bold text-sm text-blue-400 tracking-wide uppercase">
                  1. Incoming
                </h3>
              </div>
              <span className="bg-blue-500/20 text-blue-300 border border-blue-500/40 px-2.5 py-0.5 rounded-full font-mono text-xs font-bold">
                {incomingOrders.length}
              </span>
            </div>

            <div className="space-y-3 overflow-y-auto max-h-[calc(100vh-280px)] pr-1">
              {incomingOrders.length === 0 ? (
                <div className="text-center py-12 text-gray-500 text-xs font-serif space-y-1">
                  <CheckCircle2 className="w-8 h-8 mx-auto opacity-30 text-blue-400" />
                  <p>No incoming tickets</p>
                </div>
              ) : (
                incomingOrders.map((o) => (
                  <KDSTicketCard key={o.id} order={o} onUpdateStatus={updateOrderStatus} />
                ))
              )}
            </div>
          </div>
        </div>

        {/* Column 2: Accepted Orders (ACCEPTED) */}
        <div className="glass-panel p-4 rounded-2xl space-y-4 border-t-4 border-t-purple-500 bg-[#12141C]/80 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-purple-500" />
                <h3 className="font-serif font-bold text-sm text-purple-400 tracking-wide uppercase">
                  2. Accepted
                </h3>
              </div>
              <span className="bg-purple-500/20 text-purple-300 border border-purple-500/40 px-2.5 py-0.5 rounded-full font-mono text-xs font-bold">
                {acceptedOrders.length}
              </span>
            </div>

            <div className="space-y-3 overflow-y-auto max-h-[calc(100vh-280px)] pr-1">
              {acceptedOrders.length === 0 ? (
                <div className="text-center py-12 text-gray-500 text-xs font-serif space-y-1">
                  <CheckCircle2 className="w-8 h-8 mx-auto opacity-30 text-purple-400" />
                  <p>No accepted tickets</p>
                </div>
              ) : (
                acceptedOrders.map((o) => (
                  <KDSTicketCard key={o.id} order={o} onUpdateStatus={updateOrderStatus} />
                ))
              )}
            </div>
          </div>
        </div>

        {/* Column 3: In Prep (PREPARING) */}
        <div className="glass-panel p-4 rounded-2xl space-y-4 border-t-4 border-t-[#D4AF37] bg-[#12141C]/80 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#D4AF37] animate-pulse" />
                <h3 className="font-serif font-bold text-sm text-[#D4AF37] tracking-wide uppercase">
                  3. In Preparation
                </h3>
              </div>
              <span className="bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/40 px-2.5 py-0.5 rounded-full font-mono text-xs font-bold">
                {preparingOrders.length}
              </span>
            </div>

            <div className="space-y-3 overflow-y-auto max-h-[calc(100vh-280px)] pr-1">
              {preparingOrders.length === 0 ? (
                <div className="text-center py-12 text-gray-500 text-xs font-serif space-y-1">
                  <CheckCircle2 className="w-8 h-8 mx-auto opacity-30 text-[#D4AF37]" />
                  <p>No tickets in prep</p>
                </div>
              ) : (
                preparingOrders.map((o) => (
                  <KDSTicketCard key={o.id} order={o} onUpdateStatus={updateOrderStatus} />
                ))
              )}
            </div>
          </div>
        </div>

        {/* Column 4: Ready for Pass (READY) */}
        <div className="glass-panel p-4 rounded-2xl space-y-4 border-t-4 border-t-emerald-500 bg-[#12141C]/80 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-500" />
                <h3 className="font-serif font-bold text-sm text-emerald-400 tracking-wide uppercase">
                  4. Ready for Pass
                </h3>
              </div>
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2.5 py-0.5 rounded-full font-mono text-xs font-bold">
                {readyOrders.length}
              </span>
            </div>

            <div className="space-y-3 overflow-y-auto max-h-[calc(100vh-280px)] pr-1">
              {readyOrders.length === 0 ? (
                <div className="text-center py-12 text-gray-500 text-xs font-serif space-y-1">
                  <CheckCircle2 className="w-8 h-8 mx-auto opacity-30 text-emerald-400" />
                  <p>No tickets on pass</p>
                </div>
              ) : (
                readyOrders.map((o) => (
                  <KDSTicketCard key={o.id} order={o} onUpdateStatus={updateOrderStatus} />
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
