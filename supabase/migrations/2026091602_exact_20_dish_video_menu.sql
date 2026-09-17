-- ================================================================
-- MIGRATION: 2026091602_exact_20_dish_video_menu.sql
-- Exact 20-dish video menu organized by categories:
-- STARTERS (3), MAIN COURSE (3), SNACKS (3), PASTA (3), PIZZA (3), DESSERTS (3), BEVERAGES (2)
-- Removes: Burrata Pugliese (repurposed into Crispy Samosa)
-- Every dish has a verified 200 OK CloudFront MP4 video from Mixkit.
-- In-place update of all 20 existing IDs avoids foreign key conflicts with historical orders.
-- ================================================================

-- 1. Ensure Categories with Snacks exist and have proper display orders
INSERT INTO public.categories (id, name, slug, display_order, is_active, image_url, description)
VALUES 
  ('c1000000-0000-0000-0000-000000000001', 'Starters', 'starters', 1, true, 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?q=80&w=800&auto=format&fit=crop', 'Crisp artisanal bites and palate openers made with seasonal garden herbs.'),
  ('c1000000-0000-0000-0000-000000000002', 'Main Course', 'mains', 2, true, 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=800&auto=format&fit=crop', 'Slow-roasted meats, seared poultry, and ocean-fresh seafood creations.'),
  ('c1000000-0000-0000-0000-000000000007', 'Snacks', 'snacks', 3, true, 'https://images.unsplash.com/photo-1601050690597-df0568f70950?q=80&w=800&auto=format&fit=crop', 'Golden crispy street snacks, double-fried fries, and savory bites.'),
  ('c1000000-0000-0000-0000-000000000003', 'Pasta', 'pasta', 4, true, 'https://images.unsplash.com/photo-1621996346565-e3d5d6281691?q=80&w=800&auto=format&fit=crop', 'Handcrafted pasta ribbons tossed in aged cheeses and velvety reductions.'),
  ('c1000000-0000-0000-0000-000000000004', 'Pizza', 'pizza', 5, true, 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?q=80&w=800&auto=format&fit=crop', 'Fermented dough stone-baked at 800°F with San Marzano tomatoes and fior di latte.'),
  ('c1000000-0000-0000-0000-000000000005', 'Desserts', 'desserts', 6, true, 'https://images.unsplash.com/photo-1579372786545-d24232daf58c?q=80&w=800&auto=format&fit=crop', 'Molten chocolate indulgence, silky sweets, and crisp caramelized confections.'),
  ('c1000000-0000-0000-0000-000000000006', 'Beverages', 'beverages', 7, true, 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=800&auto=format&fit=crop', 'Artisanal mango lassis, cold brew coffees, and botanical infusions.')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  display_order = EXCLUDED.display_order,
  is_active = true,
  image_url = EXCLUDED.image_url,
  description = EXCLUDED.description;

-- 2. Temporarily prefix all dish slugs to prevent unique constraint collisions during repurposing
UPDATE public.dishes SET slug = 'temp-' || id;

-- 3. Upsert the 20 Unique Dishes with Verified Videos

-- ─────────────────────────────────────────────────────────────
-- STARTERS (3 Dishes)
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
  name = EXCLUDED.name, slug = EXCLUDED.slug, category_id = EXCLUDED.category_id,
  description = EXCLUDED.description, price = EXCLUDED.price, media_url = EXCLUDED.media_url,
  poster_url = EXCLUDED.poster_url, video_url = EXCLUDED.video_url, video_public_id = EXCLUDED.video_public_id,
  video_poster_url = EXCLUDED.video_poster_url, video_duration = EXCLUDED.video_duration,
  video_status = EXCLUDED.video_status, featured = true, calories = EXCLUDED.calories,
  dietary_tags = EXCLUDED.dietary_tags, allergens = EXCLUDED.allergens, wine_pairing = EXCLUDED.wine_pairing,
  is_available = true;

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
  name = EXCLUDED.name, slug = EXCLUDED.slug, category_id = EXCLUDED.category_id,
  description = EXCLUDED.description, price = EXCLUDED.price, media_url = EXCLUDED.media_url,
  poster_url = EXCLUDED.poster_url, video_url = EXCLUDED.video_url, video_public_id = EXCLUDED.video_public_id,
  video_poster_url = EXCLUDED.video_poster_url, video_duration = EXCLUDED.video_duration,
  video_status = EXCLUDED.video_status, featured = true, calories = EXCLUDED.calories,
  dietary_tags = EXCLUDED.dietary_tags, allergens = EXCLUDED.allergens, wine_pairing = EXCLUDED.wine_pairing,
  is_available = true;

-- 3. Hara Bhara Kebab (₹229)
INSERT INTO public.dishes (
  id, category_id, name, slug, description, price, media_url, poster_url, video_url,
  video_public_id, video_poster_url, video_duration, video_status, featured, calories, dietary_tags, allergens, wine_pairing, is_available
) VALUES (
  'd1000000-0000-0000-0000-000000000108',
  'c1000000-0000-0000-0000-000000000001',
  'Hara Bhara Kebab',
  'hara-bhara-kebab',
  'Nutritious spinach, green peas, and fresh herb kebabs blended with roasted gram flour and aromatic spices.',
  229.00,
  'https://images.unsplash.com/photo-1541544741938-0af808871cc0?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1541544741938-0af808871cc0?q=80&w=600&auto=format&fit=crop',
  'https://assets.mixkit.co/videos/47555/47555-720.mp4',
  'craftsland/dishes/hara_bhara_kebab',
  'https://images.unsplash.com/photo-1541544741938-0af808871cc0?q=80&w=600&auto=format&fit=crop',
  12.0, 'READY', false, 240, ARRAY['VEGETARIAN', 'GLUTEN_FREE'], ARRAY[]::text[], 'Vermentino', true
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name, slug = EXCLUDED.slug, category_id = EXCLUDED.category_id,
  description = EXCLUDED.description, price = EXCLUDED.price, media_url = EXCLUDED.media_url,
  poster_url = EXCLUDED.poster_url, video_url = EXCLUDED.video_url, video_public_id = EXCLUDED.video_public_id,
  video_poster_url = EXCLUDED.video_poster_url, video_duration = EXCLUDED.video_duration,
  video_status = EXCLUDED.video_status, featured = false, calories = EXCLUDED.calories,
  dietary_tags = EXCLUDED.dietary_tags, allergens = EXCLUDED.allergens, wine_pairing = EXCLUDED.wine_pairing,
  is_available = true;

-- ─────────────────────────────────────────────────────────────
-- MAIN COURSE (3 Dishes)
-- ─────────────────────────────────────────────────────────────

-- 4. CraftsLand Biryani (₹399)
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
  name = EXCLUDED.name, slug = EXCLUDED.slug, category_id = EXCLUDED.category_id,
  description = EXCLUDED.description, price = EXCLUDED.price, media_url = EXCLUDED.media_url,
  poster_url = EXCLUDED.poster_url, video_url = EXCLUDED.video_url, video_public_id = EXCLUDED.video_public_id,
  video_poster_url = EXCLUDED.video_poster_url, video_duration = EXCLUDED.video_duration,
  video_status = EXCLUDED.video_status, featured = true, calories = EXCLUDED.calories,
  dietary_tags = EXCLUDED.dietary_tags, allergens = EXCLUDED.allergens, wine_pairing = EXCLUDED.wine_pairing,
  is_available = true;

-- 5. Butter Chicken (₹349)
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
  name = EXCLUDED.name, slug = EXCLUDED.slug, category_id = EXCLUDED.category_id,
  description = EXCLUDED.description, price = EXCLUDED.price, media_url = EXCLUDED.media_url,
  poster_url = EXCLUDED.poster_url, video_url = EXCLUDED.video_url, video_public_id = EXCLUDED.video_public_id,
  video_poster_url = EXCLUDED.video_poster_url, video_duration = EXCLUDED.video_duration,
  video_status = EXCLUDED.video_status, featured = true, calories = EXCLUDED.calories,
  dietary_tags = EXCLUDED.dietary_tags, allergens = EXCLUDED.allergens, wine_pairing = EXCLUDED.wine_pairing,
  is_available = true;

-- 6. Dal Makhani (₹279)
INSERT INTO public.dishes (
  id, category_id, name, slug, description, price, media_url, poster_url, video_url,
  video_public_id, video_poster_url, video_duration, video_status, featured, calories, dietary_tags, allergens, wine_pairing, is_available
) VALUES (
  'd1000000-0000-0000-0000-000000000109',
  'c1000000-0000-0000-0000-000000000002',
  'Dal Makhani',
  'dal-makhani',
  'Slow-cooked black lentils simmered overnight over charcoal embers with ripe tomatoes, churned butter, and rich cream.',
  279.00,
  'https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=600&auto=format&fit=crop',
  'https://assets.mixkit.co/videos/32608/32608-720.mp4',
  'craftsland/dishes/dal_makhani',
  'https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=600&auto=format&fit=crop',
  16.0, 'READY', false, 360, ARRAY['SIGNATURE', 'VEGETARIAN', 'GLUTEN_FREE'], ARRAY['Dairy'], 'Cabernet Franc', true
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name, slug = EXCLUDED.slug, category_id = EXCLUDED.category_id,
  description = EXCLUDED.description, price = EXCLUDED.price, media_url = EXCLUDED.media_url,
  poster_url = EXCLUDED.poster_url, video_url = EXCLUDED.video_url, video_public_id = EXCLUDED.video_public_id,
  video_poster_url = EXCLUDED.video_poster_url, video_duration = EXCLUDED.video_duration,
  video_status = EXCLUDED.video_status, featured = false, calories = EXCLUDED.calories,
  dietary_tags = EXCLUDED.dietary_tags, allergens = EXCLUDED.allergens, wine_pairing = EXCLUDED.wine_pairing,
  is_available = true;

-- ─────────────────────────────────────────────────────────────
-- SNACKS (3 Dishes)
-- ─────────────────────────────────────────────────────────────

-- 7. Crispy Samosa (₹149) [Repurposed from d1000000-0000-0000-0000-000000000106 Burrata Pugliese]
INSERT INTO public.dishes (
  id, category_id, name, slug, description, price, media_url, poster_url, video_url,
  video_public_id, video_poster_url, video_duration, video_status, featured, calories, dietary_tags, allergens, wine_pairing, is_available
) VALUES (
  'd1000000-0000-0000-0000-000000000106',
  'c1000000-0000-0000-0000-000000000007',
  'Crispy Samosa',
  'crispy-samosa',
  'Golden flaky handmade pastry parcels filled with spiced potatoes, green peas, and toasted cumin seeds, served with mint chutney.',
  149.00,
  'https://images.unsplash.com/photo-1601050690597-df0568f70950?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1601050690597-df0568f70950?q=80&w=600&auto=format&fit=crop',
  'https://assets.mixkit.co/videos/36423/36423-720.mp4',
  'craftsland/dishes/crispy_samosa',
  'https://images.unsplash.com/photo-1601050690597-df0568f70950?q=80&w=600&auto=format&fit=crop',
  14.0, 'READY', false, 280, ARRAY['VEGETARIAN'], ARRAY['Gluten'], 'Masala Chai', true
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name, slug = EXCLUDED.slug, category_id = EXCLUDED.category_id,
  description = EXCLUDED.description, price = EXCLUDED.price, media_url = EXCLUDED.media_url,
  poster_url = EXCLUDED.poster_url, video_url = EXCLUDED.video_url, video_public_id = EXCLUDED.video_public_id,
  video_poster_url = EXCLUDED.video_poster_url, video_duration = EXCLUDED.video_duration,
  video_status = EXCLUDED.video_status, featured = false, calories = EXCLUDED.calories,
  dietary_tags = EXCLUDED.dietary_tags, allergens = EXCLUDED.allergens, wine_pairing = EXCLUDED.wine_pairing,
  is_available = true;

-- 8. Truffle French Fries (₹189) [Repurposed from d1000000-0000-0000-0000-000000000113 Artisanal Pistachio Gelato]
INSERT INTO public.dishes (
  id, category_id, name, slug, description, price, media_url, poster_url, video_url,
  video_public_id, video_poster_url, video_duration, video_status, featured, calories, dietary_tags, allergens, wine_pairing, is_available
) VALUES (
  'd1000000-0000-0000-0000-000000000113',
  'c1000000-0000-0000-0000-000000000007',
  'Truffle French Fries',
  'truffle-french-fries',
  'Crispy double-cooked russet potato fries tossed in aromatic white truffle oil, sea salt, and aged parmesan.',
  189.00,
  'https://images.unsplash.com/photo-1576107232684-1279f3908594?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1576107232684-1279f3908594?q=80&w=600&auto=format&fit=crop',
  'https://assets.mixkit.co/videos/9278/9278-720.mp4',
  'craftsland/dishes/truffle_fries',
  'https://images.unsplash.com/photo-1576107232684-1279f3908594?q=80&w=600&auto=format&fit=crop',
  15.0, 'READY', false, 390, ARRAY['VEGETARIAN', 'GLUTEN_FREE'], ARRAY['Dairy'], 'Craft Lager', true
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name, slug = EXCLUDED.slug, category_id = EXCLUDED.category_id,
  description = EXCLUDED.description, price = EXCLUDED.price, media_url = EXCLUDED.media_url,
  poster_url = EXCLUDED.poster_url, video_url = EXCLUDED.video_url, video_public_id = EXCLUDED.video_public_id,
  video_poster_url = EXCLUDED.video_poster_url, video_duration = EXCLUDED.video_duration,
  video_status = EXCLUDED.video_status, featured = false, calories = EXCLUDED.calories,
  dietary_tags = EXCLUDED.dietary_tags, allergens = EXCLUDED.allergens, wine_pairing = EXCLUDED.wine_pairing,
  is_available = true;

-- 9. Crispy Chicken Wings (₹279) [Repurposed from d1000000-0000-0000-0000-000000000102 Grilled Herb Chicken]
INSERT INTO public.dishes (
  id, category_id, name, slug, description, price, media_url, poster_url, video_url,
  video_public_id, video_poster_url, video_duration, video_status, featured, calories, dietary_tags, allergens, wine_pairing, is_available
) VALUES (
  'd1000000-0000-0000-0000-000000000102',
  'c1000000-0000-0000-0000-000000000007',
  'Crispy Chicken Wings',
  'crispy-chicken-wings',
  'Flash-crisped chicken wings glazed with tangy artisanal hot pepper sauce, toasted sesame, and cool garlic herb dip.',
  279.00,
  'https://images.unsplash.com/photo-1527477378408-1bc0e6085a6b?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1527477378408-1bc0e6085a6b?q=80&w=600&auto=format&fit=crop',
  'https://assets.mixkit.co/videos/45581/45581-720.mp4',
  'craftsland/dishes/chicken_wings',
  'https://images.unsplash.com/photo-1527477378408-1bc0e6085a6b?q=80&w=600&auto=format&fit=crop',
  16.0, 'READY', false, 480, ARRAY['SIGNATURE'], ARRAY['Gluten'], 'Pale Ale', true
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name, slug = EXCLUDED.slug, category_id = EXCLUDED.category_id,
  description = EXCLUDED.description, price = EXCLUDED.price, media_url = EXCLUDED.media_url,
  poster_url = EXCLUDED.poster_url, video_url = EXCLUDED.video_url, video_public_id = EXCLUDED.video_public_id,
  video_poster_url = EXCLUDED.video_poster_url, video_duration = EXCLUDED.video_duration,
  video_status = EXCLUDED.video_status, featured = false, calories = EXCLUDED.calories,
  dietary_tags = EXCLUDED.dietary_tags, allergens = EXCLUDED.allergens, wine_pairing = EXCLUDED.wine_pairing,
  is_available = true;

-- ─────────────────────────────────────────────────────────────
-- PASTA (3 Dishes)
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
  name = EXCLUDED.name, slug = EXCLUDED.slug, category_id = EXCLUDED.category_id,
  description = EXCLUDED.description, price = EXCLUDED.price, media_url = EXCLUDED.media_url,
  poster_url = EXCLUDED.poster_url, video_url = EXCLUDED.video_url, video_public_id = EXCLUDED.video_public_id,
  video_poster_url = EXCLUDED.video_poster_url, video_duration = EXCLUDED.video_duration,
  video_status = EXCLUDED.video_status, featured = false, calories = EXCLUDED.calories,
  dietary_tags = EXCLUDED.dietary_tags, allergens = EXCLUDED.allergens, wine_pairing = EXCLUDED.wine_pairing,
  is_available = true;

-- 11. Spaghetti Bolognese (₹349) [Repurposed from d1000000-0000-0000-0000-000000000101 Truffle Mushroom Risotto]
INSERT INTO public.dishes (
  id, category_id, name, slug, description, price, media_url, poster_url, video_url,
  video_public_id, video_poster_url, video_duration, video_status, featured, calories, dietary_tags, allergens, wine_pairing, is_available
) VALUES (
  'd1000000-0000-0000-0000-000000000101',
  'c1000000-0000-0000-0000-000000000003',
  'Spaghetti Bolognese',
  'spaghetti-bolognese',
  'Al dente spaghetti smothered in slow-simmered rich meat ragù with San Marzano tomatoes, fresh herbs, and parmigiano reggiano.',
  349.00,
  'https://images.unsplash.com/photo-1621996346565-e3d5d6281691?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1621996346565-e3d5d6281691?q=80&w=600&auto=format&fit=crop',
  'https://assets.mixkit.co/videos/47410/47410-720.mp4',
  'craftsland/dishes/spaghetti_bolognese',
  'https://images.unsplash.com/photo-1621996346565-e3d5d6281691?q=80&w=600&auto=format&fit=crop',
  16.0, 'READY', false, 580, ARRAY['SIGNATURE'], ARRAY['Gluten', 'Dairy'], 'Chianti Classico', true
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name, slug = EXCLUDED.slug, category_id = EXCLUDED.category_id,
  description = EXCLUDED.description, price = EXCLUDED.price, media_url = EXCLUDED.media_url,
  poster_url = EXCLUDED.poster_url, video_url = EXCLUDED.video_url, video_public_id = EXCLUDED.video_public_id,
  video_poster_url = EXCLUDED.video_poster_url, video_duration = EXCLUDED.video_duration,
  video_status = EXCLUDED.video_status, featured = false, calories = EXCLUDED.calories,
  dietary_tags = EXCLUDED.dietary_tags, allergens = EXCLUDED.allergens, wine_pairing = EXCLUDED.wine_pairing,
  is_available = true;

-- 12. Penne Arrabbiata (₹280)
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
  name = EXCLUDED.name, slug = EXCLUDED.slug, category_id = EXCLUDED.category_id,
  description = EXCLUDED.description, price = EXCLUDED.price, media_url = EXCLUDED.media_url,
  poster_url = EXCLUDED.poster_url, video_url = EXCLUDED.video_url, video_public_id = EXCLUDED.video_public_id,
  video_poster_url = EXCLUDED.video_poster_url, video_duration = EXCLUDED.video_duration,
  video_status = EXCLUDED.video_status, featured = false, calories = EXCLUDED.calories,
  dietary_tags = EXCLUDED.dietary_tags, allergens = EXCLUDED.allergens, wine_pairing = EXCLUDED.wine_pairing,
  is_available = true;

-- ─────────────────────────────────────────────────────────────
-- PIZZA (3 Dishes)
-- ─────────────────────────────────────────────────────────────

-- 13. Wood-fired Margherita (₹290)
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
  name = EXCLUDED.name, slug = EXCLUDED.slug, category_id = EXCLUDED.category_id,
  description = EXCLUDED.description, price = EXCLUDED.price, media_url = EXCLUDED.media_url,
  poster_url = EXCLUDED.poster_url, video_url = EXCLUDED.video_url, video_public_id = EXCLUDED.video_public_id,
  video_poster_url = EXCLUDED.video_poster_url, video_duration = EXCLUDED.video_duration,
  video_status = EXCLUDED.video_status, featured = false, calories = EXCLUDED.calories,
  dietary_tags = EXCLUDED.dietary_tags, allergens = EXCLUDED.allergens, wine_pairing = EXCLUDED.wine_pairing,
  is_available = true;

-- 14. Farmhouse Fresh Pizza (₹340) [Repurposed from d1000000-0000-0000-0000-000000000111 Truffle & Wild Mushroom Pizza]
INSERT INTO public.dishes (
  id, category_id, name, slug, description, price, media_url, poster_url, video_url,
  video_public_id, video_poster_url, video_duration, video_status, featured, calories, dietary_tags, allergens, wine_pairing, is_available
) VALUES (
  'd1000000-0000-0000-0000-000000000111',
  'c1000000-0000-0000-0000-000000000004',
  'Farmhouse Fresh Pizza',
  'farmhouse-fresh-pizza',
  'Stone-baked sourdough topped with crisp bell peppers, sweet red onions, tender sweet corn, sautéed mushrooms, and melted mozzarella.',
  340.00,
  'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=600&auto=format&fit=crop',
  'https://assets.mixkit.co/videos/49231/49231-720.mp4',
  'craftsland/dishes/farmhouse_pizza',
  'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=600&auto=format&fit=crop',
  15.0, 'READY', false, 720, ARRAY['VEGETARIAN'], ARRAY['Dairy', 'Gluten'], 'Barbera d''Asti', true
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name, slug = EXCLUDED.slug, category_id = EXCLUDED.category_id,
  description = EXCLUDED.description, price = EXCLUDED.price, media_url = EXCLUDED.media_url,
  poster_url = EXCLUDED.poster_url, video_url = EXCLUDED.video_url, video_public_id = EXCLUDED.video_public_id,
  video_poster_url = EXCLUDED.video_poster_url, video_duration = EXCLUDED.video_duration,
  video_status = EXCLUDED.video_status, featured = false, calories = EXCLUDED.calories,
  dietary_tags = EXCLUDED.dietary_tags, allergens = EXCLUDED.allergens, wine_pairing = EXCLUDED.wine_pairing,
  is_available = true;

-- 15. Chicken Tikka Pizza (₹360) [Repurposed from d1000000-0000-0000-0000-000000000107 Smoked Botanical Mocktail]
INSERT INTO public.dishes (
  id, category_id, name, slug, description, price, media_url, poster_url, video_url,
  video_public_id, video_poster_url, video_duration, video_status, featured, calories, dietary_tags, allergens, wine_pairing, is_available
) VALUES (
  'd1000000-0000-0000-0000-000000000107',
  'c1000000-0000-0000-0000-000000000004',
  'Chicken Tikka Pizza',
  'chicken-tikka-pizza',
  'Sourdough crust topped with smoky roasted tandoori chicken tikka, spiced tomato makhani base, red onions, and bubbly mozzarella.',
  360.00,
  'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=600&auto=format&fit=crop',
  'https://assets.mixkit.co/videos/22034/22034-720.mp4',
  'craftsland/dishes/chicken_tikka_pizza',
  'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=600&auto=format&fit=crop',
  15.0, 'READY', false, 740, ARRAY['SIGNATURE'], ARRAY['Dairy', 'Gluten'], 'Syrah', true
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name, slug = EXCLUDED.slug, category_id = EXCLUDED.category_id,
  description = EXCLUDED.description, price = EXCLUDED.price, media_url = EXCLUDED.media_url,
  poster_url = EXCLUDED.poster_url, video_url = EXCLUDED.video_url, video_public_id = EXCLUDED.video_public_id,
  video_poster_url = EXCLUDED.video_poster_url, video_duration = EXCLUDED.video_duration,
  video_status = EXCLUDED.video_status, featured = false, calories = EXCLUDED.calories,
  dietary_tags = EXCLUDED.dietary_tags, allergens = EXCLUDED.allergens, wine_pairing = EXCLUDED.wine_pairing,
  is_available = true;

-- ─────────────────────────────────────────────────────────────
-- DESSERTS (3 Dishes)
-- ─────────────────────────────────────────────────────────────

-- 16. Gulab Jamun (₹149)
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
  name = EXCLUDED.name, slug = EXCLUDED.slug, category_id = EXCLUDED.category_id,
  description = EXCLUDED.description, price = EXCLUDED.price, media_url = EXCLUDED.media_url,
  poster_url = EXCLUDED.poster_url, video_url = EXCLUDED.video_url, video_public_id = EXCLUDED.video_public_id,
  video_poster_url = EXCLUDED.video_poster_url, video_duration = EXCLUDED.video_duration,
  video_status = EXCLUDED.video_status, featured = true, calories = EXCLUDED.calories,
  dietary_tags = EXCLUDED.dietary_tags, allergens = EXCLUDED.allergens, wine_pairing = EXCLUDED.wine_pairing,
  is_available = true;

-- 17. Chocolate Lava Brownie (₹240) [Repurposed from d1000000-0000-0000-0000-000000000105 Chocolate Lava Cake]
INSERT INTO public.dishes (
  id, category_id, name, slug, description, price, media_url, poster_url, video_url,
  video_public_id, video_poster_url, video_duration, video_status, featured, calories, dietary_tags, allergens, wine_pairing, is_available
) VALUES (
  'd1000000-0000-0000-0000-000000000105',
  'c1000000-0000-0000-0000-000000000005',
  'Chocolate Lava Brownie',
  'chocolate-lava-brownie',
  'Fudgy warm dark chocolate brownie made with Valrhona cocoa, molten chocolate ganache core, and Madagascar vanilla bean gelato.',
  240.00,
  'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?q=80&w=600&auto=format&fit=crop',
  'https://assets.mixkit.co/videos/29050/29050-720.mp4',
  'craftsland/dishes/lava_brownie',
  'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?q=80&w=600&auto=format&fit=crop',
  16.0, 'READY', false, 490, ARRAY['VEGETARIAN'], ARRAY['Dairy', 'Eggs', 'Gluten'], 'Tawny Port', true
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name, slug = EXCLUDED.slug, category_id = EXCLUDED.category_id,
  description = EXCLUDED.description, price = EXCLUDED.price, media_url = EXCLUDED.media_url,
  poster_url = EXCLUDED.poster_url, video_url = EXCLUDED.video_url, video_public_id = EXCLUDED.video_public_id,
  video_poster_url = EXCLUDED.video_poster_url, video_duration = EXCLUDED.video_duration,
  video_status = EXCLUDED.video_status, featured = false, calories = EXCLUDED.calories,
  dietary_tags = EXCLUDED.dietary_tags, allergens = EXCLUDED.allergens, wine_pairing = EXCLUDED.wine_pairing,
  is_available = true;

-- 18. New York Cheesecake (₹220) [Repurposed from d1000000-0000-0000-0000-000000000112 Rasmalai Tres Leches]
INSERT INTO public.dishes (
  id, category_id, name, slug, description, price, media_url, poster_url, video_url,
  video_public_id, video_poster_url, video_duration, video_status, featured, calories, dietary_tags, allergens, wine_pairing, is_available
) VALUES (
  'd1000000-0000-0000-0000-000000000112',
  'c1000000-0000-0000-0000-000000000005',
  'New York Cheesecake',
  'new-york-cheesecake',
  'Velvety slow-baked Philadelphia cream cheese on a buttery graham cracker crust, topped with macerated wild berries.',
  220.00,
  'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?q=80&w=600&auto=format&fit=crop',
  'https://assets.mixkit.co/videos/32457/32457-720.mp4',
  'craftsland/dishes/cheesecake',
  'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?q=80&w=600&auto=format&fit=crop',
  15.0, 'READY', false, 420, ARRAY['VEGETARIAN'], ARRAY['Dairy', 'Eggs', 'Gluten'], 'Sweet Riesling', true
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name, slug = EXCLUDED.slug, category_id = EXCLUDED.category_id,
  description = EXCLUDED.description, price = EXCLUDED.price, media_url = EXCLUDED.media_url,
  poster_url = EXCLUDED.poster_url, video_url = EXCLUDED.video_url, video_public_id = EXCLUDED.video_public_id,
  video_poster_url = EXCLUDED.video_poster_url, video_duration = EXCLUDED.video_duration,
  video_status = EXCLUDED.video_status, featured = false, calories = EXCLUDED.calories,
  dietary_tags = EXCLUDED.dietary_tags, allergens = EXCLUDED.allergens, wine_pairing = EXCLUDED.wine_pairing,
  is_available = true;

-- ─────────────────────────────────────────────────────────────
-- BEVERAGES (2 Dishes)
-- ─────────────────────────────────────────────────────────────

-- 19. Mango Lassi (₹129)
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
  name = EXCLUDED.name, slug = EXCLUDED.slug, category_id = EXCLUDED.category_id,
  description = EXCLUDED.description, price = EXCLUDED.price, media_url = EXCLUDED.media_url,
  poster_url = EXCLUDED.poster_url, video_url = EXCLUDED.video_url, video_public_id = EXCLUDED.video_public_id,
  video_poster_url = EXCLUDED.video_poster_url, video_duration = EXCLUDED.video_duration,
  video_status = EXCLUDED.video_status, featured = true, calories = EXCLUDED.calories,
  dietary_tags = EXCLUDED.dietary_tags, allergens = EXCLUDED.allergens, wine_pairing = EXCLUDED.wine_pairing,
  is_available = true;

-- 20. Artisanal Iced Coffee (₹159) [Repurposed from d1000000-0000-0000-0000-000000000114 Masala Chai Affogato]
INSERT INTO public.dishes (
  id, category_id, name, slug, description, price, media_url, poster_url, video_url,
  video_public_id, video_poster_url, video_duration, video_status, featured, calories, dietary_tags, allergens, wine_pairing, is_available
) VALUES (
  'd1000000-0000-0000-0000-000000000114',
  'c1000000-0000-0000-0000-000000000006',
  'Artisanal Iced Coffee',
  'artisanal-iced-coffee',
  'Slow-dripped single-origin Arabica cold brew poured over crystalline ice spheres with a splash of sweet condensed milk.',
  159.00,
  'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?q=80&w=600&auto=format&fit=crop',
  'https://assets.mixkit.co/videos/9267/9267-720.mp4',
  'craftsland/dishes/iced_coffee',
  'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?q=80&w=600&auto=format&fit=crop',
  16.0, 'READY', false, 160, ARRAY['VEGETARIAN', 'GLUTEN_FREE'], ARRAY['Dairy'], 'Digestif', true
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name, slug = EXCLUDED.slug, category_id = EXCLUDED.category_id,
  description = EXCLUDED.description, price = EXCLUDED.price, media_url = EXCLUDED.media_url,
  poster_url = EXCLUDED.poster_url, video_url = EXCLUDED.video_url, video_public_id = EXCLUDED.video_public_id,
  video_poster_url = EXCLUDED.video_poster_url, video_duration = EXCLUDED.video_duration,
  video_status = EXCLUDED.video_status, featured = false, calories = EXCLUDED.calories,
  dietary_tags = EXCLUDED.dietary_tags, allergens = EXCLUDED.allergens, wine_pairing = EXCLUDED.wine_pairing,
  is_available = true;

-- 4. Mark any other dishes not in the 20 as unavailable
UPDATE public.dishes
SET is_available = false
WHERE id NOT IN (
  'd1000000-0000-0000-0000-000000000201',
  'd1000000-0000-0000-0000-000000000202',
  'd1000000-0000-0000-0000-000000000108',
  'd1000000-0000-0000-0000-000000000203',
  'd1000000-0000-0000-0000-000000000204',
  'd1000000-0000-0000-0000-000000000109',
  'd1000000-0000-0000-0000-000000000106',
  'd1000000-0000-0000-0000-000000000113',
  'd1000000-0000-0000-0000-000000000102',
  'd1000000-0000-0000-0000-000000000103',
  'd1000000-0000-0000-0000-000000000101',
  'd1000000-0000-0000-0000-000000000110',
  'd1000000-0000-0000-0000-000000000104',
  'd1000000-0000-0000-0000-000000000111',
  'd1000000-0000-0000-0000-000000000107',
  'd1000000-0000-0000-0000-000000000205',
  'd1000000-0000-0000-0000-000000000105',
  'd1000000-0000-0000-0000-000000000112',
  'd1000000-0000-0000-0000-000000000206',
  'd1000000-0000-0000-0000-000000000114'
);
