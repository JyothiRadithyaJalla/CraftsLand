import React from 'react';
import { MetaTags } from '@shared/components/MetaTags';
import { Link } from 'react-router-dom';
import { EmptyState } from '@shared/components/EmptyState';
import { Heart } from 'lucide-react';

export const FavoritesPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <MetaTags title="Saved Favorites | Craftsland" />
      <EmptyState
        title="No Saved Favorites Yet"
        description="Bookmark dishes from our Haute Menu for effortless quick ordering on your next dining journey."
        icon={<Heart className="w-7 h-7 text-[#B84A32]" />}
        action={
          <Link
            to="/menu"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-[#B84A32] to-[#8B3525] hover:from-[#C85A3A] hover:to-[#B84A32] text-[#F5EFE5] font-semibold text-xs uppercase tracking-wider shadow-md transition-all"
          >
            Explore Haute Menu
          </Link>
        }
      />
    </div>
  );
};
