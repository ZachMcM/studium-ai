"use client";

import { ExtendedTutor } from "@/types/prisma";
import { useQuery } from "react-query";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { SendHorizonal } from "lucide-react";
import { useChat } from "ai/react";
import { Card } from "@/components/ui/card";
import { useSession } from "next-auth/react";
import TextareaAutosize from "react-textarea-autosize";

export default function TutorPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading: isChatLoading,
  } = useChat({
    api: `/api/tutors/${params.id}/chat`,
  });
  const { data: session } = useSession();

  const { data: tutor, isLoading } = useQuery({
    queryKey: ["tutors", { id: params.id }],
    queryFn: async (): Promise<ExtendedTutor> => {
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

  return (
    <main className="flex flex-col justify-between space-y-10 flex-1">
      {/* <div className="flex items-center space-x-4 border-b pb-4">
        <Avatar className="h-14 w-14">
          <AvatarImage src={tutor?.image!} />
          <AvatarFallback className="bg-secondary" />
        </Avatar>
        {isLoading ? (
          <div className="space-y-2 w-full">
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-4 w-1/3" />
          </div>
        ) : (
          <div>
            <h3 className="font-semibold text-2xl font-cal">{tutor?.title}</h3>
            <p className="font-medium text-muted-foreground">
              {tutor?.description}
            </p>
          </div>
        )}
      </div> */}
      <div className="space-y-4">
        {messages.map((message) => (
          <div className="mx-auto max-w-2xl flex items-start space-x-4 p-4 border rounded-lg">
            {message.role == "user" && (
              <Avatar className="h-8 w-8">
                <AvatarImage src={session?.user.image!} />
                <AvatarFallback className="bg-secondary" />
              </Avatar>
            )}
            {message.role == "assistant" && (
              <Avatar className="h-8 w-8">
                <AvatarImage src={tutor?.image || "/tutor-fallback.png"} />
              </Avatar>
            )}
            <p className="font-medium">{message.content}</p>
          </div>
        ))}
      </div>
      <div className="mx-auto sm:max-w-2xl sm:px-4">
        <form onSubmit={handleSubmit}>
          <div className="flex items-start space-x-4 border rounded-lg p-4 lg:min-w-[600px] z-50">
            <TextareaAutosize
              value={input}
              onChange={handleInputChange}
              className="w-full overflow-hidden bg-transparent resize-none focus:outline-none placeholder:text-muted-foreground font-medium"
              placeholder="Type a message"
            />
            <Button size="icon" type="submit">
              <SendHorizonal className="h-4 w-4" />
            </Button>
          </div>
        </form>
      </div>
    </main>
  );
}
