-- ====================================================================
-- L'ÉTOILE NOIR — DEMO & PRODUCTION INITIAL SEED DATA
-- ====================================================================

-- 1. CATEGORIES SEED DATA
INSERT INTO public.categories (id, name, slug, display_order, is_active) VALUES
('c1000000-0000-0000-0000-000000000001', 'Caviar & Starters', 'starters', 1, true),
('c1000000-0000-0000-0000-000000000002', "Chef's Tasting Menu", 'chefs-tasting', 2, true),
('c1000000-0000-0000-0000-000000000003', 'Signature Mains', 'mains', 3, true),
('c1000000-0000-0000-0000-000000000004', 'Artisanal Desserts', 'desserts', 4, true),
('c1000000-0000-0000-0000-000000000005', 'Sommelier Cellar & Cocktails', 'wines', 5, true),
('c1000000-0000-0000-0000-000000000006', 'Private Reserve Spirits', 'spirits', 6, true)
ON CONFLICT (slug) DO NOTHING;

-- 2. DISHES SEED DATA
INSERT INTO public.dishes (id, category_id, name, slug, description, price, media_url, poster_url, calories, dietary_tags, allergens, wine_pairing, is_available) VALUES
-- Starters
('d1000000-0000-0000-0000-000000000101', 'c1000000-0000-0000-0000-000000000001', 'Imperial Beluga Caviar Tartlet', 'beluga-caviar-tartlet', 'Oscietra caviar, smoked crème fraîche, golden buckwheat tartlet with 24k gold leaf accent.', 95.00, 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?q=80&w=1200&auto=format&fit=crop', 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?q=80&w=600&auto=format&fit=crop', 240, ARRAY['CHEFS_CHOICE'], ARRAY['Dairy', 'Fish', 'Gluten'], 'Dom Pérignon Vintage 2013', true),
('d1000000-0000-0000-0000-000000000102', 'c1000000-0000-0000-0000-000000000001', 'Hokkaido Scallop Carpaccio', 'hokkaido-scallop-carpaccio', 'Thinly sliced Hokkaido sea scallops, finger lime caviar, white truffle oil, and yuzu foam.', 42.00, 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?q=80&w=1200&auto=format&fit=crop', 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?q=80&w=600&auto=format&fit=crop', 190, ARRAY['GLUTEN_FREE', 'CHEFS_CHOICE'], ARRAY['Mollusks'], 'Chablis Grand Cru Les Clos 2020', true),
('d1000000-0000-0000-0000-000000000103', 'c1000000-0000-0000-0000-000000000001', 'Perigord Black Truffle Soup', 'perigord-truffle-soup', 'Velvety consommé infused with black winter truffles, topped with puff pastry crust.', 38.00, 'https://images.unsplash.com/photo-1547592180-85f173990554?q=80&w=1200&auto=format&fit=crop', 'https://images.unsplash.com/photo-1547592180-85f173990554?q=80&w=600&auto=format&fit=crop', 310, ARRAY['VEGETARIAN'], ARRAY['Dairy', 'Gluten'], 'Meursault Premier Cru 2019', true),

-- Mains
('d1000000-0000-0000-0000-000000000104', 'c1000000-0000-0000-0000-000000000003', 'A5 Miyazaki Wagyu Tenderloin', 'a5-wagyu-tenderloin', 'Miyazaki A5 beef tenderloin, charred onion puree, bone marrow jus, smoked sea salt.', 165.00, 'https://images.unsplash.com/photo-1558030006-450675393462?q=80&w=1200&auto=format&fit=crop', 'https://images.unsplash.com/photo-1558030006-450675393462?q=80&w=600&auto=format&fit=crop', 620, ARRAY['CHEFS_CHOICE', 'GLUTEN_FREE'], ARRAY['Beef'], 'Château Margaux 2015', true),
('d1000000-0000-0000-0000-000000000105', 'c1000000-0000-0000-0000-000000000003', 'Wild Roasted Chilean Sea Bass', 'chilean-sea-bass', 'Pan-roasted Chilean sea bass, saffron fumet, baby leeks, buttered asparagus tips.', 78.00, 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?q=80&w=1200&auto=format&fit=crop', 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?q=80&w=600&auto=format&fit=crop', 480, ARRAY['GLUTEN_FREE'], ARRAY['Fish', 'Dairy'], 'Puligny-Montrachet 2021', true),
('d1000000-0000-0000-0000-000000000106', 'c1000000-0000-0000-0000-000000000003', 'Duck Breast à l’Orange Sanguine', 'duck-breast-orange', 'Crispy skin Magret duck breast, blood orange reduction, parsnip mousse, micro herbs.', 64.00, 'https://images.unsplash.com/photo-1514944288352-fffac99f0bdf?q=80&w=1200&auto=format&fit=crop', 'https://images.unsplash.com/photo-1514944288352-fffac99f0bdf?q=80&w=600&auto=format&fit=crop', 520, ARRAY['CHEFS_CHOICE'], ARRAY['Poultry'], 'Pinot Noir Domaine de la Romanée-Conti', true),
('d1000000-0000-0000-0000-000000000107', 'c1000000-0000-0000-0000-000000000003', 'Morel Mushroom & Truffle Risotto', 'truffle-risotto', 'Acquerello carnaroli rice, wild French morels, shaved Alba white truffle, aged Parmigiano.', 56.00, 'https://images.unsplash.com/photo-1633964913295-ceb43826e7c9?q=80&w=1200&auto=format&fit=crop', 'https://images.unsplash.com/photo-1633964913295-ceb43826e7c9?q=80&w=600&auto=format&fit=crop', 440, ARRAY['VEGETARIAN', 'GLUTEN_FREE'], ARRAY['Dairy'], 'Barolo Monfortino Riserva 2015', true),

-- Desserts
('d1000000-0000-0000-0000-000000000108', 'c1000000-0000-0000-0000-000000000004', 'L’Étoile Noir Smoked Chocolate Sphere', 'smoked-chocolate-sphere', 'Valrhona 70% dark chocolate sphere, warm salted caramel drizzle, Madagascar vanilla bean gelato.', 28.00, 'https://images.unsplash.com/photo-1579372786545-d24232daf58c?q=80&w=1200&auto=format&fit=crop', 'https://images.unsplash.com/photo-1579372786545-d24232daf58c?q=80&w=600&auto=format&fit=crop', 380, ARRAY['CHEFS_CHOICE', 'VEGETARIAN'], ARRAY['Dairy', 'Eggs'], 'Château d’Yquem Sauternes 2010', true),
('d1000000-0000-0000-0000-000000000109', 'c1000000-0000-0000-0000-000000000004', 'Deconstructed Tahitian Vanilla Soufflé', 'tahitian-vanilla-souffle', 'Warm vanilla bean soufflé, passion fruit sorbet, caramelized hazelnut crunch.', 24.00, 'https://images.unsplash.com/photo-1587314168485-3236d6710814?q=80&w=1200&auto=format&fit=crop', 'https://images.unsplash.com/photo-1587314168485-3236d6710814?q=80&w=600&auto=format&fit=crop', 310, ARRAY['VEGETARIAN'], ARRAY['Dairy', 'Eggs', 'Tree Nuts'], 'Tokaji Aszú 6 Puttonyos 2017', true)
ON CONFLICT (slug) DO NOTHING;

-- 3. RESTAURANT SETTINGS SEED
INSERT INTO public.restaurant_settings (key, value) VALUES
('brand_info', '{"name": "L''Étoile Noir", "currency": "USD", "tax_rate": 0.085, "delivery_fee": 15.00}'::jsonb),
('store_status', '{"is_open": true, "auto_accept_orders": true}'::jsonb)
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;
