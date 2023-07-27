"use client";

import { cn } from "@/lib/utils";
import { Database, Dumbbell, FileText, StickyNote } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

export default function DashboardSidebar() {
  return (
    <aside className="hidden md:flex flex-col p-6 basis-1/5 lg:basis-1/6">
      <div className="flex flex-col space-y-2">
        <DashboardButton link="notes">
          <FileText className="h-4 w-4 mr-2" />
          Notes
        </DashboardButton>
        <DashboardButton link="flashcards">
          <StickyNote className="h-4 w-4 mr-2" />
          Flashcards
        </DashboardButton>
        <DashboardButton link="quizes">
          <Dumbbell className="h-4 w-4 mr-2" />
          Quizes
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
        pathname == `/dashboard/${link}` && "bg-accent"
      )}
    >
      {children}
    </Link>
  );
}
