require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { supabase, initDatabase } = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'zayed_express_super_secret_key_2026';

app.use(cors());
app.use(express.json());

// Initialize DB on startup (seed initial data)
initDatabase();

// --- SECURITY MIDDLEWARES ---

function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ success: false, message: 'غير مصرح: يرجى تسجيل الدخول أولاً' });
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ success: false, message: 'جلسة العمل منتهية الصلاحية' });
    req.user = decoded;
    next();
  });
}

function isAdmin(req, res, next) {
  if (req.user && req.user.role === 'admin') return next();
  res.status(403).json({ success: false, message: 'غير مصرح: يجب أن تكون مديراً للنظام' });
}

// --- USERS ---

app.get('/api/users', verifyToken, isAdmin, async (req, res) => {
  const { data, error } = await supabase.from('users').select('id, name, email, role');
  if (error) return res.status(500).json({ error: error.message });
  res.json({ users: data });
});

// --- AUTH ---

app.post('/api/auth/register', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password)
    return res.json({ success: false, message: 'يرجى ملء جميع الحقول المطلوبة' });

  const { data: existing } = await supabase.from('users').select('id').eq('email', email).maybeSingle();
  if (existing) return res.json({ success: false, message: 'البريد الإلكتروني مسجل مسبقاً' });

  const userId = 'u' + Date.now();
  const hashedPassword = await bcrypt.hash(password, 10);

  const { error } = await supabase.from('users').insert([{ id: userId, name, email, password: hashedPassword, role: 'user' }]);
  if (error) return res.status(500).json({ success: false, message: error.message });

  const token = jwt.sign({ id: userId, email, role: 'user' }, JWT_SECRET, { expiresIn: '24h' });
  res.json({ success: true, token, user: { id: userId, name, email, role: 'user' } });
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.json({ success: false, message: 'يرجى إدخال البريد الإلكتروني وكلمة المرور' });

  const { data: row } = await supabase.from('users').select('*').eq('email', email).maybeSingle();
  if (row && (await bcrypt.compare(password, row.password))) {
    const token = jwt.sign({ id: row.id, email: row.email, role: row.role }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ success: true, token, user: { id: row.id, name: row.name, email: row.email, role: row.role } });
  } else {
    res.json({ success: false, message: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' });
  }
});

// --- VENDORS ---

app.get('/api/vendors', async (req, res) => {
  const { data, error } = await supabase.from('vendors').select('*');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.post('/api/vendors', verifyToken, isAdmin, async (req, res) => {
  const { name, contact } = req.body;
  if (!name) return res.status(400).json({ error: 'Vendor name is required' });
  const vendorId = 'v' + Date.now();
  const { data, error } = await supabase.from('vendors').insert([{ id: vendorId, name, contact, active: true }]).select().single();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// --- PRODUCTS ---

app.get('/api/products', async (req, res) => {
  const { data, error } = await supabase.from('products').select('*');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.get('/api/products/:id', async (req, res) => {
  const { data, error } = await supabase.from('products').select('*').eq('id', req.params.id).maybeSingle();
  if (error) return res.status(500).json({ error: error.message });
  if (!data) return res.status(404).json({ error: 'Product not found' });
  res.json(data);
});

app.post('/api/products', verifyToken, isAdmin, async (req, res) => {
  const { name, description, price, oldPrice, category, image, badge } = req.body;
  const productId = 'p' + Date.now();
  const { data, error } = await supabase.from('products')
    .insert([{ id: productId, name, description, price, oldPrice, category, image, rating: 5.0, reviews: 0, badge }])
    .select().single();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.put('/api/products/:id', verifyToken, isAdmin, async (req, res) => {
  const { name, description, price, oldPrice, category, image, badge } = req.body;
  const updates = {};
  if (name !== undefined) updates.name = name;
  if (description !== undefined) updates.description = description;
  if (price !== undefined) updates.price = price;
  if (oldPrice !== undefined) updates.oldPrice = oldPrice;
  if (category !== undefined) updates.category = category;
  if (image !== undefined) updates.image = image;
  if (badge !== undefined) updates.badge = badge;

  const { error } = await supabase.from('products').update(updates).eq('id', req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true });
});

app.delete('/api/products/:id', verifyToken, isAdmin, async (req, res) => {
  const { error } = await supabase.from('products').delete().eq('id', req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true });
});

// --- CART ---

app.get('/api/cart', verifyToken, async (req, res) => {
  const { data, error } = await supabase.from('cart').select('*').eq('userId', req.user.id);
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.post('/api/cart', verifyToken, async (req, res) => {
  const { product, quantity } = req.body;
  if (!product || !product.id) return res.status(400).json({ error: 'Product is required' });

  const { data: existing } = await supabase.from('cart').select('*').eq('userId', req.user.id).eq('id', product.id).maybeSingle();

  if (existing) {
    await supabase.from('cart').update({ quantity: existing.quantity + (quantity || 1) })
      .eq('userId', req.user.id).eq('id', product.id);
  } else {
    await supabase.from('cart').insert([{
      userId: req.user.id, id: product.id, name: product.name,
      description: product.description, price: product.price,
      oldPrice: product.oldPrice, category: product.category,
      image: product.image, rating: product.rating, reviews: product.reviews,
      badge: product.badge, quantity: quantity || 1
    }]);
  }

  const { data } = await supabase.from('cart').select('*').eq('userId', req.user.id);
  res.json(data);
});

app.put('/api/cart/:id', verifyToken, async (req, res) => {
  const { quantity } = req.body;
  await supabase.from('cart').update({ quantity }).eq('userId', req.user.id).eq('id', req.params.id);
  const { data } = await supabase.from('cart').select('*').eq('userId', req.user.id);
  res.json(data);
});

app.delete('/api/cart/:id', verifyToken, async (req, res) => {
  await supabase.from('cart').delete().eq('userId', req.user.id).eq('id', req.params.id);
  const { data } = await supabase.from('cart').select('*').eq('userId', req.user.id);
  res.json(data);
});

app.delete('/api/cart', verifyToken, async (req, res) => {
  await supabase.from('cart').delete().eq('userId', req.user.id);
  res.json([]);
});

// --- ORDERS ---

app.get('/api/orders', verifyToken, async (req, res) => {
  let query = supabase.from('orders').select('*').order('date', { ascending: false });
  if (req.user.role !== 'admin') query = query.eq('userId', req.user.id);
  const { data, error } = await query;
  if (error) return res.status(500).json({ error: error.message });
  const orders = data.map(row => ({ ...row, items: typeof row.items === 'string' ? JSON.parse(row.items) : row.items }));
  res.json(orders);
});

app.post('/api/orders', verifyToken, async (req, res) => {
  const { id, date, total, items, status } = req.body;
  const { data, error } = await supabase.from('orders')
    .insert([{ id, userId: req.user.id, date, total, status, items: JSON.stringify(items) }])
    .select().single();
  if (error) return res.status(500).json({ error: error.message });
  res.json({ ...data, items });
});

app.put('/api/orders/:id', verifyToken, async (req, res) => {
  const { status } = req.body;
  let query = supabase.from('orders').update({ status }).eq('id', req.params.id);
  if (req.user.role !== 'admin') query = query.eq('userId', req.user.id);
  const { error } = await query;
  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true });
});

// --- REVIEWS ---

app.get('/api/products/:id/reviews', async (req, res) => {
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('productId', req.params.id)
    .order('date', { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.post('/api/products/:id/reviews', verifyToken, async (req, res) => {
  const { rating, comment } = req.body;
  const { id: productId } = req.params;
  
  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json({ error: 'التقييم يجب أن يكون بين 1 و 5 نجوم' });
  }

  const { data: user, error: userError } = await supabase
    .from('users')
    .select('name')
    .eq('id', req.user.id)
    .single();

  if (userError || !user) {
    return res.status(404).json({ error: 'المستخدم غير موجود' });
  }

  const reviewId = 'r' + Date.now();
  const newReview = {
    id: reviewId,
    productId,
    userName: user.name,
    rating: parseInt(rating),
    comment: comment || '',
    date: new Date().toISOString()
  };

  const { data, error } = await supabase
    .from('reviews')
    .insert([newReview])
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// Only start the server when running locally (not as a Vercel function)
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}

module.exports = app;
