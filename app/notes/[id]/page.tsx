import NotesClient from "@/components/notes/NotesClient";

export default function NotesPage({ params }: { params: { id: string }}) {
  return <NotesClient id={params.id}/>
}