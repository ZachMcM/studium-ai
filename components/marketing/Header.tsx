import { GraduationCap } from "lucide-react";
import { HeaderLink } from "../HeaderLink";
import { SigninButton } from "./SigninButton";

export function Header() {
  return (
    <nav className="h-20 sticky shrink-0 flex items-center justify-between px-6 md:px-12 lg:px-24 top-0 left-0 shadow-sm bg-background">
      <div className="flex items-center space-x-10">
        <div className="flex items-center">
          <GraduationCap className="h-6 w-6 mr-2" />
          <h1 className="font-semibold">study ai</h1>
        </div>
        <div className="flex items-center space-x-6 font-medium text-sm">
        </div>
      </div>
      <SigninButton />
    </nav>
  );
}
