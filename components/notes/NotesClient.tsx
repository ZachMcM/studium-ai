"use client";

import { Notes } from "@prisma/client";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { Skeleton } from "../ui/skeleton";
import { useEffect, useRef, useState } from "react";
import { useCompletion } from "ai/react";
import { Button } from "../ui/button";
import ReactMarkdown from "react-markdown";
import TextareaAutosize from "react-textarea-autosize";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import NotesConfig from "./NotesConfig";
import NotesMore from "./NotesMore";
import { toast } from "../ui/use-toast";
import { Loader2, StopCircle } from "lucide-react";
import NotesSiderbar from "./NotesSidebar";
import Link from "next/link";
import LogoIcon from "../LogoIcon";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

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
      console.log(data);
      toast({
        title: "Error",
        description: "There was an error saving the notes. Please try again.",
      });
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
  const searchParams = useSearchParams();

  const {
    complete,
    completion: content,
    isLoading: completionLoading,
    setCompletion: setContent,
    stop,
  } = useCompletion({
    api: "/api/ai/notes",
    onFinish: removeNew,
  });

  const pathname = usePathname();
  const router = useRouter();
  const queryClient = useQueryClient();

  const { mutate: deleteNotes, isLoading: isDeleting } = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/notes/${notes?.id}`, {
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

  // TODO
  function removeNew() {
    console.log(pathname)
    if (Boolean(searchParams.get("new"))) {
      router.replace(`/notes/${notes?.id}`)
    }
  }

  useEffect(() => {
    if (markdownEnd.current) {
      markdownEnd.current.scrollIntoView();
    }
    if (previewEnd.current) {
      previewEnd.current.scrollIntoView();
    }
  }, [content.length]);

  const contentRef = useRef<HTMLTextAreaElement | null>(null);

  const markdownEnd = useRef<HTMLDivElement | null>(null);
  const previewEnd = useRef<HTMLDivElement | null>(null);

  return (
    <Tabs defaultValue="preview">
      <div className="w-full sticky top-0 left-0 h-16 border-b flex items-center px-6 justify-between bg-background">
        <div className="flex items-center space-x-3 shrink-0">
          <Link href="/dashboard/notes">
            <LogoIcon />
          </Link>
          <span className="hidden md:block text-4xl font-extralight text-muted">
            /
          </span>
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
            <NotesConfig complete={complete} />
            <TabsList>
              <TabsTrigger value="preview">Preview</TabsTrigger>
              <TabsTrigger
                onClick={() => contentRef.current?.focus()}
                value="markdown"
              >
                Markdown
              </TabsTrigger>
            </TabsList>
            <NotesMore
              deleteFunction={() => deleteNotes()}
              isDeleting={isDeleting}
            />
          </div>
          <NotesSiderbar
            isDeleting={isDeleting}
            deleteFunction={() => deleteNotes()}
            complete={complete}
          />
          <Button onClick={() => save()} variant="secondary">
            Save {isSaving && <Loader2 className="h-4 w-4 animate-spin ml-2" />}
          </Button>
        </div>
      </div>
      <div className="p-6 md:py-16 mx-auto max-w-3xl">
        {notesLoading ? (
          <div className="space-y-4 px-6">
            <Skeleton className="h-4 w-[400px]" />
            <Skeleton className="h-4 w-[300px]" />
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[400px]" />
          </div>
        ) : (
          <>
            <TabsContent value="preview">
              {completionLoading && content.length == 0 && (
                <Loader2 className="h-4 w-4 animate-spin" />
              )}
              <ReactMarkdown
                children={content}
                className="prose prose-zincmd:prose-lg dark:prose-invert"
              />
              <div ref={previewEnd}></div>
            </TabsContent>
            <TabsContent value="markdown">
              {completionLoading && content.length == 0 && (
                <Loader2 className="h-4 w-4 animate-spin" />
              )}
              <TextareaAutosize
                value={content}
                onChange={(e) => setContent(e.target.value)}
                ref={contentRef}
                autoFocus
                placeholder="Write your notes in markdown here or generate them by configuring your notes..."
                className="placeholder:text-muted-foreground w-full resize-none bg-transparent focus:outline-none"
              />
              <div ref={markdownEnd}></div>
            </TabsContent>
          </>
        )}
      </div>
      <div className="fixed bottom-0 right-0 m-6">
        {completionLoading && (
          <Button onClick={() => {
            stop()
            removeNew()
          }} variant="secondary" size="icon">
            <StopCircle className="h-5 w-5" />
          </Button>
        )}
      </div>
    </Tabs>
  );
}
