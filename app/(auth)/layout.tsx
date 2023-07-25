import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="h-screen flex justify-center items-center">
    <div className="m-4 md:m-6 absolute top-0 left-0">
      <Link href="/">
        <Button variant="ghost">
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      </Link>
    </div>
    {children}
  </div>
  )
}