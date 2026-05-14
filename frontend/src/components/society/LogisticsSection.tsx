import { Logistics } from "@/types/society";

interface Props {
  logistics: Logistics | null;
}

function WaterDots({ level }: { level: number }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className={`w-3 h-3 rounded-full ${
            i <= level ? "bg-cyan-500" : "bg-gray-200"
          }`}
        />
      ))}
    </div>
  );
}

export default function LogisticsSection({ logistics }: Props) {
  if (!logistics) {
    return (
      <section className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          🚇 Logistics
        </h2>
        <p className="text-gray-400 italic">
          No logistics data yet. Help us fill this in!
        </p>
      </section>
    );
  }

  return (
    <section className="bg-white rounded-lg border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        🚇 Logistics
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
        {/* Metro */}
        {logistics.nearest_metro && (
          <div className="flex flex-col">
            <span className="text-gray-500">Nearest Metro</span>
            <span className="font-medium text-gray-900">
              {logistics.nearest_metro}
              {logistics.metro_distance_km && (
                <span className="text-gray-400 font-normal">
                  {" "}
                  ({logistics.metro_distance_km} km)
                </span>
              )}
            </span>
          </div>
        )}

        {/* Railway */}
        {logistics.nearest_railway && (
          <div className="flex flex-col">
            <span className="text-gray-500">Nearest Railway Station</span>
            <span className="font-medium text-gray-900">
              {logistics.nearest_railway}
              {logistics.railway_distance_km && (
                <span className="text-gray-400 font-normal">
                  {" "}
                  ({logistics.railway_distance_km} km)
                </span>
              )}
            </span>
          </div>
        )}

        {/* Water */}
        {logistics.water_reliability && (
          <div className="flex flex-col gap-1">
            <span className="text-gray-500">Water Reliability</span>
            <div className="flex items-center gap-2">
              <WaterDots level={logistics.water_reliability} />
              <span className="text-xs text-gray-400">
                {logistics.water_reliability}/5
              </span>
            </div>
          </div>
        )}

        {/* Power */}
        {logistics.power_backup !== null && (
          <div className="flex flex-col">
            <span className="text-gray-500">Power Backup</span>
            <span className="font-medium text-gray-900">
              {logistics.power_backup ? "✓ Available" : "✗ Not available"}
            </span>
          </div>
        )}
      </div>

      {/* Nearby Essentials */}
      {logistics.nearby_essentials && logistics.nearby_essentials.length > 0 && (
        <div className="mt-4 pt-4 border-t">
          <span className="text-sm text-gray-500 block mb-2">
            Nearby Essentials
          </span>
          <div className="flex flex-wrap gap-2">
            {logistics.nearby_essentials.map((item) => (
              <span
                key={item}
                className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
