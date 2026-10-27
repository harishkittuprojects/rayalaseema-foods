// ==============================================================================
// RAYALASEEMA CLOUD KITCHEN - UNIFIED DATABASE & MEDIA ENGINE (SUPABASE + CLOUDINARY)
// ==============================================================================

(function(window) {
  'use strict';

  // 1. SUPABASE CONFIGURATION
  const SUPABASE_CONFIG = {
    url: 'https://sjcjxetwxrdxwnhzpzaq.supabase.co',
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNqY2p4ZXR3eHJkeHduaHpwemFxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTMwOTI5NTAsImV4cCI6MjEwODY2ODk1MH0.9RoO3yei8058qqhFDBOhKobFXBtrxsOOAga82sj3oSc'
  };

  // 2. CLOUDINARY CONFIGURATION
  const CLOUDINARY_CONFIG = {
    cloudName: 'ufqzv6wv',
    apiKey: '189364843787363',
    apiSecret: 'xNUCCSWTTw0CpJ274_KRr3YJfgc',
    uploadFolder: 'rayalaseema_foods'
  };

  // Initialize Supabase Client if library is loaded
  let supabaseClient = null;
  if (window.supabase && typeof window.supabase.createClient === 'function') {
    try {
      supabaseClient = window.supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);
    } catch (err) {
      console.warn('[RCK_DB] Supabase client init warning:', err);
    }
  }

  // SHA-1 helper using Web Crypto API for Cloudinary signed upload
  async function sha1Hex(str) {
    const encoder = new TextEncoder();
    const data = encoder.encode(str);
    const hashBuffer = await crypto.subtle.digest('SHA-1', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  // Central Database & Media Object
  const RCK_DB = {
    supabase: supabaseClient,
    config: {
      supabase: SUPABASE_CONFIG,
      cloudinary: CLOUDINARY_CONFIG
    },
    isOnline: navigator.onLine,
    isSupabaseReady: false,

    // ==========================================
    // CLOUDINARY DIRECT UPLOADER (Signed SHA-1)
    // ==========================================
    async uploadImageToCloudinary(fileOrBlob, customFolder = null) {
      if (!fileOrBlob) throw new Error('No image file provided');
      
      const folder = customFolder || CLOUDINARY_CONFIG.uploadFolder;
      const timestamp = Math.round(Date.now() / 1000);
      
      // Sorted parameters string for signing: folder & timestamp
      const paramsToSign = `folder=${folder}&timestamp=${timestamp}${CLOUDINARY_CONFIG.apiSecret}`;
      const signature = await sha1Hex(paramsToSign);

      const formData = new FormData();
      formData.append('file', fileOrBlob);
      formData.append('api_key', CLOUDINARY_CONFIG.apiKey);
      formData.append('timestamp', timestamp);
      formData.append('signature', signature);
      formData.append('folder', folder);

      const uploadUrl = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/image/upload`;
      const response = await fetch(uploadUrl, {
        method: 'POST',
        body: formData
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error ? result.error.message : 'Cloudinary upload failed');
      }

      return {
        url: result.secure_url || result.url,
        publicId: result.public_id,
        format: result.format,
        width: result.width,
        height: result.height,
        raw: result
      };
    },

    // ==========================================
    // SUPABASE AUTH & ADMIN SECURITY
    // ==========================================
    async adminLogin(email, password) {
      const cleanEmail = (email || '').trim().toLowerCase();
      const cleanPass = (password || '').trim();

      // 1. Check custom stored admin credentials or fallback default
      const customAdmin = this.getStoredAdminCredentials();
      const isCustomMatch = (cleanEmail === customAdmin.email.toLowerCase() && cleanPass === customAdmin.password);
      const isDefaultMatch = (
        (cleanEmail === 'admin@rayalaseemafoods.com' || cleanEmail === 'admin@rayalaseema.com' || cleanEmail === 'admin') && 
        (cleanPass === 'admin123' || cleanPass === 'Rayala@2026')
      );

      // 2. Try Supabase Auth if client available
      if (this.supabase && cleanEmail.includes('@')) {
        try {
          const { data, error } = await this.supabase.auth.signInWithPassword({
            email: cleanEmail,
            password: cleanPass
          });
          if (!error && data && data.user) {
            const session = {
              email: data.user.email,
              id: data.user.id,
              authProvider: 'supabase',
              loggedInAt: new Date().toISOString()
            };
            localStorage.setItem('rck_admin_session', JSON.stringify(session));
            return { success: true, user: session };
          }
        } catch (authErr) {
          console.log('[RCK_DB] Supabase auth try:', authErr.message);
        }
      }

      // 3. Fallback match with stored master admin
      if (isCustomMatch || isDefaultMatch) {
        const session = {
          email: cleanEmail,
          role: 'SuperAdmin',
          authProvider: 'master_key',
          loggedInAt: new Date().toISOString()
        };
        localStorage.setItem('rck_admin_session', JSON.stringify(session));
        return { success: true, user: session };
      }

      return { success: false, error: 'Invalid email or password' };
    },

    getAdminSession() {
      try {
        const s = localStorage.getItem('rck_admin_session');
        return s ? JSON.parse(s) : null;
      } catch (e) {
        return null;
      }
    },

    adminLogout() {
      localStorage.removeItem('rck_admin_session');
      if (this.supabase) {
        try { this.supabase.auth.signOut(); } catch (e) {}
      }
    },

    getStoredAdminCredentials() {
      try {
        const creds = localStorage.getItem('rck_admin_creds');
        return creds ? JSON.parse(creds) : {
          email: 'admin@rayalaseemafoods.com',
          password: 'admin'
        };
      } catch (e) {
        return { email: 'admin@rayalaseemafoods.com', password: 'admin' };
      }
    },

    saveStoredAdminCredentials(email, password) {
      localStorage.setItem('rck_admin_creds', JSON.stringify({ email, password }));
    },

    // ==========================================
    // DATA LAYER & SUPABASE REST INTERACTION
    // ==========================================
    async fetchFromSupabase(key) {
      if (!this.supabase) return null;
      try {
        const { data, error } = await this.supabase
          .from('site_content')
          .select('data')
          .eq('key', key)
          .maybeSingle();

        if (error) {
          return null;
        }
        if (data && data.data) {
          return data.data;
        }
      } catch (err) {
        console.warn(`[RCK_DB] Error fetching ${key} from Supabase:`, err.message);
      }
      return null;
    },

    async saveToSupabase(key, payload) {
      if (!this.supabase) return false;
      try {
        const { error } = await this.supabase
          .from('site_content')
          .upsert({
            key: key,
            data: payload,
            updated_at: new Date().toISOString()
          }, { onConflict: 'key' });

        if (error) {
          console.warn(`[RCK_DB] Supabase upsert error for ${key}:`, error.message);
          return false;
        }
        this.isSupabaseReady = true;
        return true;
      } catch (err) {
        console.warn(`[RCK_DB] Failed to save ${key} to Supabase:`, err.message);
        return false;
      }
    },

    // Sync complete MENU_DATA with Supabase
    async syncAllToSupabase() {
      const results = {};
      const fullData = this.getFullSiteData();
      
      results.site_full = await this.saveToSupabase('site_full', fullData);
      results.products = await this.saveToSupabase('products', fullData.products || []);
      results.categories = await this.saveToSupabase('categories', fullData.categories || []);
      results.subscriptionPlans = await this.saveToSupabase('subscriptionPlans', fullData.subscriptionPlans || []);
      results.menus = await this.saveToSupabase('menus', {
        breakfast: fullData.subscriberBreakfastMenu,
        lunch: fullData.subscriberMonthlyMenu,
        dinner: fullData.subscriberDinnerMenu
      });
      results.siteSettings = await this.saveToSupabase('siteSettings', fullData.siteSettings || {});
      results.subscriptions = await this.saveToSupabase('subscriptions', this.getSubscriptions());
      results.orders = await this.saveToSupabase('orders', this.getOrders());

      return results;
    },

    // Load entire site data from Supabase, or fall back to localStorage & MENU_DATA
    async loadSiteData() {
      let data = null;

      // 1. Try local storage cache first for instant UI response
      try {
        const cached = localStorage.getItem('rck_site_data');
        if (cached) {
          data = JSON.parse(cached);
          this.applyToMenuData(data);
        }
      } catch (e) {}

      // 2. Fetch fresh data from Supabase asynchronously
      if (this.supabase) {
        try {
          const remoteFull = await this.fetchFromSupabase('site_full');
          if (remoteFull && typeof remoteFull === 'object') {
            data = remoteFull;
            this.isSupabaseReady = true;
            localStorage.setItem('rck_site_data', JSON.stringify(data));
            this.applyToMenuData(data);
            window.dispatchEvent(new CustomEvent('rck_data_updated', { detail: data }));
            return data;
          }

          // If site_full not found, try fetching individual keys
          const [remoteProducts, remoteCategories, remotePlans, remoteSettings] = await Promise.all([
            this.fetchFromSupabase('products'),
            this.fetchFromSupabase('categories'),
            this.fetchFromSupabase('subscriptionPlans'),
            this.fetchFromSupabase('siteSettings')
          ]);

          if (remoteProducts || remoteCategories || remotePlans) {
            data = this.getFullSiteData();
            if (remoteProducts) data.products = remoteProducts;
            if (remoteCategories) data.categories = remoteCategories;
            if (remotePlans) data.subscriptionPlans = remotePlans;
            if (remoteSettings) data.siteSettings = remoteSettings;
            
            this.isSupabaseReady = true;
            localStorage.setItem('rck_site_data', JSON.stringify(data));
            this.applyToMenuData(data);
            window.dispatchEvent(new CustomEvent('rck_data_updated', { detail: data }));
            return data;
          }
        } catch (err) {
          console.warn('[RCK_DB] Supabase live fetch error:', err.message);
        }
      }

      // 3. Fallback to default MENU_DATA
      if (!data) {
        data = this.getFullSiteData();
      }
      return data;
    },

    applyToMenuData(data) {
      if (!window.MENU_DATA) return;
      if (data.products && Array.isArray(data.products)) window.MENU_DATA.products = data.products;
      if (data.categories && Array.isArray(data.categories)) window.MENU_DATA.categories = data.categories;
      if (data.subscriptionPlans && Array.isArray(data.subscriptionPlans)) window.MENU_DATA.subscriptionPlans = data.subscriptionPlans;
      if (data.subscriberBreakfastMenu) window.MENU_DATA.subscriberBreakfastMenu = data.subscriberBreakfastMenu;
      if (data.subscriberMonthlyMenu) window.MENU_DATA.subscriberMonthlyMenu = data.subscriberMonthlyMenu;
      if (data.subscriberDinnerMenu) window.MENU_DATA.subscriberDinnerMenu = data.subscriberDinnerMenu;
      if (data.siteSettings) window.MENU_DATA.siteSettings = data.siteSettings;
      if (data.reviews && Array.isArray(data.reviews)) window.MENU_DATA.reviews = data.reviews;
    },

    getFullSiteData() {
      // Gather current state from window.MENU_DATA or defaults
      const base = window.MENU_DATA || {};
      const cached = localStorage.getItem('rck_site_data');
      let saved = {};
      if (cached) {
        try { saved = JSON.parse(cached); } catch(e) {}
      }

      return {
        siteSettings: saved.siteSettings || base.siteSettings || {
          brandName: "Rayalaseema Cloud Kitchen",
          tagline: "Authentic Andhra & Seema Flavors Delivered Fresh Daily",
          heroTitle: "Pure Rayalaseema Flavors, Delivered Fresh Daily to Your Office & Home",
          heroSubtitle: "Zero Soda. Zero Palm Oil. Wood-Pressed Oils & Heritage Recipes. Enjoy authentic 10-day meal subscriptions & daily chef bowls.",
          announcementText: "🔥 ZERO FOOD LOSS GUARANTEE: Flexible 10-Day Subscriptions • Pause Anytime Before 5:30 PM • 100% Preserved Days!",
          phone: "+91 98765 43210",
          whatsapp: "+91 98765 43210",
          email: "support@rayalaseemafoods.com",
          address: "Hitec City / Madhapur Corridor, Hyderabad",
          upiId: "rayalaseemafoods@okaxis",
          heroBannerImage: "image.png"
        },
        categories: saved.categories || base.categories || [],
        products: saved.products || base.products || [],
        subscriptionPlans: saved.subscriptionPlans || base.subscriptionPlans || [],
        subscriberBreakfastMenu: saved.subscriberBreakfastMenu || base.subscriberBreakfastMenu || {},
        subscriberMonthlyMenu: saved.subscriberMonthlyMenu || base.subscriberMonthlyMenu || {},
        subscriberDinnerMenu: saved.subscriberDinnerMenu || base.subscriberDinnerMenu || {},
        reviews: saved.reviews || base.reviews || []
      };
    },

    saveFullSiteData(fullData) {
      localStorage.setItem('rck_site_data', JSON.stringify(fullData));
      this.applyToMenuData(fullData);
      this.saveToSupabase('site_full', fullData);
      window.dispatchEvent(new CustomEvent('rck_data_updated', { detail: fullData }));
    },

    // ==========================================
    // PRODUCTS CRUD
    // ==========================================
    getProducts() {
      const data = this.getFullSiteData();
      return data.products || [];
    },

    async saveProduct(product) {
      const full = this.getFullSiteData();
      const list = full.products || [];
      const idx = list.findIndex(p => p.id === product.id);

      if (idx !== -1) {
        list[idx] = { ...list[idx], ...product, updated_at: new Date().toISOString() };
      } else {
        list.unshift({ ...product, created_at: new Date().toISOString() });
      }

      full.products = list;
      this.saveFullSiteData(full);
      this.saveToSupabase('products', list);
      return list;
    },

    async deleteProduct(productId) {
      const full = this.getFullSiteData();
      full.products = (full.products || []).filter(p => p.id !== productId);
      this.saveFullSiteData(full);
      this.saveToSupabase('products', full.products);
      return full.products;
    },

    // ==========================================
    // CATEGORIES CRUD
    // ==========================================
    getCategories() {
      const data = this.getFullSiteData();
      return data.categories || [];
    },

    async saveCategory(cat) {
      const full = this.getFullSiteData();
      const list = full.categories || [];
      const idx = list.findIndex(c => c.id === cat.id);

      if (idx !== -1) {
        list[idx] = { ...list[idx], ...cat };
      } else {
        list.push(cat);
      }

      full.categories = list;
      this.saveFullSiteData(full);
      this.saveToSupabase('categories', list);
      return list;
    },

    async deleteCategory(catId) {
      const full = this.getFullSiteData();
      full.categories = (full.categories || []).filter(c => c.id !== catId);
      this.saveFullSiteData(full);
      this.saveToSupabase('categories', full.categories);
      return full.categories;
    },

    // ==========================================
    // SUBSCRIPTIONS (10-DAY KITCHEN DISPATCH)
    // ==========================================
    getSubscriptions() {
      try {
        const saved = localStorage.getItem('rck_subscriptions');
        if (saved) return JSON.parse(saved);
        if (window.MENU_DATA && window.MENU_DATA.initialSubscriptions) {
          return window.MENU_DATA.initialSubscriptions;
        }
      } catch (e) {}
      return [];
    },

    saveSubscriptions(list) {
      localStorage.setItem('rck_subscriptions', JSON.stringify(list));
      this.saveToSupabase('subscriptions', list);
    },

    // ==========================================
    // ORDERS CRUD
    // ==========================================
    getOrders() {
      try {
        const saved = localStorage.getItem('rck_orders');
        if (saved) return JSON.parse(saved);
        if (window.MENU_DATA && window.MENU_DATA.initialOrders) {
          return window.MENU_DATA.initialOrders;
        }
      } catch (e) {}
      return [];
    },

    saveOrders(list) {
      localStorage.setItem('rck_orders', JSON.stringify(list));
      this.saveToSupabase('orders', list);
    },

    updateOrderStatus(orderId, newStatus) {
      const orders = this.getOrders();
      const order = orders.find(o => o.id === orderId);
      if (order) {
        order.status = newStatus;
        this.saveOrders(orders);
        return true;
      }
      return false;
    }
  };

  // Expose to window
  window.RCK_DB = RCK_DB;

  // Auto-init on script load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => RCK_DB.loadSiteData());
  } else {
    RCK_DB.loadSiteData();
  }

})(window);
