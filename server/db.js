const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcryptjs');

const dbPath = path.join(__dirname, 'database.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database.');
    initializeDatabase();
  }
});

function initializeDatabase() {
  db.serialize(() => {
    // 1. Users Table
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT NOT NULL
      )
    `, (err) => {
      if (err) console.error('Error creating users table:', err.message);
      else seedUsers();
    });

    // 2. Vendors Table
    db.run(`
      CREATE TABLE IF NOT EXISTS vendors (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        contact TEXT,
        active INTEGER DEFAULT 1
      )
    `, (err) => {
      if (err) console.error('Error creating vendors table:', err.message);
      else seedVendors();
    });

    // 3. Products Table
    db.run(`
      CREATE TABLE IF NOT EXISTS products (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        price REAL NOT NULL,
        oldPrice REAL,
        category TEXT NOT NULL,
        image TEXT,
        rating REAL DEFAULT 5.0,
        reviews INTEGER DEFAULT 0,
        badge TEXT
      )
    `, (err) => {
      if (err) console.error('Error creating products table:', err.message);
      else seedProducts();
    });

    // 4. Cart Table (User-specific)
    db.run(`
      CREATE TABLE IF NOT EXISTS cart (
        userId TEXT,
        id TEXT,
        name TEXT NOT NULL,
        description TEXT,
        price REAL NOT NULL,
        oldPrice REAL,
        category TEXT NOT NULL,
        image TEXT,
        rating REAL,
        reviews INTEGER,
        badge TEXT,
        quantity INTEGER NOT NULL,
        PRIMARY KEY (userId, id)
      )
    `, (err) => {
      if (err) console.error('Error creating cart table:', err.message);
    });

    // 5. Orders Table (With userId column for multi-user security)
    db.run(`
      CREATE TABLE IF NOT EXISTS orders (
        id TEXT PRIMARY KEY,
        userId TEXT,
        date TEXT NOT NULL,
        total REAL NOT NULL,
        status TEXT NOT NULL,
        items TEXT NOT NULL
      )
    `, (err) => {
      if (err) console.error('Error creating orders table:', err.message);
    });
  });
}

function seedUsers() {
  db.get('SELECT COUNT(*) as count FROM users', [], (err, row) => {
    if (err) return console.error(err.message);
    if (row.count === 0) {
      const stmt = db.prepare('INSERT INTO users (id, name, email, password, role) VALUES (?, ?, ?, ?, ?)');
      const hashedPassword = bcrypt.hashSync('admin', 10);
      stmt.run('admin', 'مدير النظام', 'admin@zayed.com', hashedPassword, 'admin');
      stmt.finalize(() => {
        console.log('Seeded default admin user with hashed password.');
      });
    }
  });
}

function seedVendors() {
  db.get('SELECT COUNT(*) as count FROM vendors', [], (err, row) => {
    if (err) return console.error(err.message);
    if (row.count === 0) {
      const INITIAL_VENDORS = [
        { id: "v1", name: "محلات الهدى للإلكترونيات", contact: "0501234567", active: 1 },
        { id: "v2", name: "بوتيك الأناقة", contact: "0509876543", active: 1 }
      ];
      const stmt = db.prepare('INSERT INTO vendors (id, name, contact, active) VALUES (?, ?, ?, ?)');
      INITIAL_VENDORS.forEach(v => {
        stmt.run(v.id, v.name, v.contact, v.active);
      });
      stmt.finalize(() => {
        console.log('Seeded default vendors.');
      });
    }
  });
}

function seedProducts() {
  db.get('SELECT COUNT(*) as count FROM products', [], (err, row) => {
    if (err) return console.error(err.message);
    if (row.count === 0) {
      const INITIAL_PRODUCTS = [
        {
          id: "p1",
          name: "سماعات رأس لاسلكية Sony WH-1000XM4",
          description: "سماعات رأس بخاصية إلغاء الضوضاء الرائدة في الصناعة، مع جودة صوت استثنائية وبطارية تدوم طويلاً.",
          price: 1200,
          oldPrice: 1500,
          category: "electronics",
          image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&w=500&q=80",
          rating: 4.8,
          reviews: 124,
          badge: "خصم 20%"
        },
        {
          id: "p2",
          name: "ساعة ذكية Apple Watch Series 8",
          description: "ساعة أبل الذكية الأحدث مع مستشعر قياس الأكسجين في الدم وتتبع اللياقة البدنية.",
          price: 1800,
          oldPrice: null,
          category: "electronics",
          image: "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?auto=format&fit=crop&w=500&q=80",
          rating: 4.9,
          reviews: 312,
          badge: "جديد"
        },
        {
          id: "p3",
          name: "حقيبة ظهر جلدية فاخرة",
          description: "حقيبة ظهر مصنوعة من الجلد الطبيعي عالية الجودة، مناسبة للعمل والسفر.",
          price: 350,
          oldPrice: 450,
          category: "fashion",
          image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=500&q=80",
          rating: 4.5,
          reviews: 89,
          badge: ""
        },
        {
          id: "p4",
          name: "حذاء رياضي Nike Air Max",
          description: "حذاء رياضي مريح بتصميم عصري وألوان جذابة.",
          price: 550,
          oldPrice: 650,
          category: "fashion",
          image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=500&q=80",
          rating: 4.7,
          reviews: 210,
          badge: "الأكثر مبيعاً"
        },
        {
          id: "p5",
          name: "ماكينة قهوة إسبريسو",
          description: "قم بإعداد قهوة الإسبريسو المفضلة لديك في المنزل بسهولة.",
          price: 850,
          oldPrice: 1000,
          category: "home",
          image: "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?auto=format&fit=crop&w=500&q=80",
          rating: 4.6,
          reviews: 156,
          badge: "عرض خاص"
        },
        {
          id: "p6",
          name: "عطر رجالي فاخر Bleu de Chanel",
          description: "عطر رجالي مميز يدوم طويلاً برائحة الأخشاب.",
          price: 650,
          oldPrice: null,
          category: "beauty",
          image: "https://images.unsplash.com/photo-1523293182086-7651a899a37f?auto=format&fit=crop&w=500&q=80",
          rating: 4.9,
          reviews: 420,
          badge: ""
        },
        {
          id: "p7",
          name: "لابتوب MacBook Air M2",
          description: "أحدث إصدار من أجهزة ماك بوك اير بشريحة M2 الجبارة.",
          price: 4500,
          oldPrice: 4800,
          category: "electronics",
          image: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=500&q=80",
          rating: 5.0,
          reviews: 890,
          badge: "مميز"
        },
        {
          id: "p8",
          name: "مجموعة العناية بالبشرة النسائية",
          description: "مجموعة متكاملة للعناية بالبشرة لترطيب ونضارة فائقة.",
          price: 250,
          oldPrice: 320,
          category: "beauty",
          image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&w=500&q=80",
          rating: 4.4,
          reviews: 67,
          badge: "خصم حصري"
        }
      ];

      const stmt = db.prepare('INSERT INTO products (id, name, description, price, oldPrice, category, image, rating, reviews, badge) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
      INITIAL_PRODUCTS.forEach(p => {
        stmt.run(p.id, p.name, p.description, p.price, p.oldPrice, p.category, p.image, p.rating, p.reviews, p.badge);
      });
      stmt.finalize(() => {
        console.log('Seeded default products.');
      });
    }
  });
}

module.exports = db;
