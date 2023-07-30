import NotesClient from "@/components/notes/NotesClient";
import { getAuthSession } from "@/lib/auth";
import { Metadata, ResolvingMetadata } from "next";
import { redirect } from "next/navigation";

type Props = {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
};
export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  // read route params
  const id = params.id;

  // fetch data
  const res = await fetch(
    `${process.env.NEXTAUTH_URL}/api/notes/${id}?secret=${process.env.NEXTAUTH_SECRET}`
  );
  const notes = await res.json();

  // optionally access and extend (rather than replace) parent metadata

  return {
    title: `${notes.title} | Study AI`,
  };
}

export default async function NotesPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await getAuthSession();
  if (!session) redirect("/signin");

  return <NotesClient id={params.id} />;
}
