// app.js - وظائف مشتركة بين كل الصفحات

async function api(pathname, options = {}) {
  const res = await fetch(pathname, {
    headers: { 'Content-Type': 'application/json' },
    credentials: 'same-origin',
    ...options
  });
  let data = {};
  try { data = await res.json(); } catch (e) {}
  if (!res.ok) {
    throw new Error(data.message || data.error || 'حدث خطأ');
  }
  return data;
}

// جلب المستخدم من LocalStorage
function getCurrentUser() {
  try {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
  } catch (e) {
    return null;
  }
}

function initNavbarToggle() {
  const toggle = document.querySelector('.navbar-toggle');
  const links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', () => links.classList.toggle('open'));
  }
}

// تحديث الشريط العلوي
function renderAuthArea() {
  const area = document.getElementById('auth-area');
  if (!area) return;

  const user = getCurrentUser();

  if (user) {
    const adminLink = user.role === 'admin' 
      ? `<a href="/admin.html">لوحة التحكم</a>` 
      : '';
    
    const firstName = user.name ? user.name.split(' ')[0] : 'المستخدم';

    area.innerHTML = `
      ${adminLink}
      <a href="/dashboard.html">مرحباً، ${escapeHtml(firstName)}</a>
      <button class="btn btn-outline btn-small" id="logout-btn" style="margin-right: 5px;">تسجيل الخروج</button>
    `;

    const btn = document.getElementById('logout-btn');
    if (btn) {
      btn.addEventListener('click', () => {
        localStorage.removeItem('currentUser');
        window.location.href = '/index.html';
      });
    }
  } else {
    area.innerHTML = `<a href="/login.html" class="btn btn-orange">تسجيل الدخول</a>`;
  }
  return user;
}

// تحديث أزرار الواجهة الرئيسية (Hero Section)
function renderHeroActions() {
  const heroActions = document.getElementById('hero-actions');
  if (!heroActions) return;

  const user = getCurrentUser();
  if (user) {
    heroActions.innerHTML = `
      <a href="/dashboard.html" class="btn btn-orange">لوحة التحكم</a>
      <a href="/resources.html" class="btn btn-outline">تصفح المصادر</a>
    `;
  } else {
    heroActions.innerHTML = `
      <a href="/register.html" class="btn btn-orange">أنشئ حسابك الآن</a>
      <a href="/resources.html" class="btn btn-outline">تصفح المصادر</a>
    `;
  }
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function showMsg(el, message, type = 'error') {
  if (!el) return;
  el.textContent = message;
  el.className = `form-msg ${type}`;
}

// حماية الصفحات
function requireAuth({ adminOnly = false } = {}) {
  const user = getCurrentUser();
  if (!user) {
    window.location.href = '/login.html';
    return null;
  }
  if (adminOnly && user.role !== 'admin') {
    window.location.href = '/dashboard.html';
    return null;
  }
  return user;
}

document.addEventListener('DOMContentLoaded', () => {
  initNavbarToggle();
  renderAuthArea();
  renderHeroActions();
});