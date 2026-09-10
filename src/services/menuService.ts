import type { Category, Dish } from '../types/menu';
import { env } from '../config/env';
import { supabase } from './supabaseClient';
import { MOCK_CATEGORIES, MOCK_DISHES } from './mockData';

export class MenuService {
  static async getCategories(): Promise<Category[]> {
    if (env.isDevelopment) {
      return MOCK_CATEGORIES;
    }

    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('is_active', true)
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

  static async getDishes(categorySlug?: string): Promise<Dish[]> {
    if (env.isDevelopment) {
      if (!categorySlug || categorySlug === 'all') return MOCK_DISHES;
      return MOCK_DISHES.filter((d) => d.categorySlug === categorySlug);
    }

    let query = supabase.from('dishes').select('*').eq('is_available', true);
    if (categorySlug && categorySlug !== 'all') {
      const { data: cat } = await supabase.from('categories').select('id').eq('slug', categorySlug).single();
      if (cat) {
        query = query.eq('category_id', cat.id);
      }
    }

    const { data, error } = await query;
    if (error || !data) return [];

    return data.map((d) => ({
      id: d.id,
      categoryId: d.category_id,
      categorySlug: categorySlug || 'mains',
      name: d.name,
      slug: d.slug,
      description: d.description,
      price: Number(d.price),
      mediaUrl: d.media_url,
      posterUrl: d.poster_url,
      calories: d.calories,
      dietaryTags: d.dietary_tags || [],
      allergens: d.allergens || [],
      winePairing: d.wine_pairing,
      isAvailable: d.is_available,
      createdAt: d.created_at,
      updatedAt: d.updated_at,
    }));
  }

  static async getDishById(id: string): Promise<Dish | null> {
    if (env.isDevelopment) {
      return MOCK_DISHES.find((d) => d.id === id) || MOCK_DISHES[0];
    }

    const { data, error } = await supabase.from('dishes').select('*').eq('id', id).single();
    if (error || !data) return null;

    return {
      id: data.id,
      categoryId: data.category_id,
      categorySlug: 'mains',
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
}
