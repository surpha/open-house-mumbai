import { BachelorRating } from "@/types/society";

interface Props {
  avgScore: string | null;
  ratings: BachelorRating[];
}

export default function BachelorSection({ avgScore, ratings }: Props) {
  return (
    <section className="bg-white rounded-lg border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        🎓 Bachelor-Friendly Index
      </h2>

      {avgScore ? (
        <div className="flex items-center gap-6 mb-4">
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-600">{avgScore}</div>
            <div className="text-sm text-gray-500">out of 10</div>
          </div>
          <div className="text-sm text-gray-600">
            Based on {ratings.length} rating{ratings.length !== 1 ? "s" : ""}
          </div>
        </div>
      ) : (
        <p className="text-gray-400 italic">No ratings yet. Be the first to rate!</p>
      )}

      {ratings.length > 0 && (
        <div className="space-y-3 mt-4 border-t pt-4">
          {ratings.slice(0, 5).map((rating) => (
            <div key={rating.id} className="flex items-start gap-3">
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-50 text-blue-700 font-semibold text-sm">
                {rating.score}
              </span>
              <div className="flex-1">
                {rating.notes && (
                  <p className="text-sm text-gray-700">{rating.notes}</p>
                )}
                <p className="text-xs text-gray-400 mt-1">
                  {rating.profiles?.display_name ?? "Anonymous"}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
