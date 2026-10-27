-- ==============================================================================
-- RAYALASEEMA CLOUD KITCHEN - SUPABASE DATABASE INITIALIZATION SCRIPT
-- ==============================================================================
-- Run this script in your Supabase SQL Editor:
-- Supabase Dashboard -> SQL Editor -> New Query -> Paste & Run (Ctrl+Enter / Cmd+Enter)
-- Project URL: https://sjcjxetwxrdxwnhzpzaq.supabase.co
-- ==============================================================================

-- 1. Create site_content table (Fast JSON Store for complete website data sync)
CREATE TABLE IF NOT EXISTS public.site_content (
    key TEXT PRIMARY KEY,
    data JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL
);

-- 2. Create products table (Dishes & Bowls)
CREATE TABLE IF NOT EXISTS public.products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    categoryName TEXT,
    price NUMERIC NOT NULL,
    originalPrice NUMERIC,
    rating NUMERIC DEFAULT 4.8,
    reviewsCount INT DEFAULT 50,
    isVeg BOOLEAN DEFAULT TRUE,
    calories TEXT,
    protein TEXT,
    description TEXT,
    image TEXT,
    popular BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL
);

-- 3. Create categories table
CREATE TABLE IF NOT EXISTS public.categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    tagline TEXT,
    description TEXT,
    pricePerDay NUMERIC,
    image TEXT,
    badge TEXT,
    color TEXT DEFAULT 'amber',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL
);

-- 4. Create subscriptions table (10-Day Plan & Monthly Subscribers)
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id TEXT PRIMARY KEY,
    customerName TEXT NOT NULL,
    customerPhone TEXT NOT NULL,
    customerAddress TEXT,
    planId TEXT,
    planName TEXT,
    mealType TEXT,
    totalDays INT DEFAULT 10,
    consumedDays INT DEFAULT 0,
    remainingDays INT DEFAULT 10,
    status TEXT DEFAULT 'Active',
    isPausedTomorrow BOOLEAN DEFAULT FALSE,
    pauseCutoff TEXT DEFAULT '5:30 PM',
    nextDeliveryDate TEXT,
    pausedDates JSONB DEFAULT '[]'::JSONB,
    history JSONB DEFAULT '[]'::JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL
);

-- 5. Create orders table (Customer Delivery & Catering Orders)
CREATE TABLE IF NOT EXISTS public.orders (
    id TEXT PRIMARY KEY,
    date TEXT,
    customerName TEXT NOT NULL,
    customerPhone TEXT NOT NULL,
    customerEmail TEXT,
    deliveryAddress TEXT,
    items JSONB DEFAULT '[]'::JSONB,
    subtotal NUMERIC DEFAULT 0,
    deliveryFee NUMERIC DEFAULT 0,
    total NUMERIC DEFAULT 0,
    status TEXT DEFAULT 'Order Placed',
    paymentMethod TEXT DEFAULT 'UPI / Online',
    paymentStatus TEXT DEFAULT 'Paid',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL
);

-- 6. Create site_settings table (Hero Banner, Announcement, Contacts, UPI)
CREATE TABLE IF NOT EXISTS public.site_settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL
);

-- ==============================================================================
-- ENABLE ROW LEVEL SECURITY (RLS) & SET PERMISSIVE POLICIES
-- This allows your website frontend and admin panel to read & write with anon key.
-- ==============================================================================

ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Clean existing policies if re-running
DO $$ 
BEGIN
    DROP POLICY IF EXISTS "Public Full Access on site_content" ON public.site_content;
    DROP POLICY IF EXISTS "Public Full Access on products" ON public.products;
    DROP POLICY IF EXISTS "Public Full Access on categories" ON public.categories;
    DROP POLICY IF EXISTS "Public Full Access on subscriptions" ON public.subscriptions;
    DROP POLICY IF EXISTS "Public Full Access on orders" ON public.orders;
    DROP POLICY IF EXISTS "Public Full Access on site_settings" ON public.site_settings;
END $$;

-- Allow Public (anon) and Authenticated users full read/write access
CREATE POLICY "Public Full Access on site_content" ON public.site_content FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Full Access on products" ON public.products FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Full Access on categories" ON public.categories FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Full Access on subscriptions" ON public.subscriptions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Full Access on orders" ON public.orders FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Full Access on site_settings" ON public.site_settings FOR ALL USING (true) WITH CHECK (true);

-- Enable Realtime replication for instant live updates across devices
ALTER PUBLICATION supabase_realtime ADD TABLE public.site_content;
ALTER PUBLICATION supabase_realtime ADD TABLE public.products;
ALTER PUBLICATION supabase_realtime ADD TABLE public.subscriptions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;
