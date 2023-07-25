import { GraduationCap } from "lucide-react";
import UserDropdown from "./UserDropdown";
import { Button } from "./ui/button";

export default function DashboardHeader() {
  return (
    <header className="h-16 border-b sticky flex items-center justify-between px-6 md:px-10">
      <div className="flex items-center mr-4">
        <GraduationCap className="mr-2"/>
        <span className="font-bold">Study AI</span>
      </div>
      <div className="flex space-x-4 items-center">
        <Button variant="outline">Feedback</Button>
        <UserDropdown/>
      </div>
    </header>
  )
}