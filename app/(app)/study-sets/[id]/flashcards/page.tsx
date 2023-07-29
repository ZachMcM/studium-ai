"use client";

import ErrorAlert from "@/components/ErrorAlert";
import FlashcardCarousel from "@/components/flashcards/FlashcardCarousel";
import { Button } from "@/components/ui/button";
import { ExtendedStudySet } from "@/types/prisma";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useQuery } from "react-query";

export default function SetFlashcards({ params }: { params: { id: string } }) {
  const { data: set, isLoading: isSetLoading } = useQuery({
    queryFn: async (): Promise<ExtendedStudySet> => {
      const res = await fetch(`/api/study-set/${params.id}`);
      const data = await res.json();
      return data;
    },
    queryKey: ["sets", { id: params.id }],
  });

  return (
    <div className="flex flex-col space-y-4">
      <Link
        href={`/study-sets/${params.id}`}
        className="flex items-center hover:opacity-7 duration-5000 font-medium text-sm"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
      </Link>
      <h3 className="font-bold text-3xl">Flashcards</h3>
      {isSetLoading ? (
        <div className="p-6 h-[200px] overflow-auto bg-secondary rounded-lg animate-pulse"/>
      ) : set ? (
        <FlashcardCarousel set={set} />
      ) : (
        <ErrorAlert />
      )}
    </div>
  );
}
