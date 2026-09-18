// Rayalaseema Cloud Kitchen - Data Store

const MENU_DATA = {
  categories: [
    {
      id: "veg-bowl",
      name: "Veg Bowl",
      tagline: "Fresh, wholesome and nutritious vegetarian meals.",
      description: "Packed with fiber, protein, and authentic Rayalaseema spices. Includes millets, paneer, sprouts, and farm veggies.",
      pricePerDay: 150,
      image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80",
      badge: "Popular Veg",
      color: "emerald"
    },
    {
      id: "non-veg-bowl",
      name: "Non-Veg Bowl",
      tagline: "Protein-rich meals for your busy workday.",
      description: "Lean cuts of Rayalaseema spiced chicken, boiled eggs, fragrant brown rice/millet, tossed garden greens.",
      pricePerDay: 180,
      image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80",
      badge: "Best Seller",
      color: "amber"
    },
    {
      id: "fruit-bowl",
      name: "Fruit Bowl",
      tagline: "Fresh fruits for a healthy and energetic you.",
      description: "Seasonal hand-picked fruits, pomegranate, kiwi, berries, dry fruits, honey-lime dressing and chia seeds.",
      pricePerDay: 120,
      image: "https://images.unsplash.com/photo-1519996529931-28324d5a630e?auto=format&fit=crop&w=800&q=80",
      badge: "Immunity Boost",
      color: "yellow"
    }
  ],

  products: [
    // Veg Bowls
    {
      id: "vb-1",
      name: "Rayalaseema Paneer Millet Bowl",
      category: "veg-bowl",
      categoryName: "Veg Bowl",
      price: 169,
      originalPrice: 199,
      rating: 4.9,
      reviewsCount: 142,
      isVeg: true,
      calories: "420 kcal",
      protein: "22g Protein",
      description: "Grilled spiced cottage cheese cubes served on foxtail millet, sautéed capsicum, roasted peanuts, and tangy mint chutney.",
      image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80",
      popular: true
    },
    {
      id: "vb-2",
      name: "Gongura Soya Chunk High-Fiber Bowl",
      category: "veg-bowl",
      categoryName: "Veg Bowl",
      price: 149,
      originalPrice: 179,
      rating: 4.8,
      reviewsCount: 98,
      isVeg: true,
      calories: "380 kcal",
      protein: "24g Protein",
      description: "Spicy gongura flavored soft soya chunks, steamed red rice, roasted chickpea crunch, and crunchy cucumber ribbons.",
      image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80",
      popular: false
    },
    {
      id: "vb-3",
      name: "Sprouted Moong & Roasted Paneer Power Bowl",
      category: "veg-bowl",
      categoryName: "Veg Bowl",
      price: 159,
      originalPrice: 189,
      rating: 4.9,
      reviewsCount: 115,
      isVeg: true,
      calories: "390 kcal",
      protein: "20g Protein",
      description: "Steamed organic sprouts with toasted cumin paneer, heirloom tomatoes, coriander lime dressing, and flaxseed crumble.",
      image: "https://images.unsplash.com/photo-1543339308-43e59d6b73a6?auto=format&fit=crop&w=800&q=80",
      popular: true
    },
    {
      id: "vb-4",
      name: "Avocado & Roasted Chickpea Super Bowl",
      category: "veg-bowl",
      categoryName: "Veg Bowl",
      price: 189,
      originalPrice: 220,
      rating: 4.7,
      reviewsCount: 84,
      isVeg: true,
      calories: "440 kcal",
      protein: "16g Protein",
      description: "Creamy avocado slices, spiced crunchy chickpeas, quinoa base, grilled zucchini, and lemon-tahini drizzle.",
      image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80",
      popular: false
    },

    // Non-Veg Bowls
    {
      id: "nvb-1",
      name: "Andhra Spiced Grilled Chicken Bowl",
      category: "non-veg-bowl",
      categoryName: "Non-Veg Bowl",
      price: 199,
      originalPrice: 249,
      rating: 5.0,
      reviewsCount: 238,
      isVeg: false,
      calories: "490 kcal",
      protein: "38g Protein",
      description: "Tender herb-marinated chicken breast slices with brown basmati rice, steamed broccoli, hard-boiled egg, and curry-leaf chimichurri.",
      image: "https://images.unsplash.com/photo-1546069901-d3a681c1c73f?auto=format&fit=crop&w=800&q=80",
      popular: true
    },
    {
      id: "nvb-2",
      name: "Rayalaseema Pepper Chicken & Egg Bowl",
      category: "non-veg-bowl",
      categoryName: "Non-Veg Bowl",
      price: 189,
      originalPrice: 229,
      rating: 4.9,
      reviewsCount: 176,
      isVeg: false,
      calories: "510 kcal",
      protein: "36g Protein",
      description: "Signature black pepper tossed country chicken tenders, soft boiled farm egg, millet pilaf, and pickled beetroot shreds.",
      image: "https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&w=800&q=80",
      popular: true
    },
    {
      id: "nvb-3",
      name: "Herb Roast Chicken & Roasted Sweet Potato Bowl",
      category: "non-veg-bowl",
      categoryName: "Non-Veg Bowl",
      price: 219,
      originalPrice: 259,
      rating: 4.8,
      reviewsCount: 92,
      isVeg: false,
      calories: "470 kcal",
      protein: "34g Protein",
      description: "Slow-roasted rosemary-garlic chicken breast, caramelized sweet potato cubes, sautéed green beans, and honey-dijon dressing.",
      image: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=800&q=80",
      popular: false
    },
    {
      id: "nvb-4",
      name: "Double Egg Whites & Smoked Chicken Protein Bowl",
      category: "non-veg-bowl",
      categoryName: "Non-Veg Bowl",
      price: 179,
      originalPrice: 209,
      rating: 4.9,
      reviewsCount: 164,
      isVeg: false,
      calories: "410 kcal",
      protein: "42g Protein",
      description: "Ultra-lean fitness bowl with 4 egg whites, shredded smoked chicken, warm quinoa, charred peppers, and light garlic yogurt dip.",
      image: "https://images.unsplash.com/photo-1584947897554-463212c19e5d?auto=format&fit=crop&w=800&q=80",
      popular: true
    },

    // Fruit Bowls
    {
      id: "fb-1",
      name: "Exotic Antioxidant Fruit Crunch Bowl",
      category: "fruit-bowl",
      categoryName: "Fruit Bowl",
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
      name: "Hydration & Immunity Citrus Berry Bowl",
      category: "fruit-bowl",
      categoryName: "Fruit Bowl",
      price: 129,
      originalPrice: 159,
      rating: 4.8,
      reviewsCount: 104,
      isVeg: true,
      calories: "180 kcal",
      protein: "4g Protein",
      description: "Crisp Washington apples, imported blueberries, sweet oranges, mint leaves, chia seeds, and light lemon zest.",
      image: "https://images.unsplash.com/photo-1490818387583-1baba5e638af?auto=format&fit=crop&w=800&q=80",
      popular: false
    },
    {
      id: "fb-3",
      name: "Dry Fruit & Greek Yogurt Supreme Fruit Bowl",
      category: "fruit-bowl",
      categoryName: "Fruit Bowl",
      price: 159,
      originalPrice: 189,
      rating: 5.0,
      reviewsCount: 147,
      isVeg: true,
      calories: "260 kcal",
      protein: "12g Protein",
      description: "Rich layered Greek yogurt, sliced Alphonso mango / seasonal berries, Californian almonds, walnuts, and organic maple glaze.",
      image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=800&q=80",
      popular: true
    }
  ],

  services: [
    {
      id: "srv-catering",
      title: "Catering Services",
      tagline: "Corporate lunches, private gatherings, and festival feasts.",
      description: "Customized live counters, individual executive lunch boxes, or buffet setups for teams of 20 to 2,000+ people. Hygienic, hot, and punctual delivery.",
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
      tagline: "Bulk healthy meal supply for IT parks, colleges & hospitals.",
      description: "Contract-based recurring bulk supply of balanced meal bowls and nutrition packs with guaranteed scheduled morning/afternoon delivery slots.",
      pricingType: "starting",
      priceDisplay: "Starting at ₹99 / bowl (Min 50 qty)",
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
      tagline: "Direct-to-doorstep individual and family orders.",
      description: "Order fresh nutritious bowls directly for lunch or dinner. Prepared fresh in our cloud kitchen and delivered straight to your office desk or home.",
      pricingType: "fixed",
      priceDisplay: "Starting at ₹120 / bowl",
      startingPrice: 120,
      ctaText: "Order Bowls Now",
      ctaAction: "order",
      badge: "Instant Delivery",
      image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80",
      features: ["Live Order Tracking", "30-45 Mins Fast Delivery", "No Minimum Order", "Customizable Add-ons"]
    },
    {
      id: "srv-hybrid",
      title: "Wholesale + Retail Food Supply",
      tagline: "Comprehensive hybrid solutions for co-working spaces and gyms.",
      description: "Dual setup providing recurring base bulk meals alongside an on-demand micro-ordering kiosk or app code for individual employees/members.",
      pricingType: "starting",
      priceDisplay: "Custom Pricing based on SLA",
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
      name: "10-Day Trial",
      tag: "Try Before Subscribing",
      pricePerDay: 150,
      totalPrice: 1500,
      days: 10,
      popular: false,
      description: "Experience the freshest bowls for 10 workdays. Test our taste and punctuality.",
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
      name: "Monthly Regular",
      tag: "Most Popular",
      pricePerDay: 140,
      totalPrice: 3640,
      days: 26,
      popular: true,
      description: "Full workday nutrition plan designed for professionals. Maximum savings & flexibility.",
      features: [
        "26 Workday Deliveries",
        "Unlimited Pause & Resume",
        "Complimentary Weekend Fruit Bowl",
        "Priority 12:30 PM Lunch Slot",
        "Nutritionist Consultation Included"
      ],
      cta: "Get Monthly Plan"
    },
    {
      id: "plan-custom",
      name: "Custom Corporate",
      tag: "For Companies / Bulk",
      pricePerDay: 119,
      totalPrice: "Custom",
      days: "Flexible",
      popular: false,
      description: "Tailored meal plans for team lunches, office cafeterias, and bulk workforce wellness.",
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
      comment: "The non-veg bowls are amazing! Good taste, low oil, and genuinely healthy options that keep you energetic all day.",
      rating: 5
    },
    {
      name: "Shandeep Reddy",
      role: "Team Lead, Madhapur",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
      comment: "Their catering service for our 80-person office quarterly event was top notch. Piping hot and everyone loved the authentic spices!",
      rating: 5
    }
  ]
};
