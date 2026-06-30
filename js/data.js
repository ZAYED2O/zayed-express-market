// =========================================
// ZAYED EXPRESS - Data Store (SQLite Sync Client with JWT)
// =========================================

class StoreDB {
  constructor() {
    // In production (Vercel), API is on the same domain → use relative URL
    // In local dev, use localhost:3000
    this.baseUrl = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
      ? 'http://localhost:3000'
      : '';
  }

  _request(method, url, body = null) {
    try {
      const xhr = new XMLHttpRequest();
      xhr.open(method, this.baseUrl + url, false);
      xhr.setRequestHeader('Content-Type', 'application/json');
      
      // Attach JWT token for authentication
      const token = localStorage.getItem('ze_token');
      if (token) {
        xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      }
      
      xhr.send(body ? JSON.stringify(body) : null);
      
      if (xhr.status === 401 || xhr.status === 403) {
        console.warn('Session expired or access denied.');
        localStorage.removeItem('ze_current_user');
        localStorage.removeItem('ze_token');
        // Return null to signify failure
        return null;
      }
      
      if (xhr.status >= 200 && xhr.status < 300) {
        return JSON.parse(xhr.responseText);
      }
      
      console.error(`Request to ${url} failed with status ${xhr.status}: ${xhr.statusText}`);
      return null;
    } catch (e) {
      console.error(`Request to ${url} failed with error:`, e);
      return null;
    }
  }

  // --- Vendors ---
  getVendors() {
    return this._request('GET', '/api/vendors') || [];
  }

  addVendor(vendor) {
    return this._request('POST', '/api/vendors', vendor);
  }

  // --- Products ---
  getProducts() {
    return this._request('GET', '/api/products') || [];
  }

  getProductById(id) {
    return this._request('GET', `/api/products/${id}`);
  }

  addProduct(product) {
    return this._request('POST', '/api/products', product);
  }

  updateProduct(id, updatedData) {
    const res = this._request('PUT', `/api/products/${id}`, updatedData);
    return res ? res.success : false;
  }

  deleteProduct(id) {
    this._request('DELETE', `/api/products/${id}`);
  }

  // --- Cart (User-specific in SQLite) ---
  getCart() {
    return this._request('GET', '/api/cart') || [];
  }

  addToCart(product, quantity = 1) {
    const cart = this._request('POST', '/api/cart', { product, quantity });
    window.dispatchEvent(new Event('cartUpdated'));
    return cart || [];
  }

  removeFromCart(id) {
    const cart = this._request('DELETE', `/api/cart/${id}`);
    window.dispatchEvent(new Event('cartUpdated'));
    return cart || [];
  }

  updateCartQuantity(id, quantity) {
    const cart = this._request('PUT', `/api/cart/${id}`, { quantity });
    window.dispatchEvent(new Event('cartUpdated'));
    return cart || [];
  }

  clearCart() {
    const cart = this._request('DELETE', '/api/cart');
    window.dispatchEvent(new Event('cartUpdated'));
    return cart || [];
  }

  getCartTotal() {
    const cart = this.getCart();
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  // --- Orders ---
  getOrders() {
    return this._request('GET', '/api/orders') || [];
  }

  addOrder(order) {
    return this._request('POST', '/api/orders', order);
  }

  updateOrder(id, updatedData) {
    const res = this._request('PUT', `/api/orders/${id}`, updatedData);
    return res ? res.success : false;
  }

  // --- Reviews ---
  getProductReviews(productId) {
    return this._request('GET', `/api/products/${productId}/reviews`) || [];
  }

  addProductReview(productId, reviewData) {
    // reviewData: { rating: Number, comment: String }
    return this._request('POST', `/api/products/${productId}/reviews`, reviewData);
  }
}

// Global instance
const db = new StoreDB();
