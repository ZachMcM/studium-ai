import { BookOpenCheck } from "lucide-react";
import UserDropdown from "./UserDropdown";
import LogoIcon from "./LogoIcon";

export default function DashboardHeader() {
  return (
    <header className="h-16 border-b sticky shrink-0 flex items-center justify-between px-6 top-0 left-0 bg-background">
      <div className="flex space-x-4 items-center">
        <LogoIcon/>
        <span className="font-bold">Study AI</span>
      </div>
      <div className="flex space-x-4 items-center">
        <UserDropdown/>
      </div>
    </header>
  )
}