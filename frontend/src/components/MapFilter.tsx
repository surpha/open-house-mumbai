"use client";

import { useState } from "react";

interface Props {
  areas: string[];
  onFilterChange: (filters: FilterState) => void;
}

export interface FilterState {
  search: string;
  area: string;
  minBachelorScore: number;
  verifiedOnly: boolean;
}

export default function MapFilter({ areas, onFilterChange }: Props) {
  const [search, setSearch] = useState("");
  const [area, setArea] = useState("");
  const [minBachelorScore, setMinBachelorScore] = useState(0);
  const [verifiedOnly, setVerifiedOnly] = useState(false);

  function update(partial: Partial<FilterState>) {
    const next = {
      search: partial.search ?? search,
      area: partial.area ?? area,
      minBachelorScore: partial.minBachelorScore ?? minBachelorScore,
      verifiedOnly: partial.verifiedOnly ?? verifiedOnly,
    };
    if (partial.search !== undefined) setSearch(partial.search);
    if (partial.area !== undefined) setArea(partial.area);
    if (partial.minBachelorScore !== undefined) setMinBachelorScore(partial.minBachelorScore);
    if (partial.verifiedOnly !== undefined) setVerifiedOnly(partial.verifiedOnly);
    onFilterChange(next);
  }

  function reset() {
    setSearch("");
    setArea("");
    setMinBachelorScore(0);
    setVerifiedOnly(false);
    onFilterChange({ search: "", area: "", minBachelorScore: 0, verifiedOnly: false });
  }

  return (
    <div className="absolute top-4 left-4 z-[1000] bg-white rounded-lg shadow-lg border border-gray-200 p-4 w-72">
      {/* Search */}
      <input
        type="text"
        value={search}
        onChange={(e) => update({ search: e.target.value })}
        placeholder="Search society name..."
        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm mb-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />

      {/* Area filter */}
      <select
        value={area}
        onChange={(e) => update({ area: e.target.value })}
        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm mb-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        <option value="">All Areas</option>
        {areas.map((a) => (
          <option key={a} value={a}>
            {a}
          </option>
        ))}
      </select>

      {/* Bachelor score */}
      <div className="mb-3">
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>Min Bachelor Score</span>
          <span className="font-medium text-blue-600">
            {minBachelorScore > 0 ? `${minBachelorScore}+` : "Any"}
          </span>
        </div>
        <input
          type="range"
          min={0}
          max={10}
          value={minBachelorScore}
          onChange={(e) => update({ minBachelorScore: parseInt(e.target.value) })}
          className="w-full"
        />
      </div>

      {/* Verified only */}
      <div className="flex items-center gap-2 mb-3">
        <input
          type="checkbox"
          id="verified-filter"
          checked={verifiedOnly}
          onChange={(e) => update({ verifiedOnly: e.target.checked })}
          className="w-4 h-4 text-blue-600 rounded border-gray-300"
        />
        <label htmlFor="verified-filter" className="text-sm text-gray-700">
          Verified only
        </label>
      </div>

      {/* Reset */}
      <button
        onClick={reset}
        className="w-full py-1.5 text-xs text-gray-500 hover:text-gray-700 border border-gray-200 rounded-md hover:bg-gray-50 transition"
      >
        Reset Filters
      </button>
    </div>
  );
}
