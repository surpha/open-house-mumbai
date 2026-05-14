import { VibeCheck } from "@/types/society";

interface Props {
  vibeChecks: VibeCheck[];
}

function ScoreDots({ score, label }: { score: number | null; label: string }) {
  if (score === null) return null;
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-600 w-28">{label}</span>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className={`w-3 h-3 rounded-full ${
              i <= score ? "bg-purple-500" : "bg-gray-200"
            }`}
          />
        ))}
      </div>
      <span className="text-xs text-gray-400">{score}/5</span>
    </div>
  );
}

export default function VibeSection({ vibeChecks }: Props) {
  if (vibeChecks.length === 0) {
    return (
      <section className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          ✨ Vibe Check
        </h2>
        <p className="text-gray-400 italic">
          No vibe checks yet. Share your experience!
        </p>
      </section>
    );
  }

  // Compute averages
  const avg = (field: "committee_vibe" | "neighbour_vibe" | "noise_level") => {
    const valid = vibeChecks.filter((v) => v[field] !== null);
    if (valid.length === 0) return null;
    return Math.round(
      valid.reduce((s, v) => s + (v[field] as number), 0) / valid.length
    );
  };

  const petCount = vibeChecks.filter((v) => v.pet_friendly === true).length;
  const petTotal = vibeChecks.filter((v) => v.pet_friendly !== null).length;

  return (
    <section className="bg-white rounded-lg border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        ✨ Vibe Check
      </h2>

      <div className="space-y-2 mb-4">
        <ScoreDots score={avg("committee_vibe")} label="Committee" />
        <ScoreDots score={avg("neighbour_vibe")} label="Neighbours" />
        <ScoreDots score={avg("noise_level")} label="Noise Level" />
      </div>

      {petTotal > 0 && (
        <p className="text-sm text-gray-600 mb-4">
          🐾 Pet-friendly:{" "}
          <span className="font-medium">
            {petCount}/{petTotal} say yes
          </span>
        </p>
      )}

      <div className="border-t pt-4 space-y-4">
        <p className="text-xs text-gray-400 uppercase font-medium">
          Recent Reviews ({vibeChecks.length})
        </p>
        {vibeChecks.slice(0, 5).map((vibe) => (
          <div key={vibe.id} className="text-sm">
            {vibe.review && (
              <p className="text-gray-700 mb-1">&ldquo;{vibe.review}&rdquo;</p>
            )}
            <p className="text-xs text-gray-400">
              — {vibe.profiles?.display_name ?? "Anonymous"}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
