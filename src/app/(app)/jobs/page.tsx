import { TopBar } from "@/components/layout/TopBar";
import { getCustomers, getJobCards, getVehicles } from "@/lib/supabase/queries";
import { JobsBoard } from "@/components/jobs/JobsBoard";

export default async function JobsPage() {
  const [jobCards, customers, vehicles] = await Promise.all([
    getJobCards(),
    getCustomers(),
    getVehicles(),
  ]);

  return (
    <>
      <TopBar
        title="Job Cards"
        subtitle="Track every job from booking through to invoice"
      />
      <main className="flex-1 overflow-x-auto p-4 sm:p-6">
        <JobsBoard jobCards={jobCards} customers={customers} vehicles={vehicles} />
      </main>
    </>
  );
}
