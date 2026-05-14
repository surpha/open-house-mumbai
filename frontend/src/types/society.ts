export interface SocietySummary {
  id: string;
  name: string;
  slug: string;
  area: string;
  address: string;
  lat: number;
  lng: number;
  verified: boolean;
  bachelor_index: number;
  rent_report_count: number;
  vibe_check_count: number;
}

export interface Society {
  id: string;
  name: string;
  slug: string;
  address: string;
  area: string;
  pin_code: string;
  total_buildings: number | null;
  total_units: number | null;
  year_built: number | null;
  verified: boolean;
  created_at: string;
}

export interface BachelorRating {
  id: string;
  score: number;
  notes: string | null;
  created_at: string;
  profiles: { display_name: string } | null;
}

export interface VibeCheck {
  id: string;
  committee_vibe: number | null;
  neighbour_vibe: number | null;
  noise_level: number | null;
  pet_friendly: boolean | null;
  review: string | null;
  created_at: string;
  profiles: { display_name: string } | null;
}

export type FlatType = "1RK" | "1BHK" | "2BHK" | "3BHK" | "4BHK" | "5BHK+";

export interface RentReport {
  id: string;
  flat_type: FlatType;
  rent_monthly: number;
  deposit: number | null;
  maintenance_monthly: number | null;
  furnished: boolean;
  reported_at: string;
  created_at: string;
}

export interface Logistics {
  nearest_metro: string | null;
  metro_distance_km: number | null;
  nearest_railway: string | null;
  railway_distance_km: number | null;
  water_reliability: number | null;
  power_backup: boolean | null;
  nearby_essentials: string[] | null;
}
