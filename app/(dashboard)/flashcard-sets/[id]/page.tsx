"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { ExtendedFlashcardSet } from "@/types/prisma";
import { useQuery } from "react-query";
import { FlashcardCarousel } from "@/components/flashcards/FlashcardCarousel";
import { SetCard } from "@/components/flashcards/SetCard";
import { useRouter } from "next/navigation";
import { CopyPlus, Share } from "lucide-react";
import { Button } from "@/components/ui/button";
import { share } from "@/lib/share";
import { toast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { useAbsoluteUrl } from "@/lib/absolute-url";
import { NewFlashcard } from "@/components/flashcards/NewFlashcard";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { SetSettings } from "@/components/flashcards/SetSettings";
import { Card } from "@/components/ui/card";

export default function FlashcardSetPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();

  const { data: set, isLoading: isSetLoading } = useQuery({
    queryKey: ["sets", { id: params.id }],
    queryFn: async (): Promise<ExtendedFlashcardSet> => {
      const res = await fetch(`/api/flashcard-sets/${params.id}`);
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
      });
    },
  });

  const shareData = {
    title: "Check out these flashcards on Study AI!",
    text: `${set?.title}: ${set?.description}`,
    url: useAbsoluteUrl(),
  };

  return (
    <div className="flex-1 w-full">
      <div className="flex bg-background border-b shadow-sm w-full p-10">
        <div className="w-full gap-4 flex flex-col justify-between md:flex-row md:items-center">
          {isSetLoading ? (
            <div className="flex flex-col w-full space-y-2">
              <Skeleton className="h-4 w-3/5" />
              <Skeleton className="h-4 w-4/5" />
            </div>
          ) : (
            set && (
              <>
                <div className="flex flex-col">
                  <h3 className="font-bold text-2xl">{set?.title}</h3>
                  <p className="font-medium text-muted-foreground">
                    {set?.description}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <SetSettings set={set} />
                  <Button
                    onClick={() => share(shareData)}
                    variant="outline"
                    size="sm"
                  >
                    <Share className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                </div>
              </>
            )
          )}
        </div>
      </div>
      <div className="flex flex-col space-y-6 mx-auto max-w-4xl px-4 py-10 md:py-16">
        {isSetLoading ? (
          <Card className="h-[450px] w-full flex flex-col space-y-2 justify-center items-center">
            <Skeleton className="h-4 w-2/5"/>
            <Skeleton className="h-4 w-3/5"/>
            <Skeleton className="h-4 w-4/5"/>
          </Card>
        ) : set && (
          <div className="space-y-32 md:space-y-16">
            <FlashcardCarousel set={set} />
            <div className="space-y-4">
              <div className="flex gap-2 items-center justify-between">
                <p className="font-semibold text-lg">Set Items</p>
                <Dialog>
                  <DialogTrigger>
                    <Button size="sm">
                      New Flashcard <CopyPlus className="h-4 w-4 ml-2" />
                    </Button>
                  </DialogTrigger>
                  <NewFlashcard set={set} />
                </Dialog>
              </div>
              <div className="space-y-8">
                {set.flashcards.map((flashcard) => (
                  <SetCard set={set} key={flashcard.id} flashcard={flashcard} />
                ))}
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="w-full">
                      Add a new flashcard to the set{" "}
                      <CopyPlus className="h-4 w-4 ml-2" />
                    </Button>
                  </DialogTrigger>
                  <NewFlashcard set={set} />
                </Dialog>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
