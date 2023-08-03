"use client";

import { ExtendedTutor } from "@/types/prisma";
import { useQuery } from "react-query";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  MoreHorizontal,
  PlusCircle,
  SendHorizonal,
} from "lucide-react";
import { Message, useChat } from "ai/react";
import { Card } from "@/components/ui/card";
import { useSession } from "next-auth/react";
import TextareaAutosize from "react-textarea-autosize";
import { useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import { cn } from "@/lib/utils";

export default function TutorPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading: isChatLoading,
    append,
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

  useEffect(() => {
    if (messages.length) {
      messagesBottom.current?.scrollIntoView({
        behavior: "smooth",
      });
    }
  }, [messages.length, messages[messages.length - 1]?.content.length]);

  const messagesBottom = useRef<null | HTMLDivElement>(null);

  return (
    <div className="mx-auto max-w-4xl flex flex-1">

    </div>
  );
}
