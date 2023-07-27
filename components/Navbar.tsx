import Link, { LinkProps } from "next/link";
import { ReactNode } from "react";
import NavAuth from "./NavAuth";
import LogoIcon from "./LogoIcon";

export default function Navbar() {
  return (
    <nav className="h-16 bg-background sticky flex items-center justify-between px-6">
      <div className="flex items-center">
        <div className="flex space-x-4 items-center mr-10">
          <LogoIcon/>
          <span className="font-bold">Study AI</span>
        </div>
        <div className="flex items-center space-x-8">
          <NavLink href="/about">About</NavLink>
          <NavLink href="/pricing">Pricing</NavLink>
          <NavLink href="/features">Features</NavLink>
        </div>
      </div>
      <NavAuth/>
    </nav>
  );
}

function NavLink({ children, href }: { href: string, children: ReactNode }) {
  return <Link href={href} className="font-medium transition-colors hover:text-foreground/80 sm:text-sm text-foreground/60">{children}</Link>
}
