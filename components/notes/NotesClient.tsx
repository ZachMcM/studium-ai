'use client'

import { Notes } from "@prisma/client";
import { AlertCircle, Loader2 } from "lucide-react";
import { useQuery } from "react-query";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import NotesEditor from "./NotesEditor";

export default function NotesClient({ id }: { id: string }) {
  const { data: notes, isLoading: notesLoading } = useQuery({
    queryKey: ["notes", { id: id }],
    queryFn: async (): Promise<Notes> => {
      const res = await fetch(`/api/notes/${id}`);
      const data = await res.json();
      return data;
    },
  });

  return (
    <main>
      {notesLoading ? (
        <div className="h-screen p-10 flex justify-center items-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : notes ? (
        <NotesEditor notes={notes}/>
      ) : (
        <div className="h-screen flex justify-center items-center p-10">
          <Alert variant="destructive" className="max-w-xl">
            <AlertCircle />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              There was an error loading the notes. Please try again.
            </AlertDescription>
          </Alert>
        </div>
      )}
    </main>
  );
}
