import React, { createContext, useContext, useEffect, useState } from 'react';
import type { Category, DietaryTag, Dish } from '../types/menu';
import { MenuService } from '../services/menuService';

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
}

const MenuContext = createContext<MenuContextType | undefined>(undefined);

export const MenuProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [dietaryFilter, setDietaryFilter] = useState<DietaryTag | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    Promise.all([MenuService.getCategories(), MenuService.getDishes()]).then(([cats, items]) => {
      setCategories(cats);
      setDishes(items);
      setIsLoading(false);
    });
  }, []);

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
