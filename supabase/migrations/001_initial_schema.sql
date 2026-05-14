-- ============================================================
-- Open House Mumbai - V1 Schema
-- ============================================================

-- Enable PostGIS for geolocation queries (map pins, proximity)
CREATE EXTENSION IF NOT EXISTS postgis;

-- ============================================================
-- PROFILES (extends Supabase auth.users)
-- ============================================================
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    display_name TEXT NOT NULL,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- SOCIETIES (core entity — one row per housing society)
-- ============================================================
CREATE TABLE societies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    address TEXT NOT NULL,
    area TEXT NOT NULL,            -- e.g. "Andheri West", "Powai"
    pin_code TEXT NOT NULL,
    location GEOGRAPHY(POINT, 4326) NOT NULL,  -- lat/lng for map pin
    total_buildings INT,
    total_units INT,
    year_built INT,
    added_by UUID REFERENCES profiles(id),
    verified BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_societies_location ON societies USING GIST(location);
CREATE INDEX idx_societies_area ON societies(area);
CREATE INDEX idx_societies_slug ON societies(slug);

-- ============================================================
-- BACHELOR RATINGS (1-10 score per user per society)
-- ============================================================
CREATE TABLE bachelor_ratings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    society_id UUID NOT NULL REFERENCES societies(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id),
    score SMALLINT NOT NULL CHECK (score >= 1 AND score <= 10),
    notes TEXT,  -- optional context ("families only after 10pm curfew")
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(society_id, user_id)  -- one rating per user per society
);

-- ============================================================
-- VIBE CHECKS (sentiment reviews)
-- ============================================================
CREATE TABLE vibe_checks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    society_id UUID NOT NULL REFERENCES societies(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id),
    committee_vibe SMALLINT CHECK (committee_vibe >= 1 AND committee_vibe <= 5),
    neighbour_vibe SMALLINT CHECK (neighbour_vibe >= 1 AND neighbour_vibe <= 5),
    noise_level SMALLINT CHECK (noise_level >= 1 AND noise_level <= 5),
    pet_friendly BOOLEAN,
    review TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_vibe_checks_society ON vibe_checks(society_id);

-- ============================================================
-- RENT REPORTS (community-contributed rent transparency)
-- ============================================================
CREATE TYPE flat_type AS ENUM ('1RK', '1BHK', '2BHK', '3BHK', '4BHK', '5BHK+');

CREATE TABLE rent_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    society_id UUID NOT NULL REFERENCES societies(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id),
    flat_type flat_type NOT NULL,
    rent_monthly INT NOT NULL,         -- in INR
    deposit INT,                       -- in INR
    maintenance_monthly INT,           -- in INR
    furnished BOOLEAN DEFAULT false,
    reported_at DATE DEFAULT CURRENT_DATE,  -- when this rent was paid
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_rent_reports_society ON rent_reports(society_id);

-- ============================================================
-- LOGISTICS (proximity & infrastructure data)
-- ============================================================
CREATE TABLE logistics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    society_id UUID UNIQUE NOT NULL REFERENCES societies(id) ON DELETE CASCADE,
    nearest_metro TEXT,
    metro_distance_km NUMERIC(4,2),
    nearest_railway TEXT,
    railway_distance_km NUMERIC(4,2),
    water_reliability SMALLINT CHECK (water_reliability >= 1 AND water_reliability <= 5),  -- 1=poor, 5=excellent
    power_backup BOOLEAN,
    nearby_essentials TEXT[],  -- e.g. {"D-Mart", "Zepto Hub", "Vegetable Market"}
    updated_by UUID REFERENCES profiles(id),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

-- Societies: anyone can read, authenticated users can insert
ALTER TABLE societies ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read access" ON societies FOR SELECT USING (true);
CREATE POLICY "Authenticated users can add" ON societies FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Bachelor ratings: anyone can read, users manage their own
ALTER TABLE bachelor_ratings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read access" ON bachelor_ratings FOR SELECT USING (true);
CREATE POLICY "Users can insert own" ON bachelor_ratings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own" ON bachelor_ratings FOR UPDATE USING (auth.uid() = user_id);

-- Vibe checks: anyone can read, users manage their own
ALTER TABLE vibe_checks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read access" ON vibe_checks FOR SELECT USING (true);
CREATE POLICY "Users can insert own" ON vibe_checks FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Rent reports: anyone can read, users manage their own
ALTER TABLE rent_reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read access" ON rent_reports FOR SELECT USING (true);
CREATE POLICY "Users can insert own" ON rent_reports FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Logistics: anyone can read, authenticated users can update
ALTER TABLE logistics ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read access" ON logistics FOR SELECT USING (true);
CREATE POLICY "Authenticated users can add" ON logistics FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated users can update" ON logistics FOR UPDATE USING (auth.uid() IS NOT NULL);

-- Profiles: public read, users manage their own
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read access" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can modify own" ON profiles FOR UPDATE USING (auth.uid() = id);

-- ============================================================
-- HELPER VIEWS (for the frontend)
-- ============================================================

-- Aggregated society stats for map pins & listing cards
CREATE VIEW society_summary AS
SELECT
    s.id,
    s.name,
    s.slug,
    s.area,
    s.address,
    ST_Y(s.location::geometry) AS lat,
    ST_X(s.location::geometry) AS lng,
    s.verified,
    COALESCE(ROUND(AVG(br.score)::numeric, 1), 0) AS bachelor_index,
    COUNT(DISTINCT rr.id) AS rent_report_count,
    COUNT(DISTINCT vc.id) AS vibe_check_count
FROM societies s
LEFT JOIN bachelor_ratings br ON br.society_id = s.id
LEFT JOIN rent_reports rr ON rr.society_id = s.id
LEFT JOIN vibe_checks vc ON vc.society_id = s.id
GROUP BY s.id;
