-- ================================================================
-- MIGRATION: 2026091601_complete_20_dish_video_menu.sql
-- Completes the full 20-dish automated video menu for CraftsLand:
-- Starters (4), Main Course (5), Pasta (2), Pizza (2), Desserts (4), Beverages (3)
-- Every dish has a verified 200 OK CloudFront MP4 video from Mixkit.
-- ================================================================

-- 1. Ensure Categories exist and are active
UPDATE public.categories SET name = 'Starters', is_active = true WHERE slug = 'starters';
UPDATE public.categories SET name = 'Main Course', is_active = true WHERE slug = 'mains';
UPDATE public.categories SET name = 'Pasta', is_active = true WHERE slug = 'pasta';
UPDATE public.categories SET name = 'Pizza', is_active = true WHERE slug = 'pizza';
UPDATE public.categories SET name = 'Desserts', is_active = true WHERE slug = 'desserts';
UPDATE public.categories SET name = 'Beverages', is_active = true WHERE slug = 'beverages';

-- 2. Upsert all 20 Unique Dishes with Verified Video URLs & High-Res Posters

-- ─────────────────────────────────────────────────────────────
-- STARTERS (4 Dishes)
-- ─────────────────────────────────────────────────────────────

-- 1. Chicken Tikka (₹299)
INSERT INTO public.dishes (
  id, category_id, name, slug, description, price, media_url, poster_url, video_url,
  video_public_id, video_poster_url, video_duration, video_status, featured, calories, dietary_tags, allergens, wine_pairing, is_available
) VALUES (
  'd1000000-0000-0000-0000-000000000201',
  'c1000000-0000-0000-0000-000000000001',
  'Chicken Tikka',
  'chicken-tikka',
  'Smoky grilled chicken marinated in roasted tandoori spices and cultured yogurt, charred over live charcoal.',
  299.00,
  'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?q=80&w=600&auto=format&fit=crop',
  'https://assets.mixkit.co/videos/47159/47159-720.mp4',
  'craftsland/dishes/chicken_tikka',
  'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?q=80&w=600&auto=format&fit=crop',
  14.0, 'READY', true, 380, ARRAY['SIGNATURE', 'GLUTEN_FREE'], ARRAY['Dairy'], 'Dry Riesling', true
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name, description = EXCLUDED.description, price = EXCLUDED.price,
  media_url = EXCLUDED.media_url, poster_url = EXCLUDED.poster_url, video_url = EXCLUDED.video_url,
  is_available = true, featured = true;

-- 2. Paneer Tikka (₹249)
INSERT INTO public.dishes (
  id, category_id, name, slug, description, price, media_url, poster_url, video_url,
  video_public_id, video_poster_url, video_duration, video_status, featured, calories, dietary_tags, allergens, wine_pairing, is_available
) VALUES (
  'd1000000-0000-0000-0000-000000000202',
  'c1000000-0000-0000-0000-000000000001',
  'Paneer Tikka',
  'paneer-tikka',
  'Charred fresh cottage cheese cubes infused with Kashmiri chili, ajwain, and mustard oil, roasted with bell peppers.',
  249.00,
  'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?q=80&w=600&auto=format&fit=crop',
  'https://assets.mixkit.co/videos/46660/46660-720.mp4',
  'craftsland/dishes/paneer_tikka',
  'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?q=80&w=600&auto=format&fit=crop',
  16.0, 'READY', true, 340, ARRAY['SIGNATURE', 'VEGETARIAN', 'GLUTEN_FREE'], ARRAY['Dairy'], 'Sauvignon Blanc', true
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name, description = EXCLUDED.description, price = EXCLUDED.price,
  media_url = EXCLUDED.media_url, poster_url = EXCLUDED.poster_url, video_url = EXCLUDED.video_url,
  is_available = true, featured = true;

-- 3. Burrata Pugliese (₹280)
INSERT INTO public.dishes (
  id, category_id, name, slug, description, price, media_url, poster_url, video_url,
  video_public_id, video_poster_url, video_duration, video_status, featured, calories, dietary_tags, allergens, wine_pairing, is_available
) VALUES (
  'd1000000-0000-0000-0000-000000000106',
  'c1000000-0000-0000-0000-000000000001',
  'Burrata Pugliese',
  'burrata-pugliese',
  'Artisanal whole burrata with blistered heirloom cherry tomatoes, basil reduction, and cold-pressed olive oil.',
  280.00,
  'https://images.unsplash.com/photo-1592417817098-8f3d6910985b?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1592417817098-8f3d6910985b?q=80&w=600&auto=format&fit=crop',
  'https://assets.mixkit.co/videos/42845/42845-720.mp4',
  'craftsland/dishes/burrata_pugliese',
  'https://images.unsplash.com/photo-1592417817098-8f3d6910985b?q=80&w=600&auto=format&fit=crop',
  15.0, 'READY', false, 320, ARRAY['VEGETARIAN', 'GLUTEN_FREE'], ARRAY['Dairy'], 'Pinot Grigio', true
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name, description = EXCLUDED.description, price = EXCLUDED.price,
  media_url = EXCLUDED.media_url, poster_url = EXCLUDED.poster_url, video_url = EXCLUDED.video_url,
  is_available = true;

-- 4. Crispy Artichoke Hearts (₹220)
INSERT INTO public.dishes (
  id, category_id, name, slug, description, price, media_url, poster_url, video_url,
  video_public_id, video_poster_url, video_duration, video_status, featured, calories, dietary_tags, allergens, wine_pairing, is_available
) VALUES (
  'd1000000-0000-0000-0000-000000000108',
  'c1000000-0000-0000-0000-000000000001',
  'Crispy Artichoke Hearts',
  'crispy-artichoke-hearts',
  'Flash-fried baby artichoke hearts with meyer lemon zest, whipped sheep ricotta dip, and toasted pine nuts.',
  220.00,
  'https://images.unsplash.com/photo-1541544741938-0af808871cc0?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1541544741938-0af808871cc0?q=80&w=600&auto=format&fit=crop',
  'https://assets.mixkit.co/videos/47555/47555-720.mp4',
  'craftsland/dishes/crispy_artichoke',
  'https://images.unsplash.com/photo-1541544741938-0af808871cc0?q=80&w=600&auto=format&fit=crop',
  12.0, 'READY', false, 260, ARRAY['VEGETARIAN', 'GLUTEN_FREE'], ARRAY['Dairy', 'Nuts'], 'Vermentino', true
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name, description = EXCLUDED.description, price = EXCLUDED.price,
  media_url = EXCLUDED.media_url, poster_url = EXCLUDED.poster_url, video_url = EXCLUDED.video_url,
  is_available = true;

-- ─────────────────────────────────────────────────────────────
-- MAIN COURSE (5 Dishes)
-- ─────────────────────────────────────────────────────────────

-- 5. CraftsLand Biryani (₹399)
INSERT INTO public.dishes (
  id, category_id, name, slug, description, price, media_url, poster_url, video_url,
  video_public_id, video_poster_url, video_duration, video_status, featured, calories, dietary_tags, allergens, wine_pairing, is_available
) VALUES (
  'd1000000-0000-0000-0000-000000000203',
  'c1000000-0000-0000-0000-000000000002',
  'CraftsLand Biryani',
  'craftsland-biryani',
  'Royal long-grain aged basmati layered with succulent cuts, saffron dum infusion, caramelized shallots, and whole spices.',
  399.00,
  'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=600&auto=format&fit=crop',
  'https://assets.mixkit.co/videos/46354/46354-720.mp4',
  'craftsland/dishes/craftsland_biryani',
  'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=600&auto=format&fit=crop',
  15.0, 'READY', true, 620, ARRAY['SIGNATURE', 'CHEFS_CHOICE', 'GLUTEN_FREE'], ARRAY['Dairy'], 'Syrah', true
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name, description = EXCLUDED.description, price = EXCLUDED.price,
  media_url = EXCLUDED.media_url, poster_url = EXCLUDED.poster_url, video_url = EXCLUDED.video_url,
  is_available = true, featured = true;

-- 6. Butter Chicken (₹349)
INSERT INTO public.dishes (
  id, category_id, name, slug, description, price, media_url, poster_url, video_url,
  video_public_id, video_poster_url, video_duration, video_status, featured, calories, dietary_tags, allergens, wine_pairing, is_available
) VALUES (
  'd1000000-0000-0000-0000-000000000204',
  'c1000000-0000-0000-0000-000000000002',
  'Butter Chicken',
  'butter-chicken',
  'Tender flame-grilled chicken simmered in a velvety tomato makhani gravy with artisanal butter and sun-dried kasuri methi.',
  349.00,
  'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?q=80&w=600&auto=format&fit=crop',
  'https://assets.mixkit.co/videos/9358/9358-720.mp4',
  'craftsland/dishes/butter_chicken',
  'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?q=80&w=600&auto=format&fit=crop',
  18.0, 'READY', true, 560, ARRAY['SIGNATURE', 'GLUTEN_FREE'], ARRAY['Dairy', 'Nuts'], 'Chardonnay', true
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name, description = EXCLUDED.description, price = EXCLUDED.price,
  media_url = EXCLUDED.media_url, poster_url = EXCLUDED.poster_url, video_url = EXCLUDED.video_url,
  is_available = true, featured = true;

-- 7. Truffle Mushroom Risotto (₹450)
INSERT INTO public.dishes (
  id, category_id, name, slug, description, price, media_url, poster_url, video_url,
  video_public_id, video_poster_url, video_duration, video_status, featured, calories, dietary_tags, allergens, wine_pairing, is_available
) VALUES (
  'd1000000-0000-0000-0000-000000000101',
  'c1000000-0000-0000-0000-000000000002',
  'Truffle Mushroom Risotto',
  'truffle-mushroom-risotto',
  'Acquerello carnaroli rice, wild French morels, shaved black winter truffles, and 24-month Parmigiano-Reggiano emulsion.',
  450.00,
  'https://images.unsplash.com/photo-1633964913295-ceb43826e7c9?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1633964913295-ceb43826e7c9?q=80&w=600&auto=format&fit=crop',
  'https://assets.mixkit.co/videos/12579/12579-720.mp4',
  'craftsland/dishes/truffle_risotto',
  'https://images.unsplash.com/photo-1633964913295-ceb43826e7c9?q=80&w=600&auto=format&fit=crop',
  15.0, 'READY', false, 460, ARRAY['VEGETARIAN', 'GLUTEN_FREE'], ARRAY['Dairy'], 'Barolo Riserva', true
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name, description = EXCLUDED.description, price = EXCLUDED.price,
  media_url = EXCLUDED.media_url, poster_url = EXCLUDED.poster_url, video_url = EXCLUDED.video_url,
  is_available = true;

-- 8. Grilled Herb Chicken (₹380)
INSERT INTO public.dishes (
  id, category_id, name, slug, description, price, media_url, poster_url, video_url,
  video_public_id, video_poster_url, video_duration, video_status, featured, calories, dietary_tags, allergens, wine_pairing, is_available
) VALUES (
  'd1000000-0000-0000-0000-000000000102',
  'c1000000-0000-0000-0000-000000000002',
  'Grilled Herb Chicken',
  'grilled-herb-chicken',
  'Organic chicken breast flame-grilled over citrus wood with rosemary thyme reduction, roasted heirloom carrots, and potato mousseline.',
  380.00,
  'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?q=80&w=600&auto=format&fit=crop',
  'https://assets.mixkit.co/videos/31348/31348-720.mp4',
  'craftsland/dishes/herb_chicken',
  'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?q=80&w=600&auto=format&fit=crop',
  14.0, 'READY', false, 520, ARRAY['GLUTEN_FREE'], ARRAY['Dairy'], 'Pinot Noir', true
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name, description = EXCLUDED.description, price = EXCLUDED.price,
  media_url = EXCLUDED.media_url, poster_url = EXCLUDED.poster_url, video_url = EXCLUDED.video_url,
  is_available = true;

-- 9. Dal CraftsLand (₹269)
INSERT INTO public.dishes (
  id, category_id, name, slug, description, price, media_url, poster_url, video_url,
  video_public_id, video_poster_url, video_duration, video_status, featured, calories, dietary_tags, allergens, wine_pairing, is_available
) VALUES (
  'd1000000-0000-0000-0000-000000000109',
  'c1000000-0000-0000-0000-000000000002',
  'Dal CraftsLand',
  'dal-craftsland',
  'Black urad lentils slow-simmered overnight over charcoal with ripe tomatoes, white butter, and gentle cream.',
  269.00,
  'https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=600&auto=format&fit=crop',
  'https://assets.mixkit.co/videos/32608/32608-720.mp4',
  'craftsland/dishes/dal_craftsland',
  'https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=600&auto=format&fit=crop',
  16.0, 'READY', false, 360, ARRAY['SIGNATURE', 'VEGETARIAN', 'GLUTEN_FREE'], ARRAY['Dairy'], 'Cabernet Franc', true
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name, description = EXCLUDED.description, price = EXCLUDED.price,
  media_url = EXCLUDED.media_url, poster_url = EXCLUDED.poster_url, video_url = EXCLUDED.video_url,
  is_available = true;

-- ─────────────────────────────────────────────────────────────
-- PASTA (2 Dishes)
-- ─────────────────────────────────────────────────────────────

-- 10. Creamy Alfredo Pasta (₹320)
INSERT INTO public.dishes (
  id, category_id, name, slug, description, price, media_url, poster_url, video_url,
  video_public_id, video_poster_url, video_duration, video_status, featured, calories, dietary_tags, allergens, wine_pairing, is_available
) VALUES (
  'd1000000-0000-0000-0000-000000000103',
  'c1000000-0000-0000-0000-000000000003',
  'Creamy Alfredo Pasta',
  'creamy-alfredo-pasta',
  'House-extruded tagliatelle tossed in rich cultured Normandy butter, double cream, cracked pepper, and shaved Pecorino Romano.',
  320.00,
  'https://images.unsplash.com/photo-1645112411341-6c4fd023714a?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1645112411341-6c4fd023714a?q=80&w=600&auto=format&fit=crop',
  'https://assets.mixkit.co/videos/32201/32201-720.mp4',
  'craftsland/dishes/alfredo_pasta',
  'https://images.unsplash.com/photo-1645112411341-6c4fd023714a?q=80&w=600&auto=format&fit=crop',
  15.0, 'READY', false, 610, ARRAY['VEGETARIAN'], ARRAY['Dairy', 'Gluten'], 'Gavi di Gavi', true
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name, description = EXCLUDED.description, price = EXCLUDED.price,
  media_url = EXCLUDED.media_url, poster_url = EXCLUDED.poster_url, video_url = EXCLUDED.video_url,
  is_available = true;

-- 11. Penne Arrabbiata (₹280)
INSERT INTO public.dishes (
  id, category_id, name, slug, description, price, media_url, poster_url, video_url,
  video_public_id, video_poster_url, video_duration, video_status, featured, calories, dietary_tags, allergens, wine_pairing, is_available
) VALUES (
  'd1000000-0000-0000-0000-000000000110',
  'c1000000-0000-0000-0000-000000000003',
  'Penne Arrabbiata',
  'penne-arrabbiata',
  'Artisanal bronze-cut penne simmered in crushed San Marzano tomatoes, fiery Calabrian chili, garlic chips, and sweet basil.',
  280.00,
  'https://images.unsplash.com/photo-1621996346565-e3d5d6281691?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1621996346565-e3d5d6281691?q=80&w=600&auto=format&fit=crop',
  'https://assets.mixkit.co/videos/47624/47624-720.mp4',
  'craftsland/dishes/penne_arrabbiata',
  'https://images.unsplash.com/photo-1621996346565-e3d5d6281691?q=80&w=600&auto=format&fit=crop',
  14.0, 'READY', false, 480, ARRAY['VEGAN', 'SPICY'], ARRAY['Gluten'], 'Chianti Classico', true
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name, description = EXCLUDED.description, price = EXCLUDED.price,
  media_url = EXCLUDED.media_url, poster_url = EXCLUDED.poster_url, video_url = EXCLUDED.video_url,
  is_available = true;

-- ─────────────────────────────────────────────────────────────
-- PIZZA (2 Dishes)
-- ─────────────────────────────────────────────────────────────

-- 12. Wood-fired Margherita (₹290)
INSERT INTO public.dishes (
  id, category_id, name, slug, description, price, media_url, poster_url, video_url,
  video_public_id, video_poster_url, video_duration, video_status, featured, calories, dietary_tags, allergens, wine_pairing, is_available
) VALUES (
  'd1000000-0000-0000-0000-000000000104',
  'c1000000-0000-0000-0000-000000000004',
  'Wood-fired Margherita',
  'wood-fired-margherita',
  'Naturally fermented sourdough crust, San Marzano D.O.P. tomato coulis, fresh fior di latte mozzarella, cold-pressed olive oil, and sweet basil.',
  290.00,
  'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?q=80&w=600&auto=format&fit=crop',
  'https://assets.mixkit.co/videos/20913/20913-720.mp4',
  'craftsland/dishes/woodfired_margherita',
  'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?q=80&w=600&auto=format&fit=crop',
  16.0, 'READY', false, 680, ARRAY['VEGETARIAN'], ARRAY['Dairy', 'Gluten'], 'Chianti Classico', true
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name, description = EXCLUDED.description, price = EXCLUDED.price,
  media_url = EXCLUDED.media_url, poster_url = EXCLUDED.poster_url, video_url = EXCLUDED.video_url,
  is_available = true;

-- 13. Truffle & Wild Mushroom Pizza (₹360)
INSERT INTO public.dishes (
  id, category_id, name, slug, description, price, media_url, poster_url, video_url,
  video_public_id, video_poster_url, video_duration, video_status, featured, calories, dietary_tags, allergens, wine_pairing, is_available
) VALUES (
  'd1000000-0000-0000-0000-000000000111',
  'c1000000-0000-0000-0000-000000000004',
  'Truffle & Wild Mushroom Pizza',
  'truffle-wild-mushroom-pizza',
  'Stone-baked sourdough with garlic herb cream base, fontina cheese, sautéed chanterelles, shiitake, and white truffle oil.',
  360.00,
  'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=600&auto=format&fit=crop',
  'https://assets.mixkit.co/videos/49231/49231-720.mp4',
  'craftsland/dishes/truffle_pizza',
  'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=600&auto=format&fit=crop',
  15.0, 'READY', false, 720, ARRAY['VEGETARIAN'], ARRAY['Dairy', 'Gluten'], 'Barbera d''Asti', true
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name, description = EXCLUDED.description, price = EXCLUDED.price,
  media_url = EXCLUDED.media_url, poster_url = EXCLUDED.poster_url, video_url = EXCLUDED.video_url,
  is_available = true;

-- ─────────────────────────────────────────────────────────────
-- DESSERTS (4 Dishes)
-- ─────────────────────────────────────────────────────────────

-- 14. Gulab Jamun (₹149)
INSERT INTO public.dishes (
  id, category_id, name, slug, description, price, media_url, poster_url, video_url,
  video_public_id, video_poster_url, video_duration, video_status, featured, calories, dietary_tags, allergens, wine_pairing, is_available
) VALUES (
  'd1000000-0000-0000-0000-000000000205',
  'c1000000-0000-0000-0000-000000000005',
  'Gulab Jamun',
  'gulab-jamun',
  'Warm golden fried khoya dumplings immersed in fragrant green cardamom and saffron rose syrup, garnished with slivered pistachios.',
  149.00,
  'https://images.unsplash.com/photo-1601050690597-df0568f70950?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1601050690597-df0568f70950?q=80&w=600&auto=format&fit=crop',
  'https://assets.mixkit.co/videos/24690/24690-720.mp4',
  'craftsland/dishes/gulab_jamun',
  'https://images.unsplash.com/photo-1601050690597-df0568f70950?q=80&w=600&auto=format&fit=crop',
  15.0, 'READY', true, 320, ARRAY['SIGNATURE', 'VEGETARIAN'], ARRAY['Dairy', 'Nuts', 'Gluten'], 'Moscato d''Asti', true
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name, description = EXCLUDED.description, price = EXCLUDED.price,
  media_url = EXCLUDED.media_url, poster_url = EXCLUDED.poster_url, video_url = EXCLUDED.video_url,
  is_available = true, featured = true;

-- 15. Chocolate Lava Cake (₹240)
INSERT INTO public.dishes (
  id, category_id, name, slug, description, price, media_url, poster_url, video_url,
  video_public_id, video_poster_url, video_duration, video_status, featured, calories, dietary_tags, allergens, wine_pairing, is_available
) VALUES (
  'd1000000-0000-0000-0000-000000000105',
  'c1000000-0000-0000-0000-000000000005',
  'Chocolate Lava Cake',
  'chocolate-lava-cake',
  'Warm molten cake made with single-origin Valrhona 72% dark chocolate, liquid ganache core, and Madagascar Bourbon vanilla bean gelato.',
  240.00,
  'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?q=80&w=600&auto=format&fit=crop',
  'https://assets.mixkit.co/videos/29050/29050-720.mp4',
  'craftsland/dishes/lava_cake',
  'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?q=80&w=600&auto=format&fit=crop',
  16.0, 'READY', false, 490, ARRAY['VEGETARIAN'], ARRAY['Dairy', 'Eggs', 'Gluten'], 'Tawny Port', true
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name, description = EXCLUDED.description, price = EXCLUDED.price,
  media_url = EXCLUDED.media_url, poster_url = EXCLUDED.poster_url, video_url = EXCLUDED.video_url,
  is_available = true;

-- 16. Rasmalai Tres Leches (₹189)
INSERT INTO public.dishes (
  id, category_id, name, slug, description, price, media_url, poster_url, video_url,
  video_public_id, video_poster_url, video_duration, video_status, featured, calories, dietary_tags, allergens, wine_pairing, is_available
) VALUES (
  'd1000000-0000-0000-0000-000000000112',
  'c1000000-0000-0000-0000-000000000005',
  'Rasmalai Tres Leches',
  'rasmalai-tres-leches',
  'Delicate cottage cheese patties soaked in saffron-infused rabri cream with cardamom sponge and pistachio crumble.',
  189.00,
  'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?q=80&w=600&auto=format&fit=crop',
  'https://assets.mixkit.co/videos/32457/32457-720.mp4',
  'craftsland/dishes/rasmalai_tres_leches',
  'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?q=80&w=600&auto=format&fit=crop',
  15.0, 'READY', false, 380, ARRAY['SIGNATURE', 'VEGETARIAN'], ARRAY['Dairy', 'Nuts', 'Gluten'], 'Sweet Riesling', true
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name, description = EXCLUDED.description, price = EXCLUDED.price,
  media_url = EXCLUDED.media_url, poster_url = EXCLUDED.poster_url, video_url = EXCLUDED.video_url,
  is_available = true;

-- 17. Artisanal Pistachio Gelato (₹169)
INSERT INTO public.dishes (
  id, category_id, name, slug, description, price, media_url, poster_url, video_url,
  video_public_id, video_poster_url, video_duration, video_status, featured, calories, dietary_tags, allergens, wine_pairing, is_available
) VALUES (
  'd1000000-0000-0000-0000-000000000113',
  'c1000000-0000-0000-0000-000000000005',
  'Artisanal Pistachio Gelato',
  'artisanal-pistachio-gelato',
  'Slow-churned Sicilian pistachio gelato topped with roasted crushed pistachios and wildflower honey drizzle.',
  169.00,
  'https://images.unsplash.com/photo-1579372786545-d24232daf58c?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1579372786545-d24232daf58c?q=80&w=600&auto=format&fit=crop',
  'https://assets.mixkit.co/videos/22022/22022-720.mp4',
  'craftsland/dishes/pistachio_gelato',
  'https://images.unsplash.com/photo-1579372786545-d24232daf58c?q=80&w=600&auto=format&fit=crop',
  12.0, 'READY', false, 280, ARRAY['VEGETARIAN', 'GLUTEN_FREE'], ARRAY['Dairy', 'Nuts'], 'Prosecco', true
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name, description = EXCLUDED.description, price = EXCLUDED.price,
  media_url = EXCLUDED.media_url, poster_url = EXCLUDED.poster_url, video_url = EXCLUDED.video_url,
  is_available = true;

-- ─────────────────────────────────────────────────────────────
-- BEVERAGES (3 Dishes)
-- ─────────────────────────────────────────────────────────────

-- 18. Mango Lassi (₹129)
INSERT INTO public.dishes (
  id, category_id, name, slug, description, price, media_url, poster_url, video_url,
  video_public_id, video_poster_url, video_duration, video_status, featured, calories, dietary_tags, allergens, wine_pairing, is_available
) VALUES (
  'd1000000-0000-0000-0000-000000000206',
  'c1000000-0000-0000-0000-000000000006',
  'Mango Lassi',
  'mango-lassi',
  'Chilled artisanal cultured yogurt blended with sweet Ratnagiri Alphonso mango pulp, green cardamom, and honey.',
  129.00,
  'https://images.unsplash.com/photo-1527661591475-527312dd65f5?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1527661591475-527312dd65f5?q=80&w=600&auto=format&fit=crop',
  'https://assets.mixkit.co/videos/22848/22848-720.mp4',
  'craftsland/dishes/mango_lassi',
  'https://images.unsplash.com/photo-1527661591475-527312dd65f5?q=80&w=600&auto=format&fit=crop',
  15.0, 'READY', true, 210, ARRAY['SIGNATURE', 'VEGETARIAN', 'GLUTEN_FREE'], ARRAY['Dairy'], 'Botanical Refresher', true
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name, description = EXCLUDED.description, price = EXCLUDED.price,
  media_url = EXCLUDED.media_url, poster_url = EXCLUDED.poster_url, video_url = EXCLUDED.video_url,
  is_available = true, featured = true;

-- 19. Smoked Botanical Mocktail (₹180)
INSERT INTO public.dishes (
  id, category_id, name, slug, description, price, media_url, poster_url, video_url,
  video_public_id, video_poster_url, video_duration, video_status, featured, calories, dietary_tags, allergens, wine_pairing, is_available
) VALUES (
  'd1000000-0000-0000-0000-000000000107',
  'c1000000-0000-0000-0000-000000000006',
  'Smoked Botanical Mocktail',
  'smoked-botanical-mocktail',
  'Smoked rosemary mist, cold-brewed Darjeeling black tea, yuzu citrus, and effervescent sparkling soda.',
  180.00,
  'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=600&auto=format&fit=crop',
  'https://assets.mixkit.co/videos/15171/15171-720.mp4',
  'craftsland/dishes/smoked_mocktail',
  'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=600&auto=format&fit=crop',
  14.0, 'READY', false, 140, ARRAY['VEGAN', 'GLUTEN_FREE'], ARRAY[]::text[], 'Artisanal Elixir', true
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name, description = EXCLUDED.description, price = EXCLUDED.price,
  media_url = EXCLUDED.media_url, poster_url = EXCLUDED.poster_url, video_url = EXCLUDED.video_url,
  is_available = true;

-- 20. Masala Chai Affogato (₹149)
INSERT INTO public.dishes (
  id, category_id, name, slug, description, price, media_url, poster_url, video_url,
  video_public_id, video_poster_url, video_duration, video_status, featured, calories, dietary_tags, allergens, wine_pairing, is_available
) VALUES (
  'd1000000-0000-0000-0000-000000000114',
  'c1000000-0000-0000-0000-000000000006',
  'Masala Chai Affogato',
  'masala-chai-affogato',
  'Double shot of rich espresso poured over house-churned spiced masala chai gelato with crushed ginger biscuits.',
  149.00,
  'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?q=80&w=600&auto=format&fit=crop',
  'https://assets.mixkit.co/videos/9267/9267-720.mp4',
  'craftsland/dishes/chai_affogato',
  'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?q=80&w=600&auto=format&fit=crop',
  16.0, 'READY', false, 190, ARRAY['SIGNATURE', 'VEGETARIAN'], ARRAY['Dairy', 'Gluten'], 'Digestif', true
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name, description = EXCLUDED.description, price = EXCLUDED.price,
  media_url = EXCLUDED.media_url, poster_url = EXCLUDED.poster_url, video_url = EXCLUDED.video_url,
  is_available = true;
