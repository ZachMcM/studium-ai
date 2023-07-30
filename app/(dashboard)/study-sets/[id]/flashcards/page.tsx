"use client";

import ErrorAlert from "@/components/ErrorAlert";
import FlashcardCarousel from "@/components/flashcards/FlashcardCarousel";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
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
      {isSetLoading ? 
      <Skeleton className="h-4 w-3/5"/> : 
      <h3 className="font-bold text-3xl">Flashcards | {set?.title}</h3>
      }
      {isSetLoading ? (
        <Card className="h-[200px]">
          <CardHeader>
            <Skeleton className="h-4 w-3/5"/>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Skeleton className="h-3 w-4/5"/>
              <Skeleton className="h-3 w-3/5"/>
              <Skeleton className="h-3 w-2/5"/>
              <Skeleton className="h-3 w-5/5"/>
            </div>
          </CardContent>
        </Card>
      ) : set ? (
        <FlashcardCarousel set={set} />
      ) : (
        <ErrorAlert />
      )}
    </div>
  );
}
