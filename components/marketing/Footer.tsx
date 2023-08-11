import { Copyright } from "lucide-react";
import { ThemeButton } from "../ThemeButton";
import { Button } from "../ui/button";

export function Footer() {
  return (
    <footer className="h-14 border-t mt-32 flex items-center justify-between px-6 shadow-sm bg-background-card">
      <p className="text-xs text-muted-foreground font-medium flex items-center">Copyright <Copyright className="h-3 w-3 ml-0.5 mr-1"/> 2023 Study AI.</p>
      <div className="flex items-center">
      <a href="https://discord.gg/rCGEZwWUPt">
          <Button variant="ghost" size="sm" className="hover:opacity-70 duration-500 hover:bg-inherit">Discord</Button>
        </a>
        <ThemeButton/>
      </div>
    </footer>
  )
}