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

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#3A3027] pb-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-red-gradient">Customer Review Moderation</h1>
          <p className="text-xs text-[#B8AEA1]">Review, publish, or hide dining feedback and star ratings</p>
        </div>
      </div>

      <div className="bg-[#211B16] rounded-2xl overflow-hidden border border-[#3A3027] shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#171310] border-b border-[#3A3027] text-[#B8AEA1] uppercase text-[10px] font-mono">
              <tr>
                <th className="p-4">Customer</th>
                <th className="p-4">Target Dish</th>
                <th className="p-4">Rating</th>
                <th className="p-4">Feedback Comment</th>
                <th className="p-4">Date</th>
                <th className="p-4 text-right">Publication Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#3A3027]">
              {reviews.map((rev) => (
                <tr key={rev.id} className="hover:bg-[#2A231C]/60 transition-colors">
                  <td className="p-4 font-serif font-bold text-[#F5EFE5] text-sm">{rev.customerName}</td>
                  <td className="p-4 font-mono text-[#C85A3A]">{rev.dishName}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-1 text-[#D29A55]">
                      {Array.from({ length: rev.rating }).map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-[#D29A55]" />
                      ))}
                    </div>
                  </td>
                  <td className="p-4 max-w-sm">
                    <p className="text-[#B8AEA1] italic font-serif leading-relaxed">"{rev.comment}"</p>
                  </td>
                  <td className="p-4 font-mono text-[#B8AEA1]">{rev.date}</td>
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
