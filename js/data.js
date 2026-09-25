// Rayalaseema Cloud Kitchen - Central Data Store

const MENU_DATA = {
  categories: [
    {
      id: "signature-dishes",
      name: "Signature Dishes",
      tagline: "The Pride of Seema - Authentic millets, sangati & authentic bhojanam.",
      description: "Traditional Ragi Idli, Korra Pongali, Ragi Sangati with spicy Kodi Pulusu, and authentic Rayalaseema Bhojanam.",
      pricePerDay: 149,
      image: "images/veg-meals.jpg",
      badge: "The Pride of Seema",
      color: "amber"
    },
    {
      id: "bagara-rice",
      name: "Bagara Rice Specials",
      tagline: "Aromatic spiced bagara rice paired with rich gravy.",
      description: "Fragrant Hyderabad-style bagara rice served with spicy Rayalaseema chicken gravy or rich slow-cooked mutton gravy.",
      pricePerDay: 249,
      image: "images/nonveg-meals.jpg",
      badge: "House Special",
      color: "amber"
    },
    {
      id: "special-curries",
      name: "Special Curries & Fry",
      tagline: "Fiery regional curries with authentic Gongura & spices.",
      description: "Tangy Gongura Chicken, slow-cooked Gongura Mutton, and spicy Chicken Liver Fry tossed with signature spices.",
      pricePerDay: 199,
      image: "images/nonveg-meals.jpg",
      badge: "Fiery Spiced",
      color: "red"
    },
    {
      id: "roti-specials",
      name: "Traditional Roti Specials",
      tagline: "Healthy sorghum Jonna Roti with hearty gravies.",
      description: "Freshly made sorghum flatbreads (Jonna Roti) paired with rich chicken gravy or slow-cooked mutton gravy.",
      pricePerDay: 249,
      image: "images/nonveg-meals.jpg",
      badge: "Healthy Millet",
      color: "emerald"
    },
    {
      id: "biryani-specials",
      name: "Biryani Specials",
      tagline: "Aromatic basmati rice layered with succulent meats.",
      description: "Authentic Chicken Biryani and flavorful Kushka with Rayalaseema curries.",
      pricePerDay: 199,
      image: "images/nonveg-meals.jpg",
      badge: "Biryani Special",
      color: "amber"
    },
    {
      id: "paneer-specials",
      name: "Paneer Specials & Dal",
      tagline: "Rich cottage cheese & yellow lentil preparations.",
      description: "Creamy Paneer Butter Masala, Palak Paneer, rich Kaju Paneer, and homestyle Dal Tadka tempered with garlic & cumin.",
      pricePerDay: 149,
      image: "images/veg-meals.jpg",
      badge: "Pure Veg",
      color: "emerald"
    },
    {
      id: "rice-specials",
      name: "Rice Specials",
      tagline: "Comforting spiced and tempered rice bowls.",
      description: "Fragrant Jeera Rice with ghee, flavorful spiced Tamota Rice, and soothing Curd Rice with pomegranate.",
      pricePerDay: 119,
      image: "images/veg-meals.jpg",
      badge: "Comfort Food",
      color: "emerald"
    }
  ],

  products: [
    // 1. SIGNATURE DISHES (THE PRIDE OF SEEMA)
    {
      id: "sig-1",
      name: "Ragi Idli with Groundnut Chutney",
      category: "signature-dishes",
      categoryName: "Signature Dish",
      price: 59,
      originalPrice: 79,
      rating: 4.9,
      reviewsCount: 184,
      isVeg: true,
      calories: "220 kcal",
      protein: "8g Protein",
      description: "Soft, healthy finger millet idlis served with traditional Rayalaseema-style groundnut chutney.",
      image: "images/veg-meals.jpg",
      popular: true
    },
    {
      id: "sig-2",
      name: "Korra Pongali with Groundnut Chutney",
      category: "signature-dishes",
      categoryName: "Signature Dish",
      price: 150,
      originalPrice: 180,
      rating: 4.8,
      reviewsCount: 132,
      isVeg: true,
      calories: "340 kcal",
      protein: "10g Protein",
      description: "Nutritious foxtail millet pongal served with traditional groundnut chutney.",
      image: "images/veg-meals.jpg",
      popular: true
    },
    {
      id: "sig-3",
      name: "Ragi Sangati Combo",
      category: "signature-dishes",
      categoryName: "Signature Dish",
      price: 250,
      originalPrice: 299,
      rating: 5.0,
      reviewsCount: 310,
      isVeg: false,
      calories: "580 kcal",
      protein: "36g Protein",
      description: "Traditional finger millet balls served with spicy Kodi Pulusu (Chicken Gravy), a dollop of ghee, and raw onions.",
      image: "images/nonveg-meals.jpg",
      popular: true
    },
    {
      id: "sig-4",
      name: "Rayalaseema Bhojanam (Veg)",
      category: "signature-dishes",
      categoryName: "Signature Dish",
      price: 149,
      originalPrice: 179,
      rating: 4.9,
      reviewsCount: 220,
      isVeg: true,
      calories: "450 kcal",
      protein: "18g Protein",
      description: "A complete meal with flavored rice, pappu, gongura tokku, vegetable curry, charu, curd, and a sweet.",
      image: "images/veg-meals.jpg",
      popular: true
    },
    {
      id: "sig-5",
      name: "Uggani with Hot Mirchi Bajji",
      category: "signature-dishes",
      categoryName: "Signature Breakfast",
      price: 89,
      originalPrice: 110,
      rating: 5.0,
      reviewsCount: 295,
      isVeg: true,
      calories: "320 kcal",
      protein: "9g Protein",
      description: "Authentic Rayalaseema seasoned puffed rice tossed with roasted gram powder, onions, and served with crispy Mirchi Bajji.",
      image: "images/veg-meals.jpg",
      popular: true
    },
    {
      id: "sig-6",
      name: "Gunta Ponganalu with Spicy Chutney",
      category: "signature-dishes",
      categoryName: "Signature Breakfast",
      price: 89,
      originalPrice: 110,
      rating: 4.9,
      reviewsCount: 215,
      isVeg: true,
      calories: "310 kcal",
      protein: "8g Protein",
      description: "Traditional golden crispy skillet puffed rice dumplings (6 pcs) served with spicy peanut chutney and ginger pachadi.",
      image: "images/veg-meals.jpg",
      popular: true
    },
    {
      id: "sig-7",
      name: "Ghee Ven Pongal with Cashews",
      category: "signature-dishes",
      categoryName: "Signature Breakfast",
      price: 79,
      originalPrice: 99,
      rating: 4.8,
      reviewsCount: 160,
      isVeg: true,
      calories: "380 kcal",
      protein: "11g Protein",
      description: "Traditional temple-style ghee pongal tempered with black pepper, cumin, ginger, and roasted whole cashews.",
      image: "images/veg-meals.jpg",
      popular: false
    },
    {
      id: "sig-8",
      name: "Rayalaseema Ghee Roast Dosa",
      category: "signature-dishes",
      categoryName: "Signature Breakfast",
      price: 69,
      originalPrice: 89,
      rating: 4.9,
      reviewsCount: 185,
      isVeg: true,
      calories: "280 kcal",
      protein: "7g Protein",
      description: "Crispy golden ghee roast dosa served with authentic peanut chutney and vegetable sambar.",
      image: "images/veg-meals.jpg",
      popular: false
    },
    {
      id: "sig-9",
      name: "Rayalaseema Bhojanam (Non-Veg)",
      category: "signature-dishes",
      categoryName: "Signature Dish",
      price: 299,
      originalPrice: 349,
      rating: 5.0,
      reviewsCount: 345,
      isVeg: false,
      calories: "620 kcal",
      protein: "42g Protein",
      description: "A complete meal with flavored rice, pappu, gongura tokku, chicken curry, chicken fry, pappu charu, curd, and a sweet.",
      image: "images/nonveg-meals.jpg",
      popular: true
    },

    // 2. BAGARA RICE SPECIALS
    {
      id: "bag-1",
      name: "Bagara Rice with Chicken Gravy",
      category: "bagara-rice",
      categoryName: "Bagara Rice Special",
      price: 249,
      originalPrice: 289,
      rating: 4.9,
      reviewsCount: 198,
      isVeg: false,
      calories: "530 kcal",
      protein: "34g Protein",
      description: "Fragrant Hyderabad-style bagara rice served with spicy Rayalaseema chicken gravy.",
      image: "images/nonveg-meals.jpg",
      popular: true
    },
    {
      id: "bag-2",
      name: "Bagara Rice with Mutton Gravy",
      category: "bagara-rice",
      categoryName: "Bagara Rice Special",
      price: 299,
      originalPrice: 349,
      rating: 5.0,
      reviewsCount: 167,
      isVeg: false,
      calories: "590 kcal",
      protein: "38g Protein",
      description: "Aromatic bagara rice paired with rich, slow-cooked Rayalaseema mutton gravy.",
      image: "images/nonveg-meals.jpg",
      popular: true
    },

    // 3. RAYALASEEMA SPECIAL CURRIES
    {
      id: "cur-1",
      name: "Gongura Chicken",
      category: "special-curries",
      categoryName: "Special Curry",
      price: 249,
      originalPrice: 289,
      rating: 4.9,
      reviewsCount: 215,
      isVeg: false,
      calories: "440 kcal",
      protein: "35g Protein",
      description: "Tender chicken cooked with tangy gongura leaves and authentic Rayalaseema spices.",
      image: "images/nonveg-meals.jpg",
      popular: true
    },
    {
      id: "cur-2",
      name: "Gongura Mutton",
      category: "special-curries",
      categoryName: "Special Curry",
      price: 349,
      originalPrice: 399,
      rating: 5.0,
      reviewsCount: 180,
      isVeg: false,
      calories: "510 kcal",
      protein: "39g Protein",
      description: "Succulent mutton slow-cooked with fresh gongura leaves for a bold regional flavor.",
      image: "images/nonveg-meals.jpg",
      popular: true
    },
    {
      id: "cur-3",
      name: "Chicken Liver Fry",
      category: "special-curries",
      categoryName: "Special Curry",
      price: 199,
      originalPrice: 239,
      rating: 4.8,
      reviewsCount: 124,
      isVeg: false,
      calories: "380 kcal",
      protein: "32g Protein",
      description: "Fresh chicken liver stir-fried with onions, curry leaves, green chilies, and signature Rayalaseema spices.",
      image: "images/nonveg-meals.jpg",
      popular: false
    },

    // 4. TRADITIONAL ROTI SPECIALS
    {
      id: "roti-1",
      name: "Jonna Roti with Chicken Gravy",
      category: "roti-specials",
      categoryName: "Roti Special",
      price: 249,
      originalPrice: 289,
      rating: 4.9,
      reviewsCount: 156,
      isVeg: false,
      calories: "460 kcal",
      protein: "33g Protein",
      description: "Healthy sorghum flatbread served with rich, authentic Rayalaseema-style chicken gravy.",
      image: "images/nonveg-meals.jpg",
      popular: true
    },
    {
      id: "roti-2",
      name: "Jonna Roti with Mutton Gravy",
      category: "roti-specials",
      categoryName: "Roti Special",
      price: 349,
      originalPrice: 399,
      rating: 5.0,
      reviewsCount: 142,
      isVeg: false,
      calories: "520 kcal",
      protein: "37g Protein",
      description: "Healthy sorghum flatbread served with slow-cooked mutton gravy prepared with traditional spices.",
      image: "images/nonveg-meals.jpg",
      popular: true
    },

    // 5. BIRYANI SPECIALS
    {
      id: "bir-1",
      name: "Chicken Biryani",
      category: "biryani-specials",
      categoryName: "Biryani Special",
      price: 299,
      originalPrice: 349,
      rating: 5.0,
      reviewsCount: 420,
      isVeg: false,
      calories: "610 kcal",
      protein: "38g Protein",
      description: "Aromatic basmati rice layered with flavorful chicken and traditional spices.",
      image: "images/nonveg-meals.jpg",
      popular: true
    },
    {
      id: "bir-3",
      name: "Kushka with Paneer Curry",
      category: "biryani-specials",
      categoryName: "Biryani Special",
      price: 199,
      originalPrice: 239,
      rating: 4.8,
      reviewsCount: 175,
      isVeg: true,
      calories: "450 kcal",
      protein: "16g Protein",
      description: "Flavorful spiced kushka rice served with rich, delicious paneer curry.",
      image: "images/kushka-paneer.jpg",
      popular: false
    },
    {
      id: "bir-4",
      name: "Kushka with Chicken Curry",
      category: "biryani-specials",
      categoryName: "Biryani Special",
      price: 199,
      originalPrice: 239,
      rating: 4.9,
      reviewsCount: 198,
      isVeg: false,
      calories: "490 kcal",
      protein: "30g Protein",
      description: "Flavorful spiced kushka rice served with authentic Rayalaseema-style chicken curry.",
      image: "images/kushka-chicken.jpg",
      popular: true
    },

    // 6. PANEER SPECIALS & CURRIES
    {
      id: "pan-1",
      name: "Paneer Butter Masala",
      category: "paneer-specials",
      categoryName: "Paneer Special",
      price: 220,
      originalPrice: 260,
      rating: 4.9,
      reviewsCount: 190,
      isVeg: true,
      calories: "410 kcal",
      protein: "19g Protein",
      description: "Soft paneer cubes in rich, creamy tomato butter gravy.",
      image: "images/paneer-butter-masala.jpg",
      popular: true
    },
    {
      id: "pan-2",
      name: "Palak Paneer",
      category: "paneer-specials",
      categoryName: "Paneer Special",
      price: 199,
      originalPrice: 239,
      rating: 4.8,
      reviewsCount: 140,
      isVeg: true,
      calories: "360 kcal",
      protein: "18g Protein",
      description: "Cottage cheese cubes cooked in smooth spinach gravy.",
      image: "images/palak-paneer.jpg",
      popular: false
    },
    {
      id: "pan-3",
      name: "Kaju Paneer",
      category: "paneer-specials",
      categoryName: "Paneer Special",
      price: 249,
      originalPrice: 299,
      rating: 5.0,
      reviewsCount: 205,
      isVeg: true,
      calories: "460 kcal",
      protein: "21g Protein",
      description: "Paneer cooked in rich cashew and tomato based gravy.",
      image: "images/kaju-paneer.jpg",
      popular: true
    },
    {
      id: "pan-4",
      name: "Dal Tadka",
      category: "paneer-specials",
      categoryName: "Paneer & Dal",
      price: 149,
      originalPrice: 179,
      rating: 4.8,
      reviewsCount: 165,
      isVeg: true,
      calories: "280 kcal",
      protein: "14g Protein",
      description: "Yellow lentils tempered with garlic, cumin and spices.",
      image: "images/dal-tadka.jpg",
      popular: false
    },

    // 7. RICE SPECIALS
    {
      id: "rice-1",
      name: "Jeera Rice",
      category: "rice-specials",
      categoryName: "Rice Special",
      price: 139,
      originalPrice: 169,
      rating: 4.8,
      reviewsCount: 110,
      isVeg: true,
      calories: "310 kcal",
      protein: "6g Protein",
      description: "Fragrant basmati rice tossed with cumin and ghee.",
      image: "images/jeera-rice.jpg",
      popular: false
    },
    {
      id: "rice-2",
      name: "Tamota Rice",
      category: "rice-specials",
      categoryName: "Rice Special",
      price: 139,
      originalPrice: 169,
      rating: 4.9,
      reviewsCount: 138,
      isVeg: true,
      calories: "320 kcal",
      protein: "7g Protein",
      description: "Flavorful tomato rice cooked with spices.",
      image: "images/tamota-rice.jpg",
      popular: true
    },
    {
      id: "rice-3",
      name: "Curd Rice",
      category: "rice-specials",
      categoryName: "Rice Special",
      price: 119,
      originalPrice: 149,
      rating: 4.9,
      reviewsCount: 195,
      isVeg: true,
      calories: "250 kcal",
      protein: "8g Protein",
      description: "Comforting curd rice with tempering and pomegranate.",
      image: "images/curd-rice.jpg",
      popular: true
    }
  ],

  deliverySlots: [
    { id: "slot-lunch-1", label: "12:00 PM - 12:45 PM (Early Lunch)", timeType: "lunch" },
    { id: "slot-lunch-2", label: "12:45 PM - 1:30 PM (Regular Lunch)", timeType: "lunch", isDefault: true },
    { id: "slot-lunch-3", label: "1:30 PM - 2:15 PM (Late Lunch)", timeType: "lunch" },
    { id: "slot-dinner-1", label: "7:30 PM - 8:30 PM (Dinner)", timeType: "dinner" },
    { id: "slot-dinner-2", label: "8:30 PM - 9:30 PM (Late Dinner)", timeType: "dinner" }
  ],

  orderStatuses: {
    "Order Placed": {
      label: "Order Placed",
      color: "bg-amber-100 text-amber-900 border-amber-300",
      badgeColor: "bg-amber-500",
      progress: 20,
      icon: "📋",
      step: 1
    },
    "Confirmed": {
      label: "Confirmed",
      color: "bg-blue-100 text-blue-900 border-blue-300",
      badgeColor: "bg-blue-500",
      progress: 40,
      icon: "✅",
      step: 2
    },
    "Preparing": {
      label: "Preparing in Kitchen",
      color: "bg-purple-100 text-purple-900 border-purple-300",
      badgeColor: "bg-purple-500",
      progress: 65,
      icon: "👨‍🍳",
      step: 3
    },
    "Out for Delivery": {
      label: "Out for Delivery",
      color: "bg-orange-100 text-orange-900 border-orange-300",
      badgeColor: "bg-orange-500",
      progress: 85,
      icon: "🛵",
      step: 4
    },
    "Delivered": {
      label: "Delivered",
      color: "bg-emerald-100 text-emerald-900 border-emerald-300",
      badgeColor: "bg-emerald-600",
      progress: 100,
      icon: "🎉",
      step: 5
    },
    "Cancelled": {
      label: "Cancelled",
      color: "bg-red-100 text-red-900 border-red-300",
      badgeColor: "bg-red-500",
      progress: 0,
      icon: "❌",
      step: 0
    }
  },

  services: [
    {
      id: "srv-catering",
      title: "Catering Services",
      tagline: "Corporate lunches, private gatherings, and festival feasts.",
      description: "Customized live counters, executive lunch boxes, or buffet setups for teams of 20 to 2,000+ people. Hygienic, hot, and punctual delivery.",
      pricingType: "starting",
      priceDisplay: "Starting at ₹120 / plate",
      startingPrice: 120,
      ctaText: "Enquire Now",
      ctaAction: "enquire",
      badge: "Custom Event Menu",
      image: "https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=800&q=80",
      features: ["Customized Menu Selection", "Dedicated On-site Support", "Eco-friendly Packaging", "Hot Insulated Delivery Boxes"]
    },
    {
      id: "srv-wholesale",
      title: "Wholesale Food Supply",
      tagline: "Bulk healthy meal supply for IT parks, institutions & hospitals.",
      description: "Contract-based recurring bulk supply of balanced wholesome meals and nutrition packs with guaranteed scheduled morning/afternoon delivery slots.",
      pricingType: "starting",
      priceDisplay: "Starting at ₹99 / meal (Min 50 qty)",
      startingPrice: 99,
      ctaText: "Enquire Now",
      ctaAction: "enquire",
      badge: "B2B Contract",
      image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80",
      features: ["Volume Discount Tiers", "Standardized Nutrient Labeling", "Monthly Invoicing & GST Credit", "Strict Temperature Control"]
    },
    {
      id: "srv-retail",
      title: "Retail Food Supply",
      tagline: "Direct-to-doorstep individual and family meal orders.",
      description: "Order fresh nutritious meals directly for lunch or dinner. Prepared fresh in our cloud kitchen and delivered straight to your office desk or home.",
      pricingType: "fixed",
      priceDisplay: "Starting at ₹120 / meal",
      startingPrice: 120,
      ctaText: "Order Meals Now",
      ctaAction: "order",
      badge: "Instant Delivery",
      image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80",
      features: ["Express Hot Delivery", "30-45 Mins Fast Delivery", "No Minimum Order", "Customizable Add-ons"]
    },
    {
      id: "srv-hybrid",
      title: "Wholesale + Retail Supply",
      tagline: "Comprehensive hybrid solutions for co-working spaces and gyms.",
      description: "Dual setup providing recurring base bulk meals alongside an on-demand micro-ordering kiosk or app code for individual employees/members.",
      pricingType: "starting",
      priceDisplay: "Custom SLA Pricing",
      startingPrice: 0,
      ctaText: "Enquire Now",
      ctaAction: "enquire",
      badge: "Flexible Hybrid",
      image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80",
      features: ["Custom Portal & Dashboard", "Mixed Bulk + Retail Billing", "Subsidized Employer Subscriptions", "Dedicated Account Manager"]
    }
  ],

  subscriptionPlans: [
    {
      id: "plan-breakfast",
      name: "Only Breakfast",
      tag: "Morning (7:30 - 9:00 AM)",
      pricePerDay: 63,
      totalPrice: 1900,
      days: 30,
      popular: false,
      description: "Authentic Rayalaseema morning rotation (Dosa, Idli, Pongal, Uggani with Bajji, Ponganalu) delivered piping hot every morning.",
      features: [
        "30 Morning Deliveries (7:30 - 9:00 AM)",
        "Daily Menu Rotation (Uggani, Ponganalu, Pongal, Dosa, Idli)",
        "Pause Absences Before 5:30 PM Cutoff",
        "Piping Hot Sambar & Signature Chutneys",
        "100% Ghee & Cold-Pressed Groundnut Oil"
      ],
      cta: "Get Breakfast Plan"
    },
    {
      id: "plan-breakfast-lunch",
      name: "Breakfast + Lunch",
      tag: "Daytime Work Combo",
      pricePerDay: 153,
      totalPrice: 4600,
      days: 30,
      popular: false,
      description: "Full workday nutrition: Rayalaseema breakfast in the morning and hearty full lunch meal at noon.",
      features: [
        "2 Meals Daily: Morning Breakfast + Noon Lunch",
        "60 Total Deliveries to Home or IT Park Desk",
        "Authentic Ghee Breakfasts & Rich Lunch Platters",
        "Pause or Skip Days Before 5:30 PM",
        "Priority Express Delivery Slot"
      ],
      cta: "Get Breakfast + Lunch"
    },
    {
      id: "plan-lunch",
      name: "Only Lunch",
      tag: "Afternoon (12:00 - 1:30 PM)",
      pricePerDay: 100,
      totalPrice: 3000,
      days: 30,
      popular: false,
      description: "Wholesome full Andhra & Rayalaseema lunch meals packed fresh and delivered to your office desk or home.",
      features: [
        "30 Afternoon Lunch Deliveries (12:00 - 1:30 PM)",
        "Full Meal: Rice, Flavored Pappu, Curries, Sambar & Curd",
        "Weekly Special Rayalaseema Delicacies",
        "Pause Absences Before 5:30 PM Cutoff",
        "Punctual Doorstep & Desk Delivery"
      ],
      cta: "Get Lunch Plan"
    },
    {
      id: "plan-lunch-dinner",
      name: "Lunch + Dinner",
      tag: "Most Popular Combo",
      pricePerDay: 153,
      totalPrice: 4600,
      days: 30,
      popular: true,
      description: "The ultimate daily lunch and dinner combo for working professionals and families. Zero cooking hassle.",
      features: [
        "2 Full Meals Daily: Hot Lunch + Fresh Dinner",
        "60 Total Deliveries per Month (12:30 PM & 8:00 PM)",
        "Complete Traditional Andhra & Rayalaseema Menu",
        "Maximum Monthly Savings on Double Meals",
        "Flexible Absence Pause Without Day Loss"
      ],
      cta: "Get Lunch + Dinner"
    },
    {
      id: "plan-dinner",
      name: "Only Dinner",
      tag: "Night (7:30 - 9:00 PM)",
      pricePerDay: 63,
      totalPrice: 1900,
      days: 30,
      popular: false,
      description: "Light, nutritious, and delicious dinners including soft phulkas/rotis, flavorful curries, and comforting meals.",
      features: [
        "30 Night Deliveries (7:30 - 9:00 PM)",
        "Soft Phulkas / Rotis with Wholesome Curries",
        "Light & Digestible Healthy Dinner Spread",
        "Flexible Pause & Resume on Travel Days",
        "Fresh Prep Right Before Dispatch"
      ],
      cta: "Get Dinner Plan"
    },
    {
      id: "plan-breakfast-dinner",
      name: "Breakfast + Dinner",
      tag: "Morning & Night Combo",
      pricePerDay: 120,
      totalPrice: 3600,
      days: 30,
      popular: false,
      description: "Complete dual-meal combo: start your day with energetic breakfast and end it with a comforting warm dinner.",
      features: [
        "2 Meals Daily: Hot Breakfast + Night Dinner",
        "60 Total Deliveries per Month",
        "Signature Morning Specials & Wholesome Dinners",
        "Save ₹200 with Monthly Combo Rate",
        "Dedicated Kitchen & WhatsApp Support"
      ],
      cta: "Get Breakfast + Dinner"
    },
    {
      id: "plan-10day-3meals",
      name: "10-Day Plan (3 Times A Day)",
      tag: "Breakfast + Lunch + Dinner (10 Days)",
      pricePerDay: 250,
      totalPrice: 2500,
      days: 10,
      popular: true,
      description: "Full daily nutrition for 10 days: 3 wholesome meals delivered fresh daily — Morning Breakfast, Noon Lunch, and Night Dinner (30 meals total).",
      features: [
        "10 Days • 3 Times A Day (30 Total Meals)",
        "Morning Breakfast (7:30 - 9:00 AM)",
        "Afternoon Full Lunch (12:00 - 1:30 PM)",
        "Night Dinner with Rotis/Chapatis (7:30 - 9:00 PM)",
        "Pause Absences Before 5:30 PM (Zero Day Loss)",
        "100% Ghee & Pure Rayalaseema Spices"
      ],
      cta: "Get 10-Day Plan (₹2,500)"
    },
    {
      id: "plan-trial",
      name: "10-Day Workday Trial",
      tag: "10 Days Guaranteed",
      pricePerDay: 150,
      totalPrice: 1500,
      days: 10,
      popular: false,
      description: "Experience 10 authentic Rayalaseema meals. Pause anytime before 5:30 PM without losing a single food day balance.",
      features: [
        "10 Guaranteed Consumption Days",
        "Pause Plan Before 5:30 PM Today",
        "Auto-Resumes Day After Paused Day",
        "Zero Food Loss Policy",
        "Punctual 12:30 PM Office Delivery"
      ],
      cta: "Start 10-Day Trial"
    }
  ],

  // Initial customer subscriptions for tracking and admin dashboard
  initialSubscriptions: [
    {
      id: "SUB-10D-89421",
      customerName: "Rahul Kumar",
      customerPhone: "+91 98765 43210",
      customerEmail: "rahul.kumar@hitec-tech.com",
      customerAddress: "Tower 4, Mindspace IT Park, Hitec City, Hyderabad - 500081",
      planId: "plan-trial",
      planName: "10-Day Food Subscription Plan",
      mealType: "Rayalaseema Deluxe Veg Full Meal",
      totalDays: 10,
      consumedDays: 1,
      remainingDays: 9,
      status: "Active",
      isPausedTomorrow: false,
      pauseCutoff: "5:30 PM",
      nextDeliveryDate: "Tomorrow (12:30 PM)",
      pausedDates: [],
      history: [
        { dayNumber: 1, date: "19 Sep 2026", status: "Delivered & Consumed", meal: "Rayalaseema Deluxe Veg Full Meal", note: "Day 1 consumed (1/10 consumed, 9 remaining)" }
      ]
    },
    {
      id: "SUB-10D-74102",
      customerName: "Priya Nair",
      customerPhone: "+91 98111 22334",
      customerEmail: "priya.nair@cybercity.com",
      customerAddress: "Building 9, Cyber Towers, Madhapur, Hyderabad - 500081",
      planId: "plan-trial",
      planName: "10-Day Food Subscription Plan",
      mealType: "Rayalaseema Chicken Curry & Biryani Meal",
      totalDays: 10,
      consumedDays: 3,
      remainingDays: 7,
      status: "Paused for Tomorrow",
      isPausedTomorrow: true,
      pauseCutoff: "5:30 PM",
      nextDeliveryDate: "Resuming Day After Tomorrow (12:30 PM)",
      pausedDates: ["20 Sep 2026"],
      history: [
        { dayNumber: 1, date: "16 Sep 2026", status: "Delivered & Consumed", meal: "Rayalaseema Chicken Meal", note: "Day 1 consumed" },
        { dayNumber: 2, date: "17 Sep 2026", status: "Delivered & Consumed", meal: "Rayalaseema Chicken Meal", note: "Day 2 consumed" },
        { dayNumber: 3, date: "18 Sep 2026", status: "Delivered & Consumed", meal: "Rayalaseema Chicken Meal", note: "Day 3 consumed" },
        { dayNumber: null, date: "20 Sep 2026", status: "Paused (Before 5:30 PM)", meal: "None", note: "Customer on leave. Zero balance deducted. (7 remaining)" }
      ]
    },
    {
      id: "SUB-10D-63219",
      customerName: "Shandeep Reddy",
      customerPhone: "+91 97000 88990",
      customerEmail: "shandeep.reddy@techhub.in",
      customerAddress: "Block B, Raheja Mindspace, Hitec City, Hyderabad - 500081",
      planId: "plan-trial",
      planName: "10-Day Food Subscription Plan",
      mealType: "Rayalaseema Deluxe Veg Full Meal",
      totalDays: 10,
      consumedDays: 10,
      remainingDays: 0,
      status: "Completed",
      isPausedTomorrow: false,
      pauseCutoff: "5:30 PM",
      nextDeliveryDate: "All 10 Days Consumed",
      pausedDates: ["12 Sep 2026", "14 Sep 2026"],
      history: [
        { dayNumber: 10, date: "18 Sep 2026", status: "Delivered & Consumed", meal: "Rayalaseema Deluxe Veg Meal", note: "Completed full 10/10 consumed days entitlement" }
      ]
    }
  ],

  reviews: [
    {
      name: "Rahul Sharma",
      role: "Software Engineer, Hitec City",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
      comment: "Fresh food, convenient delivery and flexible subscription. Highly recommended for daily office lunches!",
      rating: 5
    },
    {
      name: "Priya Nair",
      role: "Product Manager, Gachibowli",
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80",
      comment: "The non-veg meals are amazing! Good taste, low oil, and genuinely healthy options that keep you energetic all day.",
      rating: 5
    },
    {
      name: "Shandeep Reddy",
      role: "Team Lead, Madhapur",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
      comment: "Their catering service for our 80-person office quarterly event was top notch. Piping hot and everyone loved the authentic spices!",
      rating: 5
    }
  ],

  // Initial orders for customer account experience
  initialOrders: [
    {
      id: "RCK-894210",
      createdAt: "2026-09-18T12:15:00.000Z",
      formattedDate: "18 Sep 2026, 12:15 PM",
      customer: {
        name: "Rahul Kumar",
        phone: "+91 98765 43210",
        address: "Tower 4, Mindspace IT Park, Hitec City, Hyderabad - 500081"
      },
      items: [
        {
          id: "vb-1",
          name: "Rayalaseema Deluxe Veg Full Meal",
          price: 169,
          quantity: 2,
          image: "images/veg-meals.jpg",
          category: "Veg Meal",
          isVeg: true
        }
      ],
      deliverySlot: "12:45 PM - 1:30 PM (Regular Lunch)",
      deliveryDate: "Today",
      paymentMethod: "UPI / GPay / PhonePe",
      paymentStatus: "Paid Online",
      status: "Out for Delivery",
      subtotal: 338,
      deliveryFee: 0,
      gst: 17,
      total: 355,
      deliveryPartner: "Venkatesh (RCK Express - +91 98765 11223)"
    },
    {
      id: "RCK-762941",
      createdAt: "2026-09-15T12:00:00.000Z",
      formattedDate: "15 Sep 2026, 12:00 PM",
      customer: {
        name: "Rahul Kumar",
        phone: "+91 98765 43210",
        address: "Tower 4, Mindspace IT Park, Hitec City, Hyderabad - 500081"
      },
      items: [
        {
          id: "nvb-1",
          name: "Rayalaseema Chicken Curry & Biryani Meal",
          price: 199,
          quantity: 1,
          image: "images/nonveg-meals.jpg",
          category: "Non-Veg Meal",
          isVeg: false
        },
        {
          id: "fb-1",
          name: "Exotic Antioxidant Fruit Crunch Meal",
          price: 139,
          quantity: 1,
          image: "https://images.unsplash.com/photo-1519996529931-28324d5a630e?auto=format&fit=crop&w=800&q=80",
          category: "Fruit Meal",
          isVeg: true
        }
      ],
      deliverySlot: "12:45 PM - 1:30 PM (Regular Lunch)",
      deliveryDate: "15 Sep 2026",
      paymentMethod: "Cash on Delivery",
      paymentStatus: "Paid on Delivery",
      status: "Delivered",
      subtotal: 338,
      deliveryFee: 0,
      gst: 17,
      total: 355,
      deliveryPartner: "Suresh (RCK Express)"
    }
  ],

  initialAddresses: [
    {
      id: "addr-1",
      title: "Work / Office (Default)",
      tag: "Work",
      fullAddress: "Tower 4, Mindspace IT Park, Hitec City, Hyderabad - 500081",
      landmark: "Near Building 4 Cafeteria",
      isDefault: true
    },
    {
      id: "addr-2",
      title: "Home / Apartment",
      tag: "Home",
      fullAddress: "Flat 402, Sunshine Heights, Madhapur, Hyderabad - 500081",
      landmark: "Opposite D-Mart",
      isDefault: false
    }
  ],

  // Monthly Subscribers's Menu - Afternoon Lunch (September 2026)
  subscriberMonthlyMenu: {
    title: "THE RAYALASEEMA CLOUD KITCHEN",
    month: "September 2026",
    subtitle: "MONTHLY SUBSCRIBERS'S MENU - AFTERNOON LUNCH",
    period: "1 SEPTEMBER TO 15 SEPTEMBER",
    tagline: "Where Spice Meets Tradition",
    commitmentNote: "Thank you for your patience and support this month. From September onward, we will make every effort to follow the published menu exactly, without missing or replacing any listed item. Your trust and continued support mean a great deal to us.",
    weeks: [
      {
        weekNumber: 1,
        weekLabel: "Week 1 (1 - 7 Sep)",
        days: [
          {
            day: "Monday",
            dateNum: 1,
            menu: "Aloo Fry, Pappu, Pappu Charu, White Rice, Curd, Papad",
            highlights: ["Aloo Fry", "Pappu", "Pappu Charu", "White Rice", "Curd", "Papad"],
            badge: "Homestyle Veg",
            isVeg: true,
            icon: "🥔"
          },
          {
            day: "Tuesday",
            dateNum: 2,
            menu: "Tomato Egg Masala, Gongura Pappu, Majjiga Charu, White Rice, Curd, Papad",
            highlights: ["Tomato Egg Masala", "Gongura Pappu", "Majjiga Charu", "White Rice", "Curd", "Papad"],
            badge: "Egg Special",
            isVeg: false,
            icon: "🍳"
          },
          {
            day: "Wednesday",
            dateNum: 3,
            menu: "Chicken Fry, Pachimirchi Pappu, Tomato Charu, White Rice, Banana, Perugu Pachadi",
            highlights: ["Chicken Fry", "Pachimirchi Pappu", "Tomato Charu", "White Rice", "Banana", "Perugu Pachadi"],
            badge: "Rayalaseema Non-Veg",
            isVeg: false,
            icon: "🍗"
          },
          {
            day: "Thursday",
            dateNum: 4,
            menu: "Vankaya Curry, Chukkakura Pappu, Tomato Charu, White Rice, Curd, Papad",
            highlights: ["Vankaya Curry", "Chukkakura Pappu", "Tomato Charu", "White Rice", "Curd", "Papad"],
            badge: "Traditional Veg",
            isVeg: true,
            icon: "🍆"
          },
          {
            day: "Friday",
            dateNum: 5,
            menu: "Vegetable Pulao, Aloo Kurma, Perugu Pachadi, Buttermilk, Banana",
            highlights: ["Vegetable Pulao", "Aloo Kurma", "Perugu Pachadi", "Buttermilk", "Banana"],
            badge: "Pulao Feast",
            isVeg: true,
            icon: "🍚"
          },
          {
            day: "Saturday",
            dateNum: 6,
            menu: "Dondakaya Fry, Tomato Pappu, Kothimeera-Pudina Chutney, White Rice, Curd, Papad, Semiya Payasam",
            highlights: ["Dondakaya Fry", "Tomato Pappu", "Kothimeera-Pudina Chutney", "White Rice", "Curd", "Papad", "Semiya Payasam"],
            badge: "Special + Sweet",
            isVeg: true,
            icon: "🍨"
          },
          {
            day: "Sunday",
            dateNum: 7,
            menu: "Bagara Rice, Chicken Curry, Perugu Pachadi, Banana",
            highlights: ["Bagara Rice", "Chicken Curry", "Perugu Pachadi", "Banana"],
            badge: "Sunday Non-Veg Feast",
            isVeg: false,
            icon: "🍛"
          }
        ]
      },
      {
        weekNumber: 2,
        weekLabel: "Week 2 (8 - 15 Sep)",
        days: [
          {
            day: "Monday",
            dateNum: 8,
            menu: "Broad Beans Curry, Pappu, Pappu Charu, White Rice, Curd, Papad",
            highlights: ["Broad Beans Curry", "Pappu", "Pappu Charu", "White Rice", "Curd", "Papad"],
            badge: "Homestyle Veg",
            isVeg: true,
            icon: "🫘"
          },
          {
            day: "Tuesday",
            dateNum: 9,
            menu: "Egg Bhurji, Gongura Pappu, Majjiga Charu, White Rice, Curd, Papad",
            highlights: ["Egg Bhurji", "Gongura Pappu", "Majjiga Charu", "White Rice", "Curd", "Papad"],
            badge: "Egg Special",
            isVeg: false,
            icon: "🍳"
          },
          {
            day: "Wednesday",
            dateNum: 10,
            menu: "Chicken Fry, Pachimirchi Pappu, Tomato Charu, White Rice, Banana, Perugu Pachadi",
            highlights: ["Chicken Fry", "Pachimirchi Pappu", "Tomato Charu", "White Rice", "Banana", "Perugu Pachadi"],
            badge: "Rayalaseema Non-Veg",
            isVeg: false,
            icon: "🍗"
          },
          {
            day: "Thursday",
            dateNum: 11,
            menu: "Beerakaya Curry, Chukkakura Pappu, Tomato Charu, White Rice, Curd, Papad",
            highlights: ["Beerakaya Curry", "Chukkakura Pappu", "Tomato Charu", "White Rice", "Curd", "Papad"],
            badge: "Traditional Veg",
            isVeg: true,
            icon: "🥒"
          },
          {
            day: "Friday",
            dateNum: 12,
            menu: "Meal Maker Pulao, Aloo Kurma, Perugu Pachadi, Buttermilk, Banana",
            highlights: ["Meal Maker Pulao", "Aloo Kurma", "Perugu Pachadi", "Buttermilk", "Banana"],
            badge: "High-Protein Pulao",
            isVeg: true,
            icon: "🍲"
          },
          {
            day: "Saturday",
            dateNum: 13,
            menu: "Bendakaya Fry, Tomato Pappu, Kothimeera-Pudina Chutney, White Rice, Curd, Papad, Gulab Jamun",
            highlights: ["Bendakaya Fry", "Tomato Pappu", "Kothimeera-Pudina Chutney", "White Rice", "Curd", "Papad", "Gulab Jamun"],
            badge: "Special + Sweet",
            isVeg: true,
            icon: "🧆"
          },
          {
            day: "Sunday",
            dateNum: 14,
            menu: "Bagara Rice, Chicken Curry, Perugu Pachadi, Banana",
            highlights: ["Bagara Rice", "Chicken Curry", "Perugu Pachadi", "Banana"],
            badge: "Sunday Non-Veg Feast",
            isVeg: false,
            icon: "🍛"
          }
        ]
      }
    ]
  },

  // Monthly Breakfast Subscription Menu (September 2026)
  subscriberBreakfastMenu: {
    title: "THE RAYALASEEMA CLOUD KITCHEN",
    month: "September 2026",
    subtitle: "MONTHLY BREAKFAST SUBSCRIPTION MENU",
    tagline: "Where Spice Meets Tradition.",
    deliverySlot: "7:30 AM - 9:00 AM (Morning Slot)",
    commitmentNote: "This weekly breakfast menu will be followed throughout September.",
    days: [
      {
        day: "Monday",
        item: "Dosa",
        description: "Crispy golden roasted dosa served with traditional groundnut chutney and piping hot vegetable sambar.",
        highlights: ["Crispy Ghee Dosa (2 pcs)", "Groundnut Chutney", "Hot Sambar"],
        badge: "Pure Ghee Dosa",
        isVeg: true,
        icon: "🥞"
      },
      {
        day: "Tuesday",
        item: "Idli",
        description: "Steamed fluffy soft rice idlis served with spicy podi, groundnut chutney and authentic sambar.",
        highlights: ["Fluffy Steamed Idlis (3 pcs)", "Karam Podi", "Sambar", "Chutney"],
        badge: "Steamed & Healthy",
        isVeg: true,
        icon: "⚪"
      },
      {
        day: "Wednesday",
        item: "Pongal",
        description: "Rich Ghee Ven Pongal tempered with whole black pepper, cumin, fresh ginger, and crunchy cashews.",
        highlights: ["Ghee Pongal", "Whole Cashews", "Coconut-Peanut Chutney", "Sambar"],
        badge: "Ghee & Cashew",
        isVeg: true,
        icon: "🍲"
      },
      {
        day: "Thursday",
        item: "Dosa",
        description: "Freshly made crispy golden dosa with traditional Rayalaseema chutney and seasoned sambar.",
        highlights: ["Crispy Dosa (2 pcs)", "Rayalaseema Chutney", "Hot Sambar"],
        badge: "Crispy Delight",
        isVeg: true,
        icon: "🥞"
      },
      {
        day: "Friday",
        item: "Uggani with Bajji",
        description: "Authentic Rayalaseema seasoned puffed rice tossed with roasted gram powder, onions, and served with hot Mirchi Bajji.",
        highlights: ["Authentic Uggani", "Hot Mirchi Bajji (2 pcs)", "Roasted Gram Blend"],
        badge: "Pride of Seema ⭐",
        isVeg: true,
        icon: "🌶️"
      },
      {
        day: "Saturday",
        item: "Ponganalu",
        description: "Golden crispy traditional skillet puffed dumplings (Gunta Ponganalu) served with spicy peanut chutney.",
        highlights: ["Gunta Ponganalu (6 pcs)", "Spicy Peanut Chutney", "Allam Pachadi"],
        badge: "Traditional Skillet ⭐",
        isVeg: true,
        icon: "🥟"
      },
      {
        day: "Sunday",
        item: "Idli",
        description: "Sunday morning comfort with melt-in-mouth hot idlis, pure ghee, rich sambar, and fresh chutney.",
        highlights: ["Melt-in-mouth Idlis (3 pcs)", "Fresh Ghee", "Sambar", "Chutney"],
        badge: "Sunday Comfort",
        isVeg: true,
        icon: "⚪"
      }
    ]
  },

  // Monthly Dinner Subscription Menu (September 2026)
  subscriberDinnerMenu: {
    title: "THE RAYALASEEMA CLOUD KITCHEN",
    month: "September 2026",
    subtitle: "SEPTEMBER 2026 - NIGHT DINNER MONTHLY SUBSCRIPTION MENU",
    breadChoice: "Chapati or Regular Roti - As Per Customer Choice",
    tagline: "Where Spice Meets Tradition.",
    posterImage: "images/dinner-menu-september.png",
    repeatNote: "The same 15-day menu will be repeated from September 16 to September 30.",
    deliverySlot: "7:30 PM - 9:00 PM (Night Dinner Slot)",
    commitmentNote: "Every dinner meal is served fresh with your choice of soft Chapati or Regular Roti alongside daily authentic curries. The 15-day rotation repeats seamlessly from September 16 to 30.",
    days: [
      {
        dayNum: 1,
        date: "September 1",
        label: "Day 1 - September 1",
        curry: "Leafy Vegetable Curry",
        bread: "Chapati or Regular Roti",
        badge: "Fresh Greens",
        icon: "🥬",
        isVeg: true
      },
      {
        dayNum: 2,
        date: "September 2",
        label: "Day 2 - September 2",
        curry: "Vankaya Curry",
        bread: "Chapati or Regular Roti",
        badge: "Brinjal Classic",
        icon: "🍆",
        isVeg: true
      },
      {
        dayNum: 3,
        date: "September 3",
        label: "Day 3 - September 3",
        curry: "Aloo Curry",
        bread: "Chapati or Regular Roti",
        badge: "Homestyle Aloo",
        icon: "🥔",
        isVeg: true
      },
      {
        dayNum: 4,
        date: "September 4",
        label: "Day 4 - September 4",
        curry: "Beans Curry",
        bread: "Chapati or Regular Roti",
        badge: "Fresh Green Beans",
        icon: "🫘",
        isVeg: true
      },
      {
        dayNum: 5,
        date: "September 5",
        label: "Day 5 - September 5",
        curry: "Carrot Curry",
        bread: "Chapati or Regular Roti",
        badge: "Nutritious & Sweet",
        icon: "🥕",
        isVeg: true
      },
      {
        dayNum: 6,
        date: "September 6",
        label: "Day 6 - September 6",
        curry: "Bendakaya Curry",
        bread: "Chapati or Regular Roti",
        badge: "Crisp Okra",
        icon: "🥒",
        isVeg: true
      },
      {
        dayNum: 7,
        date: "September 7",
        label: "Day 7 - September 7",
        curry: "Cabbage Curry",
        bread: "Chapati or Regular Roti",
        badge: "Light & Wholesome",
        icon: "🥗",
        isVeg: true
      },
      {
        dayNum: 8,
        date: "September 8",
        label: "Day 8 - September 8",
        curry: "Different Leafy Vegetable Curry",
        bread: "Chapati or Regular Roti",
        badge: "Seasonal Keerai",
        icon: "🥬",
        isVeg: true
      },
      {
        dayNum: 9,
        date: "September 9",
        label: "Day 9 - September 9",
        curry: "Beerakaya Curry",
        bread: "Chapati or Regular Roti",
        badge: "Ridge Gourd Curry",
        icon: "🥒",
        isVeg: true
      },
      {
        dayNum: 10,
        date: "September 10",
        label: "Day 10 - September 10",
        curry: "Aloo Curry",
        bread: "Chapati or Regular Roti",
        badge: "Spiced Potato",
        icon: "🥔",
        isVeg: true
      },
      {
        dayNum: 11,
        date: "September 11",
        label: "Day 11 - September 11",
        curry: "Cluster Beans or Broad Beans Curry",
        bread: "Chapati or Regular Roti",
        badge: "Country Beans",
        icon: "🫘",
        isVeg: true
      },
      {
        dayNum: 12,
        date: "September 12",
        label: "Day 12 - September 12",
        curry: "Beetroot Curry",
        bread: "Chapati or Regular Roti",
        badge: "Rich & Earthy",
        icon: "🟣",
        isVeg: true
      },
      {
        dayNum: 13,
        date: "September 13",
        label: "Day 13 - September 13",
        curry: "Dondakaya Curry",
        bread: "Chapati or Regular Roti",
        badge: "Tindora Special",
        icon: "🥒",
        isVeg: true
      },
      {
        dayNum: 14,
        date: "September 14",
        label: "Day 14 - September 14",
        curry: "Cauliflower Curry",
        bread: "Chapati or Regular Roti",
        badge: "Fresh Gobi",
        icon: "🥦",
        isVeg: true
      },
      {
        dayNum: 15,
        date: "September 15",
        label: "Day 15 - September 15",
        curry: "Leafy Vegetable Curry",
        bread: "Chapati or Regular Roti",
        badge: "Pure Greens",
        icon: "🥬",
        isVeg: true
      }
    ]
  },

  // Customer Reviews and Ratings
  reviews: [
    {
      id: "rev-1",
      name: "Suresh Reddy",
      role: "Senior Software Engineer @ Microsoft",
      rating: 5,
      comment: "The 10-day subscription is a lifesaver. Authentic Andhra taste, timely 12:30 PM delivery, and the flexibility to pause on leaves without losing days is incredible.",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80"
    },
    {
      id: "rev-2",
      name: "Swathi Anumolu",
      role: "Product Manager @ Amazon",
      rating: 5,
      comment: "The Gongura Pappu, Chicken Fry, and Friday Pulao feasts feel 100% home-cooked. Zero heavy soda or excess oil. Clean and healthy food daily!",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80"
    },
    {
      id: "rev-3",
      name: "Kiran Varma",
      role: "Operations Lead @ Infosys",
      rating: 5,
      comment: "We ordered corporate lunch for our 45-member team. The Bagara Rice with Rayalaseema Chicken Curry was hot, hygienic, and everybody loved it.",
      avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80"
    }
  ]
};
