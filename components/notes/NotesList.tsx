"use client";

import { useSession } from "next-auth/react";
import { redirect, useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { Input } from "../ui/input";
import { useState } from "react";
import { Button } from "../ui/button";
import {
  AlertCircle,
  Edit,
  Forward,
  Loader2,
  MoreVertical,
  Plus,
  Trash2,
} from "lucide-react";
import { Notes } from "@prisma/client";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
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
import DeleteNotes from "./DeleteNotes";

export default function NotesList() {
  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/");
    },
  });

  const { data: notesList, isLoading: notesLoading } = useQuery({
    queryKey: ["notes"],
    queryFn: async (): Promise<Notes[]> => {
      const res = await fetch("/api/notes");
      const data = await res.json();
      return data;
    },
  });

  const router = useRouter();

  const { mutate: createNotes, isLoading: creatingNotes } = useMutation({
    mutationFn: async (): Promise<Notes> => {
      const res = await fetch("/api/notes", {
        method: "POST",
      });
      const data = await res.json();
      return data;
    },
    onSuccess: (data) => {
      console.log(data);
      router.push(`/notes/${data.id}`);
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
        <Button className="shrink-0" onClick={() => createNotes()}>
          Add New...{" "}
          {creatingNotes ? (
            <Loader2 className="h-4 w-4 ml-2 animate-spin" />
          ) : (
            <Plus className="h-4 w-4" />
          )}
        </Button>
      </div>
      <div className="mt-6">
        {notesLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : notesList ? (
          notesList.length == 0 ? (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Oops</AlertTitle>
              <AlertDescription>
                There are no notes. Try adding some.
              </AlertDescription>
            </Alert>
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
                          {notes.title}
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
                        {notes && <DeleteNotes id={notes.id}/>}
                      </AlertDialog>
                    </div>
                  ))
              ) : (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Oops</AlertTitle>
                  <AlertDescription>
                    No notes match your search.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )
        ) : (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              There was an error loading the notes, please try again.
            </AlertDescription>
          </Alert>
        )}
      </div>
    </>
  );
}
