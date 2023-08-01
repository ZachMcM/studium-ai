"use client";

import ErrorAlert from "@/components/alerts/ErrorAlert";
import { Skeleton } from "@/components/ui/skeleton";
import { ExtendedFlashcardSet } from "@/types/prisma";
import { useQuery } from "react-query";
import FlashcardCarousel from "./FlashcardCarousel";
import SetCard from "./SetCard";
import SetEdit from "./SetEdit";
import { useRouter } from "next/navigation";
import { Share } from "lucide-react";
import { Button } from "../ui/button";
import { share } from "@/lib/share";
import { toast } from "../ui/use-toast";
import { ToastAction } from "../ui/toast";
import { useAbsoluteUrl } from "@/lib/absolute-url";

export default function SetClient({ id }: { id: string }) {
  const router = useRouter()

  const { data: set, isLoading: isSetLoading } = useQuery({
    queryKey: ["sets", { id }],
    queryFn: async (): Promise<ExtendedFlashcardSet> => {
      const res = await fetch(`/api/flashcard-sets/${id}`);
      const data = await res.json();
      return data;
    },
    onError: () => {
      toast({
        title: "Uh oh, something went wrong!",
        description: <p>There was an error loading the flashcard set.</p>,
        variant: "destructive",
        action: (
          <ToastAction altText="Try again" onClick={() => router.refresh()}>
            Try again
          </ToastAction>
        ),
      })
    }
  });

  const shareData = {
    title: "Check out these flashcards on Study AI!",
    text: `${set?.title}: ${set?.description}`,
    url: useAbsoluteUrl(),
  };

  return (
    <div className="w-full mx-auto max-w-4xl flex-col space-y-6">
      {isSetLoading ? (
        <>
          <div className="space-y-1">
            <Skeleton className="h-7 w-3/5 mb-6" />
            <Skeleton className="h-7 w-4/5 mb-6" />
          </div>
          <Skeleton className="h-[450px] w-full" />
        </>
      ) : set ? (
        <div className="space-y-32 md:space-y-16">
          <div className="space-y-8">
            <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row-reverse md:items-center md:justify-between">
              <div className="flex items-center space-x-2 md:ml-4">
                <Button onClick={() => share(shareData)} variant="outline" size="sm">
                  <Share className="h-4 w-4 mr-2" />Share
                </Button>
                <SetEdit set={set} />
              </div>
              <div className="space-y-1">
                <h1 className="font-bold text-3xl lg:text-4xl">{set.title}</h1>
                <p className="text-muted-foreground font-medium text-lg">
                  {set.description}
                </p>
              </div>
            </div>
            <FlashcardCarousel set={set} />
          </div>
          <div className="space-y-2">
            <p className="font-semibold text-lg">Set Items</p>
            <div className="space-y-8">
              {set.flashcards.map((flashcard) => (
                <SetCard key={flashcard.id} flashcard={flashcard} />
              ))}
            </div>
          </div>
        </div>
      ) : (
        <ErrorAlert />
      )}
    </div>
  );
}
