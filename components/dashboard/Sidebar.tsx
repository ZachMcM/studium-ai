"use client"

import { GraduationCap, PanelLeftOpen } from "lucide-react"
import { Sheet, SheetContent, SheetHeader, SheetTrigger } from "../ui/sheet"
import Link from "next/link"
import HeaderLink from "../HeaderLink"

export default function Sidebar() {
  return (
    <Sheet>
      <SheetTrigger asChild className="cursor-pointer md:hidden">
        <PanelLeftOpen className="h-5 w-5"/>
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader>
        <Link href="/dashboard" className="flex items-center">
          <GraduationCap className="h-4 w-4 mr-2" />
          <h1 className="font-semibold">
            study ai
          </h1>
        </Link>
        </SheetHeader>
        <div className="flex flex-col mt-6 space-y-3 font-medium">
          <HeaderLink href="/flashcards">Flashcards</HeaderLink>
          <HeaderLink href="/chatbots">Chatbots</HeaderLink>
          <HeaderLink href="/quizes">Quizes</HeaderLink>
        </div>
      </SheetContent>
    </Sheet>
  )
}