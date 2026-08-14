import { TopBar } from "@/components/layout/TopBar";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { bookings, getCustomer, getVehicle } from "@/lib/mock-data";
import { Plus } from "lucide-react";

const days = [
  { date: "2026-08-14", label: "Fri 14 Aug" },
  { date: "2026-08-15", label: "Sat 15 Aug" },
  { date: "2026-08-16", label: "Sun 16 Aug" },
  { date: "2026-08-17", label: "Mon 17 Aug" },
  { date: "2026-08-18", label: "Tue 18 Aug" },
];

const typeTone: Record<string, "blue" | "green" | "amber" | "purple"> = {
  service: "blue",
  mot: "purple",
  repair: "amber",
  diagnostic: "green",
};

export default function DiaryPage() {
  return (
    <>
      <TopBar
        title="Diary"
        subtitle="Weekly booking calendar across bays and technicians"
      />
      <main className="flex-1 space-y-4 overflow-y-auto p-6">
        <div className="flex justify-end">
          <button className="flex items-center gap-2 rounded-lg bg-neutral-900 px-3 py-2 text-sm font-medium text-white hover:bg-neutral-800">
            <Plus size={15} /> New booking
          </button>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 xl:grid-cols-5">
          {days.map((day) => {
            const dayBookings = bookings
              .filter((b) => b.date === day.date)
              .sort((a, b) => a.time.localeCompare(b.time));
            return (
              <Card key={day.date} className="flex flex-col">
                <div className="border-b border-neutral-100 px-4 py-3">
                  <p className="text-sm font-semibold text-neutral-900">
                    {day.label}
                  </p>
                  <p className="text-xs text-neutral-500">
                    {dayBookings.length} booking
                    {dayBookings.length === 1 ? "" : "s"}
                  </p>
                </div>
                <div className="flex-1 space-y-2 p-3">
                  {dayBookings.length === 0 ? (
                    <p className="px-2 py-4 text-center text-xs text-neutral-400">
                      No bookings
                    </p>
                  ) : (
                    dayBookings.map((b) => {
                      const customer = getCustomer(b.customerId);
                      const vehicle = getVehicle(b.vehicleId);
                      return (
                        <div
                          key={b.id}
                          className="rounded-lg border border-neutral-100 p-2.5"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-neutral-900">
                              {b.time}
                            </span>
                            <Badge tone={typeTone[b.type]} className="capitalize">
                              {b.type}
                            </Badge>
                          </div>
                          <p className="mt-1 text-sm font-medium text-neutral-900">
                            {customer?.name}
                          </p>
                          <p className="text-xs text-neutral-500">
                            {vehicle?.registration}
                          </p>
                          <p className="mt-1 text-xs text-neutral-400">
                            {b.bay} · {b.technician}
                          </p>
                        </div>
                      );
                    })
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      </main>
    </>
  );
}
