"use client";

import { useState } from "react";
import RateBachelorForm from "@/components/forms/RateBachelorForm";
import AddVibeCheckForm from "@/components/forms/AddVibeCheckForm";
import ReportRentForm from "@/components/forms/ReportRentForm";

interface Props {
  societyId: string;
  onContribution: () => void;
}

type Tab = "bachelor" | "vibe" | "rent";

const TABS: { key: Tab; label: string; color: string }[] = [
  { key: "bachelor", label: "🎓 Rate Bachelor-Friendliness", color: "blue" },
  { key: "vibe", label: "✨ Vibe Check", color: "purple" },
  { key: "rent", label: "💰 Report Rent", color: "green" },
];

export default function ContributePanel({ societyId, onContribution }: Props) {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("bachelor");
  const [success, setSuccess] = useState(false);

  function handleSuccess() {
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      setOpen(false);
      onContribution();
    }, 1500);
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="w-full py-3 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-700 transition"
      >
        + Update This Listing
      </button>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">
          Contribute Info
        </h2>
        <button
          onClick={() => setOpen(false)}
          className="text-sm text-gray-400 hover:text-gray-600"
        >
          ✕ Close
        </button>
      </div>

      {success ? (
        <div className="p-4 bg-green-50 border border-green-200 rounded-md text-sm text-green-700 text-center">
          ✓ Thanks! Your contribution has been saved.
        </div>
      ) : (
        <>
          {/* Tabs */}
          <div className="flex gap-1 mb-4 p-1 bg-gray-100 rounded-lg">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex-1 py-2 px-2 text-xs font-medium rounded-md transition ${
                  activeTab === tab.key
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Form */}
          {activeTab === "bachelor" && (
            <RateBachelorForm societyId={societyId} onSuccess={handleSuccess} />
          )}
          {activeTab === "vibe" && (
            <AddVibeCheckForm societyId={societyId} onSuccess={handleSuccess} />
          )}
          {activeTab === "rent" && (
            <ReportRentForm societyId={societyId} onSuccess={handleSuccess} />
          )}
        </>
      )}
    </div>
  );
}
