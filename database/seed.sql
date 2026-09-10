-- ====================================================================
-- CRAFTSLAND — DEMO & PRODUCTION INITIAL SEED DATA
-- ====================================================================

-- 1. CATEGORIES SEED DATA
INSERT INTO public.categories (id, name, slug, display_order, is_active, image_url, description) VALUES
('c1000000-0000-0000-0000-000000000001', 'Appetizers', 'starters', 1, true, 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?q=80&w=800&auto=format&fit=crop', 'Crisp artisanal bites and palate openers made with seasonal garden herbs.'),
('c1000000-0000-0000-0000-000000000002', 'Main Courses', 'mains', 2, true, 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=800&auto=format&fit=crop', 'Slow-roasted meats, seared poultry, and ocean-fresh seafood creations.'),
('c1000000-0000-0000-0000-000000000003', 'Pasta', 'pasta', 3, true, 'https://images.unsplash.com/photo-1621996346565-e3d5d6281691?q=80&w=800&auto=format&fit=crop', 'Handcrafted pasta ribbons tossed in aged cheeses and velvety reductions.'),
('c1000000-0000-0000-0000-000000000004', 'Pizza', 'pizza', 4, true, 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?q=80&w=800&auto=format&fit=crop', 'Fermented dough stone-baked at 800°F with San Marzano tomatoes and fior di latte.'),
('c1000000-0000-0000-0000-000000000005', 'Desserts', 'desserts', 5, true, 'https://images.unsplash.com/photo-1579372786545-d24232daf58c?q=80&w=800&auto=format&fit=crop', 'Molten chocolate indulgence, silky gelato, and crisp caramelized confections.'),
('c1000000-0000-0000-0000-000000000006', 'Beverages', 'beverages', 6, true, 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=800&auto=format&fit=crop', 'Botanical infusions, smoked cold brews, and signature crafted mocktails.')
ON CONFLICT (slug) DO UPDATE SET 
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  description = EXCLUDED.description;

-- 2. DISHES SEED DATA
INSERT INTO public.dishes (id, category_id, name, slug, description, price, media_url, poster_url, video_url, featured, calories, dietary_tags, allergens, wine_pairing, is_available) VALUES
('d1000000-0000-0000-0000-000000000101', 'c1000000-0000-0000-0000-000000000002', 'Truffle Mushroom Risotto', 'truffle-mushroom-risotto', 'Acquerello carnaroli rice, wild French morels, shaved black winter truffles, and 24-month Parmigiano-Reggiano emulsion.', 34.00, 'https://images.unsplash.com/photo-1633964913295-ceb43826e7c9?q=80&w=1200&auto=format&fit=crop', 'https://images.unsplash.com/photo-1633964913295-ceb43826e7c9?q=80&w=600&auto=format&fit=crop', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', true, 460, ARRAY['SIGNATURE', 'CHEFS_CHOICE', 'VEGETARIAN', 'GLUTEN_FREE'], ARRAY['Dairy'], 'Barolo Riserva 2018', true),
('d1000000-0000-0000-0000-000000000102', 'c1000000-0000-0000-0000-000000000002', 'Grilled Herb Chicken', 'grilled-herb-chicken', 'Organic free-range chicken breast flame-grilled over citrus wood with rosemary thyme reduction, roasted heirloom carrots, and potato mousseline.', 29.00, 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?q=80&w=1200&auto=format&fit=crop', 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?q=80&w=600&auto=format&fit=crop', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4', true, 520, ARRAY['SIGNATURE', 'GLUTEN_FREE'], ARRAY['Dairy'], 'Domaine Dujac Morey-Saint-Denis 2020', true),
('d1000000-0000-0000-0000-000000000103', 'c1000000-0000-0000-0000-000000000003', 'Creamy Alfredo Pasta', 'creamy-alfredo-pasta', 'House-extruded tagliatelle tossed in rich cultured Normandy butter, double cream, cracked tellicherry pepper, and shaved Pecorino Romano.', 26.00, 'https://images.unsplash.com/photo-1621996346565-e3d5d6281691?q=80&w=1200&auto=format&fit=crop', 'https://images.unsplash.com/photo-1621996346565-e3d5d6281691?q=80&w=600&auto=format&fit=crop', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4', true, 610, ARRAY['SIGNATURE', 'VEGETARIAN'], ARRAY['Dairy', 'Gluten'], 'Gavi di Gavi La Scolca 2021', true),
('d1000000-0000-0000-0000-000000000104', 'c1000000-0000-0000-0000-000000000004', 'Wood-fired Margherita', 'wood-fired-margherita', 'Naturally fermented sourdough crust, San Marzano D.O.P. tomato coulis, fresh fior di latte mozzarella, cold-pressed olive oil, and sweet basil leaves.', 22.00, 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?q=80&w=1200&auto=format&fit=crop', 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?q=80&w=600&auto=format&fit=crop', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4', true, 680, ARRAY['SIGNATURE', 'VEGETARIAN'], ARRAY['Dairy', 'Gluten'], 'Chianti Classico Gran Selezione 2019', true),
('d1000000-0000-0000-0000-000000000105', 'c1000000-0000-0000-0000-000000000005', 'Chocolate Lava Cake', 'chocolate-lava-cake', 'Warm molten cake made with single-origin Valrhona 72% dark chocolate, liquid ganache core, Madagascar Bourbon vanilla bean gelato, and gold dust.', 18.00, 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?q=80&w=1200&auto=format&fit=crop', 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?q=80&w=600&auto=format&fit=crop', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4', true, 490, ARRAY['SIGNATURE', 'VEGETARIAN', 'CHEFS_CHOICE'], ARRAY['Dairy', 'Eggs', 'Gluten'], 'Taylor Fladgate 20 Year Old Tawny Port', true)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  media_url = EXCLUDED.media_url,
  poster_url = EXCLUDED.poster_url,
  video_url = EXCLUDED.video_url,
  featured = EXCLUDED.featured;

-- 3. RESTAURANT SETTINGS SEED
INSERT INTO public.restaurant_settings (key, value) VALUES
('brand_info', '{"name": "CRAFTSLAND", "tagline": "Good Food Brighter Moods", "currency": "USD", "tax_rate": 0.085, "delivery_fee": 12.00}'::jsonb),
('store_status', '{"is_open": true, "auto_accept_orders": true}'::jsonb)
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;
