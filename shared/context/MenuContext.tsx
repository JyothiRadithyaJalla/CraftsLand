import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { Category, DietaryTag, Dish } from '../types/menu';
import { MenuService } from '../services/menuService';
import { supabase } from '../services/supabaseClient';

interface MenuContextType {
  categories: Category[];
  dishes: Dish[];
  selectedCategory: string;
  searchQuery: string;
  dietaryFilter: DietaryTag | null;
  setSelectedCategory: (catSlug: string) => void;
  setSearchQuery: (query: string) => void;
  setDietaryFilter: (tag: DietaryTag | null) => void;
  isLoading: boolean;
  refreshMenu: () => Promise<void>;
}

const MenuContext = createContext<MenuContextType | undefined>(undefined);

export const MenuProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [dietaryFilter, setDietaryFilter] = useState<DietaryTag | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const loadMenuData = useCallback(async () => {
    try {
      const [cats, items] = await Promise.all([
        MenuService.getCategories(),
        MenuService.getDishes('all', true), // include unavailable so dishes show SOLD OUT badge
      ]);
      setCategories(cats);
      setDishes(items);
    } catch (err) {
      console.error('Failed to load menu data:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMenuData();

    // Subscribe to realtime dish updates (e.g. stock toggle, price change)
    const channel = supabase
      .channel('public_dishes_realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'dishes' },
        () => {
          loadMenuData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [loadMenuData]);

  return (
    <MenuContext.Provider
      value={{
        categories,
        dishes,
        selectedCategory,
        searchQuery,
        dietaryFilter,
        setSelectedCategory,
        setSearchQuery,
        setDietaryFilter,
        isLoading,
        refreshMenu: loadMenuData,
      }}
    >
      {children}
    </MenuContext.Provider>
  );
};

export const useMenuContext = () => {
  const context = useContext(MenuContext);
  if (!context) {
    throw new Error('useMenuContext must be used within a MenuProvider');
  }
  return context;
};
