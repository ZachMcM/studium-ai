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
import { useSession } from "next-auth/react";
import UserDropdown from "../UserDropdown";

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

  const [title, setTitle] = useState<string>("");
  const searchParams = useSearchParams();

  const {
    complete,
    completion: content,
    isLoading: completionLoading,
    setCompletion: setContent,
    stop,
  } = useCompletion({
    api: "/api/notes/generate",
    onFinish: removeNew,
  });

  const pathname = usePathname();
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      router.push("/sigin");
    },
  });

  const { mutate: deleteNotes, isLoading: isDeleting } = useMutation({
    mutationFn: async (): Promise<Notes> => {
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

  const { mutate: updateTitle } = useMutation({
    mutationFn: async (updatedTitle: string): Promise<Notes> => {
      const res = await fetch(`/api/notes/${notes?.id}`, {
        method: "PATCH",
        body: JSON.stringify({
          title: updatedTitle,
        }),
      });
      const data = await res.json();
      return data;
    },
    onSuccess: (data) => {
      console.log(data);
    },
  });

  const { mutate: updateContent } = useMutation({
    mutationFn: async (updatedContent: string): Promise<Notes> => {
      const res = await fetch(`/api/notes/${notes?.id}`, {
        method: "PATCH",
        body: JSON.stringify({
          content: updatedContent,
        }),
      });
      const data = await res.json();
      return data;
    },
    onSuccess: (data) => {
      console.log(data);
    },
  });

  // TODO
  function removeNew() {
    console.log(pathname);
    if (Boolean(searchParams.get("new"))) {
      router.replace(`/notes/${notes?.id}`);
    }
  }

  useEffect(() => {
    if (completionLoading && markdownEnd.current) {
      markdownEnd.current.scrollIntoView();
    }
    if (completionLoading && previewEnd.current) {
      previewEnd.current.scrollIntoView();
    }
  }, [content.length]);

  const contentRef = useRef<HTMLTextAreaElement | null>(null);

  const markdownEnd = useRef<HTMLDivElement | null>(null);
  const previewEnd = useRef<HTMLDivElement | null>(null);

  return (
    <Tabs defaultValue="preview">
      <div className="sticky top-0 left-0 h-16 border-b flex w-full items-center px-6 justify-between bg-background">
        <Link href="/dashboard/notes" className="flex space-x-2 items-center">
          <LogoIcon />
          <span className="font-semibold">Study AI</span>
        </Link>
        <div className="flex space-x-2 items-center">
          {session?.user.id == notes?.userId && (
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
            </div>
          )}
          <UserDropdown />
        </div>
      </div>
      <div className="p-6 md:py-16 mx-auto max-w-3xl">
        <TextareaAutosize
          value={title}
          onChange={(e) => {
            updateTitle(e.target.value);
            setTitle(e.target.value);
          }}
          className="font-extrabold text-4xl lg:text-5xl tracking-tight bg-transparent focus:outline-none resize-none w-full mb-6"
          placeholder="Notes Title"
          autoFocus
        />
        {notesLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-4 w-5/5" />
            <Skeleton className="h-4 w-4/5" />
            <Skeleton className="h-4 w-3/5" />
            <Skeleton className="h-4 w-4/5" />
          </div>
        ) : (
          <>
            <TabsContent value="preview">
              {completionLoading && content.length == 0 && (
                <Loader2 className="h-4 w-4 animate-spin" />
              )}
              <ReactMarkdown
                children={content}
                className="prose prose-zinc md:prose-lg dark:prose-invert"
              />
              <div ref={previewEnd}></div>
            </TabsContent>
            <TabsContent value="markdown">
              {completionLoading && content.length == 0 && (
                <Loader2 className="h-4 w-4 animate-spin" />
              )}
              <TextareaAutosize
                value={content}
                onChange={(e) => {
                  updateContent(e.target.value);
                  setContent(e.target.value);
                }}
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
          <Button
            onClick={() => {
              stop();
              removeNew();
            }}
            variant="secondary"
            size="icon"
          >
            <StopCircle className="h-5 w-5" />
          </Button>
        )}
      </div>
    </Tabs>
  );
}
