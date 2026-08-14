import Link from "next/link";
import { TopBar } from "@/components/layout/TopBar";
import { Card } from "@/components/ui/Card";
import { customers, getVehiclesForCustomer } from "@/lib/mock-data";
import { formatDate } from "@/lib/format";
import { AddCustomerButton } from "@/components/forms/AddCustomerModal";

export default function CustomersPage() {
  return (
    <>
      <TopBar
        title="Customers"
        subtitle={`${customers.length} customers on record`}
      />
      <main className="flex-1 space-y-4 overflow-y-auto p-6">
        <div className="flex justify-end">
          <AddCustomerButton />
        </div>
        <Card>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-left text-xs text-slate-500">
                <th className="px-5 py-3 font-medium">Name</th>
                <th className="px-5 py-3 font-medium">Contact</th>
                <th className="px-5 py-3 font-medium">Vehicles</th>
                <th className="px-5 py-3 font-medium">Customer since</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((c) => {
                const vehicleCount = getVehiclesForCustomer(c.id).length;
                return (
                  <tr
                    key={c.id}
                    className="border-b border-slate-50 last:border-0 hover:bg-slate-50"
                  >
                    <td className="px-5 py-3">
                      <Link
                        href={`/customers/${c.id}`}
                        className="font-medium text-slate-900 hover:underline"
                      >
                        {c.name}
                      </Link>
                    </td>
                    <td className="px-5 py-3 text-slate-500">
                      <div>{c.email}</div>
                      <div>{c.phone}</div>
                    </td>
                    <td className="px-5 py-3 text-slate-700">
                      {vehicleCount} vehicle{vehicleCount === 1 ? "" : "s"}
                    </td>
                    <td className="px-5 py-3 text-slate-500">
                      {formatDate(c.createdAt)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Card>
      </main>
    </>
  );
}
