import SetsList from "@/components/flashcards/SetsList"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Flashcards | Study AI",
  description: "Create and manage your AI generated notes"
}

export default function FlashcardSets() {
  return (
    <div className="w-full flex flex-col">
      <h1 className="text-4xl font-bold">Flashcards</h1>
      <p className="text-muted-foreground font-medium">Create and manage your AI generated flashcard sets.</p>
      <SetsList/>
    </div>  
  )
}