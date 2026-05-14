-- ============================================================
-- Seed data: 5 Mumbai societies for initial testing
-- Run this AFTER 001_initial_schema.sql
-- ============================================================

-- Insert societies
INSERT INTO societies (name, slug, address, area, pin_code, location, total_buildings, total_units, year_built, verified)
VALUES
  ('Raheja Residency', 'raheja-residency', 'Plot 14, New Link Road, Andheri West', 'Andheri West', '400053', ST_MakePoint(72.8296, 19.1364)::geography, 4, 120, 2008, true),
  ('Lodha Palava', 'lodha-palava', 'Hiranandani Gardens, Powai', 'Powai', '400076', ST_MakePoint(72.9051, 19.1197)::geography, 8, 350, 2015, true),
  ('Vasant Galaxy', 'vasant-galaxy', 'SV Road, Goregaon West', 'Goregaon West', '400062', ST_MakePoint(72.8424, 19.1663)::geography, 2, 60, 2001, false),
  ('Nahar Amrit Shakti', 'nahar-amrit-shakti', 'Chandivali Farm Road, Andheri East', 'Chandivali', '400072', ST_MakePoint(72.8891, 19.1052)::geography, 12, 500, 2010, true),
  ('Kalpataru Aura', 'kalpataru-aura', 'Turner Road, Bandra West', 'Bandra West', '400050', ST_MakePoint(72.8358, 19.0544)::geography, 1, 45, 2018, true);

-- Insert logistics for each society
INSERT INTO logistics (society_id, nearest_metro, metro_distance_km, nearest_railway, railway_distance_km, water_reliability, power_backup, nearby_essentials)
VALUES
  ((SELECT id FROM societies WHERE slug = 'raheja-residency'), 'D.N. Nagar Metro', 0.8, 'Andheri Station', 1.5, 4, true, ARRAY['D-Mart', 'Zepto Hub', 'Vegetable Market', 'Medical Store', 'HDFC ATM']),
  ((SELECT id FROM societies WHERE slug = 'lodha-palava'), 'Powai Metro (upcoming)', 2.0, 'Kanjurmarg Station', 3.2, 5, true, ARRAY['D-Mart', 'Galleria Mall', 'Hiranandani Hospital', 'Nature Basket']),
  ((SELECT id FROM societies WHERE slug = 'vasant-galaxy'), 'Goregaon Metro', 0.5, 'Goregaon Station', 1.0, 3, false, ARRAY['Big Bazaar', 'Vegetable Market', 'SBI ATM']),
  ((SELECT id FROM societies WHERE slug = 'nahar-amrit-shakti'), 'Chandivali Metro (upcoming)', 1.5, 'Jogeshwari Station', 4.0, 4, true, ARRAY['D-Mart', 'Reliance Fresh', 'Chandivali Studio', 'Park']),
  ((SELECT id FROM societies WHERE slug = 'kalpataru-aura'), 'Bandra Metro (upcoming)', 1.0, 'Bandra Station', 0.8, 5, true, ARRAY['Linking Road Market', 'Starbucks', 'Bandra Gym', 'Pali Market']);
