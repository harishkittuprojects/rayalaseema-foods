// Rayalaseema Cloud Kitchen - Central Application Logic & State Engine

class AppState {
  constructor() {
    this.cart = this.loadCart();
    this.user = this.loadUser();
    this.orders = this.loadOrders();
    this.savedAddresses = this.loadAddresses();
    this.subscriptions = this.loadSubscriptions();
    this.simulatedTimeMode = localStorage.getItem('rck_time_mode') || 'before'; // 'before' (3:30 PM) | 'after' (6:15 PM) | 'real'
    this.cardQuantities = {};
    this.activeBuyNowItem = null;
    this.activeCheckoutMode = 'cart'; // 'cart' or 'buy_now'
    this.currentFilter = 'all';
    this.searchQuery = '';
    this.appliedCoupon = null;
    this.deliveryFee = 30;
    this.freeDeliveryThreshold = 300;
    this.activeAccountTab = 'orders';
  }

  loadCart() {
    try {
      const saved = localStorage.getItem('rck_cart');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  }

  saveCart() {
    localStorage.setItem('rck_cart', JSON.stringify(this.cart));
    this.updateCartUI();
  }

  loadUser() {
    try {
      const saved = localStorage.getItem('rck_user');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.activeSubscription) {
          // Normalise and ensure 10-day plan fields exist
          if (parsed.activeSubscription.totalDays === undefined) parsed.activeSubscription.totalDays = 10;
          if (parsed.activeSubscription.consumedDays === undefined) {
            parsed.activeSubscription.consumedDays = parsed.activeSubscription.usedDays !== undefined ? parsed.activeSubscription.usedDays : 1;
          }
          if (parsed.activeSubscription.remainingDays === undefined) {
            parsed.activeSubscription.remainingDays = parsed.activeSubscription.totalDays - parsed.activeSubscription.consumedDays;
          }
          if (parsed.activeSubscription.pausedDates === undefined) parsed.activeSubscription.pausedDates = [];
          if (parsed.activeSubscription.isPausedTomorrow === undefined) parsed.activeSubscription.isPausedTomorrow = false;
          if (parsed.activeSubscription.pauseCutoff === undefined) parsed.activeSubscription.pauseCutoff = "5:30 PM";
          if (!parsed.activeSubscription.nextDelivery) {
            parsed.activeSubscription.nextDelivery = parsed.activeSubscription.isPausedTomorrow ? "Resumes Day After Tomorrow (12:30 PM)" : "Tomorrow (12:30 PM)";
          }
        }
        return parsed;
      }
      return {
        isLoggedIn: true,
        name: "Rahul Kumar",
        phone: "+91 98765 43210",
        email: "rahul.kumar@hitec-tech.com",
        dietPreference: "Balanced / Mixed",
        address: "Tower 4, Mindspace IT Park, Hitec City, Hyderabad - 500081",
        activeSubscription: {
          id: "SUB-10D-89421",
          planId: "plan-trial",
          planName: "10-Day Food Subscription Plan",
          planType: "Authentic Daily Lunch (Veg & Non-Veg)",
          mealType: "Rayalaseema Deluxe Veg Full Meal",
          totalDays: 10,
          consumedDays: 1, // Consumed today -> 1
          remainingDays: 9, // Exactly 10 - 1 = 9 guaranteed
          status: "Active", // "Active" | "Paused for Tomorrow" | "Completed"
          isPausedTomorrow: false,
          pauseCutoff: "5:30 PM",
          nextDelivery: "Tomorrow (12:30 PM)",
          nextDeliveryDate: "Tomorrow (12:30 PM)",
          pausedDates: [],
          history: [
            { dayNumber: 1, date: "19 Sep 2026", status: "Delivered & Consumed", meal: "Rayalaseema Deluxe Veg Full Meal", note: "Day 1 consumed (1/10 consumed, 9 remaining)" }
          ]
        }
      };
    } catch (e) {
      return { isLoggedIn: true, name: "Customer", phone: "+91 98765 43210", email: "user@example.com" };
    }
  }

  saveUser() {
    localStorage.setItem('rck_user', JSON.stringify(this.user));
    this.updateUserUI();
  }

  loadSubscriptions() {
    try {
      const saved = localStorage.getItem('rck_subscriptions');
      return saved ? JSON.parse(saved) : (MENU_DATA.initialSubscriptions || []);
    } catch (e) {
      return MENU_DATA.initialSubscriptions || [];
    }
  }

  saveSubscriptions() {
    localStorage.setItem('rck_subscriptions', JSON.stringify(this.subscriptions));
  }

  canPauseTomorrow() {
    if (this.simulatedTimeMode === 'before') {
      return { allowed: true, timeStr: "3:30 PM", label: "3:30 PM (Before 5:30 PM Cutoff)", reason: "Pause allowed before 5:30 PM cutoff" };
    }
    if (this.simulatedTimeMode === 'after') {
      return { allowed: false, timeStr: "6:15 PM", label: "6:15 PM (After 5:30 PM Cutoff)", reason: "5:30 PM kitchen prep cutoff has passed for tomorrow" };
    }
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const isBefore = (hours < 17 || (hours === 17 && minutes < 30));
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return {
      allowed: isBefore,
      timeStr: timeStr,
      label: `${timeStr} (${isBefore ? 'Before' : 'After'} 5:30 PM)`,
      reason: isBefore ? "Pause allowed before 5:30 PM cutoff" : "5:30 PM kitchen prep cutoff has passed for tomorrow"
    };
  }

  setTimeMode(mode) {
    this.simulatedTimeMode = mode;
    localStorage.setItem('rck_time_mode', mode);
    this.showToast(`Simulation Clock set to: ${mode === 'before' ? '3:30 PM (Before 5:30 PM)' : mode === 'after' ? '6:15 PM (After 5:30 PM)' : 'Real Device Clock'}`, 'info');
    renderAccountPause();
    renderAccountPlans();
  }

  loadOrders() {
    try {
      const saved = localStorage.getItem('rck_orders');
      return saved ? JSON.parse(saved) : (MENU_DATA.initialOrders || []);
    } catch (e) {
      return MENU_DATA.initialOrders || [];
    }
  }

  saveOrders() {
    localStorage.setItem('rck_orders', JSON.stringify(this.orders));
    this.updateOrdersUI();
  }

  loadAddresses() {
    try {
      const saved = localStorage.getItem('rck_addresses');
      return saved ? JSON.parse(saved) : (MENU_DATA.initialAddresses || []);
    } catch (e) {
      return MENU_DATA.initialAddresses || [];
    }
  }

  saveAddresses() {
    localStorage.setItem('rck_addresses', JSON.stringify(this.savedAddresses));
  }

  getCardQty(productId) {
    return this.cardQuantities[productId] || 1;
  }

  setCardQty(productId, qty) {
    this.cardQuantities[productId] = Math.max(1, Math.min(20, qty));
    const qtyDisplays = document.querySelectorAll(`.card-qty-display-${productId}`);
    qtyDisplays.forEach(el => {
      el.textContent = this.cardQuantities[productId];
    });
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
        category: item.categoryName || item.category || "Meal",
        isVeg: item.isVeg !== undefined ? item.isVeg : true,
        quantity: quantity
      });
    }
    this.saveCart();
    this.showToast(`Added ${quantity} × ${item.name} to cart!`, 'success');
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
    const subtotal = this.activeCheckoutMode === 'buy_now' && this.activeBuyNowItem ?
      (this.activeBuyNowItem.price * this.activeBuyNowItem.quantity) :
      this.getCartSubtotal();

    if (this.appliedCoupon.type === 'percent') {
      return Math.round((subtotal * this.appliedCoupon.value) / 100);
    }
    return Math.min(subtotal, this.appliedCoupon.value);
  }

  getDeliveryFee() {
    const subtotal = this.activeCheckoutMode === 'buy_now' && this.activeBuyNowItem ?
      (this.activeBuyNowItem.price * this.activeBuyNowItem.quantity) :
      this.getCartSubtotal();

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
    const gst = Math.round((subtotal - discount) * 0.05); // 5% GST
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
      renderCartPage();
    }
  }

  updateUserUI() {
    const avatarEl = document.getElementById('nav-user-avatar');
    const labelEl = document.getElementById('nav-user-label');
    const bannerAvatar = document.getElementById('account-banner-avatar');
    const bannerName = document.getElementById('account-banner-name');
    const bannerContact = document.getElementById('account-banner-contact');

    const initials = this.user.name ? this.user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'ME';

    if (avatarEl) avatarEl.textContent = initials;
    if (labelEl) labelEl.textContent = this.user.isLoggedIn ? this.user.name.split(' ')[0] : 'Login';
    if (bannerAvatar) bannerAvatar.textContent = initials;
    if (bannerName) bannerName.textContent = this.user.name;
    if (bannerContact) bannerContact.textContent = `${this.user.email} • ${this.user.phone}`;
  }

  updateOrdersUI() {
    const ordersBadge = document.getElementById('account-orders-badge');
    if (ordersBadge) {
      ordersBadge.textContent = this.orders.length;
    }
    if (this.activeAccountTab === 'orders') {
      renderOrdersList();
    }
  }

  showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl text-xs sm:text-sm font-semibold transition-all transform duration-300 ${
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
  initEnquiryModal();
  app.updateCartUI();
  app.updateUserUI();
  app.updateOrdersUI();

  // Initialize AOS if available
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 650,
      once: true,
      easing: 'ease-out-cubic',
      offset: 50
    });
  }
});

// Single Page Application Router
function initRouter() {
  const mainViews = ['home', 'about', 'categories', 'services', 'cart', 'account'];
  const homeSections = ['about-section', 'our-bowls-section', 'trial-banner', 'how-it-works-section', 'plans-section', 'catering-section', 'reviews-section'];

  window.navigateTo = function(target, filterCategory = null) {
    if (filterCategory) {
      window.setCategoryFilter(filterCategory);
    }

    // Direct Section Scroll inside Home
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

    if (target === 'login' || target === 'orders') {
      showView('account');
      if (target === 'orders') {
        switchAccountTab('orders');
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
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
    } else if (viewName === 'account') {
      renderAccountView();
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

    if (hash === 'orders') {
      showView('account');
      switchAccountTab('orders');
      return;
    }

    if (hash === 'login') {
      showView('account');
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

// ==================== PRODUCT CARD RENDERING & HANDLERS ====================

function createProductCardHtml(product) {
  const qty = app.getCardQty(product.id);
  const isVegIcon = product.isVeg ? 
    `<span class="veg-indicator" title="Vegetarian"><span class="veg-indicator-dot"></span></span>` :
    `<span class="non-veg-indicator" title="Non-Vegetarian"><span class="non-veg-indicator-triangle"></span></span>`;

  return `
    <div class="food-card bg-white rounded-3xl border border-zinc-200/80 overflow-hidden shadow-sm hover:border-amber-300 flex flex-col justify-between" data-aos="fade-up">
      <div class="relative overflow-hidden group aspect-[16/10] sm:aspect-auto sm:h-52 bg-zinc-100">
        <img src="${product.image}" alt="${product.name}" class="w-full h-full object-cover object-center group-hover:scale-105 transition duration-500" loading="lazy" />
        
        <div class="absolute top-3 left-3 flex gap-2 items-center">
          <span class="bg-white/95 backdrop-blur px-2.5 py-1 rounded-xl text-xs font-bold text-zinc-900 shadow-sm flex items-center gap-1.5">
            ${isVegIcon}
            ${product.categoryName}
          </span>
          ${product.popular ? `<span class="bg-amber-400 text-zinc-950 font-extrabold text-xs px-2.5 py-1 rounded-xl shadow-sm">Popular</span>` : ''}
        </div>

        <div class="absolute bottom-3 right-3 bg-zinc-950/80 backdrop-blur text-white text-xs font-semibold px-2.5 py-1 rounded-xl">
          ${product.protein} • ${product.calories}
        </div>
      </div>

      <div class="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <div class="flex items-center justify-between mb-1.5">
            <h3 class="text-base sm:text-lg font-black text-zinc-900 line-clamp-1">${product.name}</h3>
          </div>
          <p class="text-zinc-500 text-xs leading-relaxed line-clamp-2">${product.description}</p>
        </div>

        <div class="space-y-3 pt-3 border-t border-zinc-100">
          <!-- Price & Quantity Selector -->
          <div class="flex items-center justify-between">
            <div>
              <div class="flex items-baseline gap-1.5">
                <span class="text-xl font-black text-zinc-950">₹${product.price}</span>
                ${product.originalPrice ? `<span class="text-xs text-zinc-400 line-through">₹${product.originalPrice}</span>` : ''}
              </div>
              <span class="text-[11px] text-emerald-700 font-bold block">100% Fresh Morning Batch</span>
            </div>

            <!-- Quantity Controls -->
            <div class="flex items-center gap-1 bg-zinc-100 p-1 rounded-xl border border-zinc-200/80">
              <button type="button" onclick="handleCardQtyChange('${product.id}', -1)" class="qty-btn" aria-label="Decrease Quantity">-</button>
              <span class="qty-value card-qty-display-${product.id}">${qty}</span>
              <button type="button" onclick="handleCardQtyChange('${product.id}', 1)" class="qty-btn" aria-label="Increase Quantity">+</button>
            </div>
          </div>

          <!-- Action Buttons: Buy Now & Add to Cart -->
          <div class="grid grid-cols-2 gap-2 food-card-actions">
            <button type="button" onclick="handleAddToCartFromCard('${product.id}')" class="w-full py-2.5 bg-amber-100 hover:bg-amber-200 active:scale-95 text-zinc-950 font-extrabold rounded-xl text-xs transition flex items-center justify-center gap-1.5 cursor-pointer shadow-sm">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
              <span>Add to Cart</span>
            </button>

            <button type="button" onclick="handleBuyNow('${product.id}')" class="btn-buy-now w-full py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow">
              <span>Buy Now</span>
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}

// Render Featured Products on Home Page
function renderFeaturedProducts() {
  const container = document.getElementById('featured-products-container');
  if (!container) return;

  const featured = MENU_DATA.products.filter(p => p.popular).slice(0, 6);
  container.innerHTML = featured.map(product => createProductCardHtml(product)).join('');
}

// Render Categories Grid with Search and Filter
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
      <div class="col-span-full py-16 text-center bg-white rounded-3xl border border-zinc-100 p-8 shadow-sm">
        <div class="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4 text-amber-600">
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
        </div>
        <h3 class="text-xl font-bold text-zinc-900 mb-1">No meals found</h3>
        <p class="text-zinc-500 text-sm mb-4">Try searching with a different term or reset your category filter.</p>
        <button onclick="clearSearchAndFilter()" class="px-6 py-2.5 bg-amber-400 hover:bg-amber-500 text-zinc-950 font-bold rounded-xl text-xs transition">
          Reset Filter & Search
        </button>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(product => createProductCardHtml(product)).join('');
}

// Card Quantity & Ordering Event Handlers
window.handleCardQtyChange = function(productId, delta) {
  const current = app.getCardQty(productId);
  app.setCardQty(productId, current + delta);
};

window.handleAddToCartFromCard = function(productId) {
  const product = MENU_DATA.products.find(p => p.id === productId);
  if (product) {
    const qty = app.getCardQty(productId);
    app.addToCart(product, qty);
  }
};

window.handleBuyNow = function(productId) {
  const product = MENU_DATA.products.find(p => p.id === productId);
  if (!product) return;

  const qty = app.getCardQty(productId);
  app.activeCheckoutMode = 'buy_now';
  app.activeBuyNowItem = {
    id: product.id,
    name: product.name,
    price: product.price,
    image: product.image,
    category: product.categoryName,
    isVeg: product.isVeg,
    quantity: qty
  };

  openCheckoutModal('buy_now');
};

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

// ==================== CHECKOUT & BUY NOW ORDER ENGINE ====================

window.openCheckoutModal = function(mode = 'cart') {
  app.activeCheckoutMode = mode;
  const modal = document.getElementById('checkout-modal');
  if (!modal) return;

  if (mode === 'cart' && app.cart.length === 0) {
    app.showToast('Your cart is empty! Please add a meal first.', 'error');
    return;
  }

  // Set Modal title and tags
  const flowTag = document.getElementById('checkout-flow-tag');
  const modalTitle = document.getElementById('checkout-modal-title');
  if (flowTag) {
    flowTag.textContent = mode === 'buy_now' ? '⚡ Instant Buy Now Checkout' : '🛒 Cart Checkout';
  }
  if (modalTitle) {
    modalTitle.textContent = mode === 'buy_now' ? 'Complete Your Meal Order' : 'Review & Confirm Order';
  }

  // Render Selected Items in Checkout
  const itemsPreview = document.getElementById('checkout-items-preview');
  let items = [];
  let subtotal = 0;

  if (mode === 'buy_now' && app.activeBuyNowItem) {
    items = [app.activeBuyNowItem];
    subtotal = app.activeBuyNowItem.price * app.activeBuyNowItem.quantity;
  } else {
    items = app.cart;
    subtotal = app.getCartSubtotal();
  }

  if (itemsPreview) {
    itemsPreview.innerHTML = `
      <div class="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Order Items (${items.reduce((s, i) => s + i.quantity, 0)} meals)</div>
      <div class="space-y-2 max-h-44 overflow-y-auto pr-1">
        ${items.map(item => `
          <div class="flex items-center justify-between gap-3 bg-white p-2.5 rounded-xl border border-zinc-200/80">
            <div class="flex items-center gap-2.5 min-w-0">
              <img src="${item.image}" alt="${item.name}" class="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
              <div class="min-w-0">
                <h4 class="text-xs font-bold text-zinc-900 truncate">${item.name}</h4>
                <span class="text-[11px] text-zinc-500">₹${item.price} × ${item.quantity} qty</span>
              </div>
            </div>
            <span class="text-xs font-extrabold text-zinc-950 whitespace-nowrap">₹${item.price * item.quantity}</span>
          </div>
        `).join('')}
      </div>
    `;
  }

  // Pre-fill user contact info
  const nameInput = document.getElementById('checkout-name');
  const phoneInput = document.getElementById('checkout-phone');
  const addressText = document.getElementById('checkout-address-text');
  const savedAddressSelect = document.getElementById('checkout-saved-address-select');

  if (nameInput) nameInput.value = app.user.name || '';
  if (phoneInput) phoneInput.value = app.user.phone || '';

  // Populate saved addresses dropdown
  if (savedAddressSelect) {
    savedAddressSelect.innerHTML = `
      <option value="">-- Choose from Saved Addresses --</option>
      ${app.savedAddresses.map(addr => `
        <option value="${addr.id}" ${addr.isDefault ? 'selected' : ''}>${addr.title} - ${addr.fullAddress.substring(0, 35)}...</option>
      `).join('')}
    `;

    const defaultAddr = app.savedAddresses.find(a => a.isDefault) || app.savedAddresses[0];
    if (defaultAddr && addressText) {
      addressText.value = defaultAddr.fullAddress;
    } else if (addressText) {
      addressText.value = app.user.address || '';
    }
  }

  // Populate Delivery Slots
  const slotSelect = document.getElementById('checkout-delivery-slot');
  if (slotSelect) {
    slotSelect.innerHTML = MENU_DATA.deliverySlots.map(s => `
      <option value="${s.label}" ${s.isDefault ? 'selected' : ''}>${s.label}</option>
    `).join('');
  }

  // Compute pricing breakdown
  const discount = app.getDiscount();
  const delivery = subtotal >= app.freeDeliveryThreshold ? 0 : app.deliveryFee;
  const gst = Math.round((subtotal - discount) * 0.05);
  const grandTotal = subtotal - discount + delivery + gst;

  const priceBreakdown = document.getElementById('checkout-price-breakdown');
  if (priceBreakdown) {
    priceBreakdown.innerHTML = `
      <div class="flex justify-between">
        <span>Items Subtotal</span>
        <span class="font-bold text-zinc-900">₹${subtotal}</span>
      </div>
      ${discount > 0 ? `
        <div class="flex justify-between text-emerald-600 font-bold">
          <span>Discount Applied</span>
          <span>-₹${discount}</span>
        </div>
      ` : ''}
      <div class="flex justify-between">
        <span>Delivery Fee</span>
        <span>${delivery === 0 ? '<span class="text-emerald-700 font-bold">FREE</span>' : `₹${delivery}`}</span>
      </div>
      <div class="flex justify-between">
        <span>Estimated GST (5%)</span>
        <span class="font-bold text-zinc-900">₹${gst}</span>
      </div>
      <div class="pt-2 border-t border-zinc-200 flex justify-between text-sm font-black text-zinc-950">
        <span>Total Payable</span>
        <span class="text-base text-amber-600">₹${grandTotal}</span>
      </div>
    `;
  }

  const submitTotal = document.getElementById('checkout-submit-total');
  if (submitTotal) {
    submitTotal.textContent = `₹${grandTotal}`;
  }

  modal.classList.remove('hidden');
};

window.closeCheckoutModal = function() {
  const modal = document.getElementById('checkout-modal');
  if (modal) modal.classList.add('hidden');
};

window.handleCheckoutAddressSelect = function(e) {
  const addrId = e.target.value;
  const addressText = document.getElementById('checkout-address-text');
  if (!addressText) return;

  if (addrId) {
    const selected = app.savedAddresses.find(a => a.id === addrId);
    if (selected) {
      addressText.value = selected.fullAddress;
    }
  }
};

window.handlePlaceOrder = function(e) {
  e.preventDefault();

  const name = document.getElementById('checkout-name').value.trim();
  const phone = document.getElementById('checkout-phone').value.trim();
  const address = document.getElementById('checkout-address-text').value.trim();
  const deliveryDate = document.getElementById('checkout-delivery-date').value;
  const deliverySlot = document.getElementById('checkout-delivery-slot').value;
  
  const paymentInputs = document.getElementsByName('checkout-payment');
  let paymentMethod = 'UPI / GPay / PhonePe';
  for (const p of paymentInputs) {
    if (p.checked) {
      paymentMethod = p.value;
      break;
    }
  }

  let orderedItems = [];
  let subtotal = 0;

  if (app.activeCheckoutMode === 'buy_now' && app.activeBuyNowItem) {
    orderedItems = [JSON.parse(JSON.stringify(app.activeBuyNowItem))];
    subtotal = app.activeBuyNowItem.price * app.activeBuyNowItem.quantity;
  } else {
    orderedItems = JSON.parse(JSON.stringify(app.cart));
    subtotal = app.getCartSubtotal();
  }

  if (orderedItems.length === 0) {
    app.showToast('No items to order!', 'error');
    return;
  }

  const discount = app.getDiscount();
  const deliveryFee = subtotal >= app.freeDeliveryThreshold ? 0 : app.deliveryFee;
  const gst = Math.round((subtotal - discount) * 0.05);
  const total = subtotal - discount + deliveryFee + gst;

  // Generate unique Order ID
  const orderId = 'RCK-' + Math.floor(100000 + Math.random() * 900000);
  const now = new Date();
  const formattedDate = now.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) + ', ' + 
                        now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  const newOrder = {
    id: orderId,
    createdAt: now.toISOString(),
    formattedDate: formattedDate,
    customer: {
      name: name,
      phone: phone,
      address: address
    },
    items: orderedItems,
    deliverySlot: deliverySlot,
    deliveryDate: deliveryDate,
    paymentMethod: paymentMethod,
    paymentStatus: paymentMethod.includes('Cash') ? 'Pay on Delivery' : 'Paid Online (Verified)',
    status: 'Order Placed',
    subtotal: subtotal,
    discount: discount,
    deliveryFee: deliveryFee,
    gst: gst,
    total: total,
    deliveryPartner: "Assigned after kitchen preparation (RCK Express)"
  };

  // Prepend new order
  app.orders.unshift(newOrder);
  app.saveOrders();

  // Check if ordered items contain a subscription plan
  const subPlanItem = orderedItems.find(i => i.id === 'plan-trial' || (i.categoryName && i.categoryName.includes('Subscription')) || (i.name && i.name.includes('10-Day')));
  if (subPlanItem) {
    const isTenDay = subPlanItem.id === 'plan-trial' || subPlanItem.name.includes('10-Day');
    const totalPlanDays = isTenDay ? 10 : 26;
    
    app.user.activeSubscription = {
      id: "SUB-10D-" + Math.floor(10000 + Math.random() * 90000),
      planId: subPlanItem.id,
      planName: isTenDay ? "10-Day Food Subscription Plan" : subPlanItem.name,
      planType: "Authentic Workday Lunch (Veg & Non-Veg)",
      mealType: "Rayalaseema Deluxe Veg Full Meal",
      totalDays: totalPlanDays,
      consumedDays: 1, // Day 1 Consumed Today
      remainingDays: totalPlanDays - 1, // 9 Days Remaining
      status: "Active",
      isPausedTomorrow: false,
      pauseCutoff: "5:30 PM",
      nextDelivery: "Tomorrow (12:30 PM)",
      nextDeliveryDate: "Tomorrow (12:30 PM)",
      pausedDates: [],
      history: [
        { dayNumber: 1, date: formattedDate.split(',')[0], status: "Delivered & Consumed", meal: "Rayalaseema Deluxe Veg Full Meal", note: `Day 1 consumed (1/${totalPlanDays} consumed, ${totalPlanDays - 1} remaining)` }
      ]
    };
    app.saveUser();

    // Push or sync to global subscriptions list
    const existingIdx = app.subscriptions.findIndex(s => s.id === app.user.activeSubscription.id || s.customerName === name);
    if (existingIdx !== -1) {
      app.subscriptions[existingIdx] = JSON.parse(JSON.stringify(app.user.activeSubscription));
    } else {
      app.subscriptions.unshift(JSON.parse(JSON.stringify(app.user.activeSubscription)));
    }
    app.saveSubscriptions();
  }

  // If order was placed from cart, clear cart
  if (app.activeCheckoutMode === 'cart') {
    app.clearCart();
  }
  app.activeBuyNowItem = null;

  // Close Checkout Modal
  closeCheckoutModal();

  // Open Order Confirmation Modal
  const successModal = document.getElementById('order-success-modal');
  const successOrderId = document.getElementById('success-order-id');
  const successOrderDetails = document.getElementById('success-order-details');

  if (successOrderId) successOrderId.textContent = `#${orderId}`;
  if (successOrderDetails) {
    successOrderDetails.innerHTML = `
      <div class="flex justify-between pb-1 border-b border-zinc-200">
        <span class="text-zinc-500">Scheduled Delivery:</span>
        <strong class="text-zinc-900">${deliveryDate} • ${deliverySlot}</strong>
      </div>
      <div class="flex justify-between pb-1 border-b border-zinc-200">
        <span class="text-zinc-500">Delivering To:</span>
        <span class="text-zinc-900 font-semibold text-right max-w-[200px] truncate">${address}</span>
      </div>
      <div class="flex justify-between pb-1 border-b border-zinc-200">
        <span class="text-zinc-500">Total Paid:</span>
        <strong class="text-amber-600 font-black">₹${total}</strong>
      </div>
      <div class="text-[11px] text-zinc-500 pt-1">
        📦 <strong>${orderedItems.length} items</strong>: ${orderedItems.map(i => `${i.quantity}× ${i.name}`).join(', ')}
      </div>
    `;
  }

  if (successModal) {
    successModal.classList.remove('hidden');
  } else {
    app.showToast(`Order #${orderId} placed successfully!`, 'success');
  }
};

window.handleViewOrderInAccount = function() {
  const successModal = document.getElementById('order-success-modal');
  if (successModal) successModal.classList.add('hidden');
  
  window.navigateTo('account');
  switchAccountTab('orders');
};

// ==================== ACCOUNT & "MY ORDERS" MANAGEMENT ====================

function renderAccountView() {
  const dashboardWrapper = document.getElementById('account-dashboard-wrapper');
  const authWrapper = document.getElementById('account-auth-wrapper');

  if (!app.user.isLoggedIn) {
    if (dashboardWrapper) dashboardWrapper.classList.add('hidden');
    if (authWrapper) authWrapper.classList.remove('hidden');
  } else {
    if (dashboardWrapper) dashboardWrapper.classList.remove('hidden');
    if (authWrapper) authWrapper.classList.add('hidden');
    
    app.updateUserUI();
    switchAccountTab(app.activeAccountTab || 'orders');
  }
}

window.switchAccountTab = function(tabName) {
  app.activeAccountTab = tabName;
  const subpanels = ['orders', 'profile', 'plans', 'pause', 'addresses'];

  // Toggle navigation button active styles
  subpanels.forEach(tab => {
    const btn = document.getElementById(`tab-nav-${tab}`);
    const panel = document.getElementById(`subpanel-${tab}`);
    if (btn) {
      if (tab === tabName) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    }
    if (panel) {
      if (tab === tabName) {
        panel.classList.remove('hidden');
      } else {
        panel.classList.add('hidden');
      }
    }
  });

  // Render content based on tab
  if (tabName === 'orders') {
    renderOrdersList();
  } else if (tabName === 'profile') {
    renderAccountProfile();
  } else if (tabName === 'plans') {
    renderAccountPlans();
  } else if (tabName === 'pause') {
    renderAccountPause();
  } else if (tabName === 'addresses') {
    renderAccountAddresses();
  }
};

function renderOrdersList() {
  const container = document.getElementById('account-orders-list');
  if (!container) return;

  if (app.orders.length === 0) {
    container.innerHTML = `
      <div class="bg-white rounded-3xl p-12 text-center border border-zinc-200/70 shadow-sm max-w-lg mx-auto">
        <div class="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-3 text-2xl">
          📦
        </div>
        <h3 class="text-xl font-bold text-zinc-900 mb-1">You haven't placed any orders yet</h3>
        <p class="text-zinc-500 text-xs mb-6">Enjoy our authentic, fresh Rayalaseema meals delivered right to your desk.</p>
        <button onclick="navigateTo('categories')" class="px-6 py-3 bg-amber-400 hover:bg-amber-500 text-zinc-950 font-black rounded-xl text-xs transition shadow cursor-pointer">
          Explore Signature Meals →
        </button>
      </div>
    `;
    return;
  }

  container.innerHTML = app.orders.map(order => {
    const statusCfg = MENU_DATA.orderStatuses[order.status] || MENU_DATA.orderStatuses["Order Placed"];
    const totalQty = order.items.reduce((s, i) => s + i.quantity, 0);

    return `
      <div class="bg-white rounded-3xl p-6 border border-zinc-200/80 shadow-sm hover:border-amber-300 transition duration-300 space-y-4">
        
        <!-- Header Info -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-zinc-100 gap-2">
          <div>
            <div class="flex items-center gap-2">
              <span class="text-base font-black text-zinc-950 font-heading">Order #${order.id}</span>
              <span class="status-pill ${statusCfg.color}">
                <span>${statusCfg.icon}</span>
                <span>${order.status}</span>
              </span>
            </div>
            <span class="text-[11px] text-zinc-400">Placed on ${order.formattedDate}</span>
          </div>

          <div class="text-left sm:text-right">
            <span class="text-xs text-zinc-400 block">Total Amount</span>
            <span class="text-lg font-black text-zinc-950">₹${order.total}</span>
          </div>
        </div>

        <!-- Ordered Items Summary Thumbnails -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          ${order.items.map(item => `
            <div class="flex items-center gap-3 bg-zinc-50 p-2.5 rounded-2xl border border-zinc-100">
              <img src="${item.image}" alt="${item.name}" class="w-12 h-12 rounded-xl object-cover flex-shrink-0" />
              <div class="min-w-0">
                <h4 class="text-xs font-bold text-zinc-900 truncate">${item.name}</h4>
                <div class="text-[11px] text-zinc-500">₹${item.price} × ${item.quantity} meal(s)</div>
              </div>
            </div>
          `).join('')}
        </div>

        <!-- Delivery & Payment Meta -->
        <div class="bg-zinc-50 rounded-2xl p-3 border border-zinc-100 text-xs text-zinc-600 grid grid-cols-1 sm:grid-cols-3 gap-2">
          <div>
            <span class="text-zinc-400 block text-[10px] uppercase font-bold">Delivery Slot</span>
            <span class="font-semibold text-zinc-800">${order.deliverySlot}</span>
          </div>
          <div>
            <span class="text-zinc-400 block text-[10px] uppercase font-bold">Payment Method</span>
            <span class="font-semibold text-zinc-800">${order.paymentMethod}</span>
          </div>
          <div>
            <span class="text-zinc-400 block text-[10px] uppercase font-bold">Address</span>
            <span class="font-semibold text-zinc-800 truncate block" title="${order.customer.address}">${order.customer.address}</span>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex flex-wrap items-center justify-between pt-2 gap-3">
          <button onclick="openOrderDetailsModal('${order.id}')" class="px-5 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-amber-400 font-bold text-xs rounded-xl transition flex items-center gap-1.5 shadow-sm cursor-pointer">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
            <span>View Full Details & Live Tracker</span>
          </button>

          <button onclick="handleReorder('${order.id}')" class="px-4 py-2.5 bg-amber-100 hover:bg-amber-200 text-zinc-950 font-bold text-xs rounded-xl transition flex items-center gap-1.5 cursor-pointer">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
            <span>Order Again</span>
          </button>
        </div>

      </div>
    `;
  }).join('');
}

window.openOrderDetailsModal = function(orderId) {
  const order = app.orders.find(o => o.id === orderId);
  if (!order) return;

  const modal = document.getElementById('order-details-modal');
  const content = document.getElementById('order-details-content');
  if (!modal || !content) return;

  const statusCfg = MENU_DATA.orderStatuses[order.status] || MENU_DATA.orderStatuses["Order Placed"];
  const currentStep = statusCfg.step || 1;

  const steps = [
    { title: "Order Placed", desc: "Received at Central Kitchen", icon: "📋", step: 1 },
    { title: "Confirmed", desc: "Ingredients prepped fresh", icon: "✅", step: 2 },
    { title: "Preparing", desc: "Cooked with cold-pressed oils", icon: "👨‍🍳", step: 3 },
    { title: "Out for Delivery", desc: "On the way in insulated hot box", icon: "🛵", step: 4 },
    { title: "Delivered", desc: "Enjoy your hot nutritious meal!", icon: "🎉", step: 5 }
  ];

  content.innerHTML = `
    <div class="space-y-6">
      <div>
        <div class="flex items-center gap-2">
          <span class="text-xs font-bold text-amber-600 uppercase tracking-widest">Order Details & Tracking</span>
        </div>
        <h3 class="text-2xl font-black text-zinc-950 mt-0.5">Order #${order.id}</h3>
        <p class="text-zinc-500 text-xs mt-0.5">Placed on ${order.formattedDate}</p>
      </div>

      <!-- Live Order Tracker Timeline -->
      <div class="bg-zinc-50 rounded-2xl p-5 border border-zinc-200/80">
        <h4 class="text-xs font-bold text-zinc-900 uppercase tracking-wider mb-4">Delivery Status Timeline</h4>
        <div class="space-y-4">
          ${steps.map(s => {
            const isCompleted = s.step <= currentStep;
            const isActive = s.step === currentStep;
            return `
              <div class="timeline-step ${isCompleted ? 'completed' : ''} ${isActive ? 'active' : ''} flex items-start gap-3">
                <div class="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm z-10 ${
                  isCompleted ? 'bg-emerald-600 text-white ring-4 ring-emerald-100' : 'bg-zinc-200 text-zinc-500'
                }">
                  ${s.icon}
                </div>
                <div>
                  <div class="text-xs font-bold ${isCompleted ? 'text-zinc-900' : 'text-zinc-400'}">${s.title}</div>
                  <div class="text-[11px] text-zinc-500">${s.desc}</div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>

      <!-- Items Breakdown -->
      <div class="space-y-2">
        <h4 class="text-xs font-bold text-zinc-900 uppercase tracking-wider">Ordered Items (${order.items.length})</h4>
        <div class="space-y-2">
          ${order.items.map(i => `
            <div class="flex items-center justify-between gap-3 bg-white p-3 rounded-xl border border-zinc-200/80">
              <div class="flex items-center gap-3">
                <img src="${i.image}" alt="${i.name}" class="w-12 h-12 rounded-xl object-cover" />
                <div>
                  <h5 class="text-xs font-bold text-zinc-900">${i.name}</h5>
                  <span class="text-[11px] text-zinc-500">₹${i.price} × ${i.quantity}</span>
                </div>
              </div>
              <span class="text-xs font-black text-zinc-950">₹${i.price * i.quantity}</span>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Receipt Breakdown -->
      <div class="bg-zinc-50 rounded-2xl p-4 border border-zinc-100 text-xs space-y-1.5 text-zinc-600">
        <div class="flex justify-between">
          <span>Subtotal</span>
          <span class="font-bold text-zinc-900">₹${order.subtotal}</span>
        </div>
        ${order.discount ? `
          <div class="flex justify-between text-emerald-600 font-bold">
            <span>Discount</span>
            <span>-₹${order.discount}</span>
          </div>
        ` : ''}
        <div class="flex justify-between">
          <span>Delivery Fee</span>
          <span>${order.deliveryFee === 0 ? '<span class="text-emerald-700 font-bold">FREE</span>' : `₹${order.deliveryFee}`}</span>
        </div>
        <div class="flex justify-between">
          <span>GST (5%)</span>
          <span class="font-bold text-zinc-900">₹${order.gst}</span>
        </div>
        <div class="pt-2 border-t border-zinc-200 flex justify-between text-sm font-black text-zinc-950">
          <span>Grand Total</span>
          <span class="text-amber-600">₹${order.total}</span>
        </div>
      </div>

      <!-- Delivery Info -->
      <div class="bg-amber-50/60 rounded-2xl p-4 border border-amber-200 text-xs space-y-1">
        <div class="font-bold text-zinc-900">📍 Delivery Destination:</div>
        <div class="text-zinc-700">${order.customer.address}</div>
        <div class="text-zinc-500 pt-1">🕒 Slot: <strong>${order.deliverySlot}</strong> • Payment: <strong>${order.paymentMethod}</strong></div>
      </div>

      <button onclick="handleReorder('${order.id}'); document.getElementById('order-details-modal').classList.add('hidden');" class="w-full py-3.5 bg-amber-400 hover:bg-amber-500 text-zinc-950 font-black rounded-xl text-sm transition shadow cursor-pointer">
        Re-Order These Items Now
      </button>
    </div>
  `;

  modal.classList.remove('hidden');
};

window.handleReorder = function(orderId) {
  const order = app.orders.find(o => o.id === orderId);
  if (!order) return;

  order.items.forEach(item => {
    app.addToCart(item, item.quantity);
  });
  window.location.hash = '#cart';
};

// ==================== PROFILE, PLANS, PAUSE & ADDRESSES ====================

function renderAccountProfile() {
  const nameInput = document.getElementById('profile-name-input');
  const phoneInput = document.getElementById('profile-phone-input');
  const emailInput = document.getElementById('profile-email-input');
  const dietInput = document.getElementById('profile-diet-input');

  if (nameInput) nameInput.value = app.user.name || '';
  if (phoneInput) phoneInput.value = app.user.phone || '';
  if (emailInput) emailInput.value = app.user.email || '';
  if (dietInput && app.user.dietPreference) dietInput.value = app.user.dietPreference;
}

window.handleSaveProfile = function(e) {
  e.preventDefault();
  app.user.name = document.getElementById('profile-name-input').value.trim();
  app.user.phone = document.getElementById('profile-phone-input').value.trim();
  app.user.email = document.getElementById('profile-email-input').value.trim();
  app.user.dietPreference = document.getElementById('profile-diet-input').value;

  app.saveUser();
  app.showToast('Profile details updated successfully!', 'success');
};

function renderAccountPlans() {
  const container = document.getElementById('account-plans-container');
  if (!container) return;

  const sub = app.user.activeSubscription || {
    id: "SUB-10D-89421",
    planName: "10-Day Food Subscription Plan",
    mealType: "Rayalaseema Deluxe Veg Full Meal",
    totalDays: 10,
    consumedDays: 1,
    remainingDays: 9,
    status: "Active",
    isPausedTomorrow: false,
    pauseCutoff: "5:30 PM",
    nextDelivery: "Tomorrow (12:30 PM)",
    pausedDates: []
  };

  const isPaused = sub.isPausedTomorrow || sub.status === "Paused for Tomorrow";
  const isCompleted = sub.status === "Completed" || sub.consumedDays >= sub.totalDays;
  const cutoffInfo = app.canPauseTomorrow();

  // Generate 10-day milestone progress indicators
  const totalDays = sub.totalDays || 10;
  const consumedDays = sub.consumedDays || 0;
  const remainingDays = Math.max(0, totalDays - consumedDays);
  const pausedCount = (sub.pausedDates && sub.pausedDates.length) || 0;

  let dayMilestonesHtml = '';
  for (let d = 1; d <= totalDays; d++) {
    if (d <= consumedDays) {
      dayMilestonesHtml += `
        <div class="flex flex-col items-center gap-1 group">
          <div class="w-8 h-8 rounded-full bg-emerald-500 text-zinc-950 font-black text-xs flex items-center justify-center shadow-md border-2 border-emerald-300">
            ✓
          </div>
          <span class="text-[10px] font-bold text-emerald-400">Day ${d}</span>
          <span class="text-[9px] text-zinc-400">Consumed</span>
        </div>
      `;
    } else if (d === consumedDays + 1) {
      if (isPaused) {
        dayMilestonesHtml += `
          <div class="flex flex-col items-center gap-1 group animate-pulse">
            <div class="w-8 h-8 rounded-full bg-amber-400 text-zinc-950 font-black text-xs flex items-center justify-center shadow-md border-2 border-amber-300">
              ⏸️
            </div>
            <span class="text-[10px] font-bold text-amber-400">Day ${d}</span>
            <span class="text-[9px] text-amber-300 font-semibold">Paused (Saved)</span>
          </div>
        `;
      } else {
        dayMilestonesHtml += `
          <div class="flex flex-col items-center gap-1 group">
            <div class="w-8 h-8 rounded-full bg-amber-400 text-zinc-950 font-black text-xs flex items-center justify-center shadow-md border-2 border-white ring-2 ring-amber-400/50">
              🚚
            </div>
            <span class="text-[10px] font-bold text-amber-300">Day ${d}</span>
            <span class="text-[9px] text-white font-semibold">Next Meal</span>
          </div>
        `;
      }
    } else {
      dayMilestonesHtml += `
        <div class="flex flex-col items-center gap-1 opacity-60">
          <div class="w-8 h-8 rounded-full bg-zinc-800 text-zinc-400 font-semibold text-xs flex items-center justify-center border border-zinc-700">
            ${d}
          </div>
          <span class="text-[10px] font-medium text-zinc-400">Day ${d}</span>
          <span class="text-[9px] text-zinc-500">Remaining</span>
        </div>
      `;
    }
  }

  container.innerHTML = `
    <div class="space-y-6">
      
      <!-- Main Subscription Card -->
      <div class="bg-gradient-to-br from-emerald-950 via-zinc-900 to-zinc-950 text-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/10 relative overflow-hidden">
        
        <!-- Top Row: Plan Title, ID & Status Badge -->
        <div class="flex flex-wrap items-start justify-between gap-4 pb-6 border-b border-white/10">
          <div>
            <div class="flex items-center gap-2">
              <span class="text-xs text-amber-400 font-extrabold uppercase tracking-wider bg-amber-400/10 px-2.5 py-0.5 rounded-full border border-amber-400/20">
                10-Day Plan Guarantee
              </span>
              <span class="text-xs text-zinc-400">ID: ${sub.id || 'SUB-10D-89421'}</span>
            </div>
            <h3 class="text-2xl sm:text-3xl font-black font-heading mt-1">${sub.planName}</h3>
            <p class="text-xs text-zinc-300 mt-0.5">Meal: <strong class="text-white">${sub.mealType || 'Rayalaseema Deluxe Veg Full Meal'}</strong> (12:30 PM Delivery)</p>
          </div>
          
          <div class="flex flex-col items-end gap-1">
            <span class="px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider border shadow-sm ${
              isCompleted ? 'bg-blue-500/20 text-blue-300 border-blue-400/30' :
              isPaused ? 'bg-amber-500/20 text-amber-300 border-amber-400/30 animate-pulse' :
              'bg-emerald-500/20 text-emerald-300 border-emerald-400/30'
            }">
              ${isCompleted ? '🎉 All 10 Days Completed' : isPaused ? '⏸️ Paused for Tomorrow' : '🟢 Active Subscription'}
            </span>
            <span class="text-[11px] text-zinc-400">Pause Cutoff: <strong class="text-amber-300">5:30 PM Daily</strong></span>
          </div>
        </div>

        <!-- 4-Stat Metric Grid -->
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 my-6">
          <div class="bg-white/5 rounded-2xl p-4 border border-white/10 text-center">
            <span class="text-xs text-zinc-400 block font-semibold">Total Plan Entitlement</span>
            <span class="text-2xl sm:text-3xl font-black text-amber-400 mt-1 block">${totalDays} Days</span>
            <span class="text-[10px] text-zinc-400 mt-0.5 block">Guaranteed Food Days</span>
          </div>
          
          <div class="bg-white/5 rounded-2xl p-4 border border-white/10 text-center">
            <span class="text-xs text-zinc-400 block font-semibold">Consumed Days</span>
            <span class="text-2xl sm:text-3xl font-black text-white mt-1 block">${consumedDays} / ${totalDays}</span>
            <span class="text-[10px] text-emerald-400 mt-0.5 block font-semibold">✓ Consumed Today</span>
          </div>
          
          <div class="bg-emerald-950/40 rounded-2xl p-4 border border-emerald-500/30 text-center relative overflow-hidden">
            <div class="absolute -top-1 -right-1 bg-emerald-500 text-zinc-950 text-[9px] font-black px-2 py-0.5 rounded-bl-lg">
              100% PROTECTED
            </div>
            <span class="text-xs text-emerald-300 block font-semibold">Remaining Food Days</span>
            <span class="text-2xl sm:text-3xl font-black text-emerald-400 mt-1 block">${remainingDays} Days</span>
            <span class="text-[10px] text-zinc-300 mt-0.5 block">Zero Balance Loss</span>
          </div>
          
          <div class="bg-white/5 rounded-2xl p-4 border border-white/10 text-center">
            <span class="text-xs text-zinc-400 block font-semibold">Paused Days</span>
            <span class="text-2xl sm:text-3xl font-black text-amber-300 mt-1 block">${pausedCount}</span>
            <span class="text-[10px] text-zinc-400 mt-0.5 block">Balance Preserved</span>
          </div>
        </div>

        <!-- 10-Day Visual Journey Tracker -->
        <div class="my-6 p-4 sm:p-5 bg-black/30 rounded-2xl border border-white/10 space-y-3">
          <div class="flex items-center justify-between text-xs">
            <span class="font-bold text-zinc-200">10-Day Food Consumption Tracker</span>
            <span class="text-amber-400 font-extrabold">${Math.round((consumedDays / totalDays) * 100)}% Consumed (${consumedDays}/${totalDays} Days)</span>
          </div>
          
          <div class="grid grid-cols-5 sm:grid-cols-10 gap-2 pt-1">
            ${dayMilestonesHtml}
          </div>
        </div>

        <!-- Next Delivery & Pause Deadline Notice -->
        <div class="pt-6 border-t border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div class="space-y-1">
            <div class="flex items-center gap-2">
              <span class="text-xs text-zinc-400">Next Scheduled Delivery:</span>
              <span class="text-xs font-extrabold ${isPaused ? 'text-amber-400' : 'text-emerald-400'}">
                ${isCompleted ? 'None (Subscription Complete)' : isPaused ? '⏸️ Paused Tomorrow • Resumes Day After' : 'Tomorrow (12:30 PM)'}
              </span>
            </div>
            <div class="text-xs text-zinc-300">
              ⏰ <strong>5:30 PM Rule:</strong> Click "Pause Plan" before 5:30 PM today if you do not want food tomorrow.
            </div>
          </div>

          <div class="flex flex-wrap items-center gap-2.5">
            <button onclick="switchAccountTab('pause')" class="px-5 py-2.5 bg-amber-400 hover:bg-amber-500 text-zinc-950 font-black text-xs rounded-xl transition shadow cursor-pointer">
              ${isPaused ? '▶️ Manage / Resume Plan' : '⏸️ Pause Plan for Tomorrow'}
            </button>
          </div>
        </div>

      </div>

      <!-- Quick Interactive Testing / Simulation Controls -->
      <div class="bg-zinc-50 rounded-2xl p-5 border border-zinc-200 space-y-3">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="text-base">🧪</span>
            <h4 class="text-xs font-bold text-zinc-900 uppercase tracking-wider">Interactive 10-Day Plan Simulation Controls</h4>
          </div>
          <span class="text-[11px] text-zinc-500 font-medium">Test state transitions instantly</span>
        </div>
        
        <p class="text-xs text-zinc-600 leading-relaxed">
          Use these controls to simulate food consumption, pause before/after 5:30 PM cutoff, or reset the 10-day counter for testing:
        </p>

        <div class="flex flex-wrap items-center gap-3 pt-1">
          <button onclick="markDayConsumed()" class="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition shadow cursor-pointer flex items-center gap-1.5">
            <span>🍽️ Mark Food Consumed (+1 Day)</span>
          </button>
          
          <button onclick="togglePauseTomorrow()" class="px-4 py-2 ${isPaused ? 'bg-amber-500 hover:bg-amber-600 text-zinc-950' : 'bg-zinc-900 hover:bg-zinc-800 text-amber-400'} font-bold text-xs rounded-xl transition shadow cursor-pointer flex items-center gap-1.5">
            <span>${isPaused ? '▶️ Resume Plan' : '⏸️ Toggle Pause Tomorrow'}</span>
          </button>

          <button onclick="resetTenDayPlan()" class="px-4 py-2 bg-zinc-200 hover:bg-zinc-300 text-zinc-800 font-bold text-xs rounded-xl transition cursor-pointer flex items-center gap-1.5">
            <span>🔄 Reset to Day 1 (1/10 Consumed, 9 Left)</span>
          </button>
        </div>
      </div>

    </div>
  `;
}

function renderAccountPause() {
  const container = document.getElementById('account-pause-container');
  if (!container) return;

  const sub = app.user.activeSubscription || {
    id: "SUB-10D-89421",
    planName: "10-Day Food Subscription Plan",
    totalDays: 10,
    consumedDays: 1,
    remainingDays: 9,
    status: "Active",
    isPausedTomorrow: false,
    pauseCutoff: "5:30 PM",
    nextDelivery: "Tomorrow (12:30 PM)",
    pausedDates: []
  };

  const isPaused = sub.isPausedTomorrow || sub.status === "Paused for Tomorrow";
  const isCompleted = sub.status === "Completed" || sub.consumedDays >= sub.totalDays;
  const cutoffInfo = app.canPauseTomorrow();
  const timeMode = app.simulatedTimeMode;

  container.innerHTML = `
    <div class="bg-white rounded-3xl p-6 sm:p-8 border border-zinc-200/70 shadow-sm space-y-6">
      
      <div class="pb-4 border-b border-zinc-100 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 class="text-2xl font-black text-zinc-950 font-heading">Pause or Resume 10-Day Plan</h3>
          <p class="text-xs text-zinc-500 mt-0.5">Pause meals before the 5:30 PM cutoff. Paused days never reduce your 10-day food entitlement.</p>
        </div>
        <div class="flex items-center gap-2">
          <span class="text-xs font-bold px-3 py-1 rounded-full ${
            cutoffInfo.allowed ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-red-100 text-red-800 border border-red-300'
          }">
            ${cutoffInfo.allowed ? '🟢 Cutoff Open (Before 5:30 PM)' : '🔴 Cutoff Closed (After 5:30 PM)'}
          </span>
        </div>
      </div>

      <!-- Cutoff Simulation Switcher (For easy demo & testing) -->
      <div class="p-4 bg-amber-50/70 rounded-2xl border border-amber-200/80 space-y-2">
        <div class="flex items-center justify-between">
          <span class="text-xs font-extrabold text-amber-900 uppercase tracking-wider">⏱️ 5:30 PM Cutoff Time Simulator</span>
          <span class="text-xs font-bold text-zinc-700">Simulated Time: <strong class="text-amber-800">${cutoffInfo.label}</strong></span>
        </div>
        <p class="text-[11px] text-zinc-600">
          Switch the simulation clock below to test pausing before 5:30 PM vs after 5:30 PM:
        </p>
        <div class="flex flex-wrap gap-2 pt-1">
          <button onclick="app.setTimeMode('before')" class="px-3.5 py-1.5 text-xs font-bold rounded-xl transition cursor-pointer ${
            timeMode === 'before' ? 'bg-emerald-600 text-white shadow' : 'bg-white text-zinc-700 border border-zinc-300 hover:bg-zinc-100'
          }">
            ✓ Simulate 3:30 PM (Before 5:30 PM Cutoff - Pause Allowed)
          </button>
          
          <button onclick="app.setTimeMode('after')" class="px-3.5 py-1.5 text-xs font-bold rounded-xl transition cursor-pointer ${
            timeMode === 'after' ? 'bg-red-600 text-white shadow' : 'bg-white text-zinc-700 border border-zinc-300 hover:bg-zinc-100'
          }">
            ⚠️ Simulate 6:15 PM (After 5:30 PM Cutoff - Locked)
          </button>
          
          <button onclick="app.setTimeMode('real')" class="px-3.5 py-1.5 text-xs font-bold rounded-xl transition cursor-pointer ${
            timeMode === 'real' ? 'bg-zinc-900 text-white shadow' : 'bg-white text-zinc-700 border border-zinc-300 hover:bg-zinc-100'
          }">
            🕒 Use Real System Clock
          </button>
        </div>
      </div>

      <!-- Tomorrow's Meal Status & Instant Pause Action -->
      <div class="bg-gradient-to-r ${isPaused ? 'from-amber-50 to-orange-50 border-amber-300' : 'from-emerald-50 to-teal-50 border-emerald-300'} rounded-2xl p-6 border flex flex-col sm:flex-row sm:items-center justify-between gap-5">
        <div class="space-y-1.5">
          <div class="flex items-center gap-2">
            <span class="text-xs font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-md ${
              isPaused ? 'bg-amber-200 text-amber-900' : 'bg-emerald-200 text-emerald-900'
            }">
              Tomorrow's Lunch Status
            </span>
            <span class="text-xs font-bold text-zinc-600">Cutoff: 5:30 PM Today</span>
          </div>

          <h4 class="text-lg font-black text-zinc-900">
            ${isPaused ? '⏸️ Paused for Tomorrow (No Food Order)' : '🚚 Scheduled for Tomorrow (12:30 PM)'}
          </h4>
          
          <p class="text-xs text-zinc-600 max-w-lg">
            ${isPaused 
              ? 'Your subscription is paused for tomorrow. Zero days deducted! Remaining balance stays preserved at ' + sub.remainingDays + ' food days. It will automatically resume the day after.' 
              : 'Your fresh meal is scheduled for delivery tomorrow at 12:30 PM. To pause tomorrow’s lunch, click Pause before 5:30 PM today.'}
          </p>
        </div>

        <button onclick="togglePauseTomorrow()" class="px-6 py-3.5 ${
          isPaused ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : 'bg-zinc-950 hover:bg-zinc-800 text-amber-400'
        } font-black text-xs rounded-2xl transition shadow-md cursor-pointer whitespace-nowrap active:scale-95 flex items-center justify-center gap-2">
          ${isPaused ? '▶️ Resume Tomorrow’s Meal' : '⏸️ Pause Tomorrow’s Meal (Before 5:30 PM)'}
        </button>
      </div>

      <!-- 10-Day Food Consumption Balance Status -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="bg-zinc-50 rounded-2xl p-4 border border-zinc-200">
          <span class="text-xs text-zinc-500 font-semibold block">Consumed Days</span>
          <span class="text-xl font-black text-zinc-900 mt-1 block">${sub.consumedDays || 1} / ${sub.totalDays || 10} Days</span>
          <span class="text-[11px] text-emerald-600 font-semibold">1 Consumed Today</span>
        </div>

        <div class="bg-zinc-50 rounded-2xl p-4 border border-zinc-200">
          <span class="text-xs text-zinc-500 font-semibold block">Preserved Remaining Days</span>
          <span class="text-xl font-black text-emerald-600 mt-1 block">${sub.remainingDays || 9} Days Remaining</span>
          <span class="text-[11px] text-zinc-500 font-medium">100% Entitlement Protected</span>
        </div>

        <div class="bg-zinc-50 rounded-2xl p-4 border border-zinc-200">
          <span class="text-xs text-zinc-500 font-semibold block">Next Delivery Date</span>
          <span class="text-xl font-black text-zinc-900 mt-1 block">${isPaused ? 'Day After Tomorrow' : 'Tomorrow'}</span>
          <span class="text-[11px] text-amber-600 font-semibold">12:30 PM Lunch Slot</span>
        </div>
      </div>

      <!-- Schedule Specific Absence Range -->
      <div class="space-y-3 pt-2">
        <h4 class="text-xs font-bold text-zinc-800 uppercase tracking-wider">Schedule Multi-Day Absences</h4>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="text-xs font-semibold text-zinc-600 block mb-1">Pause From Date</label>
            <input type="date" id="pause-start-date" class="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-medium focus:outline-none focus:border-amber-400" />
          </div>
          <div>
            <label class="text-xs font-semibold text-zinc-600 block mb-1">Resume On Date</label>
            <input type="date" id="pause-end-date" class="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-medium focus:outline-none focus:border-amber-400" />
          </div>
        </div>
        <button onclick="handleSchedulePause()" class="px-5 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-amber-400 font-bold text-xs rounded-xl transition shadow cursor-pointer">
          Apply Leave Schedule
        </button>
      </div>

      <!-- 10-Day Plan Pause / Resume Policy Specification -->
      <div class="p-5 bg-zinc-50 rounded-2xl border border-zinc-200 text-xs text-zinc-600 space-y-2">
        <div class="font-black text-zinc-950 uppercase tracking-wider flex items-center gap-1.5">
          <span>📋</span> 10-Day Food Subscription Pause / Resume Policy:
        </div>
        <ul class="space-y-1.5 list-disc list-inside leading-relaxed text-zinc-700">
          <li><strong>Day 1 Consumed:</strong> Consuming food today counts as 1 consumed day (1/10 consumed, 9 days remaining).</li>
          <li><strong>5:30 PM Cutoff Rule:</strong> To pause tomorrow's meal, click “Pause Plan” before 5:30 PM today.</li>
          <li><strong>Zero Loss:</strong> When paused before 5:30 PM, no food/order is generated for tomorrow, tomorrow is NOT counted as a consumed day, and your 9-day balance is preserved.</li>
          <li><strong>Auto-Resume:</strong> The subscription automatically resumes from the day after the paused day.</li>
          <li><strong>10 Full Food Days Guarantee:</strong> You will receive exactly 10 actual food-delivery/consumption days. Paused days never reduce your 10-day balance.</li>
        </ul>
      </div>

    </div>
  `;
}

// Global pause toggle with 5:30 PM cutoff validation
window.togglePauseTomorrow = function(forceSubId) {
  const isCustomerSelf = !forceSubId;
  const sub = forceSubId 
    ? app.subscriptions.find(s => s.id === forceSubId) 
    : app.user.activeSubscription;

  if (!sub) return;

  if (sub.status === 'Completed' || (sub.consumedDays >= sub.totalDays)) {
    app.showToast("This 10-day subscription has already completed all 10 food days!", "info");
    return;
  }

  const isCurrentlyPaused = sub.isPausedTomorrow || sub.status === "Paused for Tomorrow";

  if (isCurrentlyPaused) {
    // Resume tomorrow
    sub.isPausedTomorrow = false;
    sub.status = "Active";
    sub.nextDelivery = "Tomorrow (12:30 PM)";
    sub.nextDeliveryDate = "Tomorrow (12:30 PM)";
    sub.pausedDates = (sub.pausedDates || []).filter(d => !d.includes("Tomorrow") && !d.includes("20 Sep"));

    // Sync in global subscriptions list
    const subIdx = app.subscriptions.findIndex(s => s.id === sub.id);
    if (subIdx !== -1) {
      app.subscriptions[subIdx] = JSON.parse(JSON.stringify(sub));
      app.saveSubscriptions();
    }

    if (isCustomerSelf) {
      app.user.activeSubscription = sub;
      app.saveUser();
      renderAccountPlans();
      renderAccountPause();
    } else if (typeof renderAdminSubscriptions === 'function') {
      renderAdminSubscriptions();
    }

    app.showToast("▶️ Plan Resumed for Tomorrow! Fresh meal will be delivered at 12:30 PM.", "success");
    return;
  }

  // Attempting to pause: check 5:30 PM Cutoff
  const cutoff = app.canPauseTomorrow();
  if (!cutoff.allowed && isCustomerSelf) {
    app.showToast("⚠️ 5:30 PM Cutoff Passed: Kitchen preparations for tomorrow are locked. Tomorrow's meal is scheduled. You can pause starting day after tomorrow.", "error", 6500);
    return;
  }

  // Successfully activate pause for tomorrow
  sub.isPausedTomorrow = true;
  sub.status = "Paused for Tomorrow";
  sub.nextDelivery = "Resumes Day After Tomorrow (12:30 PM)";
  sub.nextDeliveryDate = "Resumes Day After Tomorrow (12:30 PM)";
  
  const tomorrowDateStr = "20 Sep 2026";
  if (!sub.pausedDates) sub.pausedDates = [];
  if (!sub.pausedDates.includes(tomorrowDateStr)) {
    sub.pausedDates.push(tomorrowDateStr);
  }

  // Preserved balance check
  sub.remainingDays = sub.totalDays - sub.consumedDays;

  // Sync in global subscriptions list
  const subIdx = app.subscriptions.findIndex(s => s.id === sub.id);
  if (subIdx !== -1) {
    app.subscriptions[subIdx] = JSON.parse(JSON.stringify(sub));
    app.saveSubscriptions();
  }

  if (isCustomerSelf) {
    app.user.activeSubscription = sub;
    app.saveUser();
    renderAccountPlans();
    renderAccountPause();
  } else if (typeof renderAdminSubscriptions === 'function') {
    renderAdminSubscriptions();
  }

  app.showToast(`⏸️ Plan Paused for Tomorrow (before 5:30 PM). No order generated. ${sub.remainingDays} remaining food days preserved!`, "success", 5000);
};

// Record Day Consumed (+1)
window.markDayConsumed = function(subId) {
  const isCustomerSelf = !subId;
  const sub = subId 
    ? app.subscriptions.find(s => s.id === subId) 
    : app.user.activeSubscription;

  if (!sub) return;

  if (sub.consumedDays >= sub.totalDays) {
    app.showToast("All 10 days of food have already been delivered and consumed!", "info");
    return;
  }

  sub.consumedDays = (sub.consumedDays || 0) + 1;
  sub.remainingDays = Math.max(0, sub.totalDays - sub.consumedDays);
  sub.isPausedTomorrow = false;

  const now = new Date();
  const dateStr = now.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

  if (sub.consumedDays >= sub.totalDays) {
    sub.status = "Completed";
    sub.nextDelivery = "All 10 Days Consumed (Completed)";
    sub.nextDeliveryDate = "All 10 Days Consumed (Completed)";
  } else {
    sub.status = "Active";
    sub.nextDelivery = "Tomorrow (12:30 PM)";
    sub.nextDeliveryDate = "Tomorrow (12:30 PM)";
  }

  if (!sub.history) sub.history = [];
  sub.history.push({
    dayNumber: sub.consumedDays,
    date: dateStr,
    status: "Delivered & Consumed",
    meal: sub.mealType || "Rayalaseema Deluxe Veg Full Meal",
    note: `Day ${sub.consumedDays} consumed (${sub.consumedDays}/${sub.totalDays} consumed, ${sub.remainingDays} remaining)`
  });

  const subIdx = app.subscriptions.findIndex(s => s.id === sub.id);
  if (subIdx !== -1) {
    app.subscriptions[subIdx] = JSON.parse(JSON.stringify(sub));
    app.saveSubscriptions();
  }

  if (isCustomerSelf) {
    app.user.activeSubscription = sub;
    app.saveUser();
    renderAccountPlans();
    renderAccountPause();
  } else if (typeof renderAdminSubscriptions === 'function') {
    renderAdminSubscriptions();
  }

  app.showToast(`🍽️ Recorded Day ${sub.consumedDays}/10 Food Consumed! Exactly ${sub.remainingDays} food days remaining.`, "success");
};

// Reset 10-Day Plan to Day 1 consumed for demo
window.resetTenDayPlan = function(subId) {
  const isCustomerSelf = !subId;
  const sub = subId 
    ? app.subscriptions.find(s => s.id === subId) 
    : app.user.activeSubscription;

  if (!sub) return;

  sub.totalDays = 10;
  sub.consumedDays = 1;
  sub.remainingDays = 9;
  sub.status = "Active";
  sub.isPausedTomorrow = false;
  sub.nextDelivery = "Tomorrow (12:30 PM)";
  sub.nextDeliveryDate = "Tomorrow (12:30 PM)";
  sub.pausedDates = [];
  sub.history = [
    { dayNumber: 1, date: "19 Sep 2026", status: "Delivered & Consumed", meal: sub.mealType || "Rayalaseema Deluxe Veg Full Meal", note: "Day 1 consumed (1/10 consumed, 9 remaining)" }
  ];

  const subIdx = app.subscriptions.findIndex(s => s.id === sub.id);
  if (subIdx !== -1) {
    app.subscriptions[subIdx] = JSON.parse(JSON.stringify(sub));
    app.saveSubscriptions();
  }

  if (isCustomerSelf) {
    app.user.activeSubscription = sub;
    app.saveUser();
    renderAccountPlans();
    renderAccountPause();
  } else if (typeof renderAdminSubscriptions === 'function') {
    renderAdminSubscriptions();
  }

  app.showToast("🔄 Plan reset to Day 1: 1/10 Consumed, 9 Food Days Remaining.", "info");
};

window.handleSchedulePause = function() {
  const start = document.getElementById('pause-start-date')?.value;
  const end = document.getElementById('pause-end-date')?.value;
  if (!start || !end) {
    app.showToast('Please select both from and to dates.', 'error');
    return;
  }
  
  const sub = app.user.activeSubscription;
  if (sub) {
    if (!sub.pausedDates) sub.pausedDates = [];
    sub.pausedDates.push(`${start} to ${end}`);
    app.saveUser();
  }
  
  app.showToast(`Leave scheduled from ${start} to ${end}. Your 10-day food balance is 100% preserved!`, 'success');
  renderAccountPlans();
  renderAccountPause();
};

function renderAccountAddresses() {
  const container = document.getElementById('account-addresses-list');
  if (!container) return;

  container.innerHTML = app.savedAddresses.map(addr => `
    <div class="bg-white rounded-2xl p-5 border ${addr.isDefault ? 'border-amber-400 bg-amber-50/20' : 'border-zinc-200/80'} shadow-sm flex flex-col justify-between space-y-4">
      <div>
        <div class="flex items-center justify-between mb-2">
          <span class="text-xs font-bold px-2 py-0.5 rounded-md ${addr.tag === 'Work' ? 'bg-blue-100 text-blue-900' : 'bg-emerald-100 text-emerald-900'}">${addr.tag}</span>
          ${addr.isDefault ? '<span class="text-[10px] font-black text-amber-700 uppercase">Default</span>' : ''}
        </div>
        <h4 class="text-sm font-bold text-zinc-900">${addr.title}</h4>
        <p class="text-xs text-zinc-600 mt-1 leading-relaxed">${addr.fullAddress}</p>
        ${addr.landmark ? `<span class="text-[11px] text-zinc-400 block mt-1">Landmark: ${addr.landmark}</span>` : ''}
      </div>

      <div class="pt-3 border-t border-zinc-100 flex items-center justify-between text-xs">
        ${!addr.isDefault ? `
          <button onclick="setDefaultAddress('${addr.id}')" class="text-amber-600 hover:text-amber-700 font-bold hover:underline">Set as Default</button>
        ` : '<span></span>'}
        <button onclick="deleteAddress('${addr.id}')" class="text-red-500 hover:text-red-700 font-semibold">Delete</button>
      </div>
    </div>
  `).join('');
}

window.openAddressModal = function() {
  const modal = document.getElementById('address-modal');
  if (modal) modal.classList.remove('hidden');
};

window.handleSaveNewAddress = function(e) {
  e.preventDefault();
  const tags = document.getElementsByName('addr-tag');
  let tag = 'Work';
  for (const t of tags) {
    if (t.checked) tag = t.value;
  }

  const title = document.getElementById('addr-title-input').value.trim();
  const full = document.getElementById('addr-full-input').value.trim();
  const landmark = document.getElementById('addr-landmark-input').value.trim();

  const newAddr = {
    id: 'addr-' + Date.now(),
    title: title,
    tag: tag,
    fullAddress: full,
    landmark: landmark,
    isDefault: app.savedAddresses.length === 0
  };

  app.savedAddresses.push(newAddr);
  app.saveAddresses();
  app.showToast('Address saved successfully!', 'success');

  document.getElementById('address-modal').classList.add('hidden');
  document.getElementById('new-address-form').reset();
  renderAccountAddresses();
};

window.deleteAddress = function(id) {
  app.savedAddresses = app.savedAddresses.filter(a => a.id !== id);
  app.saveAddresses();
  app.showToast('Address deleted', 'info');
  renderAccountAddresses();
};

window.setDefaultAddress = function(id) {
  app.savedAddresses.forEach(a => {
    a.isDefault = a.id === id;
  });
  app.saveAddresses();
  app.showToast('Default address updated', 'success');
  renderAccountAddresses();
};

window.handleLogout = function() {
  app.user.isLoggedIn = false;
  app.saveUser();
  app.showToast('Signed out successfully.', 'info');
  renderAccountView();
};

window.handleAuthSubmit = function(e) {
  e.preventDefault();
  const email = document.getElementById('auth-email').value;
  app.user.email = email || app.user.email;
  app.user.isLoggedIn = true;
  app.saveUser();
  app.showToast(`Welcome back, ${app.user.name}!`, 'success');
  renderAccountView();
};

// ==================== SUBSCRIPTION PLANS & SERVICES PAGE ====================

function renderServicesPage() {
  const container = document.getElementById('services-grid-container');
  if (!container) return;

  container.innerHTML = MENU_DATA.services.map((srv, idx) => `
    <div class="bg-white rounded-3xl border border-zinc-200/80 overflow-hidden shadow-sm hover:shadow-xl transition duration-300 flex flex-col justify-between" data-aos="fade-up" data-aos-delay="${idx * 100}">
      <div class="relative aspect-[16/9] sm:aspect-auto sm:h-56 overflow-hidden bg-zinc-900">
        <img src="${srv.image}" alt="${srv.title}" class="w-full h-full object-cover object-center group-hover:scale-105 transition duration-500" loading="lazy" />
        <div class="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-transparent"></div>
        <div class="absolute top-4 left-4">
          <span class="bg-amber-400 text-zinc-950 font-bold text-xs px-3 py-1 rounded-full shadow">
            ${srv.badge}
          </span>
        </div>
        <div class="absolute bottom-4 left-4 right-4 text-white">
          <h3 class="text-2xl font-bold font-heading">${srv.title}</h3>
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
            <span class="text-base font-black text-zinc-900">${srv.priceDisplay}</span>
          </div>

          ${srv.ctaAction === 'order' ? `
            <a href="#categories" onclick="navigateTo('categories'); return false;" class="px-5 py-2.5 bg-amber-400 hover:bg-amber-500 text-zinc-950 font-bold rounded-xl text-sm transition shadow flex items-center gap-1.5 cursor-pointer">
              ${srv.ctaText}
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
            </a>
          ` : `
            <button onclick="openEnquiryModal('${srv.title}')" class="px-5 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-amber-400 font-bold rounded-xl text-sm transition shadow flex items-center gap-1.5 cursor-pointer">
              ${srv.ctaText}
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
            </button>
          `}
        </div>
      </div>
    </div>
  `).join('');
}

function renderSubscriptionPlans() {
  const container = document.getElementById('subscription-plans-container');
  if (!container) return;

  container.innerHTML = MENU_DATA.subscriptionPlans.map(plan => `
    <div class="relative bg-white rounded-3xl p-6 border-2 transition duration-300 flex flex-col justify-between ${
      plan.popular ? 'border-amber-400 shadow-xl scale-[1.02]' : 'border-zinc-200/80 shadow-sm hover:border-zinc-400'
    }">
      ${plan.popular ? `
        <div class="absolute -top-3.5 left-1/2 transform -translate-x-1/2 bg-amber-400 text-zinc-950 font-black text-xs px-4 py-1 rounded-full uppercase tracking-wider shadow">
          ${plan.tag}
        </div>
      ` : ''}

      <div>
        <div class="flex items-center justify-between mb-4">
          <div>
            <span class="text-xs font-bold text-zinc-400 uppercase tracking-wider">${plan.tag}</span>
            <h3 class="text-2xl font-black text-zinc-900 font-heading">${plan.name}</h3>
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

      <button onclick="handleAddPlanToCart('${plan.id}')" class="w-full py-3.5 rounded-2xl font-black text-sm transition duration-200 flex items-center justify-center gap-2 cursor-pointer ${
        plan.popular ? 'bg-amber-400 hover:bg-amber-500 text-zinc-950 shadow-md' : 'bg-zinc-900 hover:bg-zinc-800 text-white'
      }">
        ${plan.cta}
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
      </button>
    </div>
  `).join('');
}

window.handleAddPlanToCart = function(planId) {
  const plan = MENU_DATA.subscriptionPlans.find(p => p.id === planId);
  if (!plan) return;

  if (plan.totalPrice === 'Custom') {
    window.openEnquiryModal('Corporate Custom Subscription Plan');
  } else {
    app.addToCart({
      id: plan.id,
      name: `${plan.name} (${plan.days} Workday Deliveries)`,
      price: plan.totalPrice,
      categoryName: "Subscription Plan",
      image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80",
      isVeg: true
    }, 1);
    window.location.hash = '#cart';
  }
};

// Render Reviews Section
function renderReviews() {
  const container = document.getElementById('testimonials-container');
  if (!container) return;

  container.innerHTML = MENU_DATA.reviews.map(r => `
    <div class="bg-white rounded-3xl p-6 border border-zinc-200/80 shadow-sm hover:shadow-md transition" data-aos="fade-up">
      <div class="flex items-center gap-1 text-amber-400 mb-3">
        ${Array(r.rating).fill(0).map(() => `<svg class="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>`).join('')}
      </div>
      <p class="text-zinc-700 text-xs sm:text-sm italic mb-6 leading-relaxed">"${r.comment}"</p>
      <div class="flex items-center gap-3">
        <img src="${r.avatar}" alt="${r.name}" class="w-10 h-10 rounded-full object-cover border-2 border-amber-300" />
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
      <img src="${item.image}" alt="${item.name}" class="w-20 h-20 rounded-2xl object-cover flex-shrink-0" />
      
      <div class="flex-1 min-w-0">
        <div class="flex items-center gap-2 mb-1">
          <span class="text-[11px] px-2 py-0.5 rounded-md bg-zinc-100 text-zinc-600 font-semibold">${item.category}</span>
        </div>
        <h4 class="text-sm sm:text-base font-bold text-zinc-900 truncate">${item.name}</h4>
        <div class="text-sm font-black text-zinc-900 mt-1">₹${item.price}</div>
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
        <span class="font-black text-sm sm:text-base text-zinc-950">₹${item.price * item.quantity}</span>
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
      <div class="bg-white rounded-3xl p-6 border border-zinc-200/80 shadow-sm space-y-4">
        <h3 class="text-lg font-bold text-zinc-900 pb-3 border-b border-zinc-100">Order Summary</h3>

        <!-- Coupon input -->
        <div class="flex gap-2">
          <input type="text" id="coupon-code-input" placeholder="Promo code (e.g. RAYALA10)" class="flex-1 px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs uppercase font-semibold focus:outline-none focus:border-amber-400" value="${app.appliedCoupon ? app.appliedCoupon.code : ''}" />
          <button onclick="applyCouponCode()" class="px-4 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-amber-400 font-bold text-xs rounded-xl transition cursor-pointer">
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
            <span>${delivery === 0 ? '<span class="text-emerald-700 font-bold">FREE</span>' : `₹${delivery}`}</span>
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

        <button onclick="openCheckoutModal('cart')" class="w-full py-4 bg-amber-400 hover:bg-amber-500 active:scale-95 text-zinc-950 font-black rounded-2xl text-base transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer">
          Proceed to Checkout
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
        </button>

        <p class="text-[11px] text-center text-zinc-400">Guaranteed Fresh Delivery • 100% Hygienic Cloud Kitchen</p>
      </div>
    `;
  }
}

window.applyCouponCode = function() {
  const input = document.getElementById('coupon-code-input');
  if (!input) return;
  const code = input.value.trim().toUpperCase();

  if (code === 'RAYALA10' || code === 'FIRSTMEAL' || code === 'FIRSTBOWL') {
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

// ==================== SERVICE ENQUIRY MODAL ====================

function initEnquiryModal() {
  const modal = document.getElementById('enquiry-modal');
  const form = document.getElementById('enquiry-form');

  window.openEnquiryModal = function(serviceTitle) {
    if (modal) {
      const input = document.getElementById('enquiry-service-name');
      if (input) input.value = serviceTitle || "General Service Enquiry";
      modal.classList.remove('hidden');
    }
  };

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      modal.classList.add('hidden');
      app.showToast('Thank you! Our catering lead will call you within 15 minutes.', 'success');
      form.reset();
    });
  }
}
