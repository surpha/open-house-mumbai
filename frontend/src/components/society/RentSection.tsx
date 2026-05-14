import { RentReport } from "@/types/society";

interface Props {
  rentReports: RentReport[];
}

function formatINR(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function RentSection({ rentReports }: Props) {
  if (rentReports.length === 0) {
    return (
      <section className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          💰 Rent Transparency
        </h2>
        <p className="text-gray-400 italic">
          No rent data yet. Contribute what you paid!
        </p>
      </section>
    );
  }

  return (
    <section className="bg-white rounded-lg border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        💰 Rent Transparency
      </h2>
      <p className="text-sm text-gray-500 mb-4">
        {rentReports.length} report{rentReports.length !== 1 ? "s" : ""} from
        the community
      </p>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-gray-500">
              <th className="pb-2 font-medium">Type</th>
              <th className="pb-2 font-medium">Rent/mo</th>
              <th className="pb-2 font-medium">Deposit</th>
              <th className="pb-2 font-medium">Maintenance</th>
              <th className="pb-2 font-medium">Furnished</th>
              <th className="pb-2 font-medium">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {rentReports.map((report) => (
              <tr key={report.id} className="text-gray-700">
                <td className="py-2 font-medium">{report.flat_type}</td>
                <td className="py-2">{formatINR(report.rent_monthly)}</td>
                <td className="py-2">
                  {report.deposit ? formatINR(report.deposit) : "—"}
                </td>
                <td className="py-2">
                  {report.maintenance_monthly
                    ? formatINR(report.maintenance_monthly)
                    : "—"}
                </td>
                <td className="py-2">{report.furnished ? "Yes" : "No"}</td>
                <td className="py-2 text-gray-400">{report.reported_at}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
