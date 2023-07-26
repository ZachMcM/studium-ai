import DashboardHeader from "@/components/DashboardHeader";
import DashboardSidebar from "@/components/DashboardSidebar";
import { ReactNode } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col h-screen">
      <DashboardHeader />
      <div className="flex flex-1">
        <DashboardSidebar />
        <div className="md:basis-5/6 w-full overflow-y-auto">
          <main className="px-12 py-6">{children}</main>
        </div>
      </div>
    </div>
  );
}
