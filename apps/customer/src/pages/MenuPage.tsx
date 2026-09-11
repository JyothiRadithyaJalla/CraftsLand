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
      <MetaTags title="Artisanal Menu | Craftsland" description="Explore the complete Craftsland culinary collection, flame-grilled mains, and stone-baked pizzas." />

      {/* Header Banner */}
      <div className="text-center space-y-3">
        {tableNumber && (
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#B84A32]/15 border border-[#B84A32]/35 text-[#D29A55] font-mono text-xs mb-2">
            <Utensils className="w-3.5 h-3.5 text-[#B84A32]" /> Dine-In Session • Table {tableNumber}
          </div>
        )}
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#F5EFE5]">The Craftsland Menu</h1>
        <p className="text-[#B8AEA1] text-sm max-w-xl mx-auto font-normal font-sans">
          Good Food Brighter Moods — An exquisite collection of scratch-prepared pastas, flame-grilled mains, stone-baked pizzas, and artisanal desserts.
        </p>
      </div>

      {/* Search & Dietary Filters Bar */}
      <div className="bg-[#211B16] border border-[#3A3027] p-4 rounded-2xl space-y-4 shadow-xl">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          
          {/* Live Search */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-[#B8AEA1]" />
            <input
              type="text"
              placeholder="Search dish or ingredient..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-10 py-2.5 rounded-full bg-[#171310] border border-[#3A3027] text-xs text-[#F5EFE5] placeholder-[#B8AEA1]/50 focus:outline-none focus:border-[#B84A32]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-3 text-[#B8AEA1] hover:text-[#F5EFE5] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Dietary Filter Tags */}
          <div className="flex items-center gap-1.5 flex-wrap w-full md:w-auto">
            <span className="text-xs text-[#B8AEA1] font-mono flex items-center gap-1 mr-2">
              <Filter className="w-3.5 h-3.5 text-[#B84A32]" /> Dietary:
            </span>
            {dietaryOptions.map((tag) => {
              const isSelected = selectedDietaryTag === tag;
              return (
                <button
                  key={tag}
                  onClick={() => setSelectedDietaryTag(isSelected ? null : tag)}
                  className={`px-3 py-1 rounded-full text-[11px] font-semibold tracking-wider uppercase border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#B84A32] text-white font-bold border-[#B84A32]'
                      : 'bg-[#171310] text-[#B8AEA1] border-[#3A3027] hover:border-[#B84A32]/40 hover:text-[#F5EFE5]'
                  }`}
                >
                  {tag.replace('_', ' ')}
                </button>
              );
            })}
            {selectedDietaryTag && (
              <button
                onClick={() => setSelectedDietaryTag(null)}
                className="text-[11px] text-[#B84A32] underline ml-2 cursor-pointer font-semibold"
              >
                Reset
              </button>
            )}
          </div>

        </div>

        {/* Category Navigation Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pt-2 border-t border-[#3A3027] no-scrollbar">
          <button
            onClick={() => handleCategorySelect('all')}
            className={`px-5 py-2 rounded-full text-xs font-bold tracking-widest uppercase whitespace-nowrap transition-all cursor-pointer ${
              activeCategory === 'all'
                ? 'bg-[#B84A32] text-white shadow-md'
                : 'bg-[#171310] text-[#B8AEA1] hover:text-[#F5EFE5] border border-[#3A3027]'
            }`}
          >
            All Dishes
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategorySelect(cat.slug)}
              className={`px-5 py-2 rounded-full text-xs font-bold tracking-widest uppercase whitespace-nowrap transition-all cursor-pointer ${
                activeCategory === cat.slug
                  ? 'bg-[#B84A32] text-white shadow-md'
                  : 'bg-[#171310] text-[#B8AEA1] hover:text-[#F5EFE5] border border-[#3A3027]'
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
              className="px-6 py-2.5 rounded-full bg-[#B84A32] text-white font-bold text-xs uppercase tracking-wider cursor-pointer shadow-md hover:bg-[#8B3525]"
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
