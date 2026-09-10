import React from 'react';
import { MetaTags } from '../../components/common/MetaTags';
import { EmptyState } from '../../components/common/EmptyState';
import { Heart } from 'lucide-react';

export const FavoritesPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <MetaTags title="Saved Favorites | L'Étoile Noir" />
      <EmptyState
        title="No Saved Favorites Yet"
        description="Bookmark dishes from our Haute Menu for effortless quick ordering on your next dining journey."
        icon={<Heart className="w-7 h-7 text-[#D4AF37]" />}
      />
    </div>
  );
};
