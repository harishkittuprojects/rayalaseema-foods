// Rayalaseema Cloud Kitchen - Central Data Store

const MENU_DATA = {
  categories: [
    {
      id: "veg-bowl",
      name: "Veg Meals",
      tagline: "Fresh, authentic South Indian vegetarian meals.",
      description: "Packed with fiber, traditional lentils, and authentic Rayalaseema spices. Includes fragrant steamed rice, paneer curry, dal tadka, seasonal veg fry, and crispy papad.",
      pricePerDay: 150,
      image: "images/veg-meals.jpg",
      badge: "Popular Veg",
      color: "emerald"
    },
    {
      id: "non-veg-bowl",
      name: "Non-Veg Meals",
      tagline: "Protein-rich, authentic Rayalaseema spiced chicken meals.",
      description: "Signature Rayalaseema chicken curry, country egg, fragrant spiced rice / biryani rice, roasted chicken fry, and savory accompaniments.",
      pricePerDay: 180,
      image: "images/nonveg-meals.jpg",
      badge: "Chef's Special",
      color: "amber"
    },
    {
      id: "fruit-bowl",
      name: "Fruit Meals",
      tagline: "Hand-picked fresh fruits for daily natural energy & immunity.",
      description: "Seasonal hand-picked fruits, pomegranate, kiwi, berries, dry fruits, honey-lime dressing, and organic chia seeds.",
      pricePerDay: 120,
      image: "https://images.unsplash.com/photo-1519996529931-28324d5a630e?auto=format&fit=crop&w=800&q=80",
      badge: "Immunity Boost",
      color: "yellow"
    }
  ],

  products: [
    // Veg Meals
    {
      id: "vb-1",
      name: "Rayalaseema Deluxe Veg Full Meal",
      category: "veg-bowl",
      categoryName: "Veg Meal",
      price: 169,
      originalPrice: 199,
      rating: 4.9,
      reviewsCount: 142,
      isVeg: true,
      calories: "450 kcal",
      protein: "22g Protein",
      description: "Steaming fragrant rice, rich paneer curry, aromatic dal tadka, seasonal vegetable fry, sambar, rasam, curd, and crispy papad.",
      image: "images/veg-meals.jpg",
      popular: true
    },
    {
      id: "vb-2",
      name: "Gongura Pappu & Rice Veg Meal",
      category: "veg-bowl",
      categoryName: "Veg Meal",
      price: 149,
      originalPrice: 179,
      rating: 4.8,
      reviewsCount: 98,
      isVeg: true,
      calories: "410 kcal",
      protein: "20g Protein",
      description: "Tangy authentic Gongura dal tadka, hot steamed rice with pure ghee, aloo fry, curd, and Rayalaseema gunpowder (Kandi Podi).",
      image: "images/veg-meals.jpg",
      popular: false
    },
    {
      id: "vb-3",
      name: "Special Paneer Butter Masala Veg Meal",
      category: "veg-bowl",
      categoryName: "Veg Meal",
      price: 159,
      originalPrice: 189,
      rating: 4.9,
      reviewsCount: 115,
      isVeg: true,
      calories: "460 kcal",
      protein: "24g Protein",
      description: "Soft fresh cottage cheese cubes simmered in spiced cashew gravy, fragrant jeera rice, yellow dal fry, and fresh salad.",
      image: "images/veg-meals.jpg",
      popular: true
    },
    {
      id: "vb-4",
      name: "South Indian Executive Veg Meal",
      category: "veg-bowl",
      categoryName: "Veg Meal",
      price: 189,
      originalPrice: 220,
      rating: 4.7,
      reviewsCount: 84,
      isVeg: true,
      calories: "480 kcal",
      protein: "21g Protein",
      description: "Complete executive thali meal featuring two regional veg curries, dal, sambar, rasam, flavored rice, chapati, and traditional sweet.",
      image: "images/veg-meals.jpg",
      popular: false
    },

    // Non-Veg Meals
    {
      id: "nvb-1",
      name: "Rayalaseema Chicken Curry & Biryani Meal",
      category: "non-veg-bowl",
      categoryName: "Non-Veg Meal",
      price: 199,
      originalPrice: 249,
      rating: 5.0,
      reviewsCount: 238,
      isVeg: false,
      calories: "520 kcal",
      protein: "38g Protein",
      description: "Authentic spicy Rayalaseema chicken curry, fragrant spiced biryani rice, roasted chicken fry pieces, country boiled egg, and onion raita.",
      image: "images/nonveg-meals.jpg",
      popular: true
    },
    {
      id: "nvb-2",
      name: "Rayalaseema Pepper Chicken Fry & Rice Meal",
      category: "non-veg-bowl",
      categoryName: "Non-Veg Meal",
      price: 189,
      originalPrice: 229,
      rating: 4.9,
      reviewsCount: 176,
      isVeg: false,
      calories: "510 kcal",
      protein: "36g Protein",
      description: "Signature black pepper tossed country chicken tenders, steamed rice with dal, soft boiled farm egg, and spicy gravy.",
      image: "images/nonveg-meals.jpg",
      popular: true
    },
    {
      id: "nvb-3",
      name: "Natu Kodi Pulusu & Rice Non-Veg Meal",
      category: "non-veg-bowl",
      categoryName: "Non-Veg Meal",
      price: 219,
      originalPrice: 259,
      rating: 4.8,
      reviewsCount: 92,
      isVeg: false,
      calories: "490 kcal",
      protein: "35g Protein",
      description: "Traditional country chicken curry cooked with fiery Guntur spices and aromatic herbs, served with steaming rice and rasam.",
      image: "images/nonveg-meals.jpg",
      popular: false
    },
    {
      id: "nvb-4",
      name: "Rayalaseema Chicken & Egg Special Meal",
      category: "non-veg-bowl",
      categoryName: "Non-Veg Meal",
      price: 179,
      originalPrice: 209,
      rating: 4.9,
      reviewsCount: 164,
      isVeg: false,
      calories: "480 kcal",
      protein: "42g Protein",
      description: "Protein-packed meal with tender boneless chicken curry, 2 farm boiled eggs, steamed rice, rasam, and roasted papad.",
      image: "images/nonveg-meals.jpg",
      popular: true
    },

    // Fruit Meals
    {
      id: "fb-1",
      name: "Exotic Antioxidant Fruit Crunch Meal",
      category: "fruit-bowl",
      categoryName: "Fruit Meal",
      price: 139,
      originalPrice: 169,
      rating: 4.9,
      reviewsCount: 182,
      isVeg: true,
      calories: "210 kcal",
      protein: "6g Protein",
      description: "Fresh dragon fruit, ripe kiwi, pomegranate jewels, sweet pineapple chunks, toasted pumpkin seeds, and wild honey drizzle.",
      image: "https://images.unsplash.com/photo-1519996529931-28324d5a630e?auto=format&fit=crop&w=800&q=80",
      popular: true
    },
    {
      id: "fb-2",
      name: "Hydration & Immunity Citrus Berry Meal",
      category: "fruit-bowl",
      categoryName: "Fruit Meal",
      price: 129,
      originalPrice: 159,
      rating: 4.8,
      reviewsCount: 104,
      isVeg: true,
      calories: "180 kcal",
      protein: "4g Protein",
      description: "Crisp Washington apples, imported blueberries, sweet oranges, fresh mint leaves, chia seeds, and light lemon zest.",
      image: "https://images.unsplash.com/photo-1490818387583-1baba5e638af?auto=format&fit=crop&w=800&q=80",
      popular: false
    },
    {
      id: "fb-3",
      name: "Dry Fruit & Greek Yogurt Supreme Fruit Meal",
      category: "fruit-bowl",
      categoryName: "Fruit Meal",
      price: 159,
      originalPrice: 189,
      rating: 5.0,
      reviewsCount: 147,
      isVeg: true,
      calories: "260 kcal",
      protein: "12g Protein",
      description: "Rich layered Greek yogurt, sliced seasonal mango or berries, roasted almonds, walnuts, and organic maple glaze.",
      image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=800&q=80",
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
      id: "plan-trial",
      name: "10-Day Trial Plan",
      tag: "Try Before Subscribing",
      pricePerDay: 150,
      totalPrice: 1500,
      days: 10,
      popular: false,
      description: "Experience the freshest workday meals for 10 workdays. Test our authentic taste and punctual delivery.",
      features: [
        "10 Daily Fresh Deliveries",
        "Choose Veg, Non-Veg or Fruit Daily",
        "Pause on Absent Days (Zero Loss)",
        "Free Office Desk Delivery",
        "WhatsApp Live Support"
      ],
      cta: "Start 10-Day Trial"
    },
    {
      id: "plan-monthly",
      name: "Monthly Regular Plan",
      tag: "Most Popular",
      pricePerDay: 140,
      totalPrice: 3640,
      days: 26,
      popular: true,
      description: "Full workday nutrition plan designed for working professionals. Maximum savings and flexibility.",
      features: [
        "26 Workday Deliveries",
        "Unlimited Pause & Resume",
        "Complimentary Weekend Fruit Meal",
        "Priority 12:30 PM Lunch Slot",
        "Nutritionist Consultation Included"
      ],
      cta: "Get Monthly Plan"
    },
    {
      id: "plan-custom",
      name: "Custom Corporate Plan",
      tag: "For Companies / Bulk",
      pricePerDay: 119,
      totalPrice: "Custom",
      days: "Flexible",
      popular: false,
      description: "Tailored meal plans for team lunches, office cafeterias, and bulk workforce wellness programs.",
      features: [
        "Custom Calorie & Diet Split",
        "Consolidated GST Monthly Invoice",
        "Dedicated Delivery Van",
        "Tasting Session at Office",
        "Dedicated Account Lead"
      ],
      cta: "Get In Touch"
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
  ]
};
