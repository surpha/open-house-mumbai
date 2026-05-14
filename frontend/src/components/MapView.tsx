"use client";

import { useEffect, useMemo, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { supabase } from "@/lib/supabase";
import { SocietySummary } from "@/types/society";
import { MOCK_SOCIETIES } from "@/lib/mock-data";
import SocietyPopup from "./SocietyPopup";
import MapFilter, { FilterState } from "./MapFilter";

// Fix default marker icon issue with webpack/next.js
const defaultIcon = L.icon({
  iconUrl: "/marker-icon.png",
  iconRetinaUrl: "/marker-icon-2x.png",
  shadowUrl: "/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

L.Marker.prototype.options.icon = defaultIcon;

// Mumbai center coordinates
const MUMBAI_CENTER: [number, number] = [19.076, 72.8777];
const DEFAULT_ZOOM = 12;

export default function MapView() {
  const [societies, setSocieties] = useState<SocietySummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    area: "",
    minBachelorScore: 0,
    verifiedOnly: false,
  });

  useEffect(() => {
    async function fetchSocieties() {
      if (!supabase) {
        setSocieties(MOCK_SOCIETIES);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("society_summary")
        .select("*");

      if (error) {
        console.error("Error fetching societies:", error);
        setSocieties(MOCK_SOCIETIES);
      } else {
        setSocieties(data && data.length > 0 ? data : MOCK_SOCIETIES);
      }
      setLoading(false);
    }

    fetchSocieties();
  }, []);

  const areas = useMemo(
    () => [...new Set(societies.map((s) => s.area))].sort(),
    [societies]
  );

  const filtered = useMemo(() => {
    return societies.filter((s) => {
      if (filters.search && !s.name.toLowerCase().includes(filters.search.toLowerCase())) {
        return false;
      }
      if (filters.area && s.area !== filters.area) {
        return false;
      }
      if (filters.minBachelorScore > 0 && s.bachelor_index < filters.minBachelorScore) {
        return false;
      }
      if (filters.verifiedOnly && !s.verified) {
        return false;
      }
      return true;
    });
  }, [societies, filters]);

  return (
    <div className="relative w-full h-full">
      {loading && (
        <div className="absolute inset-0 z-[1000] flex items-center justify-center bg-white/80">
          <p className="text-lg font-medium text-gray-600">Loading map...</p>
        </div>
      )}
      <MapFilter areas={areas} onFilterChange={setFilters} />
      <div className="absolute top-4 right-4 z-[1000] bg-white/90 px-3 py-1.5 rounded-md shadow text-xs text-gray-600">
        {filtered.length} of {societies.length} societies
      </div>
      <MapContainer
        center={MUMBAI_CENTER}
        zoom={DEFAULT_ZOOM}
        className="w-full h-full z-0"
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {filtered.map((society) => (
          <Marker
            key={society.id}
            position={[society.lat, society.lng]}
          >
            <Popup>
              <SocietyPopup society={society} />
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
