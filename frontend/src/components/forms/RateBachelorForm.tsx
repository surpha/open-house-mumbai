"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

interface Props {
  societyId: string;
  onSuccess: () => void;
}

export default function RateBachelorForm({ societyId, onSuccess }: Props) {
  const [score, setScore] = useState<number>(5);
  const [notes, setNotes] = useState("");
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
      setError("You must be signed in to rate.");
      return;
    }

    setSubmitting(true);

    const { error: insertError } = await supabase
      .from("bachelor_ratings")
      .upsert(
        {
          society_id: societyId,
          user_id: user.id,
          score,
          notes: notes.trim() || null,
        },
        { onConflict: "society_id,user_id" }
      );

    setSubmitting(false);

    if (insertError) {
      setError(insertError.message);
      return;
    }

    onSuccess();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          How bachelor-friendly is this society? *
        </label>
        <div className="flex items-center gap-2">
          <input
            type="range"
            min={1}
            max={10}
            value={score}
            onChange={(e) => setScore(parseInt(e.target.value))}
            className="flex-1"
          />
          <span className="w-8 text-center text-lg font-bold text-blue-600">
            {score}
          </span>
          <span className="text-sm text-gray-400">/10</span>
        </div>
        <div className="flex justify-between text-xs text-gray-400 mt-1 px-1">
          <span>Not at all</span>
          <span>Very friendly</span>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Notes (optional)
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="e.g. Families-only building, strict after 10pm..."
          rows={2}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
        />
      </div>

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="w-full py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 disabled:opacity-50 transition text-sm"
      >
        {submitting ? "Submitting..." : "Submit Rating"}
      </button>
    </form>
  );
}
