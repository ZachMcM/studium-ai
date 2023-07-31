import SetClient from "@/components/flashcards/SetClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Flashcard Set | Study AI"
}

export default function FlashcardSetPage({ params }: { params: { id: string }}) {
  return <SetClient id={params.id}/>
}