import NotesClient from "@/components/notes/NotesClient";
import { Metadata, ResolvingMetadata } from "next";

type Props = {
  params: { id: string }
  searchParams: { [key: string]: string | string[] | undefined }
}
export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  // read route params
  const id = params.id
 
  // fetch data
  const res = await fetch(`${process.env.NEXTAUTH_URL}/api/notes/${id}`)
  const notes = await res.json()
 
  // optionally access and extend (rather than replace) parent metadata
 
  return {
    title: notes.title,
  }
}

export default function NotesPage({ params }: { params: { id: string } }) {
  return (
    <NotesClient id={params.id}/>
  )
}