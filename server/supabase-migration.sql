-- إنشاء الجداول في Supabase PostgreSQL
-- قم بتشغيل هذا السكريبت في SQL Editor في Supabase

-- 1. جدول المستخدمين
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'user'
);

-- 2. جدول البائعين
CREATE TABLE IF NOT EXISTS vendors (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  contact TEXT,
  active BOOLEAN DEFAULT TRUE
);

-- 3. جدول المنتجات
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price REAL NOT NULL,
  "oldPrice" REAL,
  category TEXT NOT NULL,
  image TEXT,
  rating REAL DEFAULT 5.0,
  reviews INTEGER DEFAULT 0,
  badge TEXT
);

-- 4. جدول السلة (خاصة بكل مستخدم)
CREATE TABLE IF NOT EXISTS cart (
  "userId" TEXT NOT NULL,
  id TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  price REAL NOT NULL,
  "oldPrice" REAL,
  category TEXT NOT NULL,
  image TEXT,
  rating REAL,
  reviews INTEGER,
  badge TEXT,
  quantity INTEGER NOT NULL,
  PRIMARY KEY ("userId", id)
);

-- 5. جدول الطلبات
CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  "userId" TEXT,
  date TEXT NOT NULL,
  total REAL NOT NULL,
  status TEXT NOT NULL,
  items TEXT NOT NULL
);

-- تعبئة البيانات الأولية للمنتجات
INSERT INTO products (id, name, description, price, "oldPrice", category, image, rating, reviews, badge)
VALUES 
  ('p1', 'سماعات رأس لاسلكية Sony WH-1000XM4', 'سماعات رأس بخاصية إلغاء الضوضاء الرائدة في الصناعة، مع جودة صوت استثنائية وبطارية تدوم طويلاً.', 1200, 1500, 'electronics', 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&w=500&q=80', 4.8, 124, 'خصم 20%'),
  ('p2', 'ساعة ذكية Apple Watch Series 8', 'ساعة أبل الذكية الأحدث مع مستشعر قياس الأكسجين في الدم وتتبع اللياقة البدنية.', 1800, NULL, 'electronics', 'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?auto=format&fit=crop&w=500&q=80', 4.9, 312, 'جديد'),
  ('p3', 'حقيبة ظهر جلدية فاخرة', 'حقيبة ظهر مصنوعة من الجلد الطبيعي عالية الجودة، مناسبة للعمل والسفر.', 350, 450, 'fashion', 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=500&q=80', 4.5, 89, ''),
  ('p4', 'حذاء رياضي Nike Air Max', 'حذاء رياضي مريح بتصميم عصري وألوان جذابة.', 550, 650, 'fashion', 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=500&q=80', 4.7, 210, 'الأكثر مبيعاً'),
  ('p5', 'ماكينة قهوة إسبريسو', 'قم بإعداد قهوة الإسبريسو المفضلة لديك في المنزل بسهولة.', 850, 1000, 'home', 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?auto=format&fit=crop&w=500&q=80', 4.6, 156, 'عرض خاص'),
  ('p6', 'عطر رجالي فاخر Bleu de Chanel', 'عطر رجالي مميز يدوم طويلاً برائحة الأخشاب.', 650, NULL, 'beauty', 'https://images.unsplash.com/photo-1523293182086-7651a899a37f?auto=format&fit=crop&w=500&q=80', 4.9, 420, ''),
  ('p7', 'لابتوب MacBook Air M2', 'أحدث إصدار من أجهزة ماك بوك اير بشريحة M2 الجبارة.', 4500, 4800, 'electronics', 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=500&q=80', 5.0, 890, 'مميز'),
  ('p8', 'مجموعة العناية بالبشرة النسائية', 'مجموعة متكاملة للعناية بالبشرة لترطيب ونضارة فائقة.', 250, 320, 'beauty', 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&w=500&q=80', 4.4, 67, 'خصم حصري')
ON CONFLICT (id) DO NOTHING;

-- تعبئة البائعين الافتراضيين
INSERT INTO vendors (id, name, contact, active)
VALUES
  ('v1', 'محلات الهدى للإلكترونيات', '0501234567', TRUE),
  ('v2', 'بوتيك الأناقة', '0509876543', TRUE)
ON CONFLICT (id) DO NOTHING;

-- تعبئة المدير الافتراضي (كلمة المرور مشفرة bcrypt لـ 'admin')
INSERT INTO users (id, name, email, password, role)
VALUES ('admin', 'مدير النظام', 'admin@zayed.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin')
ON CONFLICT (id) DO NOTHING;
