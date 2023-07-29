"use client";

import { useSession } from "next-auth/react";
import { redirect, usePathname, useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { Input } from "../ui/input";
import { useState } from "react";
import { Button } from "../ui/button";
import {
  Edit,
  Forward,
  Loader2,
  MoreVertical,
  Trash2,
} from "lucide-react";
import { Notes } from "@prisma/client";
import Link from "next/link";
import {
  AlertDialog,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import SearchAlert from "../SearchAlert";
import ErrorAlert from "../ErrorAlert";
import EmptyAlert from "../EmptyAlert";
import NewNotes from "./NewNotes";
import DeleteDialog from "../DeleteDialog";

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
          <Loader2 className="h-4 w-4 animate-spin" />
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
                    <div className="flex items-center justify-between border-b last:border-none px-6 py-4">
                      <div className="space-y-1">
                        <Link
                          href={`/notes/${notes.id}`}
                          className="text-lg hover:underline font-semibold"
                        >
                          {notes.title || "Untitled Notes"}
                        </Link>
                        <p className="text-muted-foreground font-medium text-sm">
                          {new Date(notes.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <AlertDialog>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <Link href={`/notes/${notes.id}`}>
                              <DropdownMenuItem>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                            </Link>
                            {/* TODO */}
                            <DropdownMenuItem>
                              <Forward className="h-4 w-4 mr-2" />
                              Share
                            </DropdownMenuItem>
                            <AlertDialogTrigger asChild>
                              <DropdownMenuItem className="!text-destructive">
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </AlertDialogTrigger>
                          </DropdownMenuContent>
                        </DropdownMenu>
                        {notes && <DeleteDialog deleteFunction={() => deleteNotes(notes.id)} isDeleting={isDeleting}/>}
                      </AlertDialog>
                    </div>
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
