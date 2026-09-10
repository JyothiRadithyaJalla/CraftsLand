import React, { useState } from 'react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { MetaTags } from '../../components/common/MetaTags';
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
      <MetaTags title="Review Moderation | L'Étoile Noir Admin" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#D4AF37]/20 pb-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-gold-gradient">Customer Review Moderation</h1>
          <p className="text-xs text-gray-400">Review, publish, or hide dining feedback and star ratings</p>
        </div>
      </div>

      <div className="glass-panel rounded-2xl overflow-hidden border border-[#D4AF37]/20 bg-[#12141C]/80">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0B0C10] border-b border-white/10 text-gray-400 uppercase text-[10px] font-mono">
              <tr>
                <th className="p-4">Customer</th>
                <th className="p-4">Target Dish</th>
                <th className="p-4">Rating</th>
                <th className="p-4">Feedback Comment</th>
                <th className="p-4">Date</th>
                <th className="p-4 text-right">Publication Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {reviews.map((rev) => (
                <tr key={rev.id} className="hover:bg-white/5 transition-colors">
                  <td className="p-4 font-serif font-bold text-[#F4F1EA] text-sm">{rev.customerName}</td>
                  <td className="p-4 font-mono text-[#D4AF37]">{rev.dishName}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-1 text-[#D4AF37]">
                      {Array.from({ length: rev.rating }).map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-[#D4AF37]" />
                      ))}
                    </div>
                  </td>
                  <td className="p-4 max-w-sm">
                    <p className="text-gray-300 italic font-serif leading-relaxed">"{rev.comment}"</p>
                  </td>
                  <td className="p-4 font-mono text-gray-400">{rev.date}</td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => handleTogglePublish(rev.id)}
                      className={`px-3 py-1.5 rounded-lg font-mono text-xs font-bold cursor-pointer transition-colors flex items-center gap-1.5 ml-auto ${
                        rev.isPublished
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                          : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                      }`}
                    >
                      {rev.isPublished ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
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
