"use client";

import dynamic from "next/dynamic";

// Leaflet depends on `window` — must be loaded client-side only
const MapView = dynamic(() => import("@/components/MapView"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <p className="text-gray-500 text-lg">Loading map...</p>
    </div>
  ),
});

export default function Home() {
  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-3 bg-white border-b border-gray-200 shadow-sm z-10">
        <div>
          <h1 className="text-lg font-bold text-gray-900">
            🏠 Open House Mumbai
          </h1>
          <p className="text-xs text-gray-500">
            Open-sourcing Mumbai&apos;s housing info
          </p>
        </div>
        <nav className="flex gap-3 text-sm">
          <a
            href="/contribute"
            className="px-3 py-1.5 bg-gray-900 text-white rounded-md hover:bg-gray-700 transition"
          >
            + Add Society
          </a>
        </nav>
      </header>

      {/* Full-screen map */}
      <main className="flex-1 relative">
        <MapView />
      </main>
    </div>
  );
}
