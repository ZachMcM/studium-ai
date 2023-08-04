"use client";

import { ExtendedTutor } from "@/types/prisma";
import { useQuery } from "react-query";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Loader2, Settings } from "lucide-react";
import { useChat } from "ai/react";
import { useRef } from "react";
import { useTextareaAutosize } from "@/lib/hooks/text-area-autosize";
import { ChatList } from "@/components/tutors/ChatList";
import { ChatScrollAnchor } from "@/components/tutors/ChatScrollPanel";
import { ChatForm } from "@/components/tutors/ChatForm";
import { Skeleton } from "@/components/ui/skeleton";
import { Message } from "ai";
import { TutorSettings } from "@/components/tutors/TutorSettings";

export default function TutorPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    setMessages,
    isLoading: isChatLoading,
  } = useChat({
    api: `/api/tutors/${params.id}/chat`,
  });

  const { data: tutor, isLoading } = useQuery({
    queryKey: ["tutors", { id: params.id }],
    queryFn: async (): Promise<ExtendedTutor> => {
      const res = await fetch(`/api/tutors/${params.id}`);
      const data = await res.json();
      console.log(data);
      return data;
    },
    onSuccess: (data) => {
      const preExistingMessages: Message[] = data.messages.map((message) => ({
        id: message.id,
        role: message.role as "assistant" | "system" | "user" | "function",
        content: message.content,
      }));

      setMessages(preExistingMessages);
    },
    onError: (data) => {
      console.log(data);
      toast({
        title: "Uh oh, something went wrong!",
        description: <p>There was an error loading the AI tutor.</p>,
        variant: "destructive",
        action: (
          <ToastAction altText="Try again" onClick={() => router.refresh()}>
            Try again
          </ToastAction>
        ),
      });
    },
  });

  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);

  useTextareaAutosize(textAreaRef.current, input);

  return (
    <div className="flex flex-col flex-1">
      <div className="flex bg-background border-b shadow-sm w-full p-10">
        <div className="w-full gap-4 flex flex-col justify-between md:flex-row md:items-center">
          {isLoading ? (
            <div className="flex flex-col w-full space-y-2">
              <Skeleton className="h-4 w-3/5" />
              <Skeleton className="h-4 w-4/5" />
            </div>
          ) : (
            tutor && (
              <>
                <div className="flex flex-col">
                  <h3 className="font-bold text-2xl">{tutor?.title}</h3>
                  <p className="font-medium text-muted-foreground">
                    {tutor?.description}
                  </p>
                </div>
                <TutorSettings tutor={tutor} />
              </>
            )
          )}
        </div>
      </div>
      <div className="pb-[200px] px-4">
        {isChatLoading ? (
          <div className="py-10 flex w-full justify-center">
            <Loader2 className="h-10 w-10 animate-spin" />
          </div>
        ) : (
          <>
            <ChatList messages={messages} />
            <ChatScrollAnchor trackVisibility={isChatLoading} />
          </>
        )}
      </div>
      <ChatForm
        isLoading={isChatLoading}
        input={input}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
      />
    </div>
  );
}
