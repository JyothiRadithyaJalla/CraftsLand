import React, { useEffect, useState } from 'react';
import { AdminLayout } from '../components/AdminLayout';
import { MetaTags } from '@shared/components/MetaTags';
import { MenuService } from '@shared/services/menuService';
import type { Category } from '@shared/types/menu';
import { Plus, Edit2, Trash2, ToggleLeft, ToggleRight, X } from 'lucide-react';

export const AdminCategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingCategory, setEditingCategory] = useState<Partial<Category> | null>(null);

  const loadCategories = async () => {
    setLoading(true);
    const list = await MenuService.getCategories();
    setCategories(list);
    setLoading(false);
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleToggleActive = async (cat: Category) => {
    await MenuService.updateCategory(cat.id, { isActive: !cat.isActive });
    await loadCategories();
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Delete this menu category? Existing dishes assigned to it will remain.')) {
      await MenuService.deleteCategory(id);
      await loadCategories();
    }
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory || !editingCategory.name) return;

    if (editingCategory.id) {
      await MenuService.updateCategory(editingCategory.id, editingCategory);
    } else {
      await MenuService.createCategory(editingCategory);
    }

    setIsModalOpen(false);
    setEditingCategory(null);
    await loadCategories();
  };

  return (
    <AdminLayout>
      <MetaTags title="Categories Management | Craftsland Admin" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#B11226]/20 pb-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-red-gradient">Menu Categories</h1>
          <p className="text-xs text-[#7F0D1D]">Structure menu sections, display order, and visibility</p>
        </div>
        <button
          onClick={() => {
            setEditingCategory({
              name: '',
              slug: '',
              displayOrder: categories.length + 1,
              isActive: true,
            });
            setIsModalOpen(true);
          }}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#B11226] to-[#7F0D1D] text-white font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 cursor-pointer shadow-lg hover:opacity-90"
        >
          <Plus className="w-4 h-4" /> Add Category
        </button>
      </div>

      <div className="bg-white rounded-2xl overflow-hidden border border-[#B11226]/20 bg-[#FFFFFF]/80">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAFAFA] border-b border-[#E5E5E5] text-gray-400 uppercase text-[10px] font-mono">
              <tr>
                <th className="p-4">Display Order</th>
                <th className="p-4">Category Name</th>
                <th className="p-4">URL Slug</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-400 font-mono animate-pulse">
                    Loading categories...
                  </td>
                </tr>
              ) : categories.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-500 font-serif text-sm">
                    No categories defined.
                  </td>
                </tr>
              ) : (
                categories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-4 font-mono font-bold text-[#B11226]">#{cat.displayOrder}</td>
                    <td className="p-4 font-serif font-bold text-[#171717] text-sm">{cat.name}</td>
                    <td className="p-4 font-mono text-gray-400">{cat.slug}</td>
                    <td className="p-4">
                      <button
                        onClick={() => handleToggleActive(cat)}
                        className={`flex items-center gap-1.5 px-3 py-1 rounded-full font-mono text-[11px] font-bold cursor-pointer transition-colors ${
                          cat.isActive
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                            : 'bg-red-500/20 text-red-400 border border-red-500/40'
                        }`}
                      >
                        {cat.isActive ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                        {cat.isActive ? 'Active' : 'Hidden'}
                      </button>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            setEditingCategory(cat);
                            setIsModalOpen(true);
                          }}
                          className="p-1.5 rounded-lg bg-white/5 border border-[#E5E5E5] text-gray-300 hover:text-white cursor-pointer"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(cat.id)}
                          className="p-1.5 rounded-lg bg-red-950/40 border border-red-500/30 text-red-400 hover:text-red-300 cursor-pointer"
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

      {/* Add / Edit Category Modal */}
      {isModalOpen && editingCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#FAFAFA]/80 backdrop-blur-md">
          <form
            onSubmit={handleSaveCategory}
            className="bg-white w-full max-w-md bg-[#FFFFFF] border border-[#B11226]/30 rounded-3xl p-6 space-y-4 text-[#171717]"
          >
            <div className="flex justify-between items-center border-b border-[#E5E5E5] pb-3">
              <h3 className="font-serif text-xl font-bold text-red-gradient">
                {editingCategory.id ? 'Edit Category' : 'Add Category'}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-full text-gray-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="text-gray-300 font-semibold">Category Name *</label>
                <input
                  type="text"
                  required
                  value={editingCategory.name || ''}
                  onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                  placeholder="e.g. Sommelier Cellar & Cocktails"
                  className="w-full bg-[#FAFAFA] border border-[#E5E5E5] rounded-xl px-3 py-2 text-xs text-[#171717] focus:outline-none focus:border-[#B11226]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-gray-300 font-semibold">URL Slug (Unique)</label>
                <input
                  type="text"
                  value={editingCategory.slug || ''}
                  onChange={(e) => setEditingCategory({ ...editingCategory, slug: e.target.value })}
                  placeholder="e.g. wines"
                  className="w-full bg-[#FAFAFA] border border-[#E5E5E5] rounded-xl px-3 py-2 text-xs text-[#171717] font-mono focus:outline-none focus:border-[#B11226]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-gray-300 font-semibold">Display Order Priority</label>
                <input
                  type="number"
                  value={editingCategory.displayOrder || 1}
                  onChange={(e) => setEditingCategory({ ...editingCategory, displayOrder: parseInt(e.target.value) || 1 })}
                  className="w-full bg-[#FAFAFA] border border-[#E5E5E5] rounded-xl px-3 py-2 text-xs text-[#171717] font-mono focus:outline-none focus:border-[#B11226]"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-[#E5E5E5] text-xs">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-5 py-2 rounded-full border border-[#E5E5E5] text-gray-400 hover:text-white cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 rounded-full bg-gradient-to-r from-[#B11226] to-[#7F0D1D] text-white font-bold uppercase tracking-wider cursor-pointer shadow-lg hover:opacity-90"
              >
                Save Category
              </button>
            </div>
          </form>
        </div>
      )}
    </AdminLayout>
  );
};
