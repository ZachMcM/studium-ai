import { BookOpenCheck } from "lucide-react";
import UserDropdown from "./UserDropdown";

export default function DashboardHeader() {
  return (
    <header className="h-16 border-b sticky shrink-0 flex items-center justify-between px-6 md:px-10 top-0 left-0 bg-background">
      <div className="flex items-center mr-4">
        <BookOpenCheck className="mr-2"/>
        <span className="font-bold">Study AI</span>
      </div>
      <div className="flex space-x-4 items-center">
        <UserDropdown/>
      </div>
    </header>
  )
}