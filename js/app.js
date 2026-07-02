// =========================================
// ZAYED EXPRESS - Main App Logic
// =========================================

// --- Language Translation Dictionary ---
const TRANSLATIONS = {
  'العربية': 'English',
  'English': 'العربية',
  'شحن مجاني للطلبات فوق 200 د.إ': 'Free shipping for orders over 200 AED',
  'عن ماذا تبحث؟': 'What are you looking for?',
  'عن ماذا تبحث؟ (هواتف، ملابس، عطور...)': 'What are you looking for? (Phones, Clothes, Perfume...)',
  'حسابي': 'My Account',
  'المفضلة': 'Wishlist',
  'السلة': 'Cart',
  'تصفح الكل': 'Browse All',
  'إلكترونيات': 'Electronics',
  'أزياء': 'Fashion',
  'المنزل': 'Home',
  'تجميل': 'Beauty',
  'تجميل وعطور': 'Beauty & Perfume',
  'عطور وتجميل': 'Beauty & Perfume',
  'عروض اليوم': 'Today\'s Deals',
  '🏷️ عروض اليوم': '🏷️ Today\'s Deals',
  'تجربة تسوق': 'An Unmatched',
  'لا مثيل لها': 'Shopping Experience',
  'اكتشف آلاف المنتجات من أفضل الماركات العالمية بأسعار تنافسية وتوصيل سريع.': 'Discover thousands of products from top international brands at competitive prices and fast delivery.',
  'تسوق الآن': 'Shop Now',
  'وصل حديثاً': 'New Arrivals',
  'عرض الكل': 'View All',
  'عروض نهاية الأسبوع': 'Weekend Deals',
  'خصومات تصل إلى 50% على تشكيلة مختارة من الإلكترونيات والأزياء.': 'Discounts up to 50% on selected electronics and fashion items.',
  'ينتهي العرض في:': 'Offer ends in:',
  'استكشف العروض': 'Explore Deals',
  'نحن نقدم أفضل تجربة تسوق عبر الإنترنت مع آلاف المنتجات وأسرع خدمة توصيل في المنطقة.': 'We provide the best online shopping experience with thousands of products and the fastest delivery in the region.',
  'روابط هامة': 'Important Links',
  'من نحن': 'About Us',
  'تواصل معنا': 'Contact Us',
  'الأسئلة الشائعة': 'FAQ',
  'سياسة الخصوصية': 'Privacy Policy',
  'الفئات': 'Categories',
  'أزياء الموضة': 'Fashion & Trends',
  'المنزل والمطبخ': 'Home & Kitchen',
  'العطور والتجميل': 'Perfumes & Beauty',
  'دبي، الإمارات العربية المتحدة': 'Dubai, United Arab Emirates',
  'جميع الحقوق محفوظة.': 'All rights reserved.',
  'البيانات الشخصية': 'Personal Info',
  'طلباتي': 'My Orders',
  'العناوين المحفوظة': 'Saved Addresses',
  'تسجيل الخروج': 'Sign Out',
  'الاسم الكامل': 'Full Name',
  'البريد الإلكتروني': 'Email Address',
  'لا يمكن تغيير البريد الإلكتروني.': 'Email cannot be changed.',
  'حفظ التغييرات': 'Save Changes',
  'سجل الطلبات': 'Orders History',
  'لا توجد طلبات سابقة.': 'No previous orders.',
  'الطلب': 'Order',
  'منتج(ات)': 'item(s)',
  'د.إ': 'AED',
  'تم التأكيد': 'Confirmed',
  'قيد التجهيز': 'Processing',
  'جاري التوصيل': 'In Transit',
  'تم التسليم': 'Delivered',
  'طلب إرجاع': 'Request Return',
  'طلب إرجاع منتج': 'Return Product Request',
  'يرجى تحديد سبب الإرجاع للمساعدة في تحسين خدمتنا.': 'Please select a return reason to help improve our service.',
  'سبب الإرجاع': 'Return Reason',
  '-- اختر السبب --': '-- Select Reason --',
  'منتج تالف أو به عيب': 'Damaged or defective product',
  'منتج غير مطابق للمواصفات': 'Product does not match description',
  'تأخير في التوصيل': 'Delayed delivery',
  'لم أعد بحاجة إليه': 'Changed my mind / No longer need it',
  'أخرى': 'Other',
  'إلغاء': 'Cancel',
  'تأكيد الطلب': 'Confirm Request',
  'تسجيل الدخول': 'Log In',
  'البريد الالكتروني': 'Email Address',
  'كلمة المرور': 'Password',
  'ليس لديك حساب؟': 'Don\'t have an account?',
  'إنشاء حساب جديد': 'Create new account',
  'الاسم': 'Name',
  'تأكيد كلمة المرور': 'Confirm Password',
  'لديك حساب بالفعل؟': 'Already have an account?',
  'الدعم الفني': 'Customer Support',
  'العناوين': 'Addresses',
  'إضافة عنوان جديد': 'Add New Address',
  'العنوان': 'Address',
  'المدينة': 'City',
  'رقم الهاتف': 'Phone Number',
  'افتراضي': 'Default',
  'حفظ العنوان': 'Save Address',
  'تعديل العنوان': 'Edit Address',
  'حذف': 'Delete',
  'تعيين كافتراضي': 'Set as Default',
  'جميع المنتجات': 'All Products',
  'تم حذف المنتج من السلة': 'Product removed from cart',
  'سلة التسوق فارغة': 'Your cart is empty',
  'لم تقم بإضافة أي منتجات إلى سلتك بعد.': 'You haven\'t added any products to your cart yet.',
  'تصفح المنتجات': 'Browse Products',
  'ملخص الطلب': 'Order Summary',
  'كود الخصم': 'Coupon Code',
  'تطبيق': 'Apply',
  'المجموع الفرعي': 'Subtotal',
  'الشحن': 'Shipping',
  'مجاني': 'Free',
  'الخصم': 'Discount',
  'الإجمالي': 'Total',
  'متابعة الشراء': 'Proceed to Checkout',
  'مجموعتنا الواسعة من المنتجات الفاخرة': 'Our wide range of premium products',
  'الكل': 'All',
  'نطاق السعر': 'Price Range',
  'أقل من 500 د.إ': 'Under 500 AED',
  'أكثر من 1000 د.إ': 'Over 1000 AED',
  'تم العثور على': 'Found',
  'منتج': 'product(s)',
  'ترتيب حسب:': 'Sort by:',
  'الأحدث': 'Newest',
  'السعر: من الأقل للأعلى': 'Price: Low to High',
  'السعر: من الأعلى للأقل': 'Price: High to Low',
  'لم يتم العثور على منتجات': 'No products found',
  'حاول تغيير الفلاتر أو كلمات البحث.': 'Try changing filters or search keywords.',
  'تأكيد طلبك بنجاح!': 'Order confirmed successfully!',
  'شكراً لتسوقك من ZAYED EXPRESS. رقم طلبك هو': 'Thank you for shopping at ZAYED EXPRESS. Your order number is',
  'العودة للرئيسية': 'Back to Home',
  'رقم البطاقة': 'Card Number',
  'تاريخ الانتهاء': 'Expiry Date',
  'بطاقة ائتمان / مدى': 'Credit Card / Mada',
  'الدفع عند الاستلام': 'Cash on Delivery',
  'إتمام الشراء': 'Checkout',
  'ملخص الطلب النهائي': 'Final Order Summary',
  'الإجمالي المطلوب:': 'Total Amount:',
  'يجب تسجيل الدخول أولاً لإتمام عملية الشراء': 'You must log in first to complete the purchase',
  'تنبيه': 'Alert'
};

document.addEventListener('DOMContentLoaded', () => {
  // Init features
  updateCartBadge();
  initTheme();
  initLanguage();
  initMobileMenu();
  initWishlist();
  initCheckoutGuard();

  // Render featured products if container exists
  const featuredContainer = document.getElementById('featured-products');
  if (featuredContainer) {
    renderFeaturedProducts(featuredContainer);
  }
  
  // Listen for cart updates across tabs/pages
  window.addEventListener('cartUpdated', updateCartBadge);
  window.addEventListener('storage', (e) => {
    if (e.key === 'ze_cart') {
      updateCartBadge();
    }
  });

  // Handle Search
  const searchInputs = document.querySelectorAll('.search-input');
  const searchBtns = document.querySelectorAll('.search-btn');
  
  const executeSearch = (input) => {
    if(input && input.value.trim() !== '') {
      window.location.href = `products.html?search=${encodeURIComponent(input.value.trim())}`;
    }
  };
  
  searchInputs.forEach((input, index) => {
    input.addEventListener('keypress', (e) => {
      if(e.key === 'Enter') executeSearch(input);
    });
    if(searchBtns[index]) {
      searchBtns[index].addEventListener('click', () => executeSearch(input));
    }
  });
});

// =========================================
// Language & Localization Logic
// =========================================
function initLanguage() {
  const savedLang = localStorage.getItem('ze_lang') || 'ar';
  
  // Find globe link and set up toggle
  const globeLinks = document.querySelectorAll('a');
  globeLinks.forEach(link => {
    if (link.innerHTML.includes('fa-globe')) {
      link.innerHTML = `<i class="fas fa-globe"></i> ${savedLang === 'ar' ? 'English' : 'العربية'}`;
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const nextLang = savedLang === 'ar' ? 'en' : 'ar';
        localStorage.setItem('ze_lang', nextLang);
        window.location.reload();
      });
    }
  });

  if (savedLang === 'en') {
    applyTranslation('en');
  }
}

function applyTranslation(lang) {
  if (lang !== 'en') return;
  
  document.documentElement.setAttribute('lang', 'en');
  document.documentElement.setAttribute('dir', 'ltr');
  
  // Recursively translate text nodes
  const walk = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
  let node;
  while (node = walk.nextNode()) {
    const text = node.nodeValue.trim();
    if (TRANSLATIONS[text]) {
      node.nodeValue = node.nodeValue.replace(text, TRANSLATIONS[text]);
    }
  }
  
  // Also translate input placeholders
  document.querySelectorAll('input[placeholder]').forEach(input => {
    const ph = input.getAttribute('placeholder').trim();
    if (TRANSLATIONS[ph]) {
      input.setAttribute('placeholder', TRANSLATIONS[ph]);
    }
  });
}

// =========================================
// Mobile Hamburger & Drawer Menu
// =========================================
function initMobileMenu() {
  // 1. Inject Hamburger Button into navbar if it doesn't exist
  const navContainer = document.querySelector('.nav-container');
  if (navContainer && !document.getElementById('mobile-menu-btn')) {
    const btn = document.createElement('button');
    btn.id = 'mobile-menu-btn';
    btn.className = 'mobile-menu-btn';
    btn.innerHTML = '<i class="fas fa-bars"></i>';
    const logo = navContainer.querySelector('.logo');
    if (logo) {
      navContainer.insertBefore(btn, logo);
    } else {
      navContainer.appendChild(btn);
    }
  }

  // 2. Inject Mobile Drawer into body if it doesn't exist
  if (!document.getElementById('mobile-drawer')) {
    const drawer = document.createElement('div');
    drawer.id = 'mobile-drawer';
    drawer.className = 'mobile-drawer';
    drawer.innerHTML = `
      <div class="mobile-drawer-content">
        <div class="mobile-drawer-header">
          <a href="index.html" class="logo">ZAYED<span>EXPRESS</span></a>
          <button class="close-btn" id="close-mobile-drawer"><i class="fas fa-times"></i></button>
        </div>
        <div class="mobile-drawer-body">
          <ul class="mobile-menu-links">
            <li><a href="index.html"><i class="fas fa-home"></i> الرئيسية</a></li>
            <li><a href="products.html"><i class="fas fa-box"></i> تصفح المنتجات</a></li>
            <li><a href="cart.html"><i class="fas fa-shopping-bag"></i> السلة</a></li>
            <li><a href="auth.html" id="mobile-nav-account"><i class="fas fa-user"></i> حسابي</a></li>
            <li id="mobile-nav-logout-li" style="display:none;"><a href="#" id="mobile-nav-logout" class="text-danger"><i class="fas fa-sign-out-alt"></i> تسجيل الخروج</a></li>
          </ul>
        </div>
      </div>
    `;
    document.body.appendChild(drawer);
  }

  // 3. Set up listeners
  const openBtn = document.getElementById('mobile-menu-btn');
  const closeBtn = document.getElementById('close-mobile-drawer');
  const drawer = document.getElementById('mobile-drawer');

  if (openBtn && drawer) {
    openBtn.addEventListener('click', () => drawer.classList.add('active'));
  }
  if (closeBtn && drawer) {
    closeBtn.addEventListener('click', () => drawer.classList.remove('active'));
    drawer.addEventListener('click', (e) => {
      if (e.target === drawer) drawer.classList.remove('active');
    });
  }

  // 4. Check user state
  const accountLink = document.getElementById('mobile-nav-account');
  const logoutLi = document.getElementById('mobile-nav-logout-li');
  const logoutBtn = document.getElementById('mobile-nav-logout');

  if (typeof auth !== 'undefined' && auth.isLoggedIn()) {
    const user = auth.getCurrentUser();
    if (accountLink) {
      accountLink.href = user.role === 'admin' ? 'admin/index.html' : 'profile.html';
      accountLink.innerHTML = `<i class="fas fa-user-circle"></i> ${user.name}`;
    }
    if (logoutLi) logoutLi.style.display = 'block';
    if (logoutBtn) {
      logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        auth.logout();
        window.location.href = 'index.html';
      });
    }
  }

  // Translate mobile drawer if English is active
  if (localStorage.getItem('ze_lang') === 'en') {
    const savedLang = 'en';
    const walk = document.createTreeWalker(drawer, NodeFilter.SHOW_TEXT, null, false);
    let node;
    while (node = walk.nextNode()) {
      const text = node.nodeValue.trim();
      if (TRANSLATIONS[text]) {
        node.nodeValue = node.nodeValue.replace(text, TRANSLATIONS[text]);
      }
    }
  }
}

// =========================================
// Wishlist (Favorites) Client Logic
// =========================================
function initWishlist() {
  updateWishlistCount();
  setTimeout(updateHeartIcons, 300); // Wait for grid render
  
  // Re-run heart update when cart or DOM changes
  const productsGrid = document.getElementById('products-grid') || document.getElementById('featured-products');
  if (productsGrid) {
    const observer = new MutationObserver(updateHeartIcons);
    observer.observe(productsGrid, { childList: true });
  }
}

function getWishlist() {
  return JSON.parse(localStorage.getItem('ze_wishlist')) || [];
}

function saveWishlist(wishlist) {
  localStorage.setItem('ze_wishlist', JSON.stringify(wishlist));
  updateWishlistCount();
}

function toggleWishlist(productId) {
  if (typeof auth !== 'undefined' && !auth.isLoggedIn()) {
    showToast('يجب تسجيل الدخول لإضافة المنتجات للمفضلة', 'error');
    setTimeout(() => window.location.href = 'auth.html', 1500);
    return;
  }
  
  let wishlist = getWishlist();
  const index = wishlist.indexOf(productId);
  if (index > -1) {
    wishlist.splice(index, 1);
    showToast(localStorage.getItem('ze_lang') === 'en' ? 'Removed from Wishlist' : 'تمت الإزالة من المفضلة', 'info');
  } else {
    wishlist.push(productId);
    showToast(localStorage.getItem('ze_lang') === 'en' ? 'Added to Wishlist' : 'تمت الإضافة إلى المفضلة');
  }
  saveWishlist(wishlist);
  updateHeartIcons();
}

function updateWishlistCount() {
  const badge = document.getElementById('wishlist-count') || (() => {
    const actions = document.querySelector('.nav-actions');
    if (actions) {
      const items = actions.querySelectorAll('a');
      for (const item of items) {
        if (item.innerHTML.includes('fa-heart')) {
          item.href = 'profile.html?view=wishlist';
          const div = document.createElement('div');
          div.id = 'wishlist-count';
          div.className = 'badge';
          div.style.cssText = 'position:absolute;top:-5px;right:-5px;background:var(--color-danger);color:#fff;font-size:0.7rem;font-weight:700;width:20px;height:20px;display:none;align-items:center;justify-content:center;border-radius:50%;';
          item.appendChild(div);
          return div;
        }
      }
    }
    return null;
  })();

  if (badge) {
    const count = getWishlist().length;
    badge.innerText = count;
    badge.style.display = count > 0 ? 'flex' : 'none';
  }
}

function updateHeartIcons() {
  const wishlist = getWishlist();
  document.querySelectorAll('.btn-icon i.fa-heart').forEach(heart => {
    const card = heart.closest('.product-card') || heart.closest('.product-detail-layout') || heart.closest('.card');
    if (card) {
      // Find product id
      let id = '';
      const link = card.querySelector('a[href*="product-detail.html"]');
      if (link) {
        id = new URLSearchParams(link.href.split('?')[1]).get('id');
      } else {
        // We might be on detail page
        id = new URLSearchParams(window.location.search).get('id');
      }
      
      if (id) {
        if (wishlist.includes(id)) {
          heart.className = 'fas fa-heart text-danger';
        } else {
          heart.className = 'far fa-heart';
        }
        
        const button = heart.closest('button');
        if (button) {
          button.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(id);
          };
        }
      }
    }
  });
}

// =========================================
// Login Checkout Guard
// =========================================
function initCheckoutGuard() {
  const checkoutBtn = document.getElementById('checkout-btn');
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', (e) => {
      if (typeof auth !== 'undefined' && !auth.isLoggedIn()) {
        e.preventDefault();
        showToast(localStorage.getItem('ze_lang') === 'en' ? 'You must log in to checkout' : 'يجب تسجيل الدخول أولاً لإتمام عملية الشراء', 'error');
        setTimeout(() => {
          window.location.href = 'auth.html?redirect=checkout.html';
        }, 1500);
      }
    });
  }

  // Double check inside checkout.html
  if (window.location.pathname.includes('checkout.html')) {
    if (typeof auth !== 'undefined' && !auth.isLoggedIn()) {
      alert(localStorage.getItem('ze_lang') === 'en' ? 'You must log in to checkout' : 'يجب تسجيل الدخول أولاً لإتمام عملية الشراء');
      window.location.href = 'auth.html?redirect=checkout.html';
    }
  }
}

// =========================================
// Dark / Light Mode Logic
// =========================================
function initTheme() {
  const savedTheme = localStorage.getItem('ze_theme') || 'light';
  if (savedTheme === 'dark') {
    document.body.classList.add('dark-theme');
  }

  const btn = document.createElement('button');
  btn.id = 'theme-toggle-btn';
  btn.className = 'theme-toggle-btn';
  btn.title = 'تبديل الوضع المظلم';
  btn.setAttribute('aria-label', 'تبديل الوضع المظلم');
  btn.innerHTML = document.body.classList.contains('dark-theme')
    ? '<i class="fas fa-sun"></i>'
    : '<i class="fas fa-moon"></i>';
  
  btn.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme');
    const isDark = document.body.classList.contains('dark-theme');
    localStorage.setItem('ze_theme', isDark ? 'dark' : 'light');
    btn.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    btn.style.transform = 'scale(1.3) rotate(360deg)';
    setTimeout(() => btn.style.transform = '', 400);
  });

  document.body.appendChild(btn);
}

function updateCartBadge() {
  const cartCount = document.getElementById('cart-count');
  if (cartCount) {
    const cart = db.getCart();
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.innerText = totalItems;
    
    if (totalItems > 0) {
      cartCount.style.display = 'flex';
      cartCount.style.transform = 'scale(1.2)';
      setTimeout(() => cartCount.style.transform = 'scale(1)', 200);
    } else {
      cartCount.style.display = 'none';
    }
  }
}

function renderFeaturedProducts(container) {
  const products = db.getProducts();
  const featured = products.slice(0, 4);
  
  container.innerHTML = '';
  featured.forEach(p => {
    container.innerHTML += createProductCardHTML(p);
  });
}

function createProductCardHTML(p) {
  const badgeHTML = p.badge ? `<div class="product-badge">${p.badge}</div>` : '';
  const oldPriceHTML = p.oldPrice ? `<span class="price-old en-text">${p.oldPrice} د.إ</span>` : '';
  
  const fullStars = Math.floor(p.rating);
  let starsHTML = '';
  for(let i=0; i<5; i++) {
    if(i < fullStars) starsHTML += '<i class="fas fa-star"></i>';
    else if(i === fullStars && p.rating % 1 !== 0) starsHTML += '<i class="fas fa-star-half-alt"></i>';
    else starsHTML += '<i class="far fa-star"></i>';
  }
  
  return `
    <div class="card product-card">
      ${badgeHTML}
      <a href="product-detail.html?id=${p.id}" class="product-img-wrap">
        <img src="${p.image}" alt="${p.name}">
        <div class="product-actions">
          <button class="btn btn-icon" title="أضف للمفضلة"><i class="far fa-heart"></i></button>
          <button class="btn btn-icon" title="أضف للسلة" onclick="event.preventDefault(); addToCartHandler('${p.id}')"><i class="fas fa-cart-plus"></i></button>
          <button class="btn btn-icon" title="نظرة سريعة" onclick="event.preventDefault();"><i class="far fa-eye"></i></button>
        </div>
      </a>
      <div class="product-info">
        <div class="product-category">${getCategoryName(p.category)}</div>
        <a href="product-detail.html?id=${p.id}" class="product-title">${p.name}</a>
        <div class="product-rating">
          ${starsHTML}
          <span class="en-text">(${p.reviews})</span>
        </div>
        <div class="product-price-wrap mt-auto">
          <div>
            ${oldPriceHTML}
            <span class="price en-text">${p.price} د.إ</span>
          </div>
        </div>
      </div>
    </div>
  `;
}

function addToCartHandler(id) {
  const p = db.getProductById(id);
  if(p) {
    db.addToCart(p, 1);
    showToast(localStorage.getItem('ze_lang') === 'en' ? `Added ${p.name} to Cart` : `تمت إضافة ${p.name} إلى السلة`);
  }
}

function getCategoryName(cat) {
  const map = {
    'electronics': 'إلكترونيات',
    'fashion': 'أزياء',
    'home': 'المنزل',
    'beauty': 'عطور وتجميل'
  };
  return map[cat] || cat;
}

function showToast(message, type = 'success') {
  let container = document.querySelector('.toast-container');
  if(!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
    <span>${message}</span>
  `;
  
  container.appendChild(toast);
  
  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}
