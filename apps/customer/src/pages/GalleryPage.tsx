import React, { useState } from 'react';
import { MetaTags } from '@shared/components/MetaTags';
import { LightboxModal } from '../components/LightboxModal';
import { ZoomIn } from 'lucide-react';

interface GalleryItem {
  id: string;
  url: string;
  category: 'plating' | 'interior' | 'wines' | 'backstage';
  title: string;
}

export const GalleryPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeLightboxImage, setActiveLightboxImage] = useState<{ url: string; title: string } | null>(null);

  const galleryItems: GalleryItem[] = [
    {
      id: 'g1',
      url: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?q=80&w=1000&auto=format&fit=crop',
      category: 'plating',
      title: 'Imperial Beluga Caviar Tartlet',
    },
    {
      id: 'g2',
      url: 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1000&auto=format&fit=crop',
      category: 'interior',
      title: 'Main Dining Room Chandelier Ambiance',
    },
    {
      id: 'g3',
      url: 'https://images.unsplash.com/photo-1558030006-450675393462?q=80&w=1000&auto=format&fit=crop',
      category: 'plating',
      title: 'A5 Miyazaki Wagyu Tenderloin Plating',
    },
    {
      id: 'g4',
      url: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?q=80&w=1000&auto=format&fit=crop',
      category: 'wines',
      title: 'Sommelier Grand Cru Reserve Cellar',
    },
    {
      id: 'g5',
      url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1000&auto=format&fit=crop',
      category: 'backstage',
      title: "Chef's Counter Interactive Experience",
    },
    {
      id: 'g6',
      url: 'https://images.unsplash.com/photo-1579372786545-d24232daf58c?q=80&w=1000&auto=format&fit=crop',
      category: 'plating',
      title: 'Smoked Chocolate Sphere Drizzle',
    },
    {
      id: 'g7',
      url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1000&auto=format&fit=crop',
      category: 'interior',
      title: 'Private Vault VIP Dining Suite',
    },
    {
      id: 'g8',
      url: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?q=80&w=1000&auto=format&fit=crop',
      category: 'plating',
      title: 'Hokkaido Scallop Carpaccio',
    },
  ];

  const filteredItems = galleryItems.filter(
    (item) => selectedCategory === 'all' || item.category === selectedCategory
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <MetaTags title="Ambiance & Culinary Art Gallery | L'Étoile Noir" />

      {/* Header */}
      <div className="text-center space-y-3">
        <span className="font-serif text-xs font-bold text-[#D4AF37] tracking-[0.3em] uppercase block">
          Visual Showcase
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-gold-gradient">Visual Symphony</h1>
        <p className="text-gray-400 text-sm max-w-xl mx-auto font-light">
          A photography collection highlighting our culinary plating artistry, opulent interiors, and grand reserve cellar.
        </p>
      </div>

      {/* Categories Bar */}
      <div className="flex justify-center items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
        {['all', 'plating', 'interior', 'wines', 'backstage'].map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-5 py-2 rounded-full text-xs font-semibold tracking-widest uppercase transition-all cursor-pointer ${
              selectedCategory === cat
                ? 'bg-[#D4AF37] text-[#0B0C10] font-bold shadow-md'
                : 'bg-[#12141C] text-gray-400 hover:text-white border border-white/10'
            }`}
          >
            {cat === 'all' ? 'All Artworks' : cat}
          </button>
        ))}
      </div>

      {/* Masonry / Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            onClick={() => setActiveLightboxImage({ url: item.url, title: item.title })}
            className="group relative aspect-[4/3] rounded-2xl overflow-hidden glass-card cursor-pointer border border-white/10 hover:border-[#D4AF37]/40 transition-all"
          >
            <img
              src={item.url}
              alt={item.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B0C10]/90 via-[#0B0C10]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4">
              <div className="flex justify-end">
                <span className="p-2 rounded-full bg-black/50 text-[#D4AF37]">
                  <ZoomIn className="w-4 h-4" />
                </span>
              </div>
              <div>
                <p className="font-serif text-xs font-bold text-[#F4F1EA]">{item.title}</p>
                <p className="text-[10px] text-[#D4AF37] uppercase font-mono">{item.category}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      <LightboxModal
        imageUrl={activeLightboxImage?.url || null}
        caption={activeLightboxImage?.title}
        onClose={() => setActiveLightboxImage(null)}
      />
    </div>
  );
};
