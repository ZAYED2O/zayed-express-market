const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('./db');

const app = express();
const PORT = 3000;
const JWT_SECRET = 'zayed_express_super_secret_key_2026';

app.use(cors());
app.use(express.json());

// --- SECURITY MIDDLEWARES ---

function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ success: false, message: 'غير مصرح: يرجى تسجيل الدخول أولاً' });
  }
  
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ success: false, message: 'جلسة العمل منتهية الصلاحية، يرجى تسجيل الدخول مجدداً' });
    }
    req.user = decoded;
    next();
  });
}

function isAdmin(req, res, next) {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ success: false, message: 'غير مصرح: يجب أن تكون مديراً للنظام للوصول' });
  }
}

// --- AUTHENTICATION & USERS ---

// GET /api/users
app.get('/api/users', verifyToken, isAdmin, (req, res) => {
  db.all('SELECT id, name, email, role FROM users', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ users: rows });
  });
});

// POST /api/auth/register
app.post('/api/auth/register', (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.json({ success: false, message: 'يرجى ملء جميع الحقول المطلوبة' });
  }

  db.get('SELECT * FROM users WHERE email = ?', [email], (err, row) => {
    if (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
    if (row) {
      return res.json({ success: false, message: 'البريد الإلكتروني مسجل مسبقاً' });
    }

    const userId = 'u' + Date.now();
    const hashedPassword = bcrypt.hashSync(password, 10);
    
    db.run(
      'INSERT INTO users (id, name, email, password, role) VALUES (?, ?, ?, ?, ?)',
      [userId, name, email, hashedPassword, 'user'],
      function (err2) {
        if (err2) {
          return res.status(500).json({ success: false, message: err2.message });
        }
        
        // Generate Token
        const token = jwt.sign({ id: userId, email, role: 'user' }, JWT_SECRET, { expiresIn: '24h' });
        
        res.json({
          success: true,
          token,
          user: { id: userId, name, email, role: 'user' }
        });
      }
    );
  });
});

// POST /api/auth/login
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.json({ success: false, message: 'يرجى إدخال البريد الإلكتروني وكلمة المرور' });
  }

  db.get('SELECT * FROM users WHERE email = ?', [email], (err, row) => {
    if (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
    if (row && bcrypt.compareSync(password, row.password)) {
      // Generate Token
      const token = jwt.sign({ id: row.id, email: row.email, role: row.role }, JWT_SECRET, { expiresIn: '24h' });
      
      res.json({
        success: true,
        token,
        user: { id: row.id, name: row.name, email: row.email, role: row.role }
      });
    } else {
      res.json({ success: false, message: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' });
    }
  });
});

// --- VENDORS ---

// GET /api/vendors
app.get('/api/vendors', (req, res) => {
  db.all('SELECT * FROM vendors', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    const vendors = rows.map(v => ({ ...v, active: !!v.active }));
    res.json(vendors);
  });
});

// POST /api/vendors
app.post('/api/vendors', verifyToken, isAdmin, (req, res) => {
  const { name, contact } = req.body;
  if (!name) {
    return res.status(400).json({ error: 'Vendor name is required' });
  }
  const vendorId = 'v' + Date.now();
  db.run(
    'INSERT INTO vendors (id, name, contact, active) VALUES (?, ?, ?, ?)',
    [vendorId, name, contact, 1],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ id: vendorId, name, contact, active: true });
    }
  );
});

// --- PRODUCTS ---

// GET /api/products
app.get('/api/products', (req, res) => {
  db.all('SELECT * FROM products', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// GET /api/products/:id
app.get('/api/products/:id', (req, res) => {
  db.get('SELECT * FROM products WHERE id = ?', [req.params.id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!row) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(row);
  });
});

// POST /api/products
app.post('/api/products', verifyToken, isAdmin, (req, res) => {
  const { name, description, price, oldPrice, category, image, badge } = req.body;
  const productId = 'p' + Date.now();
  const rating = 5.0;
  const reviews = 0;

  db.run(
    'INSERT INTO products (id, name, description, price, oldPrice, category, image, rating, reviews, badge) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [productId, name, description, price, oldPrice, category, image, rating, reviews, badge],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ id: productId, name, description, price, oldPrice, category, image, rating, reviews, badge });
    }
  );
});

// PUT /api/products/:id
app.put('/api/products/:id', verifyToken, isAdmin, (req, res) => {
  const { name, description, price, oldPrice, category, image, badge } = req.body;
  db.run(
    `UPDATE products SET 
      name = COALESCE(?, name),
      description = COALESCE(?, description),
      price = COALESCE(?, price),
      oldPrice = ?,
      category = COALESCE(?, category),
      image = COALESCE(?, image),
      badge = ?
     WHERE id = ?`,
    [name, description, price, oldPrice, category, image, badge, req.params.id],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ success: this.changes > 0 });
    }
  );
});

// DELETE /api/products/:id
app.delete('/api/products/:id', verifyToken, isAdmin, (req, res) => {
  db.run('DELETE FROM products WHERE id = ?', [req.params.id], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ success: true });
  });
});

// --- CART (USER-SPECIFIC) ---

// GET /api/cart
app.get('/api/cart', verifyToken, (req, res) => {
  db.all('SELECT * FROM cart WHERE userId = ?', [req.user.id], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// POST /api/cart
app.post('/api/cart', verifyToken, (req, res) => {
  const { product, quantity } = req.body;
  if (!product || !product.id) {
    return res.status(400).json({ error: 'Product is required' });
  }

  db.get('SELECT * FROM cart WHERE userId = ? AND id = ?', [req.user.id, product.id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (row) {
      const newQty = row.quantity + (quantity || 1);
      db.run('UPDATE cart SET quantity = ? WHERE userId = ? AND id = ?', [newQty, req.user.id, product.id], function (err2) {
        if (err2) return res.status(500).json({ error: err2.message });
        db.all('SELECT * FROM cart WHERE userId = ?', [req.user.id], (err3, rows) => {
          if (err3) return res.status(500).json({ error: err3.message });
          res.json(rows);
        });
      });
    } else {
      db.run(
        'INSERT INTO cart (userId, id, name, description, price, oldPrice, category, image, rating, reviews, badge, quantity) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [req.user.id, product.id, product.name, product.description, product.price, product.oldPrice, product.category, product.image, product.rating, product.reviews, product.badge, quantity || 1],
        function (err2) {
          if (err2) return res.status(500).json({ error: err2.message });
          db.all('SELECT * FROM cart WHERE userId = ?', [req.user.id], (err3, rows) => {
            if (err3) return res.status(500).json({ error: err3.message });
            res.json(rows);
          });
        }
      );
    }
  });
});

// PUT /api/cart/:id
app.put('/api/cart/:id', verifyToken, (req, res) => {
  const { quantity } = req.body;
  db.run('UPDATE cart SET quantity = ? WHERE userId = ? AND id = ?', [quantity, req.user.id, req.params.id], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    db.all('SELECT * FROM cart WHERE userId = ?', [req.user.id], (err2, rows) => {
      if (err2) return res.status(500).json({ error: err2.message });
      res.json(rows);
    });
  });
});

// DELETE /api/cart/:id
app.delete('/api/cart/:id', verifyToken, (req, res) => {
  db.run('DELETE FROM cart WHERE userId = ? AND id = ?', [req.user.id, req.params.id], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    db.all('SELECT * FROM cart WHERE userId = ?', [req.user.id], (err2, rows) => {
      if (err2) return res.status(500).json({ error: err2.message });
      res.json(rows);
    });
  });
});

// DELETE /api/cart
app.delete('/api/cart', verifyToken, (req, res) => {
  db.run('DELETE FROM cart WHERE userId = ?', [req.user.id], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json([]);
  });
});

// --- ORDERS (USER & ADMIN PROTECTION) ---

// GET /api/orders
app.get('/api/orders', verifyToken, (req, res) => {
  let query = 'SELECT * FROM orders';
  const params = [];
  
  // If not admin, restrict orders to the authenticated user
  if (req.user.role !== 'admin') {
    query += ' WHERE userId = ?';
    params.push(req.user.id);
  }
  
  db.all(query, params, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    const orders = rows.map(row => ({
      ...row,
      items: JSON.parse(row.items)
    }));
    res.json(orders);
  });
});

// POST /api/orders
app.post('/api/orders', verifyToken, (req, res) => {
  const { id, date, total, items, status } = req.body;
  db.run(
    'INSERT INTO orders (id, userId, date, total, status, items) VALUES (?, ?, ?, ?, ?, ?)',
    [id, req.user.id, date, total, status, JSON.stringify(items)],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ id, userId: req.user.id, date, total, status, items });
    }
  );
});

// PUT /api/orders/:id
app.put('/api/orders/:id', verifyToken, (req, res) => {
  const updates = req.body;
  const fields = [];
  const values = [];

  Object.keys(updates).forEach(key => {
    if (key === 'items') {
      fields.push(`${key} = ?`);
      values.push(JSON.stringify(updates[key]));
    } else {
      fields.push(`${key} = ?`);
      values.push(updates[key]);
    }
  });

  if (fields.length === 0) {
    return res.status(400).json({ error: 'No fields to update' });
  }

  let sql = `UPDATE orders SET ${fields.join(', ')} WHERE id = ?`;
  const params = [...values];
  
  // If user is not admin, they can only update status to 'طلب إرجاع' etc. on their own order
  if (req.user.role !== 'admin') {
    sql += ' AND userId = ?';
    params.push(req.user.id, req.user.id);
  } else {
    params.push(req.params.id);
  }

  db.run(sql, params, function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ success: this.changes > 0 });
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
