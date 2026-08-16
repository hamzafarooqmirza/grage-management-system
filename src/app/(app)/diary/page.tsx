import { TopBar } from "@/components/layout/TopBar";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { getBookings, getCustomers, getVehicles } from "@/lib/supabase/queries";
import { BookJobButton } from "@/components/forms/BookJobModal";
import { JOB_TYPE_LABELS, JOB_TYPE_TONE } from "@/lib/job-types";

function upcomingDays(count: number) {
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const monthNames = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];
  const days: { date: string; label: string }[] = [];
  const start = new Date();
  for (let i = 0; i < count; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    const iso = d.toISOString().slice(0, 10);
    days.push({
      date: iso,
      label: `${dayNames[d.getDay()]} ${d.getDate()} ${monthNames[d.getMonth()]}`,
    });
  }
  return days;
}

export default async function DiaryPage() {
  const [bookings, customers, vehicles] = await Promise.all([
    getBookings(),
    getCustomers(),
    getVehicles(),
  ]);

  const customerById = new Map(customers.map((c) => [c.id, c]));
  const vehicleById = new Map(vehicles.map((v) => [v.id, v]));
  const days = upcomingDays(5);

  return (
    <>
      <TopBar
        title="Diary"
        subtitle="Upcoming booking calendar across bays and technicians"
      />
      <main className="flex-1 space-y-4 overflow-y-auto p-4 sm:p-6">
        <div className="flex justify-end">
          <BookJobButton customers={customers} />
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 xl:grid-cols-5">
          {days.map((day) => {
            const dayBookings = bookings
              .filter((b) => b.date === day.date)
              .sort((a, b) => (a.time ?? "").localeCompare(b.time ?? ""));
            return (
              <Card key={day.date} className="flex flex-col">
                <div className="border-b border-slate-100 px-4 py-3">
                  <p className="text-sm font-semibold text-slate-900">
                    {day.label}
                  </p>
                  <p className="text-xs text-slate-500">
                    {dayBookings.length} booking
                    {dayBookings.length === 1 ? "" : "s"}
                  </p>
                </div>
                <div className="flex-1 space-y-2 p-3">
                  {dayBookings.length === 0 ? (
                    <p className="px-2 py-4 text-center text-xs text-slate-400">
                      No bookings
                    </p>
                  ) : (
                    dayBookings.map((b) => {
                      const customer = customerById.get(b.customerId);
                      const vehicle = b.vehicleId
                        ? vehicleById.get(b.vehicleId)
                        : undefined;
                      return (
                        <div
                          key={b.id}
                          className="rounded-lg border border-slate-100 p-2.5"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-slate-900">
                              {b.time ?? "—"}
                            </span>
                            <Badge tone={JOB_TYPE_TONE[b.jobType]}>
                              {JOB_TYPE_LABELS[b.jobType]}
                            </Badge>
                          </div>
                          <p className="mt-1 text-sm font-medium text-slate-900">
                            {customer?.name}
                          </p>
                          <p className="text-xs text-slate-500">
                            {vehicle?.registration ?? "—"}
                          </p>
                          <p className="mt-1 text-xs text-slate-400">
                            {[b.bay, b.technician].filter(Boolean).join(" · ") || "Unassigned"}
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
