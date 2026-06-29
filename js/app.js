// =========================================
// ZAYED EXPRESS - Main App Logic
// =========================================

document.addEventListener('DOMContentLoaded', () => {
  updateCartBadge();
  
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

function updateCartBadge() {
  const cartCount = document.getElementById('cart-count');
  if (cartCount) {
    const cart = db.getCart();
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.innerText = totalItems;
    
    if (totalItems > 0) {
      cartCount.style.display = 'flex';
      // Animate badge
      cartCount.style.transform = 'scale(1.2)';
      setTimeout(() => cartCount.style.transform = 'scale(1)', 200);
    } else {
      cartCount.style.display = 'none';
    }
  }
}

function renderFeaturedProducts(container) {
  const products = db.getProducts();
  // Get first 4 products
  const featured = products.slice(0, 4);
  
  container.innerHTML = '';
  
  featured.forEach(p => {
    container.innerHTML += createProductCardHTML(p);
  });
}

function createProductCardHTML(p) {
  const badgeHTML = p.badge ? `<div class="product-badge">${p.badge}</div>` : '';
  const oldPriceHTML = p.oldPrice ? `<span class="price-old en-text">${p.oldPrice} د.إ</span>` : '';
  
  // Generate stars
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
          <button class="btn btn-icon" title="أضف للمفضلة" onclick="event.preventDefault(); showToast('تمت الإضافة للمفضلة')"><i class="far fa-heart"></i></button>
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
    showToast(`تمت إضافة ${p.name} إلى السلة`);
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

// Global Toast Function for User Facing Messages
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
