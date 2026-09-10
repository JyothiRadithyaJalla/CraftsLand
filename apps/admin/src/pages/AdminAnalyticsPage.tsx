import React, { useEffect, useState } from 'react';
import { AdminLayout } from '../components/AdminLayout';
import { MetaTags } from '@shared/components/MetaTags';
import { AnalyticsService, type SalesTrend, type OrderTypeDistribution } from '@shared/services/analyticsService';
import { BarChart3, TrendingUp, PieChart } from 'lucide-react';

export const AdminAnalyticsPage: React.FC = () => {
  const [hourlyTrend, setHourlyTrend] = useState<SalesTrend[]>([]);
  const [distribution, setDistribution] = useState<OrderTypeDistribution[]>([]);

  useEffect(() => {
    const loadAnalytics = async () => {
      const trend = await AnalyticsService.getHourlySalesTrend();
      setHourlyTrend(trend);
      const dist = await AnalyticsService.getOrderTypeDistribution();
      setDistribution(dist);
    };
    loadAnalytics();
  }, []);

  const maxRevenue = Math.max(...hourlyTrend.map((t) => t.revenue), 2000);

  return (
    <AdminLayout>
      <MetaTags title="Sales & Analytics | Craftsland Admin" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#D4AF37]/20 pb-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-gold-gradient">Sales & Operational Analytics</h1>
          <p className="text-xs text-gray-400">Peak dining traffic, hourly revenue, order breakdown, and performance metrics</p>
        </div>
      </div>

      {/* Hourly Sales Performance Chart */}
      <div className="glass-panel p-6 rounded-2xl space-y-4 border border-[#D4AF37]/20 bg-[#12141C]/80">
        <div className="flex justify-between items-center border-b border-white/10 pb-3">
          <h3 className="font-serif text-xl font-bold text-[#F4F1EA] flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-[#D4AF37]" /> Today's Hourly Revenue Stream
          </h3>
          <span className="text-xs text-[#D4AF37] font-mono font-bold">Peak Hours: 19:00 - 20:30</span>
        </div>

        <div className="pt-6 pb-2 flex items-end justify-between gap-3 h-52">
          {hourlyTrend.map((item) => {
            const heightPercent = Math.round((item.revenue / maxRevenue) * 100);
            return (
              <div key={item.timeLabel} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                <span className="text-[10px] font-mono text-[#D4AF37] opacity-0 group-hover:opacity-100 transition-opacity font-bold">
                  ${item.revenue}
                </span>
                <div
                  style={{ height: `${heightPercent}%` }}
                  className="w-full bg-gradient-to-t from-[#8C7853] to-[#D4AF37] rounded-t-lg transition-all duration-500 group-hover:brightness-125"
                />
                <span className="text-xs font-mono text-gray-400">{item.timeLabel}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Order Type Distribution & Key Performance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Distribution Breakdown */}
        <div className="glass-panel p-6 rounded-2xl space-y-4 border border-[#D4AF37]/20 bg-[#12141C]/80">
          <h3 className="font-serif text-xl font-bold text-[#F4F1EA] border-b border-white/10 pb-3 flex items-center gap-2">
            <PieChart className="w-5 h-5 text-[#D4AF37]" /> Dining Mode Share
          </h3>

          <div className="space-y-4">
            {distribution.map((dist) => (
              <div key={dist.type} className="space-y-1.5 text-xs">
                <div className="flex justify-between font-mono">
                  <span className="text-gray-300 font-semibold">{dist.type}</span>
                  <span className="text-[#D4AF37] font-bold">{dist.percentage}% ({dist.count} tickets)</span>
                </div>
                <div className="w-full h-2.5 bg-white/5 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${dist.percentage}%` }}
                    className="h-full bg-gradient-to-r from-[#D4AF37] to-[#8C7853] rounded-full"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Executive Highlights Card */}
        <div className="glass-panel p-6 rounded-2xl space-y-4 border border-[#D4AF37]/20 bg-[#12141C]/80 flex flex-col justify-between">
          <div>
            <h3 className="font-serif text-xl font-bold text-[#F4F1EA] border-b border-white/10 pb-3 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[#D4AF37]" /> Executive Summary
            </h3>
            <ul className="space-y-3 text-xs text-gray-300 pt-3">
              <li className="flex justify-between border-b border-white/5 pb-2">
                <span>Highest Grossing Category:</span>
                <span className="font-mono text-[#D4AF37] font-bold">Signature Mains (58%)</span>
              </li>
              <li className="flex justify-between border-b border-white/5 pb-2">
                <span>Sommelier Wine Add-on Rate:</span>
                <span className="font-mono text-[#D4AF37] font-bold">42% of orders</span>
              </li>
              <li className="flex justify-between border-b border-white/5 pb-2">
                <span>Avg Kitchen Prep Duration:</span>
                <span className="font-mono text-emerald-400 font-bold">14m 20s</span>
              </li>
              <li className="flex justify-between">
                <span>Table Turn Velocity:</span>
                <span className="font-mono text-[#F4F1EA] font-bold">1.8 turns / evening</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};
