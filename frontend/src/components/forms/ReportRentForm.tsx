"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { FlatType } from "@/types/society";

interface Props {
  societyId: string;
  onSuccess: () => void;
}

const FLAT_TYPES: FlatType[] = ["1RK", "1BHK", "2BHK", "3BHK", "4BHK", "5BHK+"];

export default function ReportRentForm({ societyId, onSuccess }: Props) {
  const [flatType, setFlatType] = useState<FlatType>("1BHK");
  const [rent, setRent] = useState("");
  const [deposit, setDeposit] = useState("");
  const [maintenance, setMaintenance] = useState("");
  const [furnished, setFurnished] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!supabase) {
      setError("Database not configured.");
      return;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setError("You must be signed in to report rent.");
      return;
    }

    const rentAmount = parseInt(rent);
    if (!rent || isNaN(rentAmount) || rentAmount <= 0) {
      setError("Please enter a valid monthly rent.");
      return;
    }

    setSubmitting(true);

    const { error: insertError } = await supabase.from("rent_reports").insert({
      society_id: societyId,
      user_id: user.id,
      flat_type: flatType,
      rent_monthly: rentAmount,
      deposit: deposit ? parseInt(deposit) : null,
      maintenance_monthly: maintenance ? parseInt(maintenance) : null,
      furnished,
    });

    setSubmitting(false);

    if (insertError) {
      setError(insertError.message);
      return;
    }

    onSuccess();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Flat Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Flat Type *
        </label>
        <div className="flex flex-wrap gap-2">
          {FLAT_TYPES.map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setFlatType(type)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition ${
                flatType === type
                  ? "bg-green-100 text-green-700 border border-green-300"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Rent */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Monthly Rent (₹) *
        </label>
        <input
          type="number"
          value={rent}
          onChange={(e) => setRent(e.target.value)}
          placeholder="e.g. 25000"
          min="1000"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm"
          required
        />
      </div>

      {/* Deposit + Maintenance */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Deposit (₹)
          </label>
          <input
            type="number"
            value={deposit}
            onChange={(e) => setDeposit(e.target.value)}
            placeholder="e.g. 100000"
            min="0"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Maintenance (₹/mo)
          </label>
          <input
            type="number"
            value={maintenance}
            onChange={(e) => setMaintenance(e.target.value)}
            placeholder="e.g. 3500"
            min="0"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm"
          />
        </div>
      </div>

      {/* Furnished */}
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="furnished"
          checked={furnished}
          onChange={(e) => setFurnished(e.target.checked)}
          className="w-4 h-4 text-green-600 rounded border-gray-300 focus:ring-green-500"
        />
        <label htmlFor="furnished" className="text-sm text-gray-700">
          Furnished / Semi-furnished
        </label>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="w-full py-2 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 disabled:opacity-50 transition text-sm"
      >
        {submitting ? "Submitting..." : "Report Rent"}
      </button>
    </form>
  );
}
