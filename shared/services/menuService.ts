import type { Category, Dish } from '../types/menu';
import { env } from '../config/env';
import { supabase } from './supabaseClient';
import { MOCK_CATEGORIES, MOCK_DISHES } from './mockData';

export class MenuService {
  static async getCategories(): Promise<Category[]> {
    if (env.isDevelopment && !env.supabaseUrl.includes('.supabase.co')) {
      return MOCK_CATEGORIES;
    }

    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('display_order', { ascending: true });

    if (error || !data) return [];

    return data.map((cat) => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      displayOrder: cat.display_order,
      isActive: cat.is_active,
    }));
  }

  static async getDishes(categorySlug?: string, includeUnavailable = false): Promise<Dish[]> {
    if (env.isDevelopment && !env.supabaseUrl.includes('.supabase.co')) {
      let filtered = includeUnavailable ? MOCK_DISHES : MOCK_DISHES.filter((d) => d.isAvailable);
      if (categorySlug && categorySlug !== 'all') {
        filtered = filtered.filter((d) => d.categorySlug === categorySlug);
      }
      return filtered;
    }

    let query = supabase.from('dishes').select('*, dish_modifiers(*), categories(slug)');
    if (!includeUnavailable) {
      query = query.eq('is_available', true);
    }
    if (categorySlug && categorySlug !== 'all') {
      const { data: cat } = await supabase.from('categories').select('id').eq('slug', categorySlug).single();
      if (cat) {
        query = query.eq('category_id', cat.id);
      }
    }

    const { data, error } = await query;
    if (error || !data) return [];

    return data.map((d: any) => ({
      id: d.id,
      categoryId: d.category_id,
      categorySlug: d.categories?.slug || categorySlug || 'mains',
      name: d.name,
      slug: d.slug,
      description: d.description,
      price: Number(d.price),
      mediaUrl: d.media_url,
      posterUrl: d.poster_url,
      videoUrl: d.video_url,
      videoPublicId: d.video_public_id,
      videoPosterUrl: d.video_poster_url,
      videoDuration: d.video_duration ? Number(d.video_duration) : undefined,
      videoStatus: d.video_status as any,
      featured: d.featured,
      calories: d.calories,
      dietaryTags: d.dietary_tags || [],
      allergens: d.allergens || [],
      winePairing: d.wine_pairing,
      isAvailable: d.is_available,
      modifiers: d.dish_modifiers?.map((m: any) => ({
        id: m.id,
        title: m.title,
        required: m.required,
        options: m.options,
      })) || [],
      createdAt: d.created_at,
      updatedAt: d.updated_at,
    }));
  }

  static async getDishById(id: string): Promise<Dish | null> {
    if (env.isDevelopment && !env.supabaseUrl.includes('.supabase.co')) {
      return MOCK_DISHES.find((d) => d.id === id) || MOCK_DISHES[0];
    }

    const { data, error } = await supabase
      .from('dishes')
      .select('*, dish_modifiers(*), categories(slug)')
      .eq('id', id)
      .single();
    if (error || !data) return null;

    return {
      id: data.id,
      categoryId: data.category_id,
      categorySlug: (data as any).categories?.slug || 'mains',
      name: data.name,
      slug: data.slug,
      description: data.description,
      price: Number(data.price),
      mediaUrl: data.media_url,
      posterUrl: data.poster_url,
      videoUrl: data.video_url,
      videoPublicId: data.video_public_id,
      videoPosterUrl: data.video_poster_url,
      videoDuration: data.video_duration ? Number(data.video_duration) : undefined,
      videoStatus: data.video_status as any,
      featured: data.featured,
      calories: data.calories,
      dietaryTags: data.dietary_tags || [],
      allergens: data.allergens || [],
      winePairing: data.wine_pairing,
      isAvailable: data.is_available,
      modifiers: (data as any).dish_modifiers?.map((m: any) => ({
        id: m.id,
        title: m.title,
        required: m.required,
        options: m.options,
      })) || [],
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  }

  static async createDish(dishData: Partial<Dish>): Promise<Dish> {
    const slug = dishData.slug || dishData.name?.toLowerCase().replace(/\s+/g, '-') || `dish-${Date.now()}`;

    if (env.isDevelopment && !env.supabaseUrl.includes('.supabase.co')) {
      const newDish: Dish = {
        id: `d-${Date.now()}`,
        categoryId: dishData.categoryId || 'c1',
        categorySlug: dishData.categorySlug || 'mains',
        name: dishData.name || 'New Dish',
        slug,
        description: dishData.description || '',
        price: dishData.price || 0,
        mediaUrl: dishData.mediaUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=600',
        posterUrl: dishData.posterUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=600',
        calories: dishData.calories,
        dietaryTags: dishData.dietaryTags || [],
        allergens: dishData.allergens || [],
        winePairing: dishData.winePairing,
        isAvailable: dishData.isAvailable !== undefined ? dishData.isAvailable : true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      MOCK_DISHES.unshift(newDish);
      return newDish;
    }

    const { data, error } = await supabase
      .from('dishes')
      .insert({
        category_id: dishData.categoryId,
        name: dishData.name,
        slug,
        description: dishData.description,
        price: dishData.price,
        media_url: dishData.mediaUrl,
        poster_url: dishData.posterUrl,
        calories: dishData.calories || null,
        dietary_tags: dishData.dietaryTags || [],
        allergens: dishData.allergens || [],
        wine_pairing: dishData.winePairing || null,
        is_available: dishData.isAvailable ?? true,
      })
      .select()
      .single();

    if (error || !data) throw new Error(error?.message || 'Failed to create dish.');

    return {
      id: data.id,
      categoryId: data.category_id,
      categorySlug: dishData.categorySlug || 'mains',
      name: data.name,
      slug: data.slug,
      description: data.description,
      price: Number(data.price),
      mediaUrl: data.media_url,
      posterUrl: data.poster_url,
      calories: data.calories,
      dietaryTags: data.dietary_tags || [],
      allergens: data.allergens || [],
      winePairing: data.wine_pairing,
      isAvailable: data.is_available,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  }

  static async updateDish(id: string, dishData: Partial<Dish>): Promise<boolean> {
    if (env.isDevelopment && !env.supabaseUrl.includes('.supabase.co')) {
      const index = MOCK_DISHES.findIndex((d) => d.id === id);
      if (index !== -1) {
        MOCK_DISHES[index] = { ...MOCK_DISHES[index], ...dishData, updatedAt: new Date().toISOString() };
        return true;
      }
      return false;
    }

    const { error } = await supabase
      .from('dishes')
      .update({
        ...(dishData.name && { name: dishData.name }),
        ...(dishData.price !== undefined && { price: dishData.price }),
        ...(dishData.description && { description: dishData.description }),
        ...(dishData.mediaUrl && { media_url: dishData.mediaUrl }),
        ...(dishData.isAvailable !== undefined && { is_available: dishData.isAvailable }),
        ...(dishData.videoUrl !== undefined && { video_url: dishData.videoUrl || null }),
        ...(dishData.videoPublicId !== undefined && { video_public_id: dishData.videoPublicId || null }),
        ...(dishData.videoPosterUrl !== undefined && { video_poster_url: dishData.videoPosterUrl || null }),
        ...(dishData.videoDuration !== undefined && { video_duration: dishData.videoDuration || null }),
        ...(dishData.videoStatus !== undefined && { video_status: dishData.videoStatus || null }),
        updated_at: new Date().toISOString(),
      })
      .eq('id', id);

    return !error;
  }

  static async deleteDish(id: string): Promise<boolean> {
    if (env.isDevelopment && !env.supabaseUrl.includes('.supabase.co')) {
      const index = MOCK_DISHES.findIndex((d) => d.id === id);
      if (index !== -1) {
        MOCK_DISHES.splice(index, 1);
        return true;
      }
      return false;
    }

    const { error } = await supabase.from('dishes').delete().eq('id', id);
    return !error;
  }

  static async createCategory(categoryData: Partial<Category>): Promise<Category> {
    const slug = categoryData.slug || categoryData.name?.toLowerCase().replace(/\s+/g, '-') || `cat-${Date.now()}`;

    if (env.isDevelopment && !env.supabaseUrl.includes('.supabase.co')) {
      const newCat: Category = {
        id: `c-${Date.now()}`,
        name: categoryData.name || 'New Category',
        slug,
        displayOrder: categoryData.displayOrder || MOCK_CATEGORIES.length + 1,
        isActive: categoryData.isActive !== undefined ? categoryData.isActive : true,
      };
      MOCK_CATEGORIES.push(newCat);
      return newCat;
    }

    const { data, error } = await supabase
      .from('categories')
      .insert({
        name: categoryData.name,
        slug,
        display_order: categoryData.displayOrder || 1,
        is_active: categoryData.isActive ?? true,
      })
      .select()
      .single();

    if (error || !data) throw new Error(error?.message || 'Failed to create category.');

    return {
      id: data.id,
      name: data.name,
      slug: data.slug,
      displayOrder: data.display_order,
      isActive: data.is_active,
    };
  }

  static async updateCategory(id: string, categoryData: Partial<Category>): Promise<boolean> {
    if (env.isDevelopment && !env.supabaseUrl.includes('.supabase.co')) {
      const cat = MOCK_CATEGORIES.find((c) => c.id === id);
      if (cat) {
        Object.assign(cat, categoryData);
        return true;
      }
      return false;
    }

    const { error } = await supabase.from('categories').update(categoryData).eq('id', id);
    return !error;
  }

  static async deleteCategory(id: string): Promise<boolean> {
    if (env.isDevelopment) {
      const index = MOCK_CATEGORIES.findIndex((c) => c.id === id);
      if (index !== -1) {
        MOCK_CATEGORIES.splice(index, 1);
        return true;
      }
      return false;
    }

    const { error } = await supabase.from('categories').delete().eq('id', id);
    return !error;
  }
}
