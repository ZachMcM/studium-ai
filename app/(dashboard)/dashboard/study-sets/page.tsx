import SetsList from "@/components/study-sets/SetsList"
import { getAuthSession } from "@/lib/auth"
import { Metadata } from "next"
import { redirect } from "next/navigation"

export const metadata: Metadata = {
  title: "Study Sets | Study AI",
  description: "Create and manage your AI generated notes"
}

export default async function StudySetsDashboard() {
  const session = await getAuthSession()
  if (!session) redirect("/signin")

  return (
    <div className="w-full flex flex-col">
      <h1 className="text-4xl font-bold">Study Sets</h1>
      <p className="text-muted-foreground font-medium">Create and manage your AI generated study sets.</p>
      <SetsList/>
    </div>  
  )
}