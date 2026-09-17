import { useState, useEffect, useCallback } from 'react';

const FAVORITES_STORAGE_KEY = 'craftsland_favorite_dish_ids';

export function useFavorites() {
  const [favoriteIds, setFavoriteIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(FAVORITES_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favoriteIds));
    } catch {
      // Storage quota or privacy mode handling
    }
  }, [favoriteIds]);

  const toggleFavorite = useCallback((dishId: string) => {
    setFavoriteIds((prev) =>
      prev.includes(dishId) ? prev.filter((id) => id !== dishId) : [...prev, dishId]
    );
  }, []);

  const isFavorite = useCallback(
    (dishId: string) => favoriteIds.includes(dishId),
    [favoriteIds]
  );

  return {
    favoriteIds,
    toggleFavorite,
    isFavorite,
    count: favoriteIds.length,
  };
}
