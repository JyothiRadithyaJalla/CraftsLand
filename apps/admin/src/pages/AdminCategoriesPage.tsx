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

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#DDD9CB] pb-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-[#182019]">Menu Categories</h1>
          <p className="text-xs text-[#626F64] font-medium">Structure menu sections, display order, and visibility</p>
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
          className="px-5 py-2.5 rounded-xl bg-[#31543A] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-md hover:bg-[#26432E] transition-all min-h-[44px]"
        >
          <Plus className="w-4 h-4" /> Add Category
        </button>
      </div>

      <div className="bg-white rounded-2xl overflow-hidden border border-[#DDD9CB] shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF8F3] border-b border-[#DDD9CB] text-[#3A453C] uppercase text-[10px] font-mono font-bold tracking-wider">
              <tr>
                <th className="p-4">Display Order</th>
                <th className="p-4">Category Name</th>
                <th className="p-4">URL Slug</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DDD9CB]">
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-[#626F64] font-mono animate-pulse">
                    Loading categories...
                  </td>
                </tr>
              ) : categories.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-[#626F64] font-serif text-sm">
                    No categories defined.
                  </td>
                </tr>
              ) : (
                categories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-[#FAF8F3] transition-colors">
                    <td className="p-4 font-mono font-bold text-[#182019]">#{cat.displayOrder}</td>
                    <td className="p-4 font-serif font-bold text-[#182019] text-sm">{cat.name}</td>
                    <td className="p-4 font-mono text-[#626F64]">{cat.slug}</td>
                    <td className="p-4">
                      <button
                        onClick={() => handleToggleActive(cat)}
                        className={`flex items-center gap-1.5 px-3 py-1 rounded-full font-mono text-[11px] font-bold cursor-pointer transition-colors ${
                          cat.isActive
                            ? 'bg-[#FAF8F3] text-[#31543A] border border-[#31543A]/30'
                            : 'bg-[#A8382B]/10 text-[#A8382B] border border-[#A8382B]/30'
                        }`}
                      >
                        {cat.isActive ? <ToggleRight className="w-4 h-4 text-[#31543A]" /> : <ToggleLeft className="w-4 h-4 text-[#A8382B]" />}
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
                          className="p-1.5 rounded-lg bg-[#FAF8F3] border border-[#DDD9CB] text-[#182019] hover:bg-[#31543A] hover:text-white cursor-pointer transition-colors shadow-xs"
                          title="Edit Category"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(cat.id)}
                          className="p-1.5 rounded-lg bg-[#A8382B]/10 border border-[#A8382B]/20 text-[#A8382B] hover:bg-[#A8382B]/20 cursor-pointer transition-colors shadow-xs"
                          title="Delete Category"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <form
            onSubmit={handleSaveCategory}
            className="bg-white w-full max-w-md border border-[#DDD9CB] rounded-3xl p-6 space-y-4 text-[#182019] shadow-2xl"
          >
            <div className="flex justify-between items-center border-b border-[#DDD9CB] pb-3">
              <h3 className="font-serif text-xl font-bold text-[#182019]">
                {editingCategory.id ? 'Edit Category' : 'Add Category'}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-full text-[#626F64] hover:text-[#182019] hover:bg-[#FAF8F3] cursor-pointer transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="text-[#3A453C] font-bold uppercase text-[10px] tracking-wider">Category Name *</label>
                <input
                  type="text"
                  required
                  value={editingCategory.name || ''}
                  onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                  placeholder="e.g. Sommelier Cellar & Cocktails"
                  className="w-full bg-[#FAF8F3] border border-[#DDD9CB] rounded-xl px-3 py-2 text-xs text-[#182019] placeholder-[#626F64]/50 focus:outline-none focus:border-[#31543A] transition-colors font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[#3A453C] font-bold uppercase text-[10px] tracking-wider">URL Slug (Unique)</label>
                <input
                  type="text"
                  value={editingCategory.slug || ''}
                  onChange={(e) => setEditingCategory({ ...editingCategory, slug: e.target.value })}
                  placeholder="e.g. wines"
                  className="w-full bg-[#FAF8F3] border border-[#DDD9CB] rounded-xl px-3 py-2 text-xs text-[#182019] placeholder-[#626F64]/50 font-mono focus:outline-none focus:border-[#31543A] transition-colors font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[#3A453C] font-bold uppercase text-[10px] tracking-wider">Display Order Priority</label>
                <input
                  type="number"
                  value={editingCategory.displayOrder || 1}
                  onChange={(e) => setEditingCategory({ ...editingCategory, displayOrder: parseInt(e.target.value) || 1 })}
                  className="w-full bg-[#FAF8F3] border border-[#DDD9CB] rounded-xl px-3 py-2 text-xs text-[#182019] font-mono focus:outline-none focus:border-[#31543A] transition-colors font-medium"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-[#DDD9CB] text-xs">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-5 py-2.5 rounded-xl border border-[#DDD9CB] text-[#182019] hover:bg-[#FAF8F3] font-bold cursor-pointer transition-colors shadow-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-[#31543A] text-white hover:bg-[#26432E] font-bold uppercase tracking-wider cursor-pointer shadow-md transition-all"
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
