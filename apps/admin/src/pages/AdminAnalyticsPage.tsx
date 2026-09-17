import React, { useEffect, useState } from 'react';
import { AdminLayout } from '../components/AdminLayout';
import { MetaTags } from '@shared/components/MetaTags';
import { formatPrice } from '@shared/utils/formatters';
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

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#D8D8D2] pb-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-[#0F172A]">Sales & Operational Analytics</h1>
          <p className="text-xs text-slate-500 font-medium">Peak dining traffic, hourly revenue, order breakdown, and performance metrics</p>
        </div>
      </div>

      {/* Hourly Sales Performance Chart */}
      <div className="bg-white p-6 rounded-2xl space-y-4 border border-[#D8D8D2] shadow-sm">
        <div className="flex justify-between items-center border-b border-[#D8D8D2] pb-3">
          <h3 className="font-serif text-xl font-bold text-[#0F172A] flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-[#0F172A]" /> Today's Hourly Revenue Stream
          </h3>
          <span className="text-xs text-slate-600 font-mono font-bold">Peak Hours: 19:00 - 20:30</span>
        </div>

        <div className="pt-6 pb-2 flex items-end justify-between gap-3 h-52">
          {hourlyTrend.map((item) => {
            const heightPercent = Math.round((item.revenue / maxRevenue) * 100);
            return (
              <div key={item.timeLabel} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                <span className="text-[10px] font-mono text-[#0F172A] opacity-0 group-hover:opacity-100 transition-opacity font-bold">
                  {formatPrice(item.revenue)}
                </span>
                <div
                  style={{ height: `${heightPercent}%` }}
                  className="w-full bg-[#0F172A] hover:bg-[#1E293B] rounded-t-lg transition-all duration-500 shadow-xs"
                />
                <span className="text-xs font-mono text-slate-500 font-medium">{item.timeLabel}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Order Type Distribution & Key Performance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Distribution Breakdown */}
        <div className="bg-white p-6 rounded-2xl space-y-4 border border-[#D8D8D2] shadow-sm">
          <h3 className="font-serif text-xl font-bold text-[#0F172A] border-b border-[#D8D8D2] pb-3 flex items-center gap-2">
            <PieChart className="w-5 h-5 text-[#0F172A]" /> Dining Mode Share
          </h3>

          <div className="space-y-4">
            {distribution.map((dist) => (
              <div key={dist.type} className="space-y-1.5 text-xs">
                <div className="flex justify-between font-mono">
                  <span className="text-[#0F172A] font-semibold">{dist.type}</span>
                  <span className="text-[#0F172A] font-bold">{dist.percentage}% ({dist.count} tickets)</span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 border border-[#CBD5E1] rounded-full overflow-hidden">
                  <div
                    style={{ width: `${dist.percentage}%` }}
                    className="h-full bg-[#0F172A] rounded-full"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Executive Highlights Card */}
        <div className="bg-white p-6 rounded-2xl space-y-4 border border-[#D8D8D2] shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-serif text-xl font-bold text-[#0F172A] border-b border-[#D8D8D2] pb-3 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[#0F172A]" /> Executive Summary
            </h3>
            <ul className="space-y-3 text-xs text-slate-600 pt-3 font-medium">
              <li className="flex justify-between border-b border-[#E2E8F0] pb-2">
                <span>Highest Grossing Category:</span>
                <span className="font-mono text-[#0F172A] font-bold">Signature Mains (58%)</span>
              </li>
              <li className="flex justify-between border-b border-[#E2E8F0] pb-2">
                <span>Sommelier Wine Add-on Rate:</span>
                <span className="font-mono text-[#0F172A] font-bold">42% of orders</span>
              </li>
              <li className="flex justify-between border-b border-[#E2E8F0] pb-2">
                <span>Avg Kitchen Prep Duration:</span>
                <span className="font-mono text-emerald-700 font-bold">14m 20s</span>
              </li>
              <li className="flex justify-between">
                <span>Table Turn Velocity:</span>
                <span className="font-mono text-[#0F172A] font-bold">1.8 turns / evening</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};
