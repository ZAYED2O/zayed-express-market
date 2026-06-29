// =========================================
// ZAYED EXPRESS ADMIN - App Logic (Seller Central Style)
// =========================================

// --- Inventory Management ---
function renderInventory(searchQuery = '') {
  const tbody = document.getElementById('inventory-list');
  if (!tbody) return;
  
  let products = db.getProducts();
  
  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    products = products.filter(p => 
      p.name.toLowerCase().includes(q) || 
      p.id.toLowerCase().includes(q)
    );
  }
  
  document.getElementById('item-count').innerText = `${products.length} items`;
  tbody.innerHTML = '';
  
  if(products.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; padding: 3rem;">لا توجد منتجات مطابقة.</td></tr>`;
    return;
  }
  
  products.reverse().forEach(p => {
    // Generate Fake ASIN/SKU for Amazon Feel
    const asin = 'B0' + Math.random().toString(36).substr(2, 8).toUpperCase();
    const sku = 'ZE-' + p.category.substring(0,3).toUpperCase() + '-' + p.id;
    
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><input type="checkbox"></td>
      <td class="img-cell"><img src="${p.image}" alt="${p.name}"></td>
      <td>
        <div style="font-weight: 600; color: var(--admin-primary); margin-bottom: 4px;">${p.name.substring(0,40)}...</div>
        <div class="en-text text-muted" style="font-size: 0.8rem;">ASIN: <a href="#">${asin}</a> | SKU: ${sku}</div>
      </td>
      <td>
        <span class="status-badge status-active">نشط</span>
        <div class="en-text" style="margin-top: 4px; font-size: 0.85rem;">150 Available</div>
      </td>
      <td>
        <div class="en-text" style="font-weight: bold;">${p.price.toFixed(2)} د.إ</div>
        <div class="text-muted" style="font-size: 0.8rem;">+ 0.00 د.إ شحن</div>
      </td>
      <td>${getCategoryName(p.category)}</td>
      <td>
        <button class="btn" style="padding: 0.2rem 0.5rem;" onclick="editProduct('${p.id}')">تعديل</button>
        <button class="btn" style="padding: 0.2rem 0.5rem; color: var(--admin-danger);" onclick="deleteProduct('${p.id}')">حذف</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
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

// --- Modal Logic ---
let productModal = null;
let productForm = null;

document.addEventListener('DOMContentLoaded', () => {
  productModal = document.getElementById('product-modal');
  productForm = document.getElementById('product-form');
});

function openProductModal() {
  if(!productModal) return;
  productForm.reset();
  document.getElementById('p-id').value = '';
  document.getElementById('modal-title').innerText = 'إضافة منتج جديد للكتالوج';
  productModal.classList.add('active');
}

function closeProductModal() {
  if(!productModal) return;
  productModal.classList.remove('active');
}

function editProduct(id) {
  const p = db.getProductById(id);
  if(!p) return;
  
  document.getElementById('modal-title').innerText = 'تعديل تفاصيل العرض';
  document.getElementById('p-id').value = p.id;
  document.getElementById('p-name').value = p.name;
  document.getElementById('p-image').value = p.image;
  document.getElementById('p-price').value = p.price;
  document.getElementById('p-old-price').value = p.oldPrice || '';
  document.getElementById('p-category').value = p.category;
  document.getElementById('p-badge').value = p.badge || '';
  document.getElementById('p-desc').value = p.description;
  
  productModal.classList.add('active');
}

function saveProduct() {
  if(!productForm.checkValidity()) {
    productForm.reportValidity();
    return;
  }
  
  const id = document.getElementById('p-id').value;
  
  const productData = {
    name: document.getElementById('p-name').value,
    image: document.getElementById('p-image').value,
    price: parseFloat(document.getElementById('p-price').value),
    oldPrice: document.getElementById('p-old-price').value ? parseFloat(document.getElementById('p-old-price').value) : null,
    category: document.getElementById('p-category').value,
    badge: document.getElementById('p-badge').value,
    description: document.getElementById('p-desc').value,
    rating: id ? undefined : 5.0,
    reviews: id ? undefined : 0
  };
  
  if (id) {
    db.updateProduct(id, productData);
    alert('تم تحديث العرض بنجاح');
  } else {
    db.addProduct(productData);
    alert('تم إضافة المنتج للكتالوج بنجاح');
  }
  
  closeProductModal();
  if(typeof renderInventory === 'function') renderInventory();
}

function deleteProduct(id) {
  if(confirm('هل أنت متأكد من حذف هذا العرض نهائياً من الكتالوج؟')) {
    db.deleteProduct(id);
    if(typeof renderInventory === 'function') renderInventory();
  }
}
