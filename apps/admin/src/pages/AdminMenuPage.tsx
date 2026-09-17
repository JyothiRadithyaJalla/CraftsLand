import React, { useEffect, useState } from 'react';
import { AdminLayout } from '../components/AdminLayout';
import { AdminVideoUploader } from '../components/AdminVideoUploader';
import { MetaTags } from '@shared/components/MetaTags';
import { MenuService } from '@shared/services/menuService';
import { MediaService } from '@shared/services/mediaService';
import type { Dish, Category } from '@shared/types/menu';
import {
  Plus, Search, Filter, Edit2, Trash2, X, ToggleLeft, ToggleRight, AlertCircle, Loader2
} from 'lucide-react';
import { ImageLightbox } from '@shared/components/ImageLightbox';
import { formatPrice } from '@shared/utils/formatters';

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
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);

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

    setIsSaving(true);
    setSaveError(null);

    try {
      let success = false;
      const prevPublicId = (editingDish as any)._previousPublicId;

      if (editingDish.id) {
        success = await MenuService.updateDish(editingDish.id, editingDish);
      } else {
        const created = await MenuService.createDish(editingDish);
        success = !!created;
      }

      if (success) {
        // If an old Cloudinary asset was replaced or removed, safely clean it up after successful DB commit
        if (prevPublicId && prevPublicId !== editingDish.videoPublicId) {
          MediaService.destroyCloudinaryAsset(prevPublicId).catch(() => {
            // Non-blocking cleanup
          });
        }
        setIsModalOpen(false);
        setEditingDish(null);
        setSaveError(null);
        await loadMenuData();
      } else {
        setSaveError('Failed to persist dish changes to database. Your uploaded video is safe, but please retry saving.');
      }
    } catch (err: any) {
      setSaveError(err.message || 'An unexpected error occurred while saving dish.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AdminLayout>
      <MetaTags title="Reserve Menu Management | Craftsland Admin" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#DDD9CB] pb-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-[#182019]">Reserve Menu Management</h1>
          <p className="text-xs text-[#626F64] font-medium">Curate haute cuisine offerings, pricing, wine pairings, and availability</p>
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
          className="px-5 py-2.5 rounded-xl bg-[#31543A] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-md hover:bg-[#26432E] transition-all min-h-[44px]"
        >
          <Plus className="w-4 h-4" /> Add Reserve Dish
        </button>
      </div>

      {/* Search & Category Filter */}
      <div className="bg-white p-4 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 text-xs border border-[#DDD9CB] shadow-sm">
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto">
          <span className="text-[#626F64] font-bold uppercase text-[10px] tracking-wider flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-[#31543A]" /> Category:
          </span>
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-xl border transition-all cursor-pointer font-bold text-xs ${
              selectedCategory === 'all'
                ? 'bg-[#31543A] border-[#31543A] text-white shadow-xs'
                : 'bg-[#FAF8F3] border-[#DDD9CB] text-[#182019] hover:bg-[#DDD9CB]/40'
            }`}
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.slug)}
              className={`px-3 py-1.5 rounded-xl border transition-all cursor-pointer font-bold text-xs whitespace-nowrap ${
                selectedCategory === cat.slug
                  ? 'bg-[#31543A] border-[#31543A] text-white shadow-xs'
                  : 'bg-[#FAF8F3] border-[#DDD9CB] text-[#182019] hover:bg-[#DDD9CB]/40'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-[#626F64]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search dish title or description..."
            className="w-full bg-[#FAF8F3] border border-[#DDD9CB] rounded-xl pl-9 pr-4 py-1.5 text-xs text-[#182019] placeholder-[#626F64]/50 focus:outline-none focus:border-[#31543A] transition-colors"
          />
        </div>
      </div>

      {/* Dish List Table */}
      <div className="bg-white rounded-2xl overflow-hidden border border-[#DDD9CB] shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF8F3] border-b border-[#DDD9CB] text-[#3A453C] uppercase text-[10px] font-mono font-bold tracking-wider">
              <tr>
                <th className="p-4">Dish</th>
                <th className="p-4">Category</th>
                <th className="p-4">Price</th>
                <th className="p-4">Dietary Tags</th>
                <th className="p-4">Availability</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DDD9CB]">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-[#626F64] font-mono animate-pulse">
                    Loading reserve menu registry...
                  </td>
                </tr>
              ) : filteredDishes.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-[#626F64] font-serif text-sm">
                    No dishes found matching search filters.
                  </td>
                </tr>
              ) : (
                filteredDishes.map((dish) => (
                  <tr key={dish.id} className="hover:bg-[#FAF8F3] transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={dish.mediaUrl}
                          alt={dish.name}
                          data-cursor="image"
                          onClick={() => setPreviewImage({ url: dish.mediaUrl, title: dish.name, category: dish.categorySlug })}
                          className="w-12 h-12 rounded-lg object-cover cursor-pointer border border-[#DDD9CB] hover:border-[#31543A] hover:scale-105 transition-all"
                        />
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h4 className="font-serif font-bold text-[#182019] text-sm">{dish.name}</h4>
                            {dish.videoUrl && (
                              <span className="px-1.5 py-0.5 rounded text-[8px] font-mono font-bold uppercase tracking-wider bg-[#FAF8F3] text-[#31543A] border border-[#31543A]/30">
                                Video
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-[#626F64] line-clamp-1 max-w-xs">{dish.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 font-mono text-[#626F64]">{dish.categorySlug}</td>
                    <td className="p-4 font-mono font-bold text-[#182019]">{formatPrice(dish.price)}</td>
                    <td className="p-4">
                      <div className="flex flex-wrap gap-1">
                        {dish.dietaryTags.map((tag, idx) => (
                          <span key={idx} className="text-[9px] font-mono uppercase bg-[#FAF8F3] text-[#182019] px-2 py-0.5 rounded-full border border-[#DDD9CB] font-bold">
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
                            ? 'bg-[#FAF8F3] text-[#31543A] border border-[#31543A]/30'
                            : 'bg-[#A8382B]/10 text-[#A8382B] border border-[#A8382B]/30'
                        }`}
                      >
                        {dish.isAvailable ? <ToggleRight className="w-4 h-4 text-[#31543A]" /> : <ToggleLeft className="w-4 h-4 text-[#A8382B]" />}
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
                          className="p-1.5 rounded-lg bg-[#FAF8F3] border border-[#DDD9CB] text-[#182019] hover:bg-[#31543A] hover:text-white cursor-pointer transition-colors shadow-xs"
                          title="Edit Dish"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteDish(dish.id)}
                          className="p-1.5 rounded-lg bg-[#A8382B]/10 border border-[#A8382B]/20 text-[#A8382B] hover:bg-[#A8382B]/20 cursor-pointer transition-colors shadow-xs"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <form
            onSubmit={handleSaveDish}
            className="bg-white w-full max-w-2xl border border-[#DDD9CB] rounded-3xl p-6 space-y-4 text-[#182019] max-h-[90vh] overflow-y-auto shadow-2xl"
          >
            <div className="flex justify-between items-center border-b border-[#DDD9CB] pb-3">
              <h3 className="font-serif text-xl font-bold text-[#182019]">
                {editingDish.id ? 'Edit Reserve Dish' : 'Add New Reserve Dish'}
              </h3>
              <button
                type="button"
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingDish(null);
                }}
                className="p-1.5 rounded-full text-[#626F64] hover:text-[#182019] hover:bg-[#FAF8F3] cursor-pointer transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {saveError && (
              <div className="bg-[#A8382B]/10 border border-[#A8382B]/20 p-3 rounded-xl text-xs text-[#A8382B] flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-[#A8382B] mt-0.5 shrink-0" />
                <div className="flex-1">
                  <p className="font-bold text-[11px]">Save Failed</p>
                  <p className="text-[11px] leading-relaxed text-[#A8382B]">{saveError}</p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1.5">
                <label className="text-[#3A453C] font-bold uppercase text-[10px] tracking-wider">Dish Name *</label>
                <input
                  type="text"
                  required
                  value={editingDish.name || ''}
                  onChange={(e) => setEditingDish({ ...editingDish, name: e.target.value })}
                  placeholder="e.g. Imperial Beluga Caviar"
                  className="w-full bg-[#FAF8F3] border border-[#DDD9CB] rounded-xl px-3 py-2 text-xs text-[#182019] placeholder-[#626F64]/50 focus:outline-none focus:border-[#31543A] transition-colors font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[#3A453C] font-bold uppercase text-[10px] tracking-wider">Price (₹ INR) *</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={editingDish.price || 0}
                  onChange={(e) => setEditingDish({ ...editingDish, price: parseFloat(e.target.value) || 0 })}
                  className="w-full bg-[#FAF8F3] border border-[#DDD9CB] rounded-xl px-3 py-2 text-xs text-[#182019] font-mono focus:outline-none focus:border-[#31543A] transition-colors font-medium"
                />
              </div>
            </div>

            <div className="space-y-1.5 text-xs">
              <label className="text-[#3A453C] font-bold uppercase text-[10px] tracking-wider">Category</label>
              <select
                value={editingDish.categorySlug || 'mains'}
                onChange={(e) => setEditingDish({ ...editingDish, categorySlug: e.target.value })}
                className="w-full bg-[#FAF8F3] border border-[#DDD9CB] rounded-xl px-3 py-2 text-xs text-[#182019] focus:outline-none focus:border-[#31543A] transition-colors font-medium"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.slug} className="bg-white text-[#182019]">{cat.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5 text-xs">
              <label className="text-[#3A453C] font-bold uppercase text-[10px] tracking-wider">Culinary Description</label>
              <textarea
                rows={3}
                value={editingDish.description || ''}
                onChange={(e) => setEditingDish({ ...editingDish, description: e.target.value })}
                placeholder="Oscietra caviar, smoked crème fraîche..."
                className="w-full bg-[#FAF8F3] border border-[#DDD9CB] rounded-xl px-3 py-2 text-xs text-[#182019] placeholder-[#626F64]/50 focus:outline-none focus:border-[#31543A] transition-colors font-medium"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1.5">
                <label className="text-[#3A453C] font-bold uppercase text-[10px] tracking-wider">Media Image URL</label>
                <input
                  type="url"
                  value={editingDish.mediaUrl || ''}
                  onChange={(e) => setEditingDish({ ...editingDish, mediaUrl: e.target.value, posterUrl: e.target.value })}
                  className="w-full bg-[#FAF8F3] border border-[#DDD9CB] rounded-xl px-3 py-2 text-xs text-[#182019] placeholder-[#626F64]/50 focus:outline-none focus:border-[#31543A] transition-colors font-medium"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[#3A453C] font-bold uppercase text-[10px] tracking-wider">Sommelier Wine Pairing</label>
                <input
                  type="text"
                  value={editingDish.winePairing || ''}
                  onChange={(e) => setEditingDish({ ...editingDish, winePairing: e.target.value })}
                  placeholder="Dom Pérignon Vintage 2013"
                  className="w-full bg-[#FAF8F3] border border-[#DDD9CB] rounded-xl px-3 py-2 text-xs text-[#182019] placeholder-[#626F64]/50 focus:outline-none focus:border-[#31543A] transition-colors font-medium"
                />
              </div>
            </div>

            {/* Real Cloudinary Video Upload Pipeline */}
            <AdminVideoUploader
              videoUrl={editingDish.videoUrl}
              videoPublicId={editingDish.videoPublicId}
              videoPosterUrl={editingDish.videoPosterUrl}
              videoDuration={editingDish.videoDuration}
              dishName={editingDish.name || 'Dish'}
              posterFallbackUrl={editingDish.posterUrl || editingDish.mediaUrl}
              disabled={isSaving}
              onChange={(media) => {
                setEditingDish((prev) => {
                  if (!prev) return prev;
                  return {
                    ...prev,
                    videoUrl: media.videoUrl,
                    videoPublicId: media.videoPublicId,
                    videoPosterUrl: media.videoPosterUrl,
                    videoDuration: media.videoDuration,
                    videoStatus: media.videoStatus,
                    ...(media.previousPublicId && { _previousPublicId: media.previousPublicId } as any),
                  };
                });
              }}
            />

            <div className="flex justify-end gap-3 pt-4 border-t border-[#DDD9CB] text-xs">
              <button
                type="button"
                disabled={isSaving}
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingDish(null);
                  setSaveError(null);
                }}
                className="px-5 py-2.5 rounded-xl border border-[#DDD9CB] text-[#182019] hover:bg-[#FAF8F3] disabled:opacity-50 font-bold cursor-pointer transition-colors shadow-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="px-6 py-2.5 rounded-xl bg-[#31543A] text-white hover:bg-[#26432E] disabled:opacity-50 font-bold uppercase tracking-wider cursor-pointer shadow-md transition-all flex items-center gap-2"
              >
                {isSaving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                {isSaving ? 'Saving Entry...' : 'Save Dish Entry'}
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
