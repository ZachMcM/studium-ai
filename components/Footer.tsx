import { Copyright } from "lucide-react";
import { ThemeButton } from "./ThemeButton";

export function Footer() {
  return (
    <footer className="h-14 border-t flex items-center justify-between px-6 shadow-sm bg-background-card">
      <p className="text-xs text-muted-foreground font-medium flex items-center">Copyright <Copyright className="h-3 w-3 ml-0.5 mr-1"/> 2023 Study AI.</p>
      <ThemeButton/>
    </footer>
  )
}