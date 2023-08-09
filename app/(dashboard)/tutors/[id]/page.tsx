"use client";

import { useQuery } from "react-query";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { useChat } from "ai/react";
import { ChatList } from "@/components/tutors/ChatList";
import { ChatForm } from "@/components/tutors/ChatForm";
import { TutorSettings } from "@/components/tutors/TutorSettings";
import { ChatScrollAnchor } from "@/components/tutors/ChatScrollAnchor";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { Tutor } from "@prisma/client";

export default function TutorPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const {
    messages,
    input,
    handleInputChange,
    setMessages,
    append,
    setInput,
    isLoading: isChatLoading,
  } = useChat({
    api: `/api/tutors/${params.id}/chat`,
  });

  const { data: tutor, isLoading } = useQuery({
    queryKey: ["tutors", { id: params.id }],
    queryFn: async (): Promise<Tutor> => {
      const res = await fetch(`/api/tutors/${params.id}`);
      const data = await res.json();
      console.log(data);
      return data;
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

  async function introduce() {
    await append({
      role: "system",
      content:
        "Introduce yourself to the user and ask how you can help them with the topic.",
    });
  }
  useEffect(() => {
    introduce()
  }, [])

  return (
    <div className="flex flex-col flex-1 max-w-4xl mx-auto w-full pt-10 md:pt-16 px-4 gap-10">
      {isLoading ? (
        <div className="flex w-full justify-center">
          <Loader2 className="text-muted-foreground animate-spin" />
        </div>
      ) : (
        tutor && (
          <>
            <div className="w-full gap-4 flex justify-between items-center ">
              <div className="flex flex-col w-full">
                <h3 className="font-bold text-2xl">{tutor?.title}</h3>
                <p className="font-medium text-muted-foreground">
                  {tutor?.description}
                </p>
              </div>
              <TutorSettings tutor={tutor} />
            </div>
            <div className="pb-[200px]">
              <ChatList messages={messages} />
              <ChatScrollAnchor
                trackVisibility={isChatLoading}
                messages={messages}
              />
            </div>
          </>
        )
      )}
      <ChatForm
        isLoading={isChatLoading}
        input={input}
        handleInputChange={handleInputChange}
        append={append}
        setInput={setInput}
      />
    </div>
  );
}
