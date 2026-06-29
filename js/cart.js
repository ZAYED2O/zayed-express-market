// =========================================
// ZAYED EXPRESS - Cart Page Logic
// =========================================

document.addEventListener('DOMContentLoaded', () => {
  renderCart();
  window.addEventListener('cartUpdated', renderCart);
});

let discount = 0;

function renderCart() {
  const container = document.getElementById('cart-items-container');
  const cart = db.getCart();
  
  if (!container) return;
  
  if (cart.length === 0) {
    container.innerHTML = `
      <div class="text-center" style="padding: 3rem 0;">
        <i class="fas fa-shopping-cart" style="font-size: 3rem; color: var(--color-border); margin-bottom: 1rem;"></i>
        <h3>سلة التسوق فارغة</h3>
        <p class="text-muted mb-lg">لم تقم بإضافة أي منتجات إلى سلتك بعد.</p>
        <a href="products.html" class="btn btn-primary">تصفح المنتجات</a>
      </div>
    `;
    document.getElementById('checkout-btn').style.display = 'none';
    updateSummary();
    return;
  }
  
  document.getElementById('checkout-btn').style.display = 'flex';
  
  let html = '';
  cart.forEach(item => {
    html += `
      <div class="cart-item">
        <a href="product-detail.html?id=${item.id}">
          <img src="${item.image}" alt="${item.name}" class="cart-item-img">
        </a>
        <div class="cart-item-details">
          <div style="display:flex; justify-content:space-between; align-items:start;">
            <a href="product-detail.html?id=${item.id}" class="cart-item-title">${item.name}</a>
            <div class="cart-item-price en-text">${item.price} د.إ</div>
          </div>
          
          <div class="cart-item-actions mt-4">
            <div class="qty-selector">
              <button class="qty-btn" onclick="updateCartItemQty('${item.id}', 1)"><i class="fas fa-plus"></i></button>
              <input type="text" class="qty-input en-text" value="${item.quantity}" readonly>
              <button class="qty-btn" onclick="updateCartItemQty('${item.id}', -1)"><i class="fas fa-minus"></i></button>
            </div>
            
            <button class="btn-remove" onclick="removeCartItem('${item.id}')">
              <i class="fas fa-trash"></i> حذف
            </button>
          </div>
        </div>
      </div>
    `;
  });
  
  container.innerHTML = html;
  updateSummary();
}

function updateCartItemQty(id, change) {
  const cart = db.getCart();
  const item = cart.find(i => i.id === id);
  if(item) {
    let newQty = item.quantity + change;
    if(newQty < 1) newQty = 1;
    db.updateCartQuantity(id, newQty);
  }
}

function removeCartItem(id) {
  if(confirm('هل أنت متأكد من حذف هذا المنتج من السلة؟')) {
    db.removeFromCart(id);
    showToast('تم حذف المنتج من السلة');
  }
}

function applyCoupon() {
  const code = document.getElementById('coupon-code').value.trim().toUpperCase();
  if (code === 'ZAYED20') {
    discount = 0.20; // 20%
    showToast('تم تطبيق الكود بنجاح! خصم 20%');
    updateSummary();
  } else if (code !== '') {
    showToast('كود الخصم غير صالح', 'error');
    discount = 0;
    updateSummary();
  }
}

function updateSummary() {
  const subtotal = db.getCartTotal();
  const shipping = subtotal > 200 || subtotal === 0 ? 0 : 25;
  const discountAmount = subtotal * discount;
  const total = subtotal + shipping - discountAmount;
  
  document.getElementById('cart-subtotal').innerText = `${subtotal.toFixed(2)} د.إ`;
  
  if (shipping === 0) {
    document.getElementById('cart-shipping').innerText = 'مجاني';
  } else {
    document.getElementById('cart-shipping').innerText = `${shipping} د.إ`;
  }
  
  if (discount > 0) {
    document.getElementById('discount-row').style.display = 'flex';
    document.getElementById('cart-discount').innerText = `-${discountAmount.toFixed(2)} د.إ`;
  } else {
    document.getElementById('discount-row').style.display = 'none';
  }
  
  document.getElementById('cart-total').innerText = `${total.toFixed(2)} د.إ`;
  
  // Save total to localStorage for checkout
  localStorage.setItem('ze_checkout_total', total.toFixed(2));
}
