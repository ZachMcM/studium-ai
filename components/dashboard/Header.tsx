import { UserDropdown } from "./UserDropdown";
import Link from "next/link";
import { GraduationCap } from "lucide-react";
import { ThemeButton } from "../ThemeButton";
import { Button } from "../ui/button";
import { FaDiscord } from "react-icons/fa6";
import { HeaderLink } from "../HeaderLink";
import { Sidebar } from "./Sidebar";

export function Header() {
  return (
    <header className="h-14 border-b z-50 sticky shrink-0 flex items-center justify-between px-6 md:px-10 top-0 left-0 shadow-sm bg-background">
      <Sidebar />
      <div className="hidden md:flex items-center space-x-10">
        <Link href="/dashboard" className="flex items-center">
          <GraduationCap className="h-6 w-6 mr-2.5" />
          <h1 className="font-semibold">studium ai</h1>
        </Link>
        <div className="flex items-center space-x-6 text-sm font-medium">
          <HeaderLink href="/dashboard">Dashboard</HeaderLink>
          <HeaderLink href="/flashcard-sets">Flashcards</HeaderLink>
          <HeaderLink href="/tutors">AI Tutors</HeaderLink>
          <HeaderLink href="/quizzes">Quizzes</HeaderLink>
        </div>
      </div>

      <div className="flex items-center">
        <ThemeButton />
        <a href="https://discord.gg/rCGEZwWUPt" className="mr-3">
          <Button variant="ghost" size="icon">
            <FaDiscord className="h-5 w-5" />
          </Button>
        </a>
        <UserDropdown />
      </div>
    </header>
  );
}
