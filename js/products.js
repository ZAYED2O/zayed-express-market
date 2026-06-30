// =========================================
// ZAYED EXPRESS - Products Page Logic
// =========================================

document.addEventListener('DOMContentLoaded', () => {
  const productsGrid = document.getElementById('products-grid');
  if(!productsGrid) return;
  
  // Initial load
  let currentProducts = db.getProducts();
  
  // Check URL params for initial category filter
  const urlParams = new URLSearchParams(window.location.search);
  const catParam = urlParams.get('cat');
  if (catParam) {
    const radio = document.querySelector(`input[name="category"][value="${catParam}"]`);
    if(radio) radio.checked = true;
  }
  
  // DOM Elements
  const catRadios = document.querySelectorAll('input[name="category"]');
  const priceRadios = document.querySelectorAll('input[name="price"]');
  const sortSelect = document.getElementById('sort-select');
  const searchInput = document.getElementById('search-input');
  const searchBtn = document.getElementById('search-btn');
  
  const searchParam = urlParams.get('search');
  if (searchParam && searchInput) {
    searchInput.value = searchParam;
  }
  
  // Listeners
  catRadios.forEach(r => r.addEventListener('change', applyFilters));
  priceRadios.forEach(r => r.addEventListener('change', applyFilters));
  sortSelect.addEventListener('change', applyFilters);
  
  if (searchInput && searchBtn) {
    searchBtn.addEventListener('click', applyFilters);
    searchInput.addEventListener('keyup', (e) => {
      if(e.key === 'Enter') applyFilters();
    });
  }
  
  // Apply initial filters
  applyFilters();
  
  function applyFilters() {
    let filtered = db.getProducts();
    
    // 1. Category Filter
    const selectedCat = document.querySelector('input[name="category"]:checked').value;
    if (selectedCat !== 'all') {
      filtered = filtered.filter(p => p.category === selectedCat);
      document.getElementById('page-title').innerText = getCategoryName(selectedCat);
    } else {
      document.getElementById('page-title').innerText = 'جميع المنتجات';
    }
    
    // 2. Price Filter
    const selectedPrice = document.querySelector('input[name="price"]:checked').value;
    if (selectedPrice !== 'all') {
      if (selectedPrice === '0-500') {
        filtered = filtered.filter(p => p.price <= 500);
      } else if (selectedPrice === '500-1000') {
        filtered = filtered.filter(p => p.price > 500 && p.price <= 1000);
      } else if (selectedPrice === '1000+') {
        filtered = filtered.filter(p => p.price > 1000);
      }
    }
    
    // 3. Search Filter
    if (searchInput && searchInput.value.trim() !== '') {
      const q = searchInput.value.toLowerCase();
      filtered = filtered.filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
    }
    
    // 4. Sort
    const sortVal = sortSelect.value;
    if (sortVal === 'price-low') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortVal === 'price-high') {
      filtered.sort((a, b) => b.price - a.price);
    } else {
      // newest (reverse order)
      filtered.reverse();
    }
    
    renderGrid(filtered);
  }
  
  function renderGrid(products) {
    document.getElementById('products-count').innerText = products.length;
    productsGrid.innerHTML = '';
    
    if (products.length === 0) {
      productsGrid.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 4rem;">
          <i class="fas fa-search" style="font-size: 3rem; color: var(--color-border); margin-bottom: 1rem;"></i>
          <h3>لم يتم العثور على منتجات</h3>
          <p class="text-muted">حاول تغيير الفلاتر أو كلمات البحث.</p>
        </div>
      `;
      return;
    }
    
    products.forEach(p => {
      productsGrid.innerHTML += createProductCardHTML(p);
    });
  }
});
