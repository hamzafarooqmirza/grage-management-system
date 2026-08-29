import Link from "next/link";
import { TopBar } from "@/components/layout/TopBar";
import { Card } from "@/components/ui/Card";
import { DeleteButton } from "@/components/ui/DeleteButton";
import { getCustomers, getVehicles } from "@/lib/supabase/queries";
import { deleteCustomer } from "@/lib/supabase/mutations";
import { formatDate } from "@/lib/format";
import { AddCustomerButton } from "@/components/forms/AddCustomerModal";

export default async function CustomersPage() {
  const [customers, vehicles] = await Promise.all([
    getCustomers(),
    getVehicles(),
  ]);

  const vehicleCountByCustomer = new Map<string, number>();
  for (const v of vehicles) {
    vehicleCountByCustomer.set(
      v.customerId,
      (vehicleCountByCustomer.get(v.customerId) ?? 0) + 1
    );
  }

  return (
    <>
      <TopBar
        title="Customers"
        subtitle={`${customers.length} customers on record`}
      />
      <main className="flex-1 space-y-4 overflow-y-auto p-4 sm:p-6">
        <div className="flex justify-end">
          <AddCustomerButton />
        </div>
        <Card>
          <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-left text-xs text-slate-500">
                <th className="px-5 py-3 font-medium">Name</th>
                <th className="px-5 py-3 font-medium">Contact</th>
                <th className="px-5 py-3 font-medium">Vehicles</th>
                <th className="px-5 py-3 font-medium">Customer since</th>
                <th className="px-5 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((c) => {
                const vehicleCount = vehicleCountByCustomer.get(c.id) ?? 0;
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
                    <td className="px-5 py-3 text-right">
                      <DeleteButton
                        id={c.id}
                        action={deleteCustomer}
                        label={`Delete ${c.name}`}
                        confirmMessage={`Delete ${c.name}? This cannot be undone.`}
                      />
                    </td>
                  </tr>
                );
              })}
              {customers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-6 text-center text-sm text-slate-400">
                    No customers yet. Click &ldquo;New customer&rdquo; to add one.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
          </div>
        </Card>
      </main>
    </>
  );
}
