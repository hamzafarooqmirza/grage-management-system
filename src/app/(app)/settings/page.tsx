import { TopBar } from "@/components/layout/TopBar";
import { getGarageSettings } from "@/lib/supabase/queries";
import { SettingsForm } from "@/components/forms/SettingsForm";

export default async function SettingsPage() {
  const settings = await getGarageSettings();

  return (
    <>
      <TopBar title="Settings" subtitle="Garage profile and invoicing defaults" />
      <main className="flex-1 space-y-4 overflow-y-auto p-4 sm:p-6">
        <div className="mx-auto max-w-2xl">
          <SettingsForm settings={settings} />
        </div>
      </main>
    </>
  );
}
