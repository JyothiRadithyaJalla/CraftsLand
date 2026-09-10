import React, { useState } from 'react';
import { MetaTags } from '@shared/components/MetaTags';
import { LightboxModal } from '../components/LightboxModal';
import { ZoomIn } from 'lucide-react';

interface GalleryItem {
  id: string;
  url: string;
  category: 'dishes' | 'ambience' | 'kitchen' | 'moments';
  title: string;
}

export const GalleryPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeLightboxImage, setActiveLightboxImage] = useState<{ url: string; title: string } | null>(null);

  const galleryItems: GalleryItem[] = [
    {
      id: 'g1',
      url: 'https://images.unsplash.com/photo-1633964913295-ceb43826e7c9?q=80&w=1000&auto=format&fit=crop',
      category: 'dishes',
      title: 'Truffle Mushroom Risotto Plating',
    },
    {
      id: 'g2',
      url: 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1000&auto=format&fit=crop',
      category: 'ambience',
      title: 'Main Dining Sanctuary & Warm Lanterns',
    },
    {
      id: 'g3',
      url: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?q=80&w=1000&auto=format&fit=crop',
      category: 'dishes',
      title: 'Grilled Herb Chicken with Citrus Wood Sear',
    },
    {
      id: 'g4',
      url: 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?q=80&w=1000&auto=format&fit=crop',
      category: 'dishes',
      title: 'Stone-Oven Margherita Pizza Fresh from Peel',
    },
    {
      id: 'g5',
      url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1000&auto=format&fit=crop',
      category: 'kitchen',
      title: "Artisanal Kitchen Pass & Expeditor Line",
    },
    {
      id: 'g6',
      url: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?q=80&w=1000&auto=format&fit=crop',
      category: 'dishes',
      title: 'Molten Valrhona Chocolate Lava Cake',
    },
    {
      id: 'g7',
      url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1000&auto=format&fit=crop',
      category: 'ambience',
      title: "Founder's Private Salon Suite",
    },
    {
      id: 'g8',
      url: 'https://images.unsplash.com/photo-1621996346565-e3d5d6281691?q=80&w=1000&auto=format&fit=crop',
      category: 'dishes',
      title: 'Tagliatelle Alfredo with Cultured Butter',
    },
  ];

  const filteredItems = galleryItems.filter(
    (item) => selectedCategory === 'all' || item.category === selectedCategory
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <MetaTags
        title="Ambiance & Plating Gallery | Craftsland"
        description="Immerse yourself in the visual splendor of Craftsland dining, hand-tossed pizzas, and warm evening lighting."
      />

      {/* Header */}
      <div className="text-center space-y-3">
        <span className="font-sans text-xs font-bold text-[#D4AF37] tracking-[0.3em] uppercase block">
          Visual Showcase
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-gold-gradient">
          Craftsland Visual Gallery
        </h1>
        <p className="text-gray-400 text-sm max-w-xl mx-auto font-light font-sans">
          A photography collection highlighting our scratch culinary plating, warm stone-baked creations, and inviting dining spaces.
        </p>
      </div>

      {/* Categories Bar */}
      <div className="flex justify-center items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
        {[
          { key: 'all', label: 'All Artworks' },
          { key: 'dishes', label: 'Crafted Dishes' },
          { key: 'ambience', label: 'Dining Ambience' },
          { key: 'kitchen', label: 'Scratch Kitchen' },
        ].map((cat) => (
          <button
            key={cat.key}
            onClick={() => setSelectedCategory(cat.key)}
            className={`px-5 py-2.5 rounded-full text-xs font-semibold tracking-wider uppercase transition-all cursor-pointer ${
              selectedCategory === cat.key
                ? 'bg-[#D4AF37] text-[#0B0C10] font-bold shadow-md'
                : 'bg-[#12141C] text-gray-400 hover:text-white border border-white/10'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Masonry / Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            onClick={() => setActiveLightboxImage({ url: item.url, title: item.title })}
            className="group relative aspect-[4/3] rounded-2xl overflow-hidden glass-card cursor-pointer border border-white/10 hover:border-[#D4AF37]/50 hover:shadow-[0_8px_30px_rgba(212,175,55,0.15)] transition-all duration-500"
          >
            <img
              src={item.url}
              alt={item.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B0C10]/95 via-[#0B0C10]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-5">
              <div className="flex justify-end">
                <span className="p-2 rounded-full bg-black/60 text-[#D4AF37]">
                  <ZoomIn className="w-4 h-4" />
                </span>
              </div>
              <div>
                <p className="font-serif text-sm font-bold text-[#F4F1EA]">{item.title}</p>
                <p className="text-[10px] text-[#D4AF37] uppercase font-mono tracking-wider mt-0.5">{item.category}</p>
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
