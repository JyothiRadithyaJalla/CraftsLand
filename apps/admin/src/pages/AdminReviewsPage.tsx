import React, { useState } from 'react';
import { AdminLayout } from '../components/AdminLayout';
import { MetaTags } from '@shared/components/MetaTags';
import { Star, Eye, EyeOff } from 'lucide-react';

interface ReviewItem {
  id: string;
  customerName: string;
  dishName: string;
  rating: number;
  comment: string;
  date: string;
  isPublished: boolean;
}

export const AdminReviewsPage: React.FC = () => {
  const [reviews, setReviews] = useState<ReviewItem[]>([
    {
      id: 'rev-1',
      customerName: 'Lord Sterling Vance',
      dishName: 'A5 Miyazaki Wagyu Tenderloin',
      rating: 5,
      comment: 'Exquisite tenderness and sublime charred onion jus pairing. The truffle shavings elevated the dish to perfection.',
      date: '2026-09-08',
      isPublished: true,
    },
    {
      id: 'rev-2',
      customerName: 'Lady Genevieve Du Pont',
      dishName: 'Imperial Beluga Caviar Tartlet',
      rating: 5,
      comment: 'Outstanding presentation and buttery buckwheat crunch. Dom Pérignon vintage pairing was flawless.',
      date: '2026-09-05',
      isPublished: true,
    },
    {
      id: 'rev-3',
      customerName: 'Baron William Rothschild',
      dishName: 'Hokkaido Scallop Carpaccio',
      rating: 4,
      comment: 'Delicate yuzu foam and white truffle balance. Excellent starter for haute menu.',
      date: '2026-09-01',
      isPublished: false,
    },
  ]);

  const handleTogglePublish = (id: string) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, isPublished: !r.isPublished } : r))
    );
  };

  return (
    <AdminLayout>
      <MetaTags title="Review Moderation | Craftsland Admin" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#D8D8D2] pb-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-[#0F172A]">Customer Review Moderation</h1>
          <p className="text-xs text-slate-500 font-medium">Review, publish, or hide dining feedback and star ratings</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl overflow-hidden border border-[#D8D8D2] shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8FAFC] border-b border-[#D8D8D2] text-slate-600 uppercase text-[10px] font-mono font-bold tracking-wider">
              <tr>
                <th className="p-4">Customer</th>
                <th className="p-4">Target Dish</th>
                <th className="p-4">Rating</th>
                <th className="p-4">Feedback Comment</th>
                <th className="p-4">Date</th>
                <th className="p-4 text-right">Publication Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {reviews.map((rev) => (
                <tr key={rev.id} className="hover:bg-[#F8FAFC] transition-colors">
                  <td className="p-4 font-serif font-bold text-[#0F172A] text-sm">{rev.customerName}</td>
                  <td className="p-4 font-mono font-semibold text-[#0F172A]">{rev.dishName}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-1 text-amber-500">
                      {Array.from({ length: rev.rating }).map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-500" />
                      ))}
                    </div>
                  </td>
                  <td className="p-4 max-w-sm">
                    <p className="text-slate-600 italic font-serif leading-relaxed">"{rev.comment}"</p>
                  </td>
                  <td className="p-4 font-mono text-slate-500">{rev.date}</td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => handleTogglePublish(rev.id)}
                      className={`px-3 py-1.5 rounded-lg font-mono text-xs font-bold cursor-pointer transition-colors flex items-center gap-1.5 ml-auto shadow-xs ${
                        rev.isPublished
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                          : 'bg-amber-50 text-amber-800 border border-amber-300'
                      }`}
                    >
                      {rev.isPublished ? <Eye className="w-3.5 h-3.5 text-emerald-600" /> : <EyeOff className="w-3.5 h-3.5 text-amber-600" />}
                      {rev.isPublished ? 'Published' : 'Hidden'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};
