import NotesList from "@/components/notes/NotesList"
import { getAuthSession } from "@/lib/auth"
import { Metadata } from "next"
import { redirect } from "next/navigation"

export const metadata: Metadata = {
  title: "Notes | Study AI",
  description: "Create and manage your AI generated notes"
}

export default async function NotesDashboard() {
  const session = await getAuthSession()
  if (!session) redirect("/signin")

  return (
    <div className="w-full flex flex-col">
      <h1 className="text-4xl font-bold">Notes</h1>
      <p className="text-muted-foreground font-medium">Create and manage your AI generated notes</p>
      <NotesList/>
    </div>  
  )
}