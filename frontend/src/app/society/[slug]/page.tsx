"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import {
  Society,
  BachelorRating,
  VibeCheck,
  RentReport,
  Logistics,
} from "@/types/society";
import BachelorSection from "@/components/society/BachelorSection";
import VibeSection from "@/components/society/VibeSection";
import RentSection from "@/components/society/RentSection";
import LogisticsSection from "@/components/society/LogisticsSection";

export default function SocietyProfilePage() {
  const params = useParams();
  const slug = params.slug as string;

  const [society, setSociety] = useState<Society | null>(null);
  const [bachelorRatings, setBachelorRatings] = useState<BachelorRating[]>([]);
  const [vibeChecks, setVibeChecks] = useState<VibeCheck[]>([]);
  const [rentReports, setRentReports] = useState<RentReport[]>([]);
  const [logistics, setLogistics] = useState<Logistics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabase || !slug) {
      setLoading(false);
      return;
    }

    async function fetchData() {
      // Fetch society
      const { data: societyData } = await supabase!
        .from("societies")
        .select("*")
        .eq("slug", slug)
        .single();

      if (!societyData) {
        setLoading(false);
        return;
      }

      setSociety(societyData);

      // Fetch related data in parallel
      const [bachelorRes, vibeRes, rentRes, logisticsRes] = await Promise.all([
        supabase!
          .from("bachelor_ratings")
          .select("*, profiles(display_name)")
          .eq("society_id", societyData.id)
          .order("created_at", { ascending: false }),
        supabase!
          .from("vibe_checks")
          .select("*, profiles(display_name)")
          .eq("society_id", societyData.id)
          .order("created_at", { ascending: false }),
        supabase!
          .from("rent_reports")
          .select("*")
          .eq("society_id", societyData.id)
          .order("reported_at", { ascending: false }),
        supabase!
          .from("logistics")
          .select("*")
          .eq("society_id", societyData.id)
          .single(),
      ]);

      setBachelorRatings(bachelorRes.data || []);
      setVibeChecks(vibeRes.data || []);
      setRentReports(rentRes.data || []);
      setLogistics(logisticsRes.data);
      setLoading(false);
    }

    fetchData();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500 text-lg">Loading society profile...</p>
      </div>
    );
  }

  if (!society) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <p className="text-gray-500 text-lg">Society not found.</p>
        <Link href="/" className="text-blue-600 hover:underline">
          ← Back to Map
        </Link>
      </div>
    );
  }

  const avgBachelorScore =
    bachelorRatings.length > 0
      ? (
          bachelorRatings.reduce((sum, r) => sum + r.score, 0) /
          bachelorRatings.length
        ).toFixed(1)
      : null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <Link
            href="/"
            className="text-sm text-gray-500 hover:text-gray-700 mb-2 inline-block"
          >
            ← Back to Map
          </Link>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {society.name}
              </h1>
              <p className="text-gray-600">
                {society.address}, {society.area} — {society.pin_code}
              </p>
              <div className="flex gap-3 mt-2 text-sm text-gray-500">
                {society.year_built && <span>Built {society.year_built}</span>}
                {society.total_units && (
                  <span>• {society.total_units} units</span>
                )}
                {society.total_buildings && (
                  <span>• {society.total_buildings} buildings</span>
                )}
              </div>
            </div>
            {society.verified && (
              <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">
                ✓ Verified
              </span>
            )}
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-6 py-8 space-y-8">
        {/* Bachelor Index */}
        <BachelorSection
          avgScore={avgBachelorScore}
          ratings={bachelorRatings}
        />

        {/* Vibe Check */}
        <VibeSection vibeChecks={vibeChecks} />

        {/* Rent Transparency */}
        <RentSection rentReports={rentReports} />

        {/* Logistics */}
        <LogisticsSection logistics={logistics} />
      </main>
    </div>
  );
}
