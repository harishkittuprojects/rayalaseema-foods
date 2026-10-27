// ==============================================================================
// RAYALASEEMA CLOUD KITCHEN - MASTER ADMIN LOGIC (js/admin.js)
// ==============================================================================

let currentAdminTab = 'dashboard';
let currentMenuSubTab = 'lunch';
let filteredDishes = [];

// ==========================================
// 1. AUTHENTICATION & INITIALIZATION
// ==========================================
document.addEventListener('DOMContentLoaded', async () => {
  checkAdminAuth();
  updateCutoffClock();
  setInterval(updateCutoffClock, 30000);

  // Listen for data updates
  window.addEventListener('rck_data_updated', () => {
    refreshAllAdminViews();
  });
});

function checkAdminAuth() {
  const session = window.RCK_DB ? window.RCK_DB.getAdminSession() : null;
  const authScreen = document.getElementById('admin-auth-screen');
  const mainPortal = document.getElementById('admin-main-portal');

  if (session && session.email) {
    if (authScreen) authScreen.classList.add('hidden');
    if (mainPortal) mainPortal.classList.remove('hidden');
    initAdminData();
  } else {
    if (authScreen) authScreen.classList.remove('hidden');
    if (mainPortal) mainPortal.classList.add('hidden');
  }
}

async function handleAdminLogin(e) {
  e.preventDefault();
  const email = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-password').value.trim();
  const errBox = document.getElementById('login-error-msg');
  const submitBtn = document.getElementById('login-submit-btn');

  errBox.classList.add('hidden');
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<span>Verifying credentials...</span>';

  try {
    const result = await window.RCK_DB.adminLogin(email, password);
    if (result.success) {
      showAdminToast(`Welcome, ${result.user.email}! Master Admin Portal unlocked.`);
      checkAdminAuth();
    } else {
      errBox.textContent = result.error || 'Invalid email or password. Please try again.';
      errBox.classList.remove('hidden');
    }
  } catch (err) {
    errBox.textContent = 'Login error: ' + err.message;
    errBox.classList.remove('hidden');
  } finally {
    submitBtn.disabled = false;
    submitBtn.innerHTML = `<span>Sign In to Admin Portal</span><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>`;
  }
}

function handleAdminLogout() {
  if (confirm("Are you sure you want to sign out of the Admin Portal?")) {
    window.RCK_DB.adminLogout();
    checkAdminAuth();
    showAdminToast("Signed out successfully.");
  }
}

function togglePasswordVisibility() {
  const input = document.getElementById('login-password');
  if (input) {
    input.type = input.type === 'password' ? 'text' : 'password';
  }
}

// ==========================================
// 2. DATA INITIALIZATION & TAB ROUTER
// ==========================================
async function initAdminData() {
  // Load database state
  await window.RCK_DB.loadSiteData();
  refreshAllAdminViews();
}

function refreshAllAdminViews() {
  renderDashboardStats();
  renderDishesTable();
  renderCategoriesGrid();
  renderRotationalMenus();
  renderSubscriptionPlans();
  renderSubscribersTable();
  renderOrdersTable();
  renderSettingsForm();
}

function switchAdminTab(tabName) {
  currentAdminTab = tabName;

  // Update tab button styles
  const allBtns = document.querySelectorAll('.admin-tab-btn');
  allBtns.forEach(btn => {
    btn.className = 'admin-tab-btn px-3 py-2 rounded-xl text-zinc-400 hover:text-white flex items-center gap-1.5 transition';
  });
  const activeBtn = document.getElementById(`tab-btn-${tabName}`);
  if (activeBtn) {
    activeBtn.className = 'admin-tab-btn px-3 py-2 rounded-xl text-amber-400 bg-zinc-800 flex items-center gap-1.5 shadow-sm';
  }

  // Hide all tab panels, show active
  const panels = document.querySelectorAll('.tab-panel');
  panels.forEach(p => p.classList.add('hidden'));

  const activePanel = document.getElementById(`tab-content-${tabName}`);
  if (activePanel) {
    activePanel.classList.remove('hidden');
  }

  // Scroll to top of content
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ==========================================
// 3. DASHBOARD METRICS & PREP QUEUE
// ==========================================
function renderDashboardStats() {
  const dishes = window.RCK_DB.getProducts();
  const categories = window.RCK_DB.getCategories();
  const subs = window.RCK_DB.getSubscriptions();

  const activeTomorrow = subs.filter(s => s.status === 'Active' && !s.isPausedTomorrow && s.consumedDays < s.totalDays);

  const statDishes = document.getElementById('stat-total-dishes');
  const statCats = document.getElementById('stat-total-cats');
  const statSubs = document.getElementById('stat-active-subs');
  const statPrep = document.getElementById('stat-prep-tomorrow');

  if (statDishes) statDishes.textContent = dishes.length;
  if (statCats) statCats.textContent = categories.length;
  if (statSubs) statSubs.textContent = subs.filter(s => s.status === 'Active').length;
  if (statPrep) statPrep.textContent = activeTomorrow.length;

  // Render Kitchen Prep List on Dashboard
  const summaryBox = document.getElementById('dashboard-kitchen-summary');
  if (summaryBox) {
    if (activeTomorrow.length === 0) {
      summaryBox.innerHTML = `
        <div class="p-6 bg-zinc-950 rounded-2xl border border-zinc-800 text-center text-xs text-zinc-500">
          No meals scheduled for tomorrow's dispatch.
        </div>
      `;
    } else {
      summaryBox.innerHTML = activeTomorrow.slice(0, 5).map(s => `
        <div class="bg-zinc-950 rounded-2xl p-3.5 border border-zinc-800 flex items-center justify-between gap-3">
          <div>
            <div class="flex items-center gap-2">
              <span class="text-xs font-bold text-white">${s.customerName}</span>
              <span class="text-[10px] font-black px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                ${s.mealType || 'Rayalaseema Deluxe Meal'}
              </span>
            </div>
            <div class="text-[11px] text-zinc-400 mt-1">📍 ${s.customerAddress} • Day ${s.consumedDays + 1} of ${s.totalDays}</div>
          </div>
          <span class="text-xs font-bold text-amber-400">12:30 PM Dispatch</span>
        </div>
      `).join('');
    }
  }
}

// ==========================================
// 4. DISHES & PRODUCTS CRUD + CLOUDINARY
// ==========================================
function renderDishesTable() {
  const tbody = document.getElementById('dishes-table-body');
  if (!tbody) return;

  const products = window.RCK_DB.getProducts();
  const categories = window.RCK_DB.getCategories();

  // Populate category filter and modal dropdown
  const catFilter = document.getElementById('dish-category-filter');
  const modalCatSelect = document.getElementById('dish-category');

  if (catFilter && catFilter.children.length <= 1) {
    catFilter.innerHTML = '<option value="all">All Categories</option>' + 
      categories.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
  }

  if (modalCatSelect) {
    modalCatSelect.innerHTML = categories.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
  }

  // Filter products
  const searchVal = (document.getElementById('dish-search-input')?.value || '').toLowerCase().trim();
  const selectedCat = document.getElementById('dish-category-filter')?.value || 'all';
  const selectedDiet = document.getElementById('dish-diet-filter')?.value || 'all';

  filteredDishes = products.filter(p => {
    const matchesSearch = !searchVal || p.name.toLowerCase().includes(searchVal) || (p.description && p.description.toLowerCase().includes(searchVal));
    const matchesCat = selectedCat === 'all' || p.category === selectedCat;
    const matchesDiet = selectedDiet === 'all' || (selectedDiet === 'veg' ? p.isVeg : !p.isVeg);
    return matchesSearch && matchesCat && matchesDiet;
  });

  if (filteredDishes.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="8" class="p-8 text-center text-zinc-500">
          No dishes match your filter criteria. Click "+ Add New Dish" above.
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = filteredDishes.map(p => `
    <tr class="hover:bg-zinc-800/40 transition">
      <td class="p-3.5">
        <img src="${p.image || 'images/veg-meals.jpg'}" alt="${p.name}" class="w-12 h-12 rounded-xl object-cover border border-zinc-700 bg-zinc-950" />
      </td>
      <td class="p-3.5">
        <div class="font-bold text-white text-xs">${p.name}</div>
        <div class="text-[11px] text-zinc-400 line-clamp-1 max-w-xs mt-0.5">${p.description || 'Traditional recipe'}</div>
      </td>
      <td class="p-3.5">
        <span class="inline-block bg-zinc-800 text-amber-300 px-2.5 py-0.5 rounded-md text-[10px] font-bold">
          ${p.categoryName || p.category}
        </span>
      </td>
      <td class="p-3.5">
        <div class="font-extrabold text-white">₹${p.price}</div>
        ${p.originalPrice ? `<div class="text-[10px] text-zinc-500 line-through">₹${p.originalPrice}</div>` : ''}
      </td>
      <td class="p-3.5">
        <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold ${p.isVeg ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30' : 'bg-red-950 text-red-400 border border-red-500/30'}">
          ${p.isVeg ? '🟢 Veg' : '🔴 Non-Veg'}
        </span>
      </td>
      <td class="p-3.5 text-zinc-400 text-[11px]">
        <div>${p.calories || '250 kcal'}</div>
        <div class="text-[10px] text-zinc-500">${p.protein || '10g Protein'}</div>
      </td>
      <td class="p-3.5">
        ${p.popular ? '<span class="text-amber-400 font-bold text-sm" title="Featured on Homepage">⭐ Yes</span>' : '<span class="text-zinc-600 text-xs">No</span>'}
      </td>
      <td class="p-3.5 text-right whitespace-nowrap">
        <button onclick="openDishModal('${p.id}')" class="px-2.5 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold rounded-lg transition mr-1 cursor-pointer">
          ✏️ Edit
        </button>
        <button onclick="handleDeleteDish('${p.id}')" class="px-2.5 py-1.5 bg-red-950/60 hover:bg-red-900 text-red-300 text-xs font-bold rounded-lg transition cursor-pointer">
          🗑️
        </button>
      </td>
    </tr>
  `).join('');
}

function filterDishesTable() {
  renderDishesTable();
}

function openDishModal(dishId = null) {
  const modal = document.getElementById('dish-modal');
  const form = document.getElementById('dish-form');
  const title = document.getElementById('dish-modal-title');
  const statusSpan = document.getElementById('dish-upload-status');
  if (statusSpan) statusSpan.textContent = '';

  const categories = window.RCK_DB.getCategories();
  const modalCatSelect = document.getElementById('dish-category');
  if (modalCatSelect) {
    modalCatSelect.innerHTML = categories.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
  }

  if (dishId) {
    const dish = window.RCK_DB.getProducts().find(p => p.id === dishId);
    if (!dish) return;
    title.textContent = 'Edit Dish: ' + dish.name;
    document.getElementById('dish-id').value = dish.id;
    document.getElementById('dish-name').value = dish.name;
    document.getElementById('dish-category').value = dish.category;
    document.getElementById('dish-is-veg').value = dish.isVeg ? 'true' : 'false';
    document.getElementById('dish-price').value = dish.price;
    document.getElementById('dish-orig-price').value = dish.originalPrice || '';
    document.getElementById('dish-calories').value = dish.calories || '';
    document.getElementById('dish-protein').value = dish.protein || '';
    document.getElementById('dish-description').value = dish.description || '';
    document.getElementById('dish-image-url').value = dish.image || '';
    document.getElementById('dish-image-preview').src = dish.image || 'images/veg-meals.jpg';
    document.getElementById('dish-popular').checked = !!dish.popular;
  } else {
    title.textContent = 'Add New Dish';
    form.reset();
    document.getElementById('dish-id').value = '';
    document.getElementById('dish-image-preview').src = 'images/veg-meals.jpg';
  }

  modal.classList.remove('hidden');
}

function closeDishModal() {
  document.getElementById('dish-modal').classList.add('hidden');
}

// Direct Cloudinary Upload for Dish Modal
async function handleDishImageChosen(event) {
  const file = event.target.files[0];
  if (!file) return;

  const statusSpan = document.getElementById('dish-upload-status');
  const urlInput = document.getElementById('dish-image-url');
  const preview = document.getElementById('dish-image-preview');
  const saveBtn = document.getElementById('btn-save-dish');

  statusSpan.textContent = '⏳ Uploading to Cloudinary...';
  statusSpan.className = 'text-[10px] text-amber-400 font-bold animate-pulse';
  if (saveBtn) saveBtn.disabled = true;

  try {
    const res = await window.RCK_DB.uploadImageToCloudinary(file);
    urlInput.value = res.url;
    preview.src = res.url;
    statusSpan.textContent = '✓ Uploaded to Cloudinary!';
    statusSpan.className = 'text-[10px] text-emerald-400 font-bold';
    showAdminToast('Dish image successfully uploaded to Cloudinary!');
  } catch (err) {
    statusSpan.textContent = 'Upload failed: ' + err.message;
    statusSpan.className = 'text-[10px] text-red-400 font-bold';
    alert('Cloudinary upload error: ' + err.message);
  } finally {
    if (saveBtn) saveBtn.disabled = false;
  }
}

async function handleSaveDish(e) {
  e.preventDefault();
  const id = document.getElementById('dish-id').value.trim() || ('dish-' + Date.now());
  const name = document.getElementById('dish-name').value.trim();
  const categoryId = document.getElementById('dish-category').value;
  const categories = window.RCK_DB.getCategories();
  const categoryObj = categories.find(c => c.id === categoryId);
  const categoryName = categoryObj ? categoryObj.name : "Special Dish";

  const isVeg = document.getElementById('dish-is-veg').value === 'true';
  const price = parseFloat(document.getElementById('dish-price').value) || 0;
  const originalPrice = parseFloat(document.getElementById('dish-orig-price').value) || null;
  const calories = document.getElementById('dish-calories').value.trim() || '260 kcal';
  const protein = document.getElementById('dish-protein').value.trim() || '10g Protein';
  const description = document.getElementById('dish-description').value.trim();
  const image = document.getElementById('dish-image-url').value.trim() || (isVeg ? 'images/veg-meals.jpg' : 'images/nonveg-meals.jpg');
  const popular = document.getElementById('dish-popular').checked;

  const dishPayload = {
    id,
    name,
    category: categoryId,
    categoryName,
    price,
    originalPrice,
    isVeg,
    calories,
    protein,
    description,
    image,
    popular
  };

  await window.RCK_DB.saveProduct(dishPayload);
  closeDishModal();
  renderDishesTable();
  renderDashboardStats();
  showAdminToast(`✓ Dish "${name}" saved to database and live website!`);
}

async function handleDeleteDish(dishId) {
  const dish = window.RCK_DB.getProducts().find(p => p.id === dishId);
  if (!dish) return;

  if (confirm(`Are you sure you want to delete "${dish.name}" from the menu?`)) {
    await window.RCK_DB.deleteProduct(dishId);
    renderDishesTable();
    renderDashboardStats();
    showAdminToast(`Removed "${dish.name}" from menu.`);
  }
}

// ==========================================
// 5. CATEGORIES CRUD
// ==========================================
function renderCategoriesGrid() {
  const container = document.getElementById('categories-grid-container');
  if (!container) return;

  const categories = window.RCK_DB.getCategories();
  const products = window.RCK_DB.getProducts();

  container.innerHTML = categories.map(cat => {
    const count = products.filter(p => p.category === cat.id).length;
    return `
      <div class="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 space-y-3 relative overflow-hidden group">
        <div class="flex items-center gap-3">
          <img src="${cat.image || 'images/veg-meals.jpg'}" alt="${cat.name}" class="w-14 h-14 rounded-2xl object-cover border border-zinc-700 bg-zinc-950 shrink-0" />
          <div class="flex-1 min-w-0">
            <span class="text-[10px] font-black uppercase text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded">${cat.badge || 'House Special'}</span>
            <h3 class="text-base font-bold text-white truncate mt-1">${cat.name}</h3>
            <span class="text-xs text-zinc-400">${count} active dishes</span>
          </div>
        </div>
        <p class="text-xs text-zinc-400 line-clamp-2 leading-relaxed">${cat.description || cat.tagline || ''}</p>
        <div class="pt-2 border-t border-zinc-800/80 flex items-center justify-between">
          <span class="text-[11px] text-zinc-500 font-mono">ID: ${cat.id}</span>
          <div class="flex items-center gap-1.5">
            <button onclick="openCategoryModal('${cat.id}')" class="px-3 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold rounded-lg transition cursor-pointer">
              Edit
            </button>
            <button onclick="handleDeleteCategory('${cat.id}')" class="px-2.5 py-1 bg-red-950/60 hover:bg-red-900 text-red-300 text-xs font-bold rounded-lg transition cursor-pointer">
              🗑️
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function openCategoryModal(catId = null) {
  const modal = document.getElementById('category-modal');
  const title = document.getElementById('category-modal-title');

  if (catId) {
    const cat = window.RCK_DB.getCategories().find(c => c.id === catId);
    if (!cat) return;
    title.textContent = 'Edit Category: ' + cat.name;
    document.getElementById('category-id').value = cat.id;
    document.getElementById('category-name').value = cat.name;
    document.getElementById('category-tagline').value = cat.tagline || '';
    document.getElementById('category-description').value = cat.description || '';
    document.getElementById('category-badge').value = cat.badge || '';
    document.getElementById('category-color').value = cat.color || 'amber';
    document.getElementById('category-image-url').value = cat.image || '';
  } else {
    title.textContent = 'Add Category';
    document.getElementById('category-form').reset();
    document.getElementById('category-id').value = '';
  }

  modal.classList.remove('hidden');
}

function closeCategoryModal() {
  document.getElementById('category-modal').classList.add('hidden');
}

async function handleCatImageChosen(e) {
  const file = e.target.files[0];
  if (!file) return;
  try {
    showAdminToast('Uploading category image to Cloudinary...');
    const res = await window.RCK_DB.uploadImageToCloudinary(file);
    document.getElementById('category-image-url').value = res.url;
    showAdminToast('✓ Category image uploaded to Cloudinary!');
  } catch (err) {
    alert('Upload failed: ' + err.message);
  }
}

async function handleSaveCategory(e) {
  e.preventDefault();
  const id = document.getElementById('category-id').value.trim() || ('cat-' + Date.now());
  const name = document.getElementById('category-name').value.trim();
  const tagline = document.getElementById('category-tagline').value.trim();
  const description = document.getElementById('category-description').value.trim();
  const badge = document.getElementById('category-badge').value.trim();
  const color = document.getElementById('category-color').value;
  const image = document.getElementById('category-image-url').value.trim() || 'images/veg-meals.jpg';

  const catPayload = { id, name, tagline, description, badge, color, image };
  await window.RCK_DB.saveCategory(catPayload);
  closeCategoryModal();
  renderCategoriesGrid();
  renderDashboardStats();
  showAdminToast(`✓ Category "${name}" saved!`);
}

async function handleDeleteCategory(catId) {
  const cat = window.RCK_DB.getCategories().find(c => c.id === catId);
  if (!cat) return;
  if (confirm(`Delete category "${cat.name}"? Dishes in this category will remain.`)) {
    await window.RCK_DB.deleteCategory(catId);
    renderCategoriesGrid();
    showAdminToast(`Category "${cat.name}" deleted.`);
  }
}

// ==========================================
// 6. ROTATIONAL MENUS (LUNCH, BREAKFAST, DINNER)
// ==========================================
function switchMenuSubTab(subTab) {
  currentMenuSubTab = subTab;
  ['lunch', 'breakfast', 'dinner'].forEach(t => {
    const btn = document.getElementById(`menu-subtab-${t}`);
    const panel = document.getElementById(`menu-panel-${t}`);
    if (btn) {
      btn.className = t === subTab 
        ? 'px-4 py-2 text-xs font-bold border-b-2 border-amber-400 text-amber-400' 
        : 'px-4 py-2 text-xs font-bold text-zinc-400 hover:text-white border-b-2 border-transparent';
    }
    if (panel) {
      if (t === subTab) panel.classList.remove('hidden');
      else panel.classList.add('hidden');
    }
  });
}

function renderRotationalMenus() {
  const data = window.RCK_DB.getFullSiteData();

  // 1. Lunch Rotation (Day 1 - 15)
  const lunchContainer = document.getElementById('lunch-rotation-list');
  const lunchMenu = data.subscriberMonthlyMenu;
  if (lunchContainer && lunchMenu && lunchMenu.days) {
    lunchContainer.innerHTML = lunchMenu.days.map((d, idx) => `
      <div class="bg-zinc-950 border border-zinc-800 rounded-2xl p-4 space-y-2.5">
        <div class="flex items-center justify-between">
          <span class="text-xs font-black text-amber-400">Day ${d.dayNum || (idx + 1)}</span>
          <span class="text-[10px] text-zinc-500 font-bold">${d.date || `Day ${idx + 1}`}</span>
        </div>
        <div>
          <label class="block text-[10px] font-bold text-zinc-400 mb-0.5">Special Curry</label>
          <input type="text" id="lunch-curry-${idx}" class="w-full px-2.5 py-1.5 bg-zinc-900 border border-zinc-700 rounded-lg text-xs text-white" value="${d.curry || ''}" />
        </div>
        <div>
          <label class="block text-[10px] font-bold text-zinc-400 mb-0.5">Bread / Rice</label>
          <input type="text" id="lunch-bread-${idx}" class="w-full px-2.5 py-1.5 bg-zinc-900 border border-zinc-700 rounded-lg text-xs text-white" value="${d.bread || ''}" />
        </div>
      </div>
    `).join('');
  }

  // 2. Breakfast Rotation
  const bfContainer = document.getElementById('breakfast-rotation-list');
  const bfMenu = data.subscriberBreakfastMenu;
  if (bfContainer && bfMenu && bfMenu.items) {
    bfContainer.innerHTML = bfMenu.items.map((b, idx) => `
      <div class="bg-zinc-950 border border-zinc-800 rounded-2xl p-3.5 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div class="flex items-center gap-2.5">
          <span class="text-xl">${b.icon || '🥞'}</span>
          <div>
            <div class="text-xs font-bold text-white">${b.name}</div>
            <div class="text-[10px] text-zinc-400">${b.chutneys || 'Groundnut & Ginger Chutney'}</div>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <input type="text" id="bf-desc-${idx}" class="px-2.5 py-1.5 bg-zinc-900 border border-zinc-700 rounded-lg text-xs text-white w-48 sm:w-64" value="${b.description || ''}" />
        </div>
      </div>
    `).join('');
  }

  // 3. Dinner Menu & Flyer
  const dinnerMenu = data.subscriberDinnerMenu || {};
  const dinnerTiming = document.getElementById('dinner-timing-input');
  const dinnerTitle = document.getElementById('dinner-title-input');
  const dinnerFlyerUrl = document.getElementById('dinner-flyer-url');
  const dinnerPreview = document.getElementById('dinner-flyer-preview');

  if (dinnerTiming && dinnerMenu.operatingHours) dinnerTiming.value = dinnerMenu.operatingHours;
  if (dinnerTitle && dinnerMenu.title) dinnerTitle.value = dinnerMenu.title;
  if (dinnerFlyerUrl && dinnerMenu.flyerImage) {
    dinnerFlyerUrl.value = dinnerMenu.flyerImage;
    if (dinnerPreview) dinnerPreview.src = dinnerMenu.flyerImage;
  }
}

function uploadFlyerToCloudinary() {
  document.getElementById('dinner-flyer-file').click();
}

async function handleFlyerFileChosen(e) {
  const file = e.target.files[0];
  if (!file) return;
  try {
    showAdminToast('Uploading dinner flyer to Cloudinary...');
    const res = await window.RCK_DB.uploadImageToCloudinary(file);
    document.getElementById('dinner-flyer-url').value = res.url;
    document.getElementById('dinner-flyer-preview').src = res.url;
    showAdminToast('✓ Dinner flyer uploaded to Cloudinary!');
  } catch (err) {
    alert('Upload failed: ' + err.message);
  }
}

async function saveAllMenuChanges() {
  const full = window.RCK_DB.getFullSiteData();

  // Save Lunch changes
  if (full.subscriberMonthlyMenu && full.subscriberMonthlyMenu.days) {
    full.subscriberMonthlyMenu.days.forEach((d, idx) => {
      const curryInput = document.getElementById(`lunch-curry-${idx}`);
      const breadInput = document.getElementById(`lunch-bread-${idx}`);
      if (curryInput) d.curry = curryInput.value.trim();
      if (breadInput) d.bread = breadInput.value.trim();
    });
  }

  // Save Breakfast changes
  if (full.subscriberBreakfastMenu && full.subscriberBreakfastMenu.items) {
    full.subscriberBreakfastMenu.items.forEach((b, idx) => {
      const descInput = document.getElementById(`bf-desc-${idx}`);
      if (descInput) b.description = descInput.value.trim();
    });
  }

  // Save Dinner changes
  if (!full.subscriberDinnerMenu) full.subscriberDinnerMenu = {};
  const dinnerTiming = document.getElementById('dinner-timing-input');
  const dinnerTitle = document.getElementById('dinner-title-input');
  const dinnerFlyer = document.getElementById('dinner-flyer-url');

  if (dinnerTiming) full.subscriberDinnerMenu.operatingHours = dinnerTiming.value.trim();
  if (dinnerTitle) full.subscriberDinnerMenu.title = dinnerTitle.value.trim();
  if (dinnerFlyer && dinnerFlyer.value.trim()) full.subscriberDinnerMenu.flyerImage = dinnerFlyer.value.trim();

  window.RCK_DB.saveFullSiteData(full);
  showAdminToast('✓ All menu schedules & dinner flyer saved to Supabase & live store!');
}

// ==========================================
// 7. SUBSCRIPTION PLANS & PACKAGES
// ==========================================
function renderSubscriptionPlans() {
  const container = document.getElementById('subscription-plans-cards');
  if (!container) return;

  const data = window.RCK_DB.getFullSiteData();
  const plans = data.subscriptionPlans || [];

  container.innerHTML = plans.map(p => `
    <div class="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 space-y-3">
      <div class="flex items-center justify-between">
        <span class="text-[10px] font-black uppercase text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded">${p.badge || 'Plan'}</span>
        <span class="text-xs font-bold text-zinc-400">${p.days} Days</span>
      </div>
      <h3 class="text-base font-bold text-white">${p.name}</h3>
      <div>
        <label class="block text-[10px] font-bold text-zinc-400 mb-0.5">Total Plan Price (₹)</label>
        <input type="text" id="plan-price-${p.id}" class="w-full px-3 py-1.5 bg-zinc-950 border border-zinc-700 rounded-xl text-xs text-white" value="${p.totalPrice}" />
      </div>
      <div>
        <label class="block text-[10px] font-bold text-zinc-400 mb-0.5">Per Meal Rate Label</label>
        <input type="text" id="plan-meal-rate-${p.id}" class="w-full px-3 py-1.5 bg-zinc-950 border border-zinc-700 rounded-xl text-xs text-white" value="${p.pricePerMeal || ''}" />
      </div>
      <button onclick="savePlanChanges('${p.id}')" class="w-full py-2 bg-zinc-800 hover:bg-zinc-700 text-amber-400 font-bold text-xs rounded-xl transition cursor-pointer">
        Save Price
      </button>
    </div>
  `).join('');
}

async function savePlanChanges(planId) {
  const full = window.RCK_DB.getFullSiteData();
  const plan = (full.subscriptionPlans || []).find(p => p.id === planId);
  if (!plan) return;

  const priceInput = document.getElementById(`plan-price-${planId}`);
  const rateInput = document.getElementById(`plan-meal-rate-${planId}`);

  if (priceInput) plan.totalPrice = priceInput.value.trim();
  if (rateInput) plan.pricePerMeal = rateInput.value.trim();

  window.RCK_DB.saveFullSiteData(full);
  showAdminToast(`✓ Updated pricing for ${plan.name}!`);
}

// ==========================================
// 8. KITCHEN DISPATCH & 10-DAY OPERATIONS
// ==========================================
function renderSubscribersTable() {
  const tbody = document.getElementById('subscribers-table-body');
  if (!tbody) return;

  const subs = window.RCK_DB.getSubscriptions();

  // KPIs
  const total = subs.length;
  const active = subs.filter(s => s.status === 'Active' && !s.isPausedTomorrow && s.consumedDays < s.totalDays).length;
  const paused = subs.filter(s => s.isPausedTomorrow || s.status === 'Paused for Tomorrow').length;
  const completed = subs.filter(s => s.status === 'Completed' || s.consumedDays >= s.totalDays).length;

  document.getElementById('sub-kpi-total').textContent = total;
  document.getElementById('sub-kpi-active').textContent = active;
  document.getElementById('sub-kpi-paused').textContent = paused;
  document.getElementById('sub-kpi-completed').textContent = completed;

  if (subs.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" class="p-8 text-center text-zinc-500">No subscriptions registered.</td></tr>`;
    return;
  }

  tbody.innerHTML = subs.map(s => {
    const isCompleted = s.status === 'Completed' || s.consumedDays >= s.totalDays;
    const isPaused = s.isPausedTomorrow || s.status === 'Paused for Tomorrow';

    return `
      <tr class="hover:bg-zinc-800/40 transition">
        <td class="p-3.5">
          <div class="font-bold text-white text-xs">${s.customerName}</div>
          <div class="text-[11px] text-zinc-400">${s.customerPhone}</div>
          <div class="text-[10px] text-zinc-500 line-clamp-1 max-w-xs">📍 ${s.customerAddress || 'Hitec City'}</div>
        </td>
        <td class="p-3.5">
          <span class="inline-block bg-zinc-800 text-emerald-400 px-2.5 py-0.5 rounded-md text-[10px] font-bold">
            ${s.mealType || 'Deluxe Veg Meal'}
          </span>
        </td>
        <td class="p-3.5">
          <div class="font-bold text-white text-xs">${s.consumedDays}/${s.totalDays} Consumed</div>
          <div class="text-[10px] text-amber-400 font-bold">${s.remainingDays} days remaining</div>
        </td>
        <td class="p-3.5">
          <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${isCompleted ? 'bg-zinc-800 text-zinc-400' : isPaused ? 'bg-amber-950 text-amber-300 border border-amber-500/30' : 'bg-emerald-950 text-emerald-300 border border-emerald-500/30'}">
            ${isCompleted ? '🎉 Completed' : isPaused ? '⏸️ Paused' : '🟢 Active'}
          </span>
        </td>
        <td class="p-3.5 text-zinc-300 text-xs font-semibold">
          ${isCompleted ? 'All Consumed' : isPaused ? 'Resumes Day After' : 'Tomorrow (12:30 PM)'}
        </td>
        <td class="p-3.5">
          ${(s.pausedDates && s.pausedDates.length > 0) ? s.pausedDates.map(d => `<span class="inline-block bg-zinc-800 text-zinc-300 px-1.5 py-0.5 rounded text-[10px] mr-1">${d}</span>`).join('') : '<span class="text-zinc-600 text-[10px]">None</span>'}
        </td>
        <td class="p-3.5 text-right whitespace-nowrap">
          ${!isCompleted ? `
            <button onclick="adminMarkConsumed('${s.id}')" title="Record 1 Day Consumed" class="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition mr-1 cursor-pointer">
              +1 Consumed
            </button>
            <button onclick="adminTogglePause('${s.id}')" class="px-2.5 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-amber-400 rounded-lg text-xs font-bold transition cursor-pointer">
              ${isPaused ? '▶️ Resume' : '⏸️ Pause'}
            </button>
          ` : `
            <button onclick="adminResetPlan('${s.id}')" class="px-2.5 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg text-xs font-bold transition cursor-pointer">
              🔄 Reset
            </button>
          `}
        </td>
      </tr>
    `;
  }).join('');
}

function adminMarkConsumed(subId) {
  const subs = window.RCK_DB.getSubscriptions();
  const sub = subs.find(s => s.id === subId);
  if (!sub) return;

  if (sub.consumedDays >= sub.totalDays) {
    showAdminToast("Subscription has already completed all 10 days!");
    return;
  }

  sub.consumedDays += 1;
  sub.remainingDays = Math.max(0, sub.totalDays - sub.consumedDays);
  sub.isPausedTomorrow = false;

  if (sub.consumedDays >= sub.totalDays) {
    sub.status = "Completed";
  } else {
    sub.status = "Active";
  }

  window.RCK_DB.saveSubscriptions(subs);
  renderSubscribersTable();
  renderDashboardStats();
  showAdminToast(`Recorded Day ${sub.consumedDays}/10 consumed for ${sub.customerName}!`);
}

function adminTogglePause(subId) {
  const subs = window.RCK_DB.getSubscriptions();
  const sub = subs.find(s => s.id === subId);
  if (!sub) return;

  const isCurrentlyPaused = sub.isPausedTomorrow || sub.status === 'Paused for Tomorrow';
  if (isCurrentlyPaused) {
    sub.isPausedTomorrow = false;
    sub.status = "Active";
    showAdminToast(`▶️ Resumed subscription for ${sub.customerName} for tomorrow's dispatch.`);
  } else {
    sub.isPausedTomorrow = true;
    sub.status = "Paused for Tomorrow";
    showAdminToast(`⏸️ Paused subscription for ${sub.customerName}. Excluded from tomorrow.`);
  }

  window.RCK_DB.saveSubscriptions(subs);
  renderSubscribersTable();
  renderDashboardStats();
}

function adminResetPlan(subId) {
  const subs = window.RCK_DB.getSubscriptions();
  const sub = subs.find(s => s.id === subId);
  if (!sub) return;
  sub.consumedDays = 0;
  sub.remainingDays = 10;
  sub.status = "Active";
  sub.isPausedTomorrow = false;
  window.RCK_DB.saveSubscriptions(subs);
  renderSubscribersTable();
  showAdminToast(`Reset 10-day plan for ${sub.customerName}.`);
}

function openNewSubModal() {
  document.getElementById('new-sub-modal').classList.remove('hidden');
}

function closeNewSubModal() {
  document.getElementById('new-sub-modal').classList.add('hidden');
}

function handleCreateNewSubscription(e) {
  e.preventDefault();
  const name = document.getElementById('new-sub-name').value.trim();
  const phone = document.getElementById('new-sub-phone').value.trim();
  const meal = document.getElementById('new-sub-meal').value;
  const address = document.getElementById('new-sub-address').value.trim();
  const consumed = parseInt(document.getElementById('new-sub-consumed').value) || 0;

  const newSub = {
    id: "SUB-10D-" + Math.floor(10000 + Math.random() * 90000),
    customerName: name,
    customerPhone: phone,
    customerAddress: address,
    planId: "plan-trial",
    planName: "10-Day Food Subscription Plan",
    mealType: meal,
    totalDays: 10,
    consumedDays: consumed,
    remainingDays: 10 - consumed,
    status: "Active",
    isPausedTomorrow: false,
    pauseCutoff: "5:30 PM",
    nextDeliveryDate: "Tomorrow (12:30 PM)",
    pausedDates: []
  };

  const subs = window.RCK_DB.getSubscriptions();
  subs.unshift(newSub);
  window.RCK_DB.saveSubscriptions(subs);
  closeNewSubModal();
  renderSubscribersTable();
  renderDashboardStats();
  showAdminToast(`✓ Registered 10-Day Subscription for ${name}!`);
}

// 5:30 PM Cutoff Clock
function updateCutoffClock() {
  const mode = localStorage.getItem('rck_time_mode') || 'before';
  const badge = document.getElementById('admin-cutoff-badge');
  const timeDisplay = document.getElementById('admin-time-display');

  if (!badge || !timeDisplay) return;

  if (mode === 'before') {
    badge.className = 'hidden sm:flex px-3 py-1.5 rounded-full text-xs font-bold border items-center gap-1.5 bg-emerald-950/60 text-emerald-300 border-emerald-500/40';
    timeDisplay.textContent = '3:30 PM (Cutoff Open)';
  } else if (mode === 'after') {
    badge.className = 'hidden sm:flex px-3 py-1.5 rounded-full text-xs font-bold border items-center gap-1.5 bg-red-950/60 text-red-300 border-red-500/40';
    timeDisplay.textContent = '6:15 PM (Cutoff Closed)';
  } else {
    const now = new Date();
    const isBefore = (now.getHours() < 17 || (now.getHours() === 17 && now.getMinutes() < 30));
    badge.className = isBefore 
      ? 'hidden sm:flex px-3 py-1.5 rounded-full text-xs font-bold border items-center gap-1.5 bg-emerald-950/60 text-emerald-300 border-emerald-500/40'
      : 'hidden sm:flex px-3 py-1.5 rounded-full text-xs font-bold border items-center gap-1.5 bg-red-950/60 text-red-300 border-red-500/40';
    timeDisplay.textContent = `${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} (${isBefore ? 'Open' : 'Closed'})`;
  }
}

function setAdminTimeMode(mode) {
  localStorage.setItem('rck_time_mode', mode);
  updateCutoffClock();
  ['before', 'after', 'real'].forEach(m => {
    const btn = document.getElementById(`btn-mode-${m}`);
    if (btn) {
      btn.className = m === mode 
        ? 'px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-bold' 
        : 'px-3 py-1.5 rounded-lg bg-zinc-800 text-zinc-300 font-bold';
    }
  });
  showAdminToast(`5:30 PM Cutoff clock set to: ${mode}`);
}

// ==========================================
// 9. ORDERS & BOOKINGS
// ==========================================
function renderOrdersTable() {
  const tbody = document.getElementById('orders-table-body');
  if (!tbody) return;

  const orders = window.RCK_DB.getOrders();
  if (orders.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" class="p-8 text-center text-zinc-500">No customer orders recorded yet.</td></tr>`;
    return;
  }

  tbody.innerHTML = orders.map(o => `
    <tr class="hover:bg-zinc-800/40 transition">
      <td class="p-3.5 font-mono text-amber-400 font-bold text-xs">${o.id}</td>
      <td class="p-3.5">
        <div class="font-bold text-white text-xs">${o.customerName || 'Customer'}</div>
        <div class="text-[11px] text-zinc-400">${o.customerPhone || ''}</div>
      </td>
      <td class="p-3.5">
        <div class="text-xs text-zinc-300">${(o.items || []).map(i => `${i.quantity}x ${i.name}`).join(', ') || 'Custom meal'}</div>
      </td>
      <td class="p-3.5 font-black text-white text-xs">₹${o.total || o.subtotal || 0}</td>
      <td class="p-3.5 text-[11px] text-zinc-400 max-w-xs truncate">${o.deliveryAddress || 'Hyderabad'}</td>
      <td class="p-3.5">
        <span class="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${o.status === 'Delivered' ? 'bg-emerald-950 text-emerald-400' : 'bg-amber-950 text-amber-300'}">
          ${o.status || 'Order Placed'}
        </span>
      </td>
      <td class="p-3.5 text-right">
        <select onchange="handleOrderStatusChange('${o.id}', this.value)" class="px-2.5 py-1 bg-zinc-950 border border-zinc-700 rounded-lg text-xs text-zinc-200">
          <option value="Order Placed" ${o.status === 'Order Placed' ? 'selected' : ''}>Order Placed</option>
          <option value="Preparing in Kitchen" ${o.status === 'Preparing in Kitchen' ? 'selected' : ''}>Preparing in Kitchen</option>
          <option value="Out for Delivery" ${o.status === 'Out for Delivery' ? 'selected' : ''}>Out for Delivery</option>
          <option value="Delivered" ${o.status === 'Delivered' ? 'selected' : ''}>Delivered</option>
        </select>
      </td>
    </tr>
  `).join('');
}

function handleOrderStatusChange(orderId, newStatus) {
  window.RCK_DB.updateOrderStatus(orderId, newStatus);
  showAdminToast(`Updated order ${orderId} to: ${newStatus}`);
}

// ==========================================
// 10. SITE SETTINGS & CREDENTIALS
// ==========================================
function renderSettingsForm() {
  const data = window.RCK_DB.getFullSiteData();
  const s = data.siteSettings || {};

  const heroTitle = document.getElementById('setting-hero-title');
  const heroSubtitle = document.getElementById('setting-hero-subtitle');
  const announcement = document.getElementById('setting-announcement');
  const phone = document.getElementById('setting-phone');
  const whatsapp = document.getElementById('setting-whatsapp');
  const email = document.getElementById('setting-email');
  const address = document.getElementById('setting-address');
  const upi = document.getElementById('setting-upi');

  if (heroTitle) heroTitle.value = s.heroTitle || '';
  if (heroSubtitle) heroSubtitle.value = s.heroSubtitle || '';
  if (announcement) announcement.value = s.announcementText || '';
  if (phone) phone.value = s.phone || '';
  if (whatsapp) whatsapp.value = s.whatsapp || '';
  if (email) email.value = s.email || '';
  if (address) address.value = s.address || '';
  if (upi) upi.value = s.upiId || '';

  const adminCreds = window.RCK_DB.getStoredAdminCredentials();
  const adminEmailInput = document.getElementById('setting-admin-email');
  if (adminEmailInput) adminEmailInput.value = adminCreds.email;
}

async function saveSiteSettings() {
  const full = window.RCK_DB.getFullSiteData();
  full.siteSettings = full.siteSettings || {};

  full.siteSettings.heroTitle = document.getElementById('setting-hero-title').value.trim();
  full.siteSettings.heroSubtitle = document.getElementById('setting-hero-subtitle').value.trim();
  full.siteSettings.announcementText = document.getElementById('setting-announcement').value.trim();
  full.siteSettings.phone = document.getElementById('setting-phone').value.trim();
  full.siteSettings.whatsapp = document.getElementById('setting-whatsapp').value.trim();
  full.siteSettings.email = document.getElementById('setting-email').value.trim();
  full.siteSettings.address = document.getElementById('setting-address').value.trim();
  full.siteSettings.upiId = document.getElementById('setting-upi').value.trim();

  window.RCK_DB.saveFullSiteData(full);
  showAdminToast('✓ Website settings saved to Supabase & live store!');
}

function updateAdminCredentials() {
  const email = document.getElementById('setting-admin-email').value.trim();
  const pass = document.getElementById('setting-admin-password').value.trim();

  if (!email || !pass) {
    alert("Please enter both email and new password.");
    return;
  }

  window.RCK_DB.saveStoredAdminCredentials(email, pass);
  showAdminToast("✓ Admin login credentials updated!");
}

// ==========================================
// 11. STANDALONE CLOUDINARY UPLOADER
// ==========================================
function triggerCloudinaryQuickUpload() {
  switchAdminTab('cloudinary');
  document.getElementById('cloudinary-standalone-file').click();
}

async function handleStandaloneMediaUpload(e) {
  const file = e.target.files[0];
  if (!file) return;

  const spinner = document.getElementById('media-upload-spinner');
  const resultBox = document.getElementById('media-result-box');
  const preview = document.getElementById('media-result-preview');
  const urlInput = document.getElementById('media-result-url');

  if (spinner) spinner.classList.remove('hidden');
  if (resultBox) resultBox.classList.add('hidden');

  try {
    const res = await window.RCK_DB.uploadImageToCloudinary(file);
    if (preview) preview.src = res.url;
    if (urlInput) urlInput.value = res.url;
    if (resultBox) resultBox.classList.remove('hidden');
    showAdminToast('✓ File uploaded directly to Cloudinary!');
  } catch (err) {
    alert('Cloudinary upload error: ' + err.message);
  } finally {
    if (spinner) spinner.classList.add('hidden');
  }
}

function copyCloudinaryUrl() {
  const urlInput = document.getElementById('media-result-url');
  if (urlInput) {
    urlInput.select();
    navigator.clipboard.writeText(urlInput.value);
    showAdminToast('📋 Cloudinary URL copied to clipboard!');
  }
}

// ==========================================
// 12. SUPABASE SYNC & SQL SCRIPT COPIER
// ==========================================
async function syncWebsiteToSupabase() {
  showAdminToast('Syncing all data with Supabase...');
  try {
    const res = await window.RCK_DB.syncAllToSupabase();
    showAdminToast('✓ Successfully synced all products, menus, and plans with Supabase!');
  } catch (err) {
    showAdminToast('Sync completed locally. Supabase: ' + err.message);
  }
}

async function pullDataFromSupabase() {
  showAdminToast('Pulling latest data from Supabase...');
  await window.RCK_DB.loadSiteData();
  refreshAllAdminViews();
  showAdminToast('✓ Pulled latest data from Supabase!');
}

function copySupabaseSqlScript() {
  const sql = `-- Run this in your Supabase SQL Editor:
CREATE TABLE IF NOT EXISTS public.site_content (
    key TEXT PRIMARY KEY,
    data JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    categoryName TEXT,
    price NUMERIC NOT NULL,
    originalPrice NUMERIC,
    isVeg BOOLEAN DEFAULT TRUE,
    calories TEXT,
    protein TEXT,
    description TEXT,
    image TEXT,
    popular BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    tagline TEXT,
    description TEXT,
    image TEXT,
    badge TEXT,
    color TEXT DEFAULT 'amber',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.subscriptions (
    id TEXT PRIMARY KEY,
    customerName TEXT NOT NULL,
    customerPhone TEXT NOT NULL,
    customerAddress TEXT,
    mealType TEXT,
    totalDays INT DEFAULT 10,
    consumedDays INT DEFAULT 0,
    remainingDays INT DEFAULT 10,
    status TEXT DEFAULT 'Active',
    isPausedTomorrow BOOLEAN DEFAULT FALSE,
    nextDeliveryDate TEXT
);

CREATE TABLE IF NOT EXISTS public.orders (
    id TEXT PRIMARY KEY,
    customerName TEXT,
    customerPhone TEXT,
    items JSONB DEFAULT '[]'::JSONB,
    total NUMERIC DEFAULT 0,
    status TEXT DEFAULT 'Order Placed'
);

ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public Full Access on site_content" ON public.site_content FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Full Access on products" ON public.products FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Full Access on categories" ON public.categories FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Full Access on subscriptions" ON public.subscriptions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Full Access on orders" ON public.orders FOR ALL USING (true) WITH CHECK (true);
`;
  navigator.clipboard.writeText(sql);
  showAdminToast('📋 Supabase SQL Schema copied to clipboard!');
}

function downloadJsonBackup() {
  const data = window.RCK_DB.getFullSiteData();
  const jsonStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data, null, 2));
  const dlAnchor = document.createElement('a');
  dlAnchor.setAttribute("href", jsonStr);
  dlAnchor.setAttribute("download", `rayalaseema_foods_backup_${new Date().toISOString().slice(0,10)}.json`);
  document.body.appendChild(dlAnchor);
  dlAnchor.click();
  dlAnchor.remove();
}

function showAdminToast(msg) {
  const toast = document.getElementById('admin-toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.remove('hidden');
  setTimeout(() => {
    toast.classList.add('hidden');
  }, 4000);
}
