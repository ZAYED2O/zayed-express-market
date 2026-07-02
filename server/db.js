const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');

const supabaseUrl = process.env.SUPABASE_URL || 'https://psfhiaipjxzakpnwgume.supabase.co';
const supabaseKey = process.env.SUPABASE_SECRET_KEY;

if (!supabaseKey) {
  console.error('❌ SUPABASE_SECRET_KEY is required. Set it in Vercel environment variables.');
}

const supabase = createClient(supabaseUrl, supabaseKey || 'missing_key', {
  auth: { autoRefreshToken: false, persistSession: false }
});

async function initDatabase() {
  try {
    // Seed admin user if not exists
    const { data: adminExists, error: adminError } = await supabase
      .from('ec_users')
      .select('id')
      .eq('id', 'admin')
      .single();

    if (adminError && adminError.code !== 'PGRST116') {
      console.error('❌ Error checking users table (admin):', adminError.message);
    } else if (!adminExists) {
      const hashedPwd = await bcrypt.hash('admin', 10);
      const { error: seedError } = await supabase.from('ec_users').upsert([{
        id: 'admin',
        name: 'مدير النظام',
        email: 'admin@zayed.com',
        password: hashedPwd,
        role: 'admin'
      }], { onConflict: 'id' });
      if (seedError) {
        console.error('❌ Error seeding admin user:', seedError.message);
      } else {
        console.log('✅ Admin user seeded');
      }
    }

    // Seed vendors if not exist
    const { data: vendors, error: vendorsError } = await supabase.from('ec_vendors').select('id').limit(1);
    if (vendorsError) {
      console.error('❌ Error checking vendors table:', vendorsError.message);
    } else if (!vendors || vendors.length === 0) {
      const { error: seedError } = await supabase.from('ec_vendors').upsert([
        { id: 'v1', name: 'محلات الهدى للإلكترونيات', contact: '0501234567', active: true },
        { id: 'v2', name: 'بوتيك الأناقة', contact: '0509876543', active: true }
      ], { onConflict: 'id' });
      if (seedError) {
        console.error('❌ Error seeding vendors:', seedError.message);
      } else {
        console.log('✅ Vendors seeded');
      }
    }

    // Seed products if not exist
    const { data: products, error: productsError } = await supabase.from('ec_products').select('id').limit(1);
    if (productsError) {
      console.error('❌ Error checking products table:', productsError.message);
    } else if (!products || products.length === 0) {
      const { error: seedError } = await supabase.from('ec_products').upsert([
        { id: 'p1', name: 'سماعات رأس لاسلكية Sony WH-1000XM4', description: 'سماعات رأس بخاصية إلغاء الضوضاء الرائدة في الصناعة.', price: 1200, oldPrice: 1500, category: 'electronics', image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&w=500&q=80', rating: 4.8, reviews: 124, badge: 'خصم 20%' },
        { id: 'p2', name: 'ساعة ذكية Apple Watch Series 8', description: 'ساعة أبل الذكية الأحدث مع مستشعر قياس الأكسجين.', price: 1800, oldPrice: null, category: 'electronics', image: 'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?auto=format&fit=crop&w=500&q=80', rating: 4.9, reviews: 312, badge: 'جديد' },
        { id: 'p3', name: 'حقيبة ظهر جلدية فاخرة', description: 'حقيبة ظهر مصنوعة من الجلد الطبيعي عالية الجودة.', price: 350, oldPrice: 450, category: 'fashion', image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=500&q=80', rating: 4.5, reviews: 89, badge: '' },
        { id: 'p4', name: 'حذاء رياضي Nike Air Max', description: 'حذاء رياضي مريح بتصميم عصري وألوان جذابة.', price: 550, oldPrice: 650, category: 'fashion', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=500&q=80', rating: 4.7, reviews: 210, badge: 'الأكثر مبيعاً' },
        { id: 'p5', name: 'ماكينة قهوة إسبريسو', description: 'قم بإعداد قهوة الإسبريسو المفضلة لديك في المنزل بسهولة.', price: 850, oldPrice: 1000, category: 'home', image: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?auto=format&fit=crop&w=500&q=80', rating: 4.6, reviews: 156, badge: 'عرض خاص' },
        { id: 'p6', name: 'عطر رجالي فاخر Bleu de Chanel', description: 'عطر رجالي مميز يدوم طويلاً برائحة الأخشاب.', price: 650, oldPrice: null, category: 'beauty', image: 'https://images.unsplash.com/photo-1523293182086-7651a899a37f?auto=format&fit=crop&w=500&q=80', rating: 4.9, reviews: 420, badge: '' },
        { id: 'p7', name: 'لابتوب MacBook Air M2', description: 'أحدث إصدار من أجهزة ماك بوك اير بشريحة M2.', price: 4500, oldPrice: 4800, category: 'electronics', image: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=500&q=80', rating: 5.0, reviews: 890, badge: 'مميز' },
        { id: 'p8', name: 'مجموعة العناية بالبشرة النسائية', description: 'مجموعة متكاملة للعناية بالبشرة لترطيب ونضارة فائقة.', price: 250, oldPrice: 320, category: 'beauty', image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&w=500&q=80', rating: 4.4, reviews: 67, badge: 'خصم حصري' }
      ], { onConflict: 'id' });
      if (seedError) {
        console.error('❌ Error seeding products:', seedError.message);
      } else {
        console.log('✅ Products seeded');
      }
    }

    // Seed reviews if not exist
    const { data: reviews, error: reviewsError } = await supabase.from('ec_reviews').select('id').limit(1);
    if (reviewsError) {
      console.error('❌ Error checking reviews table:', reviewsError.message);
    } else if (!reviews || reviews.length === 0) {
      const { error: seedError } = await supabase.from('ec_reviews').upsert([
        { id: 'r1', productId: 'p1', userName: 'أحمد الحربي', rating: 5, comment: 'سماعة رائعة جداً وعزل الضوضاء فيها ممتاز، أنصح بها بشدة!', date: new Date().toISOString() },
        { id: 'r2', productId: 'p1', userName: 'سارة المهيري', rating: 4, comment: 'جودة الصوت ممتازة والبطارية تدوم طويلاً، لكنها قد تكون ضاغطة قليلاً على الأذن بعد الاستخدام الطويل.', date: new Date().toISOString() },
        { id: 'r3', productId: 'p2', userName: 'محمد الفلاسي', rating: 5, comment: 'ساعة أبل الغنية عن التعريف، ميزات تتبع اللياقة البدنية والقلب دقيقة جداً.', date: new Date().toISOString() }
      ], { onConflict: 'id' });
      if (seedError) {
        console.error('❌ Error seeding reviews:', seedError.message);
      } else {
        console.log('✅ Reviews seeded');
      }
    }

    console.log('✅ Database initialization check completed');
  } catch (err) {
    console.error('❌ Database init error:', err.message);
  }
}

module.exports = { supabase, initDatabase };
