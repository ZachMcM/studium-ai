import { GraduationCap } from "lucide-react";
import { SigninButton } from "./SigninButton";
import { Button } from "../ui/button";
import { siteConfig } from "@/config/site";
import { GitHubLogoIcon } from "@radix-ui/react-icons";

export function Header() {
  return (
    <nav className="h-20 z-50 sticky shrink-0 flex items-center justify-between px-6 md:px-12 lg:px-24 top-0 left-0 bg-background">
      <div className="flex items-center">
        <GraduationCap className="h-6 w-6 mr-2" />
        <h1 className="font-semibold">{siteConfig.name}</h1>
      </div>
      <div className="flex items-center gap-2">
        <a href="https://discord.gg/rCGEZwWUPt">
          <Button
            variant="ghost"
            className="hover:opacity-70 duration-500 hover:bg-inherit"
          >
            Discord
          </Button>
        </a>
        <a href="https://github.com/ZachMcM/studium-ai">
          <Button
            variant="ghost"
            className="hover:opacity-70 duration-500 hover:bg-inherit"
          >
            Github
          </Button>
        </a>
        <SigninButton />
      </div>
    </nav>
  );
}
