export type DietaryTag = 'VEGAN' | 'VEGETARIAN' | 'GLUTEN_FREE' | 'NUT_FREE' | 'HALAL' | 'CHEFS_CHOICE' | 'SPICY';

export interface ModifierOption {
  id: string;
  name: string;
  price: number;
}

export interface DishModifier {
  id: string;
  title: string;
  required: boolean;
  options: ModifierOption[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  displayOrder: number;
  isActive: boolean;
}

export interface Dish {
  id: string;
  categoryId: string;
  categorySlug: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  mediaUrl: string;
  posterUrl: string;
  calories?: number;
  dietaryTags: DietaryTag[];
  allergens: string[];
  winePairing?: string;
  isAvailable: boolean;
  modifiers?: DishModifier[];
  createdAt: string;
  updatedAt: string;
}
