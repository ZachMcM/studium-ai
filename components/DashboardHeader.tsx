import UserDropdown from "./UserDropdown";
import LogoIcon from "./LogoIcon";

export default function DashboardHeader() {
  return (
    <header className="h-16 border-b sticky shrink-0 flex items-center justify-between px-6 top-0 left-0 bg-background">
      <div className="flex space-x-2 items-center">
        <LogoIcon/>
        <span className="font-semibold">Study AI</span>
      </div>
      <UserDropdown/>
    </header>
  )
}