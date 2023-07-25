import Navbar from "@/components/Navbar";
import { ReactNode } from "react";

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col">
      <Navbar/>
      {children}
    </div>
  )
}