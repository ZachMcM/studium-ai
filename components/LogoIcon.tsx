import { cn } from "@/lib/utils";
import { GraduationCap } from "lucide-react";

export default function LogoIcon({ className }: { className?: string }) {
  return (
    <div className={cn("bg-accent h-8 w-8 p-1.5 flex items-center justify-center rounded-full", className)}>
      <GraduationCap/>
    </div>
  )
}