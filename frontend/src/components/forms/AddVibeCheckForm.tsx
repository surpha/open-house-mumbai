"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

interface Props {
  societyId: string;
  onSuccess: () => void;
}

export default function AddVibeCheckForm({ societyId, onSuccess }: Props) {
  const [committeeVibe, setCommitteeVibe] = useState<number>(3);
  const [neighbourVibe, setNeighbourVibe] = useState<number>(3);
  const [noiseLevel, setNoiseLevel] = useState<number>(3);
  const [petFriendly, setPetFriendly] = useState<string>("");
  const [review, setReview] = useState("");
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
      setError("You must be signed in to submit a vibe check.");
      return;
    }

    setSubmitting(true);

    const { error: insertError } = await supabase.from("vibe_checks").insert({
      society_id: societyId,
      user_id: user.id,
      committee_vibe: committeeVibe,
      neighbour_vibe: neighbourVibe,
      noise_level: noiseLevel,
      pet_friendly: petFriendly === "" ? null : petFriendly === "yes",
      review: review.trim() || null,
    });

    setSubmitting(false);

    if (insertError) {
      setError(insertError.message);
      return;
    }

    onSuccess();
  }

  function ScoreSelector({
    label,
    value,
    onChange,
    lowLabel,
    highLabel,
  }: {
    label: string;
    value: number;
    onChange: (v: number) => void;
    lowLabel: string;
    highLabel: string;
  }) {
    return (
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
        <div className="flex items-center gap-3">
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <button
                key={i}
                type="button"
                onClick={() => onChange(i)}
                className={`w-8 h-8 rounded-full text-sm font-medium transition ${
                  i <= value
                    ? "bg-purple-500 text-white"
                    : "bg-gray-100 text-gray-400 hover:bg-gray-200"
                }`}
              >
                {i}
              </button>
            ))}
          </div>
        </div>
        <div className="flex justify-between text-xs text-gray-400 mt-1 w-44">
          <span>{lowLabel}</span>
          <span>{highLabel}</span>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <ScoreSelector
        label="Committee Vibe"
        value={committeeVibe}
        onChange={setCommitteeVibe}
        lowLabel="Hostile"
        highLabel="Welcoming"
      />

      <ScoreSelector
        label="Neighbour Vibe"
        value={neighbourVibe}
        onChange={setNeighbourVibe}
        lowLabel="Unfriendly"
        highLabel="Great"
      />

      <ScoreSelector
        label="Noise Level"
        value={noiseLevel}
        onChange={setNoiseLevel}
        lowLabel="Very noisy"
        highLabel="Very quiet"
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Pet-Friendly?
        </label>
        <div className="flex gap-3">
          {[
            { label: "Yes", value: "yes" },
            { label: "No", value: "no" },
            { label: "Not sure", value: "" },
          ].map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setPetFriendly(opt.value)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition ${
                petFriendly === opt.value
                  ? "bg-purple-100 text-purple-700 border border-purple-300"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Review (optional)
        </label>
        <textarea
          value={review}
          onChange={(e) => setReview(e.target.value)}
          placeholder="Share your experience living here..."
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="w-full py-2 bg-purple-600 text-white font-medium rounded-md hover:bg-purple-700 disabled:opacity-50 transition text-sm"
      >
        {submitting ? "Submitting..." : "Submit Vibe Check"}
      </button>
    </form>
  );
}
