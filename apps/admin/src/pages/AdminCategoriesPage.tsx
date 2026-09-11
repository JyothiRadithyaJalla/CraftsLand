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

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#3A3027] pb-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-red-gradient">Menu Categories</h1>
          <p className="text-xs text-[#B8AEA1]">Structure menu sections, display order, and visibility</p>
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
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#C85A3A] via-[#B84A32] to-[#8B3525] text-[#F5EFE5] font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 cursor-pointer shadow-lg hover:brightness-110 transition-all"
        >
          <Plus className="w-4 h-4" /> Add Category
        </button>
      </div>

      <div className="bg-[#211B16] rounded-2xl overflow-hidden border border-[#3A3027] shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#171310] border-b border-[#3A3027] text-[#B8AEA1] uppercase text-[10px] font-mono">
              <tr>
                <th className="p-4">Display Order</th>
                <th className="p-4">Category Name</th>
                <th className="p-4">URL Slug</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#3A3027]">
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-[#B8AEA1] font-mono animate-pulse">
                    Loading categories...
                  </td>
                </tr>
              ) : categories.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-[#B8AEA1] font-serif text-sm">
                    No categories defined.
                  </td>
                </tr>
              ) : (
                categories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-[#2A231C]/60 transition-colors">
                    <td className="p-4 font-mono font-bold text-[#C85A3A]">#{cat.displayOrder}</td>
                    <td className="p-4 font-serif font-bold text-[#F5EFE5] text-sm">{cat.name}</td>
                    <td className="p-4 font-mono text-[#B8AEA1]">{cat.slug}</td>
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
                          className="p-1.5 rounded-lg bg-[#171310] border border-[#3A3027] text-[#B8AEA1] hover:text-[#F5EFE5] hover:border-[#B84A32] cursor-pointer transition-colors"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(cat.id)}
                          className="p-1.5 rounded-lg bg-red-950/30 border border-red-500/30 text-red-400 hover:bg-red-900/40 cursor-pointer transition-colors"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
          <form
            onSubmit={handleSaveCategory}
            className="bg-[#211B16] w-full max-w-md border border-[#3A3027] rounded-3xl p-6 space-y-4 text-[#F5EFE5] shadow-2xl"
          >
            <div className="flex justify-between items-center border-b border-[#3A3027] pb-3">
              <h3 className="font-serif text-xl font-bold text-red-gradient">
                {editingCategory.id ? 'Edit Category' : 'Add Category'}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-full text-[#B8AEA1] hover:text-[#F5EFE5] cursor-pointer transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="text-[#B8AEA1] font-semibold">Category Name *</label>
                <input
                  type="text"
                  required
                  value={editingCategory.name || ''}
                  onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                  placeholder="e.g. Sommelier Cellar & Cocktails"
                  className="w-full bg-[#171310] border border-[#3A3027] rounded-xl px-3 py-2 text-xs text-[#F5EFE5] placeholder-[#B8AEA1]/40 focus:outline-none focus:border-[#B84A32] transition-colors"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[#B8AEA1] font-semibold">URL Slug (Unique)</label>
                <input
                  type="text"
                  value={editingCategory.slug || ''}
                  onChange={(e) => setEditingCategory({ ...editingCategory, slug: e.target.value })}
                  placeholder="e.g. wines"
                  className="w-full bg-[#171310] border border-[#3A3027] rounded-xl px-3 py-2 text-xs text-[#F5EFE5] placeholder-[#B8AEA1]/40 font-mono focus:outline-none focus:border-[#B84A32] transition-colors"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[#B8AEA1] font-semibold">Display Order Priority</label>
                <input
                  type="number"
                  value={editingCategory.displayOrder || 1}
                  onChange={(e) => setEditingCategory({ ...editingCategory, displayOrder: parseInt(e.target.value) || 1 })}
                  className="w-full bg-[#171310] border border-[#3A3027] rounded-xl px-3 py-2 text-xs text-[#F5EFE5] font-mono focus:outline-none focus:border-[#B84A32] transition-colors"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-[#3A3027] text-xs">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-5 py-2 rounded-full border border-[#3A3027] text-[#B8AEA1] hover:text-[#F5EFE5] hover:border-[#B8AEA1] cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 rounded-full bg-gradient-to-r from-[#C85A3A] via-[#B84A32] to-[#8B3525] text-[#F5EFE5] font-bold uppercase tracking-wider cursor-pointer shadow-lg hover:brightness-110 transition-all"
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
