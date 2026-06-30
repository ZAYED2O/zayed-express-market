// =========================================
// ZAYED EXPRESS - Authentication Logic (SQLite Backend Sync with JWT)
// =========================================

class Auth {
  _request(method, url, body = null) {
    try {
      const xhr = new XMLHttpRequest();
      xhr.open(method, 'http://localhost:3000' + url, false);
      xhr.setRequestHeader('Content-Type', 'application/json');
      
      // Attach JWT token for authorization if it exists
      const token = localStorage.getItem('ze_token');
      if (token) {
        xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      }
      
      xhr.send(body ? JSON.stringify(body) : null);
      
      if (xhr.status === 401 || xhr.status === 403) {
        console.warn('Session expired or access denied.');
        localStorage.removeItem('ze_current_user');
        localStorage.removeItem('ze_token');
        return { success: false, message: 'انتهت جلسة العمل، يرجى تسجيل الدخول مجدداً' };
      }
      
      if (xhr.status >= 200 && xhr.status < 300) {
        return JSON.parse(xhr.responseText);
      }
      
      console.error(`Request to ${url} failed with status ${xhr.status}: ${xhr.statusText}`);
      return { success: false, message: 'خطأ في الاتصال بالخادم' };
    } catch (e) {
      console.error(`Request to ${url} failed with error:`, e);
      return { success: false, message: 'خطأ في الاتصال بالخادم' };
    }
  }

  getUsers() {
    const res = this._request('GET', '/api/users');
    return res.users || [];
  }

  getCurrentUser() {
    return JSON.parse(localStorage.getItem('ze_current_user')) || null;
  }

  register(name, email, password) {
    const res = this._request('POST', '/api/auth/register', { name, email, password });
    if (res.success) {
      const sessionUser = { ...res.user };
      localStorage.setItem('ze_current_user', JSON.stringify(sessionUser));
      localStorage.setItem('ze_token', res.token);
    }
    return res;
  }

  login(email, password) {
    const res = this._request('POST', '/api/auth/login', { email, password });
    if (res.success) {
      const sessionUser = { ...res.user };
      localStorage.setItem('ze_current_user', JSON.stringify(sessionUser));
      localStorage.setItem('ze_token', res.token);
    }
    return res;
  }

  logout() {
    localStorage.removeItem('ze_current_user');
    localStorage.removeItem('ze_token');
  }

  isLoggedIn() {
    return !!this.getCurrentUser();
  }
}

const auth = new Auth();

// Listeners for UI state
document.addEventListener('DOMContentLoaded', () => {
  const user = auth.getCurrentUser();
  
  if (user) {
    // If we are on auth.html and already logged in, redirect
    if (window.location.pathname.includes('auth.html')) {
      window.location.href = user.role === 'admin' ? 'admin/index.html' : 'profile.html';
    }
    // Protect admin pages from non-admin users
    const isAdminFolder = window.location.pathname.includes('/admin/');
    if (isAdminFolder && user.role !== 'admin') {
      window.location.href = '../index.html';
    }
  } else {
    // If we are on protected pages
    const protectedPages = ['profile.html', 'checkout.html'];
    const currentFile = window.location.pathname.split('/').pop();
    const isAdminFolder = window.location.pathname.includes('/admin/');
    
    if (protectedPages.includes(currentFile) || isAdminFolder) {
      const authPath = isAdminFolder ? '../auth.html' : 'auth.html';
      window.location.href = authPath;
    }
  }
});
