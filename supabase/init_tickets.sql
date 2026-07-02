-- إنشاء جدول تذاكر الدعم الفني
-- ملاحظة: تم تغيير نوع user_id إلى TEXT ليتطابق مع نوع معرف المستخدم id في جدول users
CREATE TABLE IF NOT EXISTS ec_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT REFERENCES users(id),
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'open',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
