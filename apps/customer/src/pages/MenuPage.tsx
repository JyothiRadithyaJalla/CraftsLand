import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useMenu } from '@shared/hooks/useMenu';
import { useCart } from '@shared/hooks/useCart';
import { MetaTags } from '@shared/components/MetaTags';
import { DishCard } from '../components/DishCard';
import { DishDetailModal } from '../components/DishDetailModal';
import { LoadingSpinner } from '@shared/components/LoadingSpinner';
import { EmptyState } from '@shared/components/EmptyState';
import { Search, Utensils, X, Filter } from 'lucide-react';
import type { Dish, DietaryTag } from '@shared/types/menu';

export const MenuPage: React.FC = () => {
  const { category: urlCategory } = useParams<{ category?: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { categories, dishes, searchQuery, setSearchQuery, isLoading } = useMenu();
  const { tableNumber, setTableNumber } = useCart();

  const [activeCategory, setActiveCategory] = useState<string>(urlCategory || 'all');
  const [selectedDietaryTag, setSelectedDietaryTag] = useState<DietaryTag | null>(null);
  const [quickViewDish, setQuickViewDish] = useState<Dish | null>(null);

  // Parse QR table parameter from URL e.g. /menu?table=12
  useEffect(() => {
    const tableParam = searchParams.get('table');
    if (tableParam) {
      setTableNumber(tableParam);
    }
  }, [searchParams, setTableNumber]);

  // Keep URL & state synchronized when category tab changes
  useEffect(() => {
    if (urlCategory) {
      setActiveCategory(urlCategory);
    } else {
      setActiveCategory('all');
    }
  }, [urlCategory]);

  const handleCategorySelect = (slug: string) => {
    setActiveCategory(slug);
    if (slug === 'all') {
      navigate('/menu');
    } else {
      navigate(`/menu/${slug}`);
    }
  };

  const dietaryOptions: DietaryTag[] = ['VEGAN', 'VEGETARIAN', 'GLUTEN_FREE', 'NUT_FREE', 'HALAL', 'CHEFS_CHOICE'];

  if (isLoading) {
    return <LoadingSpinner label="Loading Reserve Menu & Cellar Vintages..." />;
  }

  const filteredDishes = dishes.filter((dish) => {
    const matchesCategory = activeCategory === 'all' || dish.categorySlug === activeCategory;
    const matchesSearch =
      searchQuery === '' ||
      dish.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dish.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDietary = !selectedDietaryTag || dish.dietaryTags.includes(selectedDietaryTag);

    return matchesCategory && matchesSearch && matchesDietary;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <MetaTags title="Haute Menu | L'Étoile Noir" />

      {/* Header Banner */}
      <div className="text-center space-y-3">
        {tableNumber && (
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#D4AF37] font-mono text-xs mb-2">
            <Utensils className="w-3.5 h-3.5" /> Dine-In Session • Table {tableNumber}
          </div>
        )}
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-gold-gradient">The Haute Collection</h1>
        <p className="text-gray-400 text-sm max-w-xl mx-auto font-light">
          An exquisite selection of seasonal dishes, imperial caviar, and reserve cellar pairings.
        </p>
      </div>

      {/* Search & Dietary Filters Bar */}
      <div className="glass-panel p-4 rounded-2xl space-y-4">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          
          {/* Live Search */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search dish or ingredient..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-10 py-2.5 rounded-full bg-[#12141C] border border-[#D4AF37]/20 text-xs text-[#F4F1EA] placeholder-gray-500 focus:outline-none focus:border-[#D4AF37]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-3 text-gray-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Dietary Filter Tags */}
          <div className="flex items-center gap-1.5 flex-wrap w-full md:w-auto">
            <span className="text-xs text-gray-400 font-mono flex items-center gap-1 mr-2">
              <Filter className="w-3.5 h-3.5 text-[#D4AF37]" /> Dietary:
            </span>
            {dietaryOptions.map((tag) => {
              const isSelected = selectedDietaryTag === tag;
              return (
                <button
                  key={tag}
                  onClick={() => setSelectedDietaryTag(isSelected ? null : tag)}
                  className={`px-3 py-1 rounded-full text-[11px] font-medium tracking-wider uppercase border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#D4AF37] text-[#0B0C10] font-bold border-[#D4AF37]'
                      : 'bg-white/5 text-gray-400 border-white/10 hover:border-white/30'
                  }`}
                >
                  {tag.replace('_', ' ')}
                </button>
              );
            })}
            {selectedDietaryTag && (
              <button
                onClick={() => setSelectedDietaryTag(null)}
                className="text-[11px] text-[#D4AF37] underline ml-2 cursor-pointer"
              >
                Reset
              </button>
            )}
          </div>

        </div>

        {/* Category Navigation Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pt-2 border-t border-white/10 no-scrollbar">
          <button
            onClick={() => handleCategorySelect('all')}
            className={`px-5 py-2 rounded-full text-xs font-semibold tracking-widest uppercase whitespace-nowrap transition-all cursor-pointer ${
              activeCategory === 'all'
                ? 'bg-[#D4AF37] text-[#0B0C10] font-bold shadow-md'
                : 'bg-[#12141C] text-gray-400 hover:text-white border border-white/10'
            }`}
          >
            All Reserves
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategorySelect(cat.slug)}
              className={`px-5 py-2 rounded-full text-xs font-semibold tracking-widest uppercase whitespace-nowrap transition-all cursor-pointer ${
                activeCategory === cat.slug
                  ? 'bg-[#D4AF37] text-[#0B0C10] font-bold shadow-md'
                  : 'bg-[#12141C] text-gray-400 hover:text-white border border-white/10'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Dish Cards Grid */}
      {filteredDishes.length === 0 ? (
        <EmptyState
          title="No Dishes Match Your Search"
          description="Try adjusting your category selection, search term, or dietary filters."
          action={
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedDietaryTag(null);
                handleCategorySelect('all');
              }}
              className="px-6 py-2.5 rounded-full bg-[#D4AF37] text-[#0B0C10] font-bold text-xs uppercase tracking-wider cursor-pointer"
            >
              Reset Filters
            </button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDishes.map((dish) => (
            <DishCard
              key={dish.id}
              dish={dish}
              onQuickView={(d) => setQuickViewDish(d)}
            />
          ))}
        </div>
      )}

      {/* Quick View Modal */}
      <DishDetailModal
        dish={quickViewDish}
        isOpen={!!quickViewDish}
        onClose={() => setQuickViewDish(null)}
      />
    </div>
  );
};
