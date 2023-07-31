"use client";

import ErrorAlert from "@/components/alerts/ErrorAlert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ExtendedFlashcardSet } from "@/types/prisma";
import { BrainCircuit, SquareStack } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useMutation, useQuery } from "react-query";
import FlashcardCarousel from "./FlashcardCarousel";
import SetCard from "./SetCard";

export default function SetClient({
  id,
}: {
  id: string;
}) {
  const [title, setTitle] = useState<string>("");

  const router = useRouter();

  const { data: set, isLoading: isSetLoading } = useQuery({
    queryKey: ["sets", { id }],
    queryFn: async (): Promise<ExtendedFlashcardSet> => {
      const res = await fetch(`/api/flashcard-sets/${id}`);
      const data = await res.json();
      return data;
    },
    onSuccess: (data) => {
      setTitle(data.title);
    },
  });

  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      router.push("/signin");
    },
  });

  return (
    <div className="w-full mx-auto max-w-4xl flex-col space-y-6">
      {isSetLoading ? (
        <>
          <div className="space-y-1">
            <Skeleton className="h-7 w-3/5 mb-6" />
            <Skeleton className="h-7 w-4/5 mb-6" />
          </div>
          <Skeleton className="h-[300px] w-full" />
        </>
      ) : (
        set ? 
        <div className="space-y-32 md:space-y-16">
          <div className="space-y-4">
            <div className="space-y-1">
              <h1 className="font-bold text-3xl lg:text-4xl">Flashcards | {set.title}</h1>
              <p className="text-muted-foreground font-medium text-lg">{set.description}</p>
            </div>
            <FlashcardCarousel set={set}/>
          </div>
          <div className="space-y-2">
          <p className="font-semibold text-lg">Set Items</p>
          <div className="space-y-8">
            {set.flashcards.map(flashcard => (
              <SetCard key={flashcard.id} flashcard={flashcard}/>
            ))}
          </div>
          </div>
        </div> :
        <ErrorAlert/>
      )}
    </div>
  );
}
