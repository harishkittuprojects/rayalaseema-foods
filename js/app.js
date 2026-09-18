// Rayalaseema Cloud Kitchen - Application Logic

class AppState {
  constructor() {
    this.cart = this.loadCart();
    this.user = this.loadUser();
    this.currentFilter = 'all';
    this.searchQuery = '';
    this.appliedCoupon = null;
    this.deliveryFee = 30;
    this.freeDeliveryThreshold = 300;
  }

  loadCart() {
    const saved = localStorage.getItem('rck_cart');
    return saved ? JSON.parse(saved) : [];
  }

  saveCart() {
    localStorage.setItem('rck_cart', JSON.stringify(this.cart));
    this.updateCartUI();
  }

  loadUser() {
    const saved = localStorage.getItem('rck_user');
    return saved ? JSON.parse(saved) : {
      isLoggedIn: true,
      name: "Rahul Kumar",
      phone: "+91 98765 43210",
      email: "rahul.kumar@hitec-tech.com",
      address: "Tower 4, Mindspace IT Park, Hitec City, Hyderabad - 500081",
      activeSubscription: {
        planName: "Veg Bowl Monthly",
        planType: "Veg Bowl",
        totalDays: 30,
        usedDays: 12,
        remainingDays: 18,
        status: "Active",
        nextDelivery: "Tomorrow (12:30 PM)",
        pausedDates: ["2026-09-22", "2026-09-25"]
      }
    };
  }

  saveUser() {
    localStorage.setItem('rck_user', JSON.stringify(this.user));
  }

  addToCart(item, quantity = 1) {
    const existing = this.cart.find(ci => ci.id === item.id);
    if (existing) {
      existing.quantity += quantity;
    } else {
      this.cart.push({
        id: item.id,
        name: item.name,
        price: item.price || item.pricePerDay || item.startingPrice,
        image: item.image,
        category: item.categoryName || item.category || "Meal Bowl",
        isVeg: item.isVeg !== undefined ? item.isVeg : true,
        quantity: quantity
      });
    }
    this.saveCart();
    this.showToast(`Added ${item.name} to your cart!`, 'success');
  }

  removeFromCart(itemId) {
    const idx = this.cart.findIndex(i => i.id === itemId);
    if (idx !== -1) {
      const removed = this.cart.splice(idx, 1)[0];
      this.saveCart();
      this.showToast(`Removed ${removed.name} from cart`, 'info');
    }
  }

  updateQuantity(itemId, delta) {
    const item = this.cart.find(ci => ci.id === itemId);
    if (item) {
      item.quantity += delta;
      if (item.quantity <= 0) {
        this.removeFromCart(itemId);
      } else {
        this.saveCart();
      }
    }
  }

  clearCart() {
    this.cart = [];
    this.appliedCoupon = null;
    this.saveCart();
  }

  getCartCount() {
    return this.cart.reduce((total, item) => total + item.quantity, 0);
  }

  getCartSubtotal() {
    return this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  getDiscount() {
    if (!this.appliedCoupon) return 0;
    const subtotal = this.getCartSubtotal();
    if (this.appliedCoupon.type === 'percent') {
      return Math.round((subtotal * this.appliedCoupon.value) / 100);
    }
    return Math.min(subtotal, this.appliedCoupon.value);
  }

  getDeliveryFee() {
    const subtotal = this.getCartSubtotal();
    if (subtotal === 0 || subtotal >= this.freeDeliveryThreshold) {
      return 0;
    }
    return this.deliveryFee;
  }

  getCartGrandTotal() {
    const subtotal = this.getCartSubtotal();
    if (subtotal === 0) return 0;
    const discount = this.getDiscount();
    const delivery = this.getDeliveryFee();
    const gst = Math.round((subtotal - discount) * 0.05); // 5% GST on food
    return subtotal - discount + delivery + gst;
  }

  updateCartUI() {
    const count = this.getCartCount();
    const badges = document.querySelectorAll('.cart-badge-count');
    badges.forEach(b => {
      b.textContent = count;
      if (count > 0) {
        b.classList.remove('hidden');
      } else {
        b.classList.add('hidden');
      }
    });

    const totalDisplays = document.querySelectorAll('.cart-nav-total');
    totalDisplays.forEach(t => {
      t.textContent = `₹${this.getCartSubtotal()}`;
    });

    // Render cart page if active
    if (window.location.hash === '#cart' || document.getElementById('view-cart')?.classList.contains('active-view')) {
      this.renderCartPage();
    }
  }

  showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl text-sm font-semibold transition-all transform duration-300 ${
      type === 'success' ? 'bg-zinc-900 text-white border-l-4 border-amber-400' :
      type === 'info' ? 'bg-amber-500 text-zinc-950 font-bold' :
      'bg-red-600 text-white'
    }`;

    const icon = type === 'success' ? 
      `<svg class="w-5 h-5 text-amber-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>` :
      `<svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>`;

    toast.innerHTML = `${icon}<span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(20px)';
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  }
}

// Global App Instance
const app = new AppState();

// Initialize application on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  initRouter();
  initHeader();
  renderFeaturedProducts();
  renderCategoriesGrid();
  renderServicesPage();
  renderSubscriptionPlans();
  renderReviews();
  renderCalendar();
  initEnquiryModal();
  initCheckoutModal();
  initLoginForm();
  app.updateCartUI();

  // Initialize AOS
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 650,
      once: true,
      easing: 'ease-out-cubic',
      offset: 50
    });
  }
});

// Single Page Application Router with Direct Section Scrolling
function initRouter() {
  const mainViews = ['home', 'categories', 'services', 'cart', 'login', 'dashboard'];
  const homeSections = ['our-bowls-section', 'trial-banner', 'how-it-works-section', 'plans-section', 'catering-section', 'reviews-section'];

  window.navigateTo = function(target, filterCategory = null) {
    if (filterCategory) {
      window.setCategoryFilter(filterCategory);
    }
    
    if (homeSections.includes(target)) {
      showView('home');
      setTimeout(() => {
        const el = document.getElementById(target);
        if (el) {
          const headerOffset = 80;
          const elementPosition = el.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }, 50);
      window.location.hash = target;
      return;
    }

    if (mainViews.includes(target)) {
      showView(target);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      window.location.hash = target;
    }
  };

  function showView(viewName) {
    mainViews.forEach(v => {
      const viewEl = document.getElementById(`view-${v}`);
      if (viewEl) {
        if (v === viewName) {
          viewEl.classList.remove('hidden');
          viewEl.classList.add('active-view');
        } else {
          viewEl.classList.add('hidden');
          viewEl.classList.remove('active-view');
        }
      }
    });

    // Update active navbar links
    document.querySelectorAll('.nav-link').forEach(link => {
      const target = link.getAttribute('data-route') || link.getAttribute('href')?.replace('#', '');
      if (target === viewName) {
        link.classList.add('active', 'text-amber-600', 'font-bold');
      } else {
        link.classList.remove('active', 'text-amber-600', 'font-bold');
      }
    });

    // Render respective data if needed
    if (viewName === 'categories') {
      renderCategoriesGrid();
    } else if (viewName === 'cart') {
      renderCartPage();
    } else if (viewName === 'dashboard' || viewName === 'login') {
      renderDashboardView();
    }

    if (typeof AOS !== 'undefined') {
      setTimeout(() => AOS.refresh(), 100);
    }
  }

  function handleHashChange() {
    let hash = window.location.hash.replace('#', '') || 'home';
    
    if (homeSections.includes(hash)) {
      showView('home');
      setTimeout(() => {
        const el = document.getElementById(hash);
        if (el) {
          const headerOffset = 80;
          const elementPosition = el.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }, 80);
      return;
    }

    if (!mainViews.includes(hash)) {
      hash = 'home';
    }

    showView(hash);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  window.addEventListener('hashchange', handleHashChange);
  handleHashChange();
}

// Header & Navigation Interactivity
function initHeader() {
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const navHeader = document.getElementById('main-header');

  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });

    // Close menu when clicked on nav link
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
      });
    });
  }

  // Sticky header shadow on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      navHeader?.classList.add('shadow-md', 'bg-white/95');
    } else {
      navHeader?.classList.remove('shadow-md');
    }
  });
}

// Render Featured Products on Home Page
function renderFeaturedProducts() {
  const container = document.getElementById('featured-products-container');
  if (!container) return;

  const featured = MENU_DATA.products.filter(p => p.popular).slice(0, 4);
  
  container.innerHTML = featured.map(product => createProductCardHtml(product)).join('');
}

// Render Categories Page with Search and Filter
function renderCategoriesGrid() {
  const container = document.getElementById('categories-product-grid');
  if (!container) return;

  let filtered = MENU_DATA.products;

  if (app.currentFilter !== 'all') {
    filtered = filtered.filter(p => p.category === app.currentFilter);
  }

  if (app.searchQuery.trim()) {
    const query = app.searchQuery.toLowerCase().trim();
    filtered = filtered.filter(p => 
      p.name.toLowerCase().includes(query) || 
      p.description.toLowerCase().includes(query) ||
      p.categoryName.toLowerCase().includes(query)
    );
  }

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="col-span-full py-16 text-center">
        <div class="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4 text-amber-600">
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
        </div>
        <h3 class="text-xl font-bold text-zinc-900 mb-1">No bowls found</h3>
        <p class="text-zinc-500 text-sm mb-4">Try searching for something else or clear your category filter.</p>
        <button onclick="clearSearchAndFilter()" class="px-5 py-2.5 bg-amber-400 hover:bg-amber-500 text-zinc-950 font-bold rounded-xl text-sm transition">
          Reset Filters
        </button>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(product => createProductCardHtml(product)).join('');
}

// Helper to generate Reusable Product Card HTML
function createProductCardHtml(product) {
  const isVegIcon = product.isVeg ? 
    `<span class="veg-indicator" title="Vegetarian"><span class="veg-indicator-dot"></span></span>` :
    `<span class="non-veg-indicator" title="Non-Vegetarian"><span class="non-veg-indicator-triangle"></span></span>`;

  return `
    <div class="food-card bg-white rounded-2xl border border-zinc-100 overflow-hidden shadow-sm hover:border-amber-200 flex flex-col justify-between" data-aos="fade-up">
      <div class="relative overflow-hidden group">
        <img src="${product.image}" alt="${product.name}" class="w-full h-48 object-cover object-center group-hover:scale-105 transition duration-500" loading="lazy" />
        
        <div class="absolute top-3 left-3 flex gap-2 items-center">
          <span class="bg-white/95 backdrop-blur px-2.5 py-1 rounded-lg text-xs font-bold text-zinc-800 shadow-sm flex items-center gap-1.5">
            ${isVegIcon}
            ${product.categoryName}
          </span>
          ${product.popular ? `<span class="bg-amber-400 text-zinc-950 font-bold text-xs px-2.5 py-1 rounded-lg shadow-sm">Popular</span>` : ''}
        </div>

        <div class="absolute bottom-3 right-3 bg-zinc-900/80 backdrop-blur text-white text-xs font-semibold px-2.5 py-1 rounded-lg">
          ${product.protein} • ${product.calories}
        </div>
      </div>

      <div class="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div class="flex items-center justify-between mb-1.5">
            <h3 class="text-lg font-bold text-zinc-900 line-clamp-1">${product.name}</h3>
          </div>
          <p class="text-zinc-500 text-xs leading-relaxed line-clamp-2 mb-4">${product.description}</p>
        </div>

        <div>
          <div class="flex items-center justify-between pt-3 border-t border-zinc-100">
            <div>
              <div class="flex items-baseline gap-1.5">
                <span class="text-xl font-extrabold text-zinc-950">₹${product.price}</span>
                ${product.originalPrice ? `<span class="text-xs text-zinc-400 line-through">₹${product.originalPrice}</span>` : ''}
              </div>
              <span class="text-[11px] text-emerald-600 font-semibold">Fresh Daily Prep</span>
            </div>

            <button onclick="handleAddToCart('${product.id}')" class="px-4 py-2 bg-amber-400 hover:bg-amber-500 active:scale-95 text-zinc-950 font-bold rounded-xl text-sm transition-all shadow-sm hover:shadow flex items-center gap-1.5">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}

// Global Category Filter Handler
window.setCategoryFilter = function(category) {
  app.currentFilter = category;
  document.querySelectorAll('.filter-tab-btn').forEach(btn => {
    if (btn.getAttribute('data-category') === category) {
      btn.classList.add('bg-zinc-900', 'text-amber-400', 'border-zinc-900');
      btn.classList.remove('bg-white', 'text-zinc-700', 'border-zinc-200');
    } else {
      btn.classList.remove('bg-zinc-900', 'text-amber-400', 'border-zinc-900');
      btn.classList.add('bg-white', 'text-zinc-700', 'border-zinc-200');
    }
  });
  renderCategoriesGrid();
};

window.handleSearchInput = function(e) {
  app.searchQuery = e.target.value;
  renderCategoriesGrid();
};

window.clearSearchAndFilter = function() {
  app.searchQuery = '';
  app.currentFilter = 'all';
  const searchInput = document.getElementById('product-search-input');
  if (searchInput) searchInput.value = '';
  window.setCategoryFilter('all');
};

// Global Add to Cart Handler
window.handleAddToCart = function(productId) {
  const product = MENU_DATA.products.find(p => p.id === productId);
  if (product) {
    app.addToCart(product);
  }
};

// Global Add Plan Handler
window.handleAddPlanToCart = function(planId) {
  const plan = MENU_DATA.subscriptionPlans.find(p => p.id === planId);
  if (plan) {
    if (plan.totalPrice === 'Custom') {
      window.openEnquiryModal('Corporate Custom Subscription Plan');
    } else {
      app.addToCart({
        id: plan.id,
        name: `${plan.name} (${plan.days} Days Meal Plan)`,
        price: plan.totalPrice,
        categoryName: "Subscription Plan",
        image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80",
        isVeg: true
      });
      window.location.hash = '#cart';
    }
  }
};

// Render Services Page
function renderServicesPage() {
  const container = document.getElementById('services-grid-container');
  if (!container) return;

  container.innerHTML = MENU_DATA.services.map((srv, idx) => `
    <div class="bg-white rounded-3xl border border-zinc-100 overflow-hidden shadow-sm hover:shadow-xl transition duration-300 flex flex-col justify-between" data-aos="fade-up" data-aos-delay="${idx * 100}">
      <div class="relative h-56 overflow-hidden">
        <img src="${srv.image}" alt="${srv.title}" class="w-full h-full object-cover object-center group-hover:scale-105 transition duration-500" loading="lazy" />
        <div class="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-transparent"></div>
        <div class="absolute top-4 left-4">
          <span class="bg-amber-400 text-zinc-950 font-bold text-xs px-3 py-1 rounded-full shadow">
            ${srv.badge}
          </span>
        </div>
        <div class="absolute bottom-4 left-4 right-4 text-white">
          <h3 class="text-2xl font-bold">${srv.title}</h3>
          <p class="text-xs text-amber-200 mt-0.5">${srv.tagline}</p>
        </div>
      </div>

      <div class="p-6 flex-1 flex flex-col justify-between space-y-6">
        <div>
          <p class="text-zinc-600 text-sm leading-relaxed mb-5">${srv.description}</p>
          
          <div class="space-y-2.5">
            <h4 class="text-xs font-bold text-zinc-400 uppercase tracking-wider">Service Highlights</h4>
            <div class="grid grid-cols-1 gap-2">
              ${srv.features.map(f => `
                <div class="flex items-center gap-2 text-xs font-semibold text-zinc-700">
                  <svg class="w-4 h-4 text-emerald-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path></svg>
                  <span>${f}</span>
                </div>
              `).join('')}
            </div>
          </div>
        </div>

        <div class="pt-5 border-t border-zinc-100 flex items-center justify-between">
          <div>
            <span class="text-xs text-zinc-400 block">Pricing</span>
            <span class="text-base font-extrabold text-zinc-900">${srv.priceDisplay}</span>
          </div>

          ${srv.ctaAction === 'order' ? `
            <a href="#categories" class="px-5 py-2.5 bg-amber-400 hover:bg-amber-500 active:scale-95 text-zinc-950 font-bold rounded-xl text-sm transition shadow-sm flex items-center gap-1.5">
              ${srv.ctaText}
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
            </a>
          ` : `
            <button onclick="openEnquiryModal('${srv.title}')" class="px-5 py-2.5 bg-zinc-900 hover:bg-zinc-800 active:scale-95 text-amber-400 font-bold rounded-xl text-sm transition shadow-sm flex items-center gap-1.5">
              ${srv.ctaText}
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
            </button>
          `}
        </div>
      </div>
    </div>
  `).join('');
}

// Render Subscription Plans Section
function renderSubscriptionPlans() {
  const container = document.getElementById('subscription-plans-container');
  if (!container) return;

  container.innerHTML = MENU_DATA.subscriptionPlans.map(plan => `
    <div class="relative bg-white rounded-3xl p-6 border-2 transition duration-300 flex flex-col justify-between ${
      plan.popular ? 'border-amber-400 shadow-xl scale-[1.02]' : 'border-zinc-100 shadow-sm hover:border-zinc-300'
    }">
      ${plan.popular ? `
        <div class="absolute -top-3.5 left-1/2 transform -translate-x-1/2 bg-amber-400 text-zinc-950 font-extrabold text-xs px-4 py-1 rounded-full uppercase tracking-wider shadow-sm">
          ${plan.tag}
        </div>
      ` : ''}

      <div>
        <div class="flex items-center justify-between mb-4">
          <div>
            <span class="text-xs font-bold text-zinc-400 uppercase tracking-wider">${plan.tag}</span>
            <h3 class="text-2xl font-black text-zinc-900">${plan.name}</h3>
          </div>
          <div class="text-right">
            <span class="text-3xl font-black text-zinc-950">₹${plan.pricePerDay}</span>
            <span class="text-xs text-zinc-500 block">/ day</span>
          </div>
        </div>

        <p class="text-zinc-600 text-xs leading-relaxed mb-6">${plan.description}</p>

        <div class="space-y-3 pt-4 border-t border-zinc-100 mb-8">
          ${plan.features.map(f => `
            <div class="flex items-center gap-2.5 text-xs text-zinc-700 font-medium">
              <div class="w-4 h-4 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0">
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path></svg>
              </div>
              <span>${f}</span>
            </div>
          `).join('')}
        </div>
      </div>

      <button onclick="handleAddPlanToCart('${plan.id}')" class="w-full py-3.5 rounded-xl font-bold text-sm transition duration-200 flex items-center justify-center gap-2 ${
        plan.popular ? 'bg-amber-400 hover:bg-amber-500 text-zinc-950 shadow-md' : 'bg-zinc-900 hover:bg-zinc-800 text-white'
      }">
        ${plan.cta}
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
      </button>
    </div>
  `).join('');
}

// Render Interactive Delivery Calendar (Mock for Office Absence Feature)
function renderCalendar() {
  const container = document.getElementById('demo-calendar-days');
  if (!container) return;

  const days = [];
  // Generate September 2026 calendar days
  for (let i = 1; i <= 30; i++) {
    let status = 'upcoming';
    if (i <= 14) status = 'delivered';
    if (i === 15) status = 'today';
    if (i === 19 || i === 20 || i === 26 || i === 27) status = 'weekend';
    if (i === 22 || i === 25) status = 'paused';

    days.push({ day: i, status });
  }

  container.innerHTML = days.map(d => {
    let classes = "w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold cursor-pointer transition ";
    if (d.status === 'delivered') classes += "bg-emerald-100 text-emerald-800";
    else if (d.status === 'today') classes += "bg-amber-400 text-zinc-950 ring-2 ring-amber-500 font-bold";
    else if (d.status === 'paused') classes += "bg-amber-100 text-amber-800 line-through font-bold";
    else if (d.status === 'weekend') classes += "text-zinc-300 hover:bg-zinc-100";
    else classes += "text-zinc-700 hover:bg-amber-50";

    return `<button type="button" onclick="toggleCalendarDate(${d.day})" class="${classes}" title="Day ${d.day} - ${d.status}">${d.day}</button>`;
  }).join('');
}

window.toggleCalendarDate = function(day) {
  app.showToast(`Updated delivery status for Sept ${day}: Toggled Pause/Active`, 'info');
};

// Render Reviews Section
function renderReviews() {
  const container = document.getElementById('testimonials-container');
  if (!container) return;

  container.innerHTML = MENU_DATA.reviews.map(r => `
    <div class="bg-white rounded-2xl p-6 border border-zinc-100 shadow-sm hover:shadow-md transition" data-aos="fade-up">
      <div class="flex items-center gap-1 text-amber-400 mb-3">
        ${Array(r.rating).fill(0).map(() => `<svg class="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>`).join('')}
      </div>
      <p class="text-zinc-700 text-sm italic mb-6 leading-relaxed">"${r.comment}"</p>
      <div class="flex items-center gap-3">
        <img src="${r.avatar}" alt="${r.name}" class="w-10 h-10 rounded-full object-cover border border-amber-300" />
        <div>
          <h4 class="text-sm font-bold text-zinc-900">${r.name}</h4>
          <p class="text-xs text-zinc-400">${r.role}</p>
        </div>
      </div>
    </div>
  `).join('');
}

// Render Cart Page
function renderCartPage() {
  const container = document.getElementById('cart-items-container');
  const summaryContainer = document.getElementById('cart-summary-container');
  const emptyState = document.getElementById('cart-empty-state');
  const cartContent = document.getElementById('cart-content-wrapper');

  if (!container) return;

  if (app.cart.length === 0) {
    if (emptyState) emptyState.classList.remove('hidden');
    if (cartContent) cartContent.classList.add('hidden');
    return;
  }

  if (emptyState) emptyState.classList.add('hidden');
  if (cartContent) cartContent.classList.remove('hidden');

  container.innerHTML = app.cart.map(item => `
    <div class="flex items-center gap-4 py-4 border-b border-zinc-100 last:border-0">
      <img src="${item.image}" alt="${item.name}" class="w-20 h-20 rounded-xl object-cover flex-shrink-0" />
      
      <div class="flex-1 min-w-0">
        <div class="flex items-center gap-2 mb-1">
          <span class="text-xs px-2 py-0.5 rounded bg-zinc-100 text-zinc-600 font-semibold">${item.category}</span>
        </div>
        <h4 class="text-base font-bold text-zinc-900 truncate">${item.name}</h4>
        <div class="text-sm font-extrabold text-zinc-900 mt-1">₹${item.price}</div>
      </div>

      <div class="flex items-center gap-2">
        <button onclick="app.updateQuantity('${item.id}', -1)" class="w-8 h-8 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-800 flex items-center justify-center font-bold text-base transition">
          -
        </button>
        <span class="w-8 text-center font-bold text-sm text-zinc-900">${item.quantity}</span>
        <button onclick="app.updateQuantity('${item.id}', 1)" class="w-8 h-8 rounded-lg bg-amber-400 hover:bg-amber-500 text-zinc-950 flex items-center justify-center font-bold text-base transition">
          +
        </button>
      </div>

      <div class="text-right min-w-[70px]">
        <span class="font-extrabold text-base text-zinc-950">₹${item.price * item.quantity}</span>
        <button onclick="app.removeFromCart('${item.id}')" class="block text-xs text-red-500 hover:text-red-700 font-semibold mt-1">
          Remove
        </button>
      </div>
    </div>
  `).join('');

  const subtotal = app.getCartSubtotal();
  const discount = app.getDiscount();
  const delivery = app.getDeliveryFee();
  const gst = Math.round((subtotal - discount) * 0.05);
  const grandTotal = app.getCartGrandTotal();

  if (summaryContainer) {
    summaryContainer.innerHTML = `
      <div class="bg-white rounded-3xl p-6 border border-zinc-100 shadow-sm space-y-4">
        <h3 class="text-lg font-bold text-zinc-900 pb-3 border-b border-zinc-100">Order Summary</h3>

        <!-- Coupon input -->
        <div class="flex gap-2">
          <input type="text" id="coupon-code-input" placeholder="Promo code (e.g. RAYALA10)" class="flex-1 px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs uppercase font-semibold focus:outline-none focus:border-amber-400" value="${app.appliedCoupon ? app.appliedCoupon.code : ''}" />
          <button onclick="applyCouponCode()" class="px-4 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-amber-400 font-bold text-xs rounded-xl transition">
            ${app.appliedCoupon ? 'Applied' : 'Apply'}
          </button>
        </div>
        ${app.appliedCoupon ? `<p class="text-xs text-emerald-600 font-semibold">✓ Promo code <strong>${app.appliedCoupon.code}</strong> applied (${app.appliedCoupon.label})</p>` : ''}

        <div class="space-y-2.5 text-sm pt-2">
          <div class="flex justify-between text-zinc-600">
            <span>Subtotal</span>
            <span class="font-bold text-zinc-900">₹${subtotal}</span>
          </div>
          ${discount > 0 ? `
            <div class="flex justify-between text-emerald-600 font-semibold">
              <span>Discount</span>
              <span>-₹${discount}</span>
            </div>
          ` : ''}
          <div class="flex justify-between text-zinc-600">
            <span>Delivery Fee</span>
            <span>${delivery === 0 ? '<span class="text-emerald-600 font-bold">FREE</span>' : `₹${delivery}`}</span>
          </div>
          <div class="flex justify-between text-zinc-600">
            <span>Estimated GST (5%)</span>
            <span class="font-bold text-zinc-900">₹${gst}</span>
          </div>

          <div class="pt-3 border-t border-zinc-100 flex justify-between items-baseline">
            <span class="text-base font-extrabold text-zinc-950">Grand Total</span>
            <span class="text-2xl font-black text-amber-600">₹${grandTotal}</span>
          </div>
        </div>

        <button onclick="openCheckoutModal()" class="w-full py-4 bg-amber-400 hover:bg-amber-500 active:scale-95 text-zinc-950 font-extrabold rounded-2xl text-base transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2">
          Proceed to Checkout
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
        </button>

        <p class="text-[11px] text-center text-zinc-400">Guaranteed Fresh Delivery • 100% Hygienic Kitchen</p>
      </div>
    `;
  }
}

// Coupon Logic
window.applyCouponCode = function() {
  const input = document.getElementById('coupon-code-input');
  if (!input) return;
  const code = input.value.trim().toUpperCase();

  if (code === 'RAYALA10' || code === 'FIRSTBOWL') {
    app.appliedCoupon = { code: code, type: 'percent', value: 10, label: '10% OFF' };
    app.showToast('Coupon applied: 10% OFF your order!', 'success');
  } else if (code === 'TRIAL50') {
    app.appliedCoupon = { code: code, type: 'flat', value: 50, label: '₹50 OFF' };
    app.showToast('Coupon applied: ₹50 OFF!', 'success');
  } else {
    app.showToast('Invalid coupon code. Try RAYALA10', 'error');
  }
  renderCartPage();
};

// Render User Dashboard (matching the right-side panel from mockup)
function renderDashboardView() {
  const container = document.getElementById('customer-dashboard-container');
  if (!container) return;

  const user = app.user;
  const sub = user.activeSubscription;

  container.innerHTML = `
    <div class="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Left sidebar summary -->
      <div class="bg-white rounded-3xl p-6 border border-zinc-100 shadow-sm space-y-6">
        <div class="flex items-center gap-4">
          <div class="w-14 h-14 rounded-full bg-amber-400 text-zinc-950 font-extrabold text-xl flex items-center justify-center border-2 border-amber-300">
            RK
          </div>
          <div>
            <h3 class="text-lg font-bold text-zinc-900">${user.name}</h3>
            <span class="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">Active Subscriber</span>
          </div>
        </div>

        <div class="space-y-2 text-xs text-zinc-600 border-t border-zinc-100 pt-4">
          <div class="flex justify-between py-1">
            <span class="text-zinc-400">Phone</span>
            <span class="font-semibold text-zinc-800">${user.phone}</span>
          </div>
          <div class="flex justify-between py-1">
            <span class="text-zinc-400">Email</span>
            <span class="font-semibold text-zinc-800">${user.email}</span>
          </div>
          <div class="pt-2">
            <span class="text-zinc-400 block mb-1">Delivery Address</span>
            <span class="font-semibold text-zinc-800 block">${user.address}</span>
          </div>
        </div>

        <div class="pt-4 border-t border-zinc-100 space-y-2">
          <button onclick="togglePauseTomorrow()" id="btn-pause-tomorrow" class="w-full py-2.5 bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold rounded-xl text-xs transition flex items-center justify-center gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            Pause Tomorrow's Bowl
          </button>
          <a href="#categories" class="w-full py-2.5 bg-zinc-900 hover:bg-zinc-800 text-amber-400 font-bold rounded-xl text-xs transition flex items-center justify-center gap-2">
            Order Additional Bowl
          </a>
        </div>
      </div>

      <!-- Main Dashboard Details -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Active Subscription Card -->
        <div class="bg-gradient-to-br from-emerald-900 to-zinc-900 text-white rounded-3xl p-6 shadow-lg relative overflow-hidden">
          <div class="relative z-10">
            <div class="flex items-center justify-between mb-4">
              <div>
                <span class="text-xs text-emerald-300 font-bold uppercase tracking-wider">Your Active Subscription</span>
                <h3 class="text-2xl font-bold">${sub.planName}</h3>
              </div>
              <span class="bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs px-3 py-1 rounded-full font-bold">
                ${sub.status}
              </span>
            </div>

            <div class="grid grid-cols-3 gap-4 my-6 py-4 border-y border-white/10 text-center">
              <div>
                <span class="text-2xl font-black text-amber-400">${sub.totalDays}</span>
                <span class="text-xs text-zinc-300 block">Total Days</span>
              </div>
              <div>
                <span class="text-2xl font-black text-white">${sub.usedDays}</span>
                <span class="text-xs text-zinc-300 block">Used Days</span>
              </div>
              <div>
                <span class="text-2xl font-black text-emerald-400">${sub.remainingDays}</span>
                <span class="text-xs text-zinc-300 block">Days Left</span>
              </div>
            </div>

            <!-- Progress Bar -->
            <div class="space-y-1.5">
              <div class="flex justify-between text-xs text-zinc-300">
                <span>Progress</span>
                <span>${Math.round((sub.usedDays / sub.totalDays) * 100)}% Completed</span>
              </div>
              <div class="w-full h-2.5 bg-white/20 rounded-full overflow-hidden">
                <div class="h-full bg-amber-400 rounded-full transition-all" style="width: ${(sub.usedDays / sub.totalDays) * 100}%"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Next Delivery & Recent Orders -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="bg-white rounded-3xl p-6 border border-zinc-100 shadow-sm">
            <div class="flex items-center justify-between mb-3">
              <h4 class="font-bold text-zinc-900">Next Scheduled Delivery</h4>
              <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            </div>
            <div class="bg-amber-50 rounded-2xl p-4 border border-amber-200/60 mb-4">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-amber-400 text-zinc-950 flex items-center justify-center font-bold">
                  🥣
                </div>
                <div>
                  <h5 class="text-sm font-bold text-zinc-900">Rayalaseema Paneer Bowl</h5>
                  <p class="text-xs text-zinc-600">${sub.nextDelivery}</p>
                </div>
              </div>
            </div>
            <p class="text-xs text-zinc-500">Delivery Boy Assigned: <strong>Venkatesh (RCK Express)</strong></p>
          </div>

          <div class="bg-white rounded-3xl p-6 border border-zinc-100 shadow-sm">
            <h4 class="font-bold text-zinc-900 mb-4">Past Deliveries</h4>
            <div class="space-y-3">
              <div class="flex items-center justify-between text-xs py-1.5 border-b border-zinc-100">
                <div>
                  <span class="font-bold text-zinc-800 block">Veg High-Fiber Bowl</span>
                  <span class="text-zinc-400">14 Sep 2026</span>
                </div>
                <span class="text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded">Delivered</span>
              </div>
              <div class="flex items-center justify-between text-xs py-1.5 border-b border-zinc-100">
                <div>
                  <span class="font-bold text-zinc-800 block">Exotic Fruit Crunch</span>
                  <span class="text-zinc-400">13 Sep 2026</span>
                </div>
                <span class="text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded">Delivered</span>
              </div>
              <div class="flex items-center justify-between text-xs py-1.5">
                <div>
                  <span class="font-bold text-zinc-800 block">Sprouted Moong Power</span>
                  <span class="text-zinc-400">12 Sep 2026</span>
                </div>
                <span class="text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded">Delivered</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

window.togglePauseTomorrow = function() {
  const user = app.user;
  const isPaused = user.activeSubscription.nextDelivery.includes('Paused');
  if (isPaused) {
    user.activeSubscription.nextDelivery = "Tomorrow (12:30 PM)";
    app.showToast("Resumed tomorrow's meal delivery! See you at 12:30 PM.", "success");
  } else {
    user.activeSubscription.nextDelivery = "Paused for Tomorrow (Resumes Day After)";
    app.showToast("Paused tomorrow's delivery. Your remaining balance is preserved!", "info");
  }
  app.saveUser();
  renderDashboardView();
};

// Login Form Handling
function initLoginForm() {
  const loginForm = document.getElementById('auth-form');
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('auth-email').value;
      app.user.email = email || app.user.email;
      app.user.isLoggedIn = true;
      app.saveUser();
      app.showToast('Login successful! Welcome back, Rahul.', 'success');
      window.location.hash = '#dashboard';
    });
  }
}

// Service Enquiry Modal Handling
function initEnquiryModal() {
  const modal = document.getElementById('enquiry-modal');
  const closeBtn = document.getElementById('close-enquiry-modal');
  const form = document.getElementById('enquiry-form');

  window.openEnquiryModal = function(serviceTitle) {
    if (modal) {
      document.getElementById('enquiry-service-name').value = serviceTitle || "General Service Enquiry";
      modal.classList.remove('hidden');
    }
  };

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      modal.classList.add('hidden');
    });
  }

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      modal.classList.add('hidden');
      app.showToast('Thank you! Our catering manager will call you within 15 minutes.', 'success');
      form.reset();
    });
  }
}

// Checkout Modal Handling
function initCheckoutModal() {
  const modal = document.getElementById('checkout-modal');
  const closeBtn = document.getElementById('close-checkout-modal');
  const form = document.getElementById('checkout-form');

  window.openCheckoutModal = function() {
    if (app.cart.length === 0) {
      app.showToast('Your cart is empty!', 'error');
      return;
    }
    if (modal) {
      document.getElementById('checkout-total-display').textContent = `₹${app.getCartGrandTotal()}`;
      modal.classList.remove('hidden');
    }
  };

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      modal.classList.add('hidden');
    });
  }

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      modal.classList.add('hidden');
      const orderId = 'RCK-' + Math.floor(100000 + Math.random() * 900000);
      app.clearCart();
      
      const successModal = document.getElementById('order-success-modal');
      if (successModal) {
        document.getElementById('success-order-id').textContent = orderId;
        successModal.classList.remove('hidden');
      } else {
        app.showToast(`Order #${orderId} placed successfully!`, 'success');
        window.location.hash = '#home';
      }
    });
  }
}
