"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";

interface FormData {
  name: string;
  address: string;
  area: string;
  pin_code: string;
  lat: string;
  lng: string;
  total_buildings: string;
  total_units: string;
  year_built: string;
}

const MUMBAI_AREAS = [
  "Andheri East",
  "Andheri West",
  "Bandra East",
  "Bandra West",
  "Borivali East",
  "Borivali West",
  "Chembur",
  "Dadar",
  "Goregaon East",
  "Goregaon West",
  "Juhu",
  "Kandivali East",
  "Kandivali West",
  "Khar",
  "Lower Parel",
  "Malad East",
  "Malad West",
  "Matunga",
  "Mulund",
  "Powai",
  "Santacruz",
  "Thane West",
  "Versova",
  "Vikhroli",
  "Worli",
  "Other",
];

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function ContributePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [form, setForm] = useState<FormData>({
    name: "",
    address: "",
    area: "",
    pin_code: "",
    lat: "",
    lng: "",
    total_buildings: "",
    total_units: "",
    year_built: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  }, []);

  async function handleSignIn() {
    if (!supabase) return;
    setAuthLoading(true);
    setAuthError(null);
    const { data, error } = await supabase.auth.signInWithPassword({
      email: authEmail,
      password: authPassword,
    });
    if (error) {
      setAuthError(error.message);
    } else {
      setUser(data.user);
    }
    setAuthLoading(false);
  }

  async function handleSignUp() {
    if (!supabase) return;
    setAuthLoading(true);
    setAuthError(null);
    const { data, error } = await supabase.auth.signUp({
      email: authEmail,
      password: authPassword,
    });
    if (error) {
      setAuthError(error.message);
    } else if (data.user) {
      // Create profile
      await supabase.from("profiles").insert({
        id: data.user.id,
        display_name: authEmail.split("@")[0],
      });
      setUser(data.user);
    }
    setAuthLoading(false);
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!supabase) {
      setError("Database not configured. Please set up Supabase credentials.");
      return;
    }

    if (!user) {
      setError("You must be signed in to add a society.");
      return;
    }

    // Validate required fields
    if (!form.name || !form.address || !form.area || !form.pin_code) {
      setError("Please fill in all required fields.");
      return;
    }

    const lat = parseFloat(form.lat);
    const lng = parseFloat(form.lng);
    if (!form.lat || !form.lng || isNaN(lat) || isNaN(lng)) {
      setError("Please provide valid latitude and longitude.");
      return;
    }

    setSubmitting(true);

    const slug = slugify(form.name);

    const { error: insertError } = await supabase.from("societies").insert({
      name: form.name,
      slug,
      address: form.address,
      area: form.area,
      pin_code: form.pin_code,
      location: `POINT(${lng} ${lat})`,
      total_buildings: form.total_buildings
        ? parseInt(form.total_buildings)
        : null,
      total_units: form.total_units ? parseInt(form.total_units) : null,
      year_built: form.year_built ? parseInt(form.year_built) : null,
      added_by: user.id,
    });

    setSubmitting(false);

    if (insertError) {
      if (insertError.code === "23505") {
        setError("A society with this name already exists.");
      } else {
        setError(insertError.message);
      }
      return;
    }

    router.push(`/society/${slug}`);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-2xl mx-auto px-6 py-4">
          <Link
            href="/"
            className="text-sm text-gray-500 hover:text-gray-700 mb-2 inline-block"
          >
            ← Back to Map
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Add a Society</h1>
          <p className="text-sm text-gray-500 mt-1">
            Help open-source Mumbai&apos;s housing data. All fields marked * are
            required.
          </p>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-8">
        {/* Auth Gate */}
        {!user ? (
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              Sign in to Contribute
            </h2>
            <p className="text-sm text-gray-500 mb-4">
              Create an account or sign in to add a society.
            </p>
            <div className="space-y-3">
              <input
                type="email"
                value={authEmail}
                onChange={(e) => setAuthEmail(e.target.value)}
                placeholder="Email"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              />
              <input
                type="password"
                value={authPassword}
                onChange={(e) => setAuthPassword(e.target.value)}
                placeholder="Password (min 6 chars)"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              />
              {authError && (
                <p className="text-sm text-red-600">{authError}</p>
              )}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleSignIn}
                  disabled={authLoading}
                  className="flex-1 py-2 bg-gray-900 text-white rounded-md text-sm font-medium hover:bg-gray-700 disabled:opacity-50 transition"
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={handleSignUp}
                  disabled={authLoading}
                  className="flex-1 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition"
                >
                  Sign Up
                </button>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-md px-4 py-2 mb-6">
            ✓ Signed in as {user.email}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Society Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Society Name *
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="e.g. Raheja Residency"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              required
            />
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Address *
            </label>
            <input
              type="text"
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="e.g. Plot 14, Sector 3, New Link Road"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              required
            />
          </div>

          {/* Area + Pin Code */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Area *
              </label>
              <select
                name="area"
                value={form.area}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                required
              >
                <option value="">Select area</option>
                {MUMBAI_AREAS.map((area) => (
                  <option key={area} value={area}>
                    {area}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pin Code *
              </label>
              <input
                type="text"
                name="pin_code"
                value={form.pin_code}
                onChange={handleChange}
                placeholder="400053"
                pattern="[0-9]{6}"
                maxLength={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                required
              />
            </div>
          </div>

          {/* Coordinates */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location Coordinates *
            </label>
            <p className="text-xs text-gray-400 mb-2">
              Tip: Right-click on Google Maps → &quot;What&apos;s here?&quot; to
              get lat/lng
            </p>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                name="lat"
                value={form.lat}
                onChange={handleChange}
                placeholder="Latitude (e.g. 19.1136)"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                required
              />
              <input
                type="text"
                name="lng"
                value={form.lng}
                onChange={handleChange}
                placeholder="Longitude (e.g. 72.8697)"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                required
              />
            </div>
          </div>

          {/* Optional details */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional Details (optional)
            </label>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  Buildings
                </label>
                <input
                  type="number"
                  name="total_buildings"
                  value={form.total_buildings}
                  onChange={handleChange}
                  placeholder="e.g. 4"
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  Total Units
                </label>
                <input
                  type="number"
                  name="total_units"
                  value={form.total_units}
                  onChange={handleChange}
                  placeholder="e.g. 120"
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  Year Built
                </label>
                <input
                  type="number"
                  name="year_built"
                  value={form.year_built}
                  onChange={handleChange}
                  placeholder="e.g. 2005"
                  min="1900"
                  max="2026"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
              </div>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting || !user}
            className="w-full py-3 bg-gray-900 text-white font-medium rounded-md hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {submitting ? "Submitting..." : "Add Society"}
          </button>
        </form>
      </main>
    </div>
  );
}
