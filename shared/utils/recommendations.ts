import type { Dish } from '../types/menu';

/**
 * Deterministically computes related dish recommendations using authentic
 * category, shared dietary tags, and dietary compatibility.
 */
export function getRecommendedDishes(currentDish: Dish, allDishes: Dish[], limit: number = 3): Dish[] {
  if (!currentDish || !allDishes || allDishes.length === 0) return [];

  const others = allDishes.filter((d) => d.id !== currentDish.id && d.isAvailable !== false);
  const currentTags = new Set(currentDish.dietaryTags || []);
  const isCurrentVeg = currentTags.has('VEGETARIAN') || currentTags.has('VEGAN');

  const scored = others.map((dish) => {
    let score = 0;

    // 1. Same category (+4)
    if (dish.categorySlug === currentDish.categorySlug || dish.categoryId === currentDish.categoryId) {
      score += 4;
    }

    // 2. Matching dietary tags (+2 each)
    const dishTags = new Set(dish.dietaryTags || []);
    for (const tag of dishTags) {
      if (currentTags.has(tag)) {
        score += 2;
      }
    }

    // 3. Dietary compatibility: If current dish is vegetarian/vegan, prioritize vegetarian/vegan (+3)
    const isCandidateVeg = dishTags.has('VEGETARIAN') || dishTags.has('VEGAN');
    if (isCurrentVeg && isCandidateVeg) {
      score += 3;
    }

    // 4. Featured or Signature items (+1)
    if (dish.featured || dishTags.has('SIGNATURE')) {
      score += 1;
    }

    return { dish, score };
  });

  scored.sort((a, b) => b.score - a.score || a.dish.name.localeCompare(b.dish.name));

  return scored.slice(0, limit).map((s) => s.dish);
}