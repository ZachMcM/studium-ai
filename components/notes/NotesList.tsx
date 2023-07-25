"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { Input } from "../ui/input";
import { useState } from "react";
import { Button } from "../ui/button";
import { AlertCircle, ExternalLink, Link2, Loader2, MoreVertical, Trash2 } from "lucide-react";
import { Notes } from "@prisma/client";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import Link from "next/link";
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogCancel, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { useToast } from "../ui/use-toast";
import NotesCreator from "./NotesCreator";

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

  const queryClient = useQueryClient();
  const { toast } = useToast()

  const { mutate: deleteNotes } = useMutation({
    mutationFn: async (id: string): Promise<Notes> => {
      const res = await fetch(`/api/notes/${id}`, {
        method: "DELETE"
      })
      const data = await res.json()
      return data
    },
    onSuccess: (data) => {
      console.log(data)
      queryClient.invalidateQueries({ queryKey: ['notes'] })
      toast({
        title: "Successfully deleted the notes."
      })
    }
  })

  const [search, setSearch] = useState("");

  return (
    <>
      <div className="flex items-center space-x-2 mt-4">
        <Input
          onChange={(e) => setSearch(e.target.value)}
          value={search}
          placeholder="Search notes..."
        />
        <NotesCreator/>
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
              {notesList.map((notes) => (
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
                        <Button variant="outline" size="icon"><MoreVertical className="h-4 w-4"/></Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <Link href={`/notes/${notes.id}`}>
                          <DropdownMenuItem>
                            <ExternalLink className="h-4 w-4 mr-2"/>Open
                          </DropdownMenuItem>
                        </Link>
                        {/* TODO */}
                        <DropdownMenuItem>
                          <Link2 className="h-4 w-4 mr-2"/>Share
                        </DropdownMenuItem>
                        <AlertDialogTrigger asChild>
                          <DropdownMenuItem className="!text-destructive">
                            <Trash2 className="h-4 w-4 mr-2"/>Delete
                          </DropdownMenuItem>
                        </AlertDialogTrigger>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete these notes.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => {
                          deleteNotes(notes.id)
                        }}>Continue</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              ))}
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
