import Link from "next/link";
import { SocietySummary } from "@/types/society";

interface SocietyPopupProps {
  society: SocietySummary;
}

export default function SocietyPopup({ society }: SocietyPopupProps) {
  return (
    <div className="min-w-[200px] p-1">
      <h3 className="font-bold text-sm text-gray-900">{society.name}</h3>
      <p className="text-xs text-gray-500 mb-2">{society.area}</p>

      <div className="flex gap-3 text-xs mb-2">
        <div className="flex flex-col items-center">
          <span className="font-semibold text-blue-600">
            {society.bachelor_index > 0 ? society.bachelor_index : "–"}
          </span>
          <span className="text-gray-400">Bachelor</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="font-semibold text-green-600">
            {society.rent_report_count}
          </span>
          <span className="text-gray-400">Rents</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="font-semibold text-purple-600">
            {society.vibe_check_count}
          </span>
          <span className="text-gray-400">Vibes</span>
        </div>
      </div>

      {society.verified && (
        <span className="inline-block text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded mb-2">
          ✓ Verified
        </span>
      )}

      <Link
        href={`/society/${society.slug}`}
        className="block text-center text-xs text-white bg-gray-900 rounded px-2 py-1 hover:bg-gray-700 transition"
      >
        View Profile →
      </Link>
    </div>
  );
}
