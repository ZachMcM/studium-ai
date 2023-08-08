"use client";

import { ExtendedTutor } from "@/types/prisma";
import { useQuery } from "react-query";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { useChat } from "ai/react";
import { ChatList } from "@/components/tutors/ChatList";
import { ChatForm } from "@/components/tutors/ChatForm";
import { Skeleton } from "@/components/ui/skeleton";
import { Message } from "ai";
import { TutorSettings } from "@/components/tutors/TutorSettings";
import { ChatScrollAnchor } from "@/components/tutors/ChatScrollAnchor";
import { useEffect, useRef } from "react";
import { Loader2 } from "lucide-react";

export default function TutorPage({ params }: { params: { id: string } }) {
  const ref = useRef<HTMLDivElement | null>(null);

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
      if (data.messages) {
        const preExistingMessages: Message[] = data.messages.map((message) => ({
          id: message.id,
          role: message.role as "assistant" | "system" | "user" | "function",
          content: message.content,
        }));

        setMessages(preExistingMessages);

        ref?.current?.scrollIntoView({
          behavior: "auto",
          block: "start",
        });
      }
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

  return (
    <main className="flex flex-col gap-10 py-10 md:py-16 flex-1 mx-auto max-w-2xl w-full px-4">
      {isLoading ? (
        <div className="w-full flex justify-center py-8">
          <Loader2 className="animate-spin text-muted-foreground" />
        </div>
      ) : (
        tutor && (
          <>
            <div className="w-full gap-4 flex flex-col bg-background justify-between md:flex-row md:items-center">
              <div className="flex flex-col">
                <h3 className="font-bold text-2xl">{tutor?.title}</h3>
                <p className="font-medium text-muted-foreground">
                  {tutor?.description}
                </p>
              </div>
              <TutorSettings tutor={tutor} />
            </div>
            <div className="pb-[150px] w-full">
              <ChatList messages={messages} />
              <ChatScrollAnchor trackVisibility={isChatLoading} />
              <div ref={ref} className="h-px w-full" />
            </div>
          </>
        )
      )}
      <ChatForm
        isLoading={isChatLoading}
        input={input}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
      />
    </main>
  );
}
