import React, { useEffect, useState } from 'react';
import { AdminLayout } from '../components/AdminLayout';
import { MetaTags } from '@shared/components/MetaTags';
import { MenuService } from '@shared/services/menuService';
import type { Dish, Category } from '@shared/types/menu';
import {
  Plus, Search, Filter, Edit2, Trash2, X, ToggleLeft, ToggleRight
} from 'lucide-react';
import { ImageLightbox } from '@shared/components/ImageLightbox';

export const AdminMenuPage: React.FC = () => {
  const [previewImage, setPreviewImage] = useState<{ url: string; title: string; category?: string } | null>(null);
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingDish, setEditingDish] = useState<Partial<Dish> | null>(null);

  const loadMenuData = async () => {
    setLoading(true);
    const catList = await MenuService.getCategories();
    setCategories(catList);
    const dishList = await MenuService.getDishes('all', true);
    setDishes(dishList);
    setLoading(false);
  };

  useEffect(() => {
    loadMenuData();
  }, []);

  const filteredDishes = dishes.filter((d) => {
    if (selectedCategory !== 'all' && d.categorySlug !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = d.name.toLowerCase().includes(q);
      const matchDesc = d.description.toLowerCase().includes(q);
      if (!matchName && !matchDesc) return false;
    }
    return true;
  });

  const handleToggleAvailability = async (dish: Dish) => {
    const success = await MenuService.updateDish(dish.id, { isAvailable: !dish.isAvailable });
    if (success) {
      await loadMenuData();
    }
  };

  const handleDeleteDish = async (id: string) => {
    if (window.confirm('Are you sure you wish to delete this dish from the menu registry?')) {
      const success = await MenuService.deleteDish(id);
      if (success) {
        await loadMenuData();
      }
    }
  };

  const handleSaveDish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDish || !editingDish.name || editingDish.price === undefined) return;

    if (editingDish.id) {
      await MenuService.updateDish(editingDish.id, editingDish);
    } else {
      await MenuService.createDish(editingDish);
    }

    setIsModalOpen(false);
    setEditingDish(null);
    await loadMenuData();
  };

  return (
    <AdminLayout>
      <MetaTags title="Reserve Menu Management | Craftsland Admin" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#3A3027] pb-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-red-gradient">Reserve Menu Management</h1>
          <p className="text-xs text-[#B8AEA1]">Curate haute cuisine offerings, pricing, wine pairings, and availability</p>
        </div>
        <button
          onClick={() => {
            setEditingDish({
              name: '',
              price: 50.00,
              description: '',
              categorySlug: categories[0]?.slug || 'starters',
              mediaUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=600',
              posterUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=600',
              dietaryTags: ['CHEFS_CHOICE'],
              allergens: [],
              isAvailable: true,
            });
            setIsModalOpen(true);
          }}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#C85A3A] via-[#B84A32] to-[#8B3525] text-[#F5EFE5] font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 cursor-pointer shadow-lg hover:brightness-110 transition-all"
        >
          <Plus className="w-4 h-4" /> Add Reserve Dish
        </button>
      </div>

      {/* Search & Category Filter */}
      <div className="bg-[#211B16] p-4 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 text-xs border border-[#3A3027] shadow-md">
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto">
          <span className="text-[#B8AEA1] font-semibold flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-[#B84A32]" /> Category:
          </span>
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-xl border transition-all cursor-pointer font-semibold ${
              selectedCategory === 'all'
                ? 'bg-[#B84A32] border-[#B84A32] text-[#F5EFE5] font-bold shadow-sm'
                : 'bg-[#171310] border-[#3A3027] text-[#B8AEA1] hover:text-[#F5EFE5]'
            }`}
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.slug)}
              className={`px-3 py-1.5 rounded-xl border transition-all cursor-pointer font-semibold whitespace-nowrap ${
                selectedCategory === cat.slug
                  ? 'bg-[#B84A32] border-[#B84A32] text-[#F5EFE5] font-bold shadow-sm'
                  : 'bg-[#171310] border-[#3A3027] text-[#B8AEA1] hover:text-[#F5EFE5]'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-[#B8AEA1]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search dish title or description..."
            className="w-full bg-[#171310] border border-[#3A3027] rounded-xl pl-9 pr-4 py-1.5 text-xs text-[#F5EFE5] placeholder-[#B8AEA1]/40 focus:outline-none focus:border-[#B84A32] transition-colors"
          />
        </div>
      </div>

      {/* Dish List Table */}
      <div className="bg-[#211B16] rounded-2xl overflow-hidden border border-[#3A3027] shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#171310] border-b border-[#3A3027] text-[#B8AEA1] uppercase text-[10px] font-mono">
              <tr>
                <th className="p-4">Dish</th>
                <th className="p-4">Category</th>
                <th className="p-4">Price</th>
                <th className="p-4">Dietary Tags</th>
                <th className="p-4">Availability</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#3A3027]">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-[#B8AEA1] font-mono animate-pulse">
                    Loading reserve menu registry...
                  </td>
                </tr>
              ) : filteredDishes.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-[#B8AEA1] font-serif text-sm">
                    No dishes found matching search filters.
                  </td>
                </tr>
              ) : (
                filteredDishes.map((dish) => (
                  <tr key={dish.id} className="hover:bg-[#2A231C]/60 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={dish.mediaUrl}
                          alt={dish.name}
                          data-cursor="image"
                          onClick={() => setPreviewImage({ url: dish.mediaUrl, title: dish.name, category: dish.categorySlug })}
                          className="w-12 h-12 rounded-lg object-cover cursor-pointer border border-[#3A3027] hover:border-[#B84A32] hover:scale-105 transition-all"
                        />
                        <div>
                          <h4 className="font-serif font-bold text-[#F5EFE5] text-sm">{dish.name}</h4>
                          <p className="text-[11px] text-[#B8AEA1] line-clamp-1 max-w-xs">{dish.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 font-mono text-[#B8AEA1]">{dish.categorySlug}</td>
                    <td className="p-4 font-mono font-bold text-[#C85A3A]">${dish.price.toFixed(2)}</td>
                    <td className="p-4">
                      <div className="flex flex-wrap gap-1">
                        {dish.dietaryTags.map((tag, idx) => (
                          <span key={idx} className="text-[9px] font-mono uppercase bg-[#B84A32]/15 text-[#C85A3A] px-2 py-0.5 rounded-full border border-[#B84A32]/30 font-semibold">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => handleToggleAvailability(dish)}
                        className={`flex items-center gap-1.5 px-3 py-1 rounded-full font-mono text-[11px] font-bold cursor-pointer transition-colors ${
                          dish.isAvailable
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                            : 'bg-red-500/20 text-red-400 border border-red-500/40'
                        }`}
                      >
                        {dish.isAvailable ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                        {dish.isAvailable ? 'Available' : 'Sold Out'}
                      </button>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            setEditingDish(dish);
                            setIsModalOpen(true);
                          }}
                          className="p-1.5 rounded-lg bg-[#171310] border border-[#3A3027] text-[#B8AEA1] hover:text-[#F5EFE5] hover:border-[#B84A32] cursor-pointer transition-colors"
                          title="Edit Dish"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteDish(dish.id)}
                          className="p-1.5 rounded-lg bg-red-950/30 border border-red-500/30 text-red-400 hover:bg-red-900/40 cursor-pointer transition-colors"
                          title="Delete Dish"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Dish Modal */}
      {isModalOpen && editingDish && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
          <form
            onSubmit={handleSaveDish}
            className="bg-[#211B16] w-full max-w-2xl border border-[#3A3027] rounded-3xl p-6 space-y-4 text-[#F5EFE5] max-h-[90vh] overflow-y-auto shadow-2xl"
          >
            <div className="flex justify-between items-center border-b border-[#3A3027] pb-3">
              <h3 className="font-serif text-xl font-bold text-red-gradient">
                {editingDish.id ? 'Edit Reserve Dish' : 'Add New Reserve Dish'}
              </h3>
              <button
                type="button"
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingDish(null);
                }}
                className="p-1 rounded-full text-[#B8AEA1] hover:text-[#F5EFE5] cursor-pointer transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1.5">
                <label className="text-[#B8AEA1] font-semibold">Dish Name *</label>
                <input
                  type="text"
                  required
                  value={editingDish.name || ''}
                  onChange={(e) => setEditingDish({ ...editingDish, name: e.target.value })}
                  placeholder="e.g. Imperial Beluga Caviar"
                  className="w-full bg-[#171310] border border-[#3A3027] rounded-xl px-3 py-2 text-xs text-[#F5EFE5] placeholder-[#B8AEA1]/40 focus:outline-none focus:border-[#B84A32] transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[#B8AEA1] font-semibold">Price ($ USD) *</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={editingDish.price || 0}
                  onChange={(e) => setEditingDish({ ...editingDish, price: parseFloat(e.target.value) || 0 })}
                  className="w-full bg-[#171310] border border-[#3A3027] rounded-xl px-3 py-2 text-xs text-[#F5EFE5] font-mono focus:outline-none focus:border-[#B84A32] transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1.5 text-xs">
              <label className="text-[#B8AEA1] font-semibold">Category</label>
              <select
                value={editingDish.categorySlug || 'mains'}
                onChange={(e) => setEditingDish({ ...editingDish, categorySlug: e.target.value })}
                className="w-full bg-[#171310] border border-[#3A3027] rounded-xl px-3 py-2 text-xs text-[#F5EFE5] focus:outline-none focus:border-[#B84A32] transition-colors"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.slug} className="bg-[#211B16] text-[#F5EFE5]">{cat.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5 text-xs">
              <label className="text-[#B8AEA1] font-semibold">Culinary Description</label>
              <textarea
                rows={3}
                value={editingDish.description || ''}
                onChange={(e) => setEditingDish({ ...editingDish, description: e.target.value })}
                placeholder="Oscietra caviar, smoked crème fraîche..."
                className="w-full bg-[#171310] border border-[#3A3027] rounded-xl px-3 py-2 text-xs text-[#F5EFE5] placeholder-[#B8AEA1]/40 focus:outline-none focus:border-[#B84A32] transition-colors"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1.5">
                <label className="text-[#B8AEA1] font-semibold">Media Image URL</label>
                <input
                  type="url"
                  value={editingDish.mediaUrl || ''}
                  onChange={(e) => setEditingDish({ ...editingDish, mediaUrl: e.target.value, posterUrl: e.target.value })}
                  className="w-full bg-[#171310] border border-[#3A3027] rounded-xl px-3 py-2 text-xs text-[#F5EFE5] placeholder-[#B8AEA1]/40 focus:outline-none focus:border-[#B84A32] transition-colors"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[#B8AEA1] font-semibold">Sommelier Wine Pairing</label>
                <input
                  type="text"
                  value={editingDish.winePairing || ''}
                  onChange={(e) => setEditingDish({ ...editingDish, winePairing: e.target.value })}
                  placeholder="Dom Pérignon Vintage 2013"
                  className="w-full bg-[#171310] border border-[#3A3027] rounded-xl px-3 py-2 text-xs text-[#F5EFE5] placeholder-[#B8AEA1]/40 focus:outline-none focus:border-[#B84A32] transition-colors"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-[#3A3027] text-xs">
              <button
                type="button"
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingDish(null);
                }}
                className="px-5 py-2.5 rounded-full border border-[#3A3027] text-[#B8AEA1] hover:text-[#F5EFE5] hover:border-[#B8AEA1] cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-full bg-gradient-to-r from-[#C85A3A] via-[#B84A32] to-[#8B3525] text-[#F5EFE5] font-bold uppercase tracking-wider cursor-pointer shadow-lg hover:brightness-110 transition-all"
              >
                Save Dish Entry
              </button>
            </div>
          </form>
        </div>
      )}
      {/* Fullscreen Dish Lightbox */}
      <ImageLightbox
        isOpen={!!previewImage}
        imageUrl={previewImage?.url || null}
        title={previewImage?.title}
        category={previewImage?.category}
        onClose={() => setPreviewImage(null)}
      />
    </AdminLayout>
  );
};
