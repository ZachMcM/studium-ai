import Link from "next/link";
import { Button } from "./ui/button";
import { ReactNode } from "react";
import NavAuth from "./NavAuth";
import { GraduationCap } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="h-16 bg-background sticky flex items-center justify-between px-6 md:px-10">
      <div className="flex items-center">
        <div className="flex items-center mr-4">
          <GraduationCap className="mr-2"/>
          <span className="font-bold">Study AI</span>
        </div>
        <div className="flex">
          <Link href="/pricing">
            <Button variant="ghost">Pricing</Button>
          </Link>
          <Link href="/about">
            <Button variant="ghost">About</Button>
          </Link>
          <Link href="/about">
            <Button variant="ghost">How to Use</Button>
          </Link>
        </div>
      </div>
      <NavAuth/>
    </nav>
  );
}
