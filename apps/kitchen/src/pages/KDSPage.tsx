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
    <div className="min-h-screen bg-[#FAFAF7] text-[#1A1714] flex flex-col p-4 sm:p-6 space-y-6">
      <MetaTags title="Kitchen Display System (KDS) | Craftsland" />

      {/* Header Bar */}
      <header className="bg-[#FFFFFF] p-4 rounded-2xl flex flex-col lg:flex-row items-center justify-between gap-4 border border-[#E2DDD6] shadow-sm">
        {/* Left: Branding & Clock */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#C85A3A] to-[#B84A32] text-white flex items-center justify-center shadow-sm">
            <ChefHat className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif text-2xl font-bold text-red-gradient tracking-wide">
                Craftsland
              </h1>
              <span className="text-[10px] font-mono uppercase bg-[#B84A32]/10 text-[#B84A32] border border-[#B84A32]/20 px-2 py-0.5 rounded-full font-bold">
                Pass & KDS
              </span>
            </div>
            <p className="text-xs text-[#6B6560] font-mono flex items-center gap-2">
              <span className="flex items-center gap-1 text-[#1A1714] font-bold"><Clock className="w-3.5 h-3.5 text-[#B84A32]" /> {currentTime}</span>
              <span>•</span>
              <span>Active Tickets: <strong className="text-[#B84A32]">{totalActiveCount}</strong></span>
            </p>
          </div>
        </div>

        {/* Right: Controls (Realtime, Audio, Refresh, Demo, Logout) */}
        <div className="flex flex-wrap items-center gap-3 text-xs">
          {/* Connection Badge */}
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-mono font-semibold border ${
            connectionStatus === 'Connected'
              ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
              : connectionStatus === 'Connecting'
              ? 'bg-amber-50 border-amber-300 text-amber-700'
              : 'bg-red-50 border-red-300 text-red-700'
          }`}>
            <Wifi className="w-3.5 h-3.5 animate-pulse" />
            <span>{connectionStatus}</span>
          </div>

          {/* Sound Toggle */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border transition-all cursor-pointer font-medium ${
              soundEnabled
                ? 'bg-[#B84A32]/10 border-[#B84A32] text-[#B84A32] font-bold'
                : 'bg-[#F5F2EE] border-[#E2DDD6] text-[#6B6560] hover:text-[#1A1714]'
            }`}
            title={soundEnabled ? 'Disable Order Sound Chime' : 'Enable Order Sound Chime'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            <span className="hidden sm:inline">{soundEnabled ? 'Chime ON' : 'Chime Muted'}</span>
          </button>

          {/* Refresh / Reconnect Button */}
          <button
            onClick={() => refreshOrders()}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-[#E2DDD6] bg-[#F5F2EE] text-[#1A1714] hover:text-[#B84A32] cursor-pointer transition-colors"
            title="Refresh Order Stream"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          {/* Demo Order Simulator */}
          <button
            onClick={() => simulateNewOrder()}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-[#B84A32] to-[#8B3525] text-white font-bold text-xs uppercase tracking-wider hover:brightness-110 cursor-pointer shadow-sm transition-all"
            title="Inject Mock Demo Ticket"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>+ Demo Ticket</span>
          </button>

          {/* Exit / Logout Button */}
          <button
            onClick={() => logout()}
            className="p-2 rounded-full border border-[#E2DDD6] text-[#6B6560] hover:text-red-600 cursor-pointer transition-colors"
            title="Logout of Kitchen Display"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Filter Bar & Search */}
      <div className="bg-[#FFFFFF] p-3.5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs border border-[#E2DDD6] shadow-sm">
        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          <span className="text-[#6B6560] font-semibold flex items-center gap-1 mr-1">
            <Filter className="w-3.5 h-3.5 text-[#B84A32]" /> Filter:
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
                    ? 'bg-[#B84A32] border-[#B84A32] text-white shadow-sm font-bold'
                    : 'bg-[#F5F2EE] border-[#E2DDD6] text-[#6B6560] hover:text-[#B84A32]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" /> {item.label}
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-[#6B6560]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search ticket # or dish..."
            className="w-full bg-[#FFFFFF] border border-[#E2DDD6] rounded-xl pl-9 pr-4 py-1.5 text-xs text-[#1A1714] focus:outline-none focus:border-[#B84A32]"
          />
        </div>
      </div>

      {/* 4-Column Kanban Board */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 overflow-x-auto min-h-[500px]">
        {/* Column 1: Incoming Orders (PENDING) */}
        <div className="bg-[#FFFFFF] p-4 rounded-2xl space-y-4 border-t-4 border-t-blue-500 border border-[#E2DDD6] shadow-sm flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-[#E2DDD6] pb-2.5">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-blue-500 animate-pulse" />
                <h3 className="font-serif font-bold text-sm text-blue-700 tracking-wide uppercase">
                  1. Incoming
                </h3>
              </div>
              <span className="bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-0.5 rounded-full font-mono text-xs font-bold">
                {incomingOrders.length}
              </span>
            </div>

            <div className="space-y-3 overflow-y-auto max-h-[calc(100vh-280px)] pr-1">
              {incomingOrders.length === 0 ? (
                <div className="text-center py-12 text-[#6B6560] text-xs font-serif space-y-1">
                  <CheckCircle2 className="w-8 h-8 mx-auto opacity-30 text-blue-500" />
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
        <div className="bg-[#FFFFFF] p-4 rounded-2xl space-y-4 border-t-4 border-t-purple-500 border border-[#E2DDD6] shadow-sm flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-[#E2DDD6] pb-2.5">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-purple-500" />
                <h3 className="font-serif font-bold text-sm text-purple-700 tracking-wide uppercase">
                  2. Accepted
                </h3>
              </div>
              <span className="bg-purple-50 text-purple-700 border border-purple-200 px-2.5 py-0.5 rounded-full font-mono text-xs font-bold">
                {acceptedOrders.length}
              </span>
            </div>

            <div className="space-y-3 overflow-y-auto max-h-[calc(100vh-280px)] pr-1">
              {acceptedOrders.length === 0 ? (
                <div className="text-center py-12 text-[#6B6560] text-xs font-serif space-y-1">
                  <CheckCircle2 className="w-8 h-8 mx-auto opacity-30 text-purple-500" />
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
        <div className="bg-[#FFFFFF] p-4 rounded-2xl space-y-4 border-t-4 border-t-[#B84A32] border border-[#E2DDD6] shadow-sm flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-[#E2DDD6] pb-2.5">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#B84A32] animate-pulse" />
                <h3 className="font-serif font-bold text-sm text-[#B84A32] tracking-wide uppercase">
                  3. In Preparation
                </h3>
              </div>
              <span className="bg-[#B84A32]/10 text-[#B84A32] border border-[#B84A32]/20 px-2.5 py-0.5 rounded-full font-mono text-xs font-bold">
                {preparingOrders.length}
              </span>
            </div>

            <div className="space-y-3 overflow-y-auto max-h-[calc(100vh-280px)] pr-1">
              {preparingOrders.length === 0 ? (
                <div className="text-center py-12 text-[#6B6560] text-xs font-serif space-y-1">
                  <CheckCircle2 className="w-8 h-8 mx-auto opacity-30 text-[#B84A32]" />
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
        <div className="bg-[#FFFFFF] p-4 rounded-2xl space-y-4 border-t-4 border-t-emerald-500 border border-[#E2DDD6] shadow-sm flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-[#E2DDD6] pb-2.5">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-500" />
                <h3 className="font-serif font-bold text-sm text-emerald-700 tracking-wide uppercase">
                  4. Ready for Pass
                </h3>
              </div>
              <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-full font-mono text-xs font-bold">
                {readyOrders.length}
              </span>
            </div>

            <div className="space-y-3 overflow-y-auto max-h-[calc(100vh-280px)] pr-1">
              {readyOrders.length === 0 ? (
                <div className="text-center py-12 text-[#6B6560] text-xs font-serif space-y-1">
                  <CheckCircle2 className="w-8 h-8 mx-auto opacity-30 text-emerald-600" />
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
