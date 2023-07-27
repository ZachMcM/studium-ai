import DashboardHeader from "@/components/DashboardHeader";
import DashboardSidebar from "@/components/DashboardSidebar";
import { ReactNode } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col h-screen">
      <DashboardHeader />
      <div className="flex flex-1">
        <DashboardSidebar />
        <div className="md:basis-4/5 lg:basis-5/6 w-full overflow-y-auto">
          <main className="p-6 lg:px-12">{children}</main>
        </div>
      </div>
    </div>
  );
}
