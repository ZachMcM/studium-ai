import { GraduationCap } from "lucide-react";
import HeaderLink from "../HeaderLink";
import SigninButton from "./SigninButton";
import { Suspense } from "react";
import { Skeleton } from "../ui/skeleton";

export default function Header() {
  return (
    <nav className="h-14 sticky shrink-0 flex items-center justify-between px-6 md:px-12 lg:px-24 top-0 left-0 shadow-sm bg-background-card">
      <div className="flex items-center space-x-10">
        <div className="flex items-center">
          <GraduationCap className="h-6 w-6 mr-2" />
          <h1 className="font-semibold font-cal">study ai</h1>
        </div>
        <div className="flex items-center space-x-6 font-medium text-sm">
          <HeaderLink href="/about">About</HeaderLink>
          <HeaderLink href="/pricing">Pricing</HeaderLink>
          <HeaderLink href="/features">Features</HeaderLink>
        </div>
      </div>
      <SigninButton />
    </nav>
  );
}
