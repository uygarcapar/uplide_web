-- Uplide Admin Panel — Seed Data
-- Users must be created via Supabase Auth dashboard first:
--   admin@uplide.test  (will be promoted to full_access)
--   reader@uplide.test (stays as reader)
-- After both users are created, run this script in the SQL editor.

-- Promote admin to full_access
update public.profiles
set role = 'full_access'
where email = 'admin@uplide.test';

-- Sample products
insert into public.products (name, description, category, price, stock, status, image_url)
values
  ('{"tr":"Kahve Çekirdeği 1kg","en":"Coffee Beans 1kg"}',
   '{"tr":"Orta kavurma Arabica","en":"Medium roast Arabica"}',
   'food', 549.90, 120, 'active',
   'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400'),
  ('{"tr":"El Yapımı Seramik Kupa","en":"Handmade Ceramic Mug"}',
   '{"tr":"Mat siyah, 350ml","en":"Matte black, 350ml"}',
   'home', 189.00, 64, 'active',
   'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=400'),
  ('{"tr":"Kablosuz Mouse","en":"Wireless Mouse"}',
   '{"tr":"Bluetooth 5.2","en":"Bluetooth 5.2"}',
   'electronics', 749.00, 35, 'active',
   'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400'),
  ('{"tr":"Spor Çantası","en":"Sports Bag"}',
   '{"tr":"40L kapasiteli","en":"40L capacity"}',
   'sports', 459.50, 22, 'active',
   'https://images.unsplash.com/photo-1547949003-9792a18a2601?w=400'),
  ('{"tr":"Bambu Diş Fırçası","en":"Bamboo Toothbrush"}',
   '{"tr":"4''lü paket","en":"Pack of 4"}',
   'home', 89.90, 250, 'active',
   'https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=400'),
  ('{"tr":"Mekanik Klavye","en":"Mechanical Keyboard"}',
   '{"tr":"75% layout","en":"75% layout"}',
   'electronics', 2999.00, 8, 'active',
   'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400'),
  ('{"tr":"Yoga Matı","en":"Yoga Mat"}',
   '{"tr":"6mm, kaymaz","en":"6mm, non-slip"}',
   'sports', 329.00, 4, 'active',
   'https://images.unsplash.com/photo-1593810451137-bee6c6a86b8b?w=400'),
  ('{"tr":"Organik Bal 500g","en":"Organic Honey 500g"}',
   '{"tr":"Kekik balı","en":"Thyme honey"}',
   'food', 299.00, 0, 'archived',
   'https://images.unsplash.com/photo-1587049352846-4a222e784f53?w=400'),
  ('{"tr":"USB-C Şarj Kablosu","en":"USB-C Cable"}',
   '{"tr":"1.5m, hızlı şarj","en":"1.5m, fast charging"}',
   'electronics', 149.00, 180, 'active',
   'https://images.unsplash.com/photo-1583863788432-1d4b75a72c5c?w=400'),
  ('{"tr":"Çiçek Saksısı","en":"Flower Pot"}',
   '{"tr":"Terracotta 20cm","en":"Terracotta 20cm"}',
   'home', 79.50, 90, 'draft', null);

-- Sample customers
insert into public.customers (full_name, email, phone, city, status, total_orders)
values
  ('Ayşe Yılmaz', 'ayse@example.com', '+90 532 123 4567', 'İstanbul', 'active', 12),
  ('Mehmet Demir', 'mehmet@example.com', '+90 535 987 6543', 'Ankara', 'active', 8),
  ('Zeynep Kaya', 'zeynep@example.com', '+90 533 222 4455', 'İzmir', 'active', 3),
  ('Can Aydın', 'can@example.com', '+90 530 111 2233', 'Bursa', 'inactive', 1),
  ('Elif Şahin', 'elif@example.com', '+90 537 555 6677', 'Antalya', 'active', 22),
  ('Burak Öztürk', 'burak@example.com', '+90 538 333 7788', 'İstanbul', 'active', 5),
  ('Selin Arslan', 'selin@example.com', '+90 539 444 9900', 'Eskişehir', 'active', 0),
  ('Emre Çetin', 'emre@example.com', '+90 531 666 1122', 'Konya', 'inactive', 2);
