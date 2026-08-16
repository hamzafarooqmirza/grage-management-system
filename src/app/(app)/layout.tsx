import { redirect } from "next/navigation";
import { Sidebar } from "@/components/layout/Sidebar";
import { NavDrawerProvider } from "@/components/layout/NavDrawerContext";
import { MobileNavDrawer } from "@/components/layout/MobileNavDrawer";
import { UserProvider } from "@/components/layout/UserContext";
import { createClient } from "@/lib/supabase/server";

export default async function AppLayout({ children }: LayoutProps<"/">) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <UserProvider email={user.email ?? "Signed in"}>
      <NavDrawerProvider>
        <Sidebar />
        <MobileNavDrawer />
        <div className="flex min-w-0 flex-1 flex-col">{children}</div>
      </NavDrawerProvider>
    </UserProvider>
  );
}
