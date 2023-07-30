"use client";

import { cn } from "@/lib/utils";
import { Book, FileText, LayoutDashboard, MessagesSquare } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

export default function DashboardSidebar() {
  return (
    <aside className="hidden md:flex flex-col p-6 basis-1/5 lg:basis-1/6 border-r">
      <div className="flex flex-col space-y-2">
        <DashboardButton link="">
          <LayoutDashboard className="h-4 w-4 mr-2" />
          Dashboard
        </DashboardButton>
        <DashboardButton link="/notes">
          <FileText className="h-4 w-4 mr-2" />
          Notes
        </DashboardButton>
        <DashboardButton link="/study-sets">
          <Book className="h-4 w-4 mr-2" />
          Study Sets
        </DashboardButton>
        <DashboardButton link="/chatbots">
          <MessagesSquare className="h-4 w-4 mr-2" />
          Chatbots
        </DashboardButton>
      </div>
    </aside>
  );
}

function DashboardButton({
  link,
  children,
}: {
  link: string;
  children: ReactNode;
}) {
  const pathname = usePathname();

  return (
    <Link
      href={`/dashboard/${link}`}
      className={cn(
        "px-3 py-2 flex items-center font-medium text-sm w-full hover:bg-accent transition-colors rounded-md hover:text-accent-foreground",
        pathname == `/dashboard${link}` && "bg-accent"
      )}
    >
      {children}
    </Link>
  );
}
