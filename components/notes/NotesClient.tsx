"use client";

import { Notes } from "@prisma/client";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { Skeleton } from "../ui/skeleton";
import { useState } from "react";
import { useCompletion } from "ai/react";
import { Button } from "../ui/button";

import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import UserDropdown from "../UserDropdown";
import NotesConfig from "./NotesConfig";
import NotesMore from "./NotesMore";
import { toast } from "../ui/use-toast";
import { Loader2 } from "lucide-react";
import NotesSiderbar from "./NotesSidebar";

export default function NotesClient({ id }: { id: string }) {

  const { data: notes, isLoading: notesLoading } = useQuery({
    queryKey: ["notes", { id: id }],
    queryFn: async (): Promise<Notes> => {
      const res = await fetch(`/api/notes/${id}`);
      const data = await res.json();
      return data;
    },
    onSuccess: (data) => {
      setTitle(data.title);
      setContent(data.content);
    },
  });

  const queryClient = useQueryClient();

  const { mutate: save, isLoading: isSaving } = useMutation({
    mutationFn: async (): Promise<Notes> => {
      const res = await fetch(`/api/notes/${notes?.id}`, {
        method: "PUT",
        body: JSON.stringify({
          content: content,
          title: title,
        }),
      });
      const data = await res.json();
      return data;
    },
    onError: (data) => {
      console.log(data)
      toast({
        title: "Error",
        description: "There was an error saving the notes. Please try again."
      })
    },
    onSuccess: (data) => {
      console.log(data);
      queryClient.invalidateQueries({
        queryKey: ["notes", { id: notes?.id }],
      });
      toast({
        title: "Notes successfully saved.",
      });
    },
  });

  const [title, setTitle] = useState<string>("");

  const {
    input,
    setInput,
    complete,
    completion: content,
    isLoading: completionLoading,
    setCompletion: setContent,
  } = useCompletion({
    api: "/api/ai/notes",
  });

  return (
    <Tabs defaultValue="preview">
      <div className="w-full h-16 border-b flex items-center px-6 md:px-10 justify-between">
        <div className="flex items-center">
          <div className="hidden md:block mr-4"><UserDropdown /></div>
          <span className="hidden md:block mr-4 text-3xl font-extralight text-muted">/</span>
          {notesLoading ? (
            <Skeleton className="h-4 w-[150px]" />
          ) : (
            <input
              className="focus:outline-none border-none bg-transparent placeholder:text-muted-foreground text-lg font-semibold"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          )}
        </div>
        <div className="flex space-x-2 items-center">
          <div className="hidden md:flex space-x-2 items-center">
            <NotesConfig notes={notes} />
            <TabsList>
              <TabsTrigger value="preview">Preview</TabsTrigger>
              <TabsTrigger value="markdown">Markdown</TabsTrigger>
            </TabsList>
            <NotesMore notes={notes} />
          </div>
          <NotesSiderbar/>
          <Button onClick={() => save()} variant="secondary">
            Save {isSaving && <Loader2 className="h-4 w-4 ml-2" />}
          </Button>
        </div>
      </div>
    </Tabs>
  );
}
