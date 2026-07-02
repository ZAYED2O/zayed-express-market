-- 1. جدول العناوين للمستخدمين
CREATE TABLE IF NOT EXISTS ec_addresses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT REFERENCES ec_users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  address_line TEXT NOT NULL,
  city TEXT NOT NULL,
  phone TEXT NOT NULL,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. جدول قنوات الدردشة والتذاكر
CREATE TABLE IF NOT EXISTS ec_chat_channels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL, -- 'customer_support', 'seller_admin', 'seller_support'
  creator_id TEXT NOT NULL, -- معرف العميل أو البائع المنشئ
  participant_id TEXT, -- معرف موظف الدعم أو الادمن المستلم
  subject TEXT, -- موضوع التذكرة أو المحادثة
  status TEXT DEFAULT 'open', -- 'open' أو 'closed'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. جدول الرسائل النصية والصوتية داخل القنوات
CREATE TABLE IF NOT EXISTS ec_chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  channel_id UUID REFERENCES ec_chat_channels(id) ON DELETE CASCADE,
  sender_id TEXT NOT NULL,
  sender_name TEXT NOT NULL,
  sender_role TEXT NOT NULL, -- 'user', 'seller', 'support', 'admin'
  message TEXT,
  audio_data TEXT, -- تشفير الرسالة الصوتية بصيغة Base64
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
