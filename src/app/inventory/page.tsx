import { TopBar } from "@/components/layout/TopBar";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { parts } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/format";
import { Plus } from "lucide-react";

export default function InventoryPage() {
  const lowStockCount = parts.filter((p) => p.stockLevel <= p.reorderLevel).length;

  return (
    <>
      <TopBar
        title="Parts & Inventory"
        subtitle={`${parts.length} parts tracked · ${lowStockCount} need reordering`}
      />
      <main className="flex-1 space-y-4 overflow-y-auto p-6">
        <div className="flex justify-end">
          <button className="flex items-center gap-2 rounded-lg bg-neutral-900 px-3 py-2 text-sm font-medium text-white hover:bg-neutral-800">
            <Plus size={15} /> New part
          </button>
        </div>
        <Card>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-100 text-left text-xs text-neutral-500">
                <th className="px-5 py-3 font-medium">Part</th>
                <th className="px-5 py-3 font-medium">SKU</th>
                <th className="px-5 py-3 font-medium">Supplier</th>
                <th className="px-5 py-3 font-medium">Stock</th>
                <th className="px-5 py-3 font-medium">Cost / Sell</th>
                <th className="px-5 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {parts.map((p) => {
                const isLow = p.stockLevel <= p.reorderLevel;
                return (
                  <tr
                    key={p.id}
                    className="border-b border-neutral-50 last:border-0"
                  >
                    <td className="px-5 py-3">
                      <p className="font-medium text-neutral-900">{p.name}</p>
                      <p className="text-xs text-neutral-500">{p.category}</p>
                    </td>
                    <td className="px-5 py-3 text-neutral-500">{p.sku}</td>
                    <td className="px-5 py-3 text-neutral-500">
                      {p.supplier}
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={
                          isLow
                            ? "font-semibold text-red-600"
                            : "text-neutral-700"
                        }
                      >
                        {p.stockLevel}
                      </span>
                      <span className="text-neutral-400">
                        {" "}
                        / reorder at {p.reorderLevel}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-neutral-500">
                      {formatCurrency(p.costPrice)} /{" "}
                      {formatCurrency(p.sellPrice)}
                    </td>
                    <td className="px-5 py-3">
                      {isLow ? (
                        <Badge tone="red">Reorder now</Badge>
                      ) : (
                        <Badge tone="green">In stock</Badge>
                      )}
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
