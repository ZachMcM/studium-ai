"use client";

import { usePathname, useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { Input } from "../ui/input";
import { useState } from "react";
import { Notes } from "@prisma/client";
import SearchAlert from "../SearchAlert";
import ErrorAlert from "../ErrorAlert";
import EmptyAlert from "../EmptyAlert";
import NewNotes from "./NewNotes";
import ItemsLoading from "../ItemsLoading";
import ItemCard from "../ItemCard";

export default function NotesList() {
  const { data: notesList, isLoading: notesLoading } = useQuery({
    queryKey: ["notes"],
    queryFn: async (): Promise<Notes[]> => {
      const res = await fetch("/api/notes");
      const data = await res.json();
      return data;
    },
  });

  const router = useRouter();
  const queryClient = useQueryClient();
  const pathname = usePathname()

  const { mutate: deleteNotes, isLoading: isDeleting } = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/notes/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      return data;
    },
    onSuccess: (data) => {
      console.log(data);
      if (pathname != "/dashboard/notes") {
        router.push("/dashboard/notes");
      }
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });

  const [search, setSearch] = useState("");

  return (
    <>
      <div className="flex items-center space-x-2 mt-4">
        <Input
          onChange={(e) => setSearch(e.target.value)}
          value={search}
          placeholder="Search notes..."
        />
        <NewNotes/>
      </div>
      <div className="mt-6">
        {notesLoading ? (
          <ItemsLoading/>
        ) : notesList ? (
          notesList.length == 0 ? (
            <EmptyAlert/>
          ) : (
            <div className="flex flex-col border rounded-lg">
              {notesList.filter((notes) =>
                notes.title.toLowerCase().includes(search.toLowerCase())
              ).length !== 0 ? (
                notesList
                  .filter((notes) =>
                    notes.title.toLowerCase().includes(search.toLowerCase())
                  )
                  .map((notes) => (
                    <ItemCard
                      title={notes.title}
                      deleteFunction={() => deleteNotes(notes.id)}
                      isDeleting={isDeleting}
                      link={`/notes/${notes.id}`}
                      createdAt={(new Date(notes.createdAt)).toLocaleDateString()}
                      itemType="Notes"
                    />
                  ))
              ) : (
                <SearchAlert/>
              )}
            </div>
          )
        ) : (
          <ErrorAlert/>
        )}
      </div>
    </>
  );
}
