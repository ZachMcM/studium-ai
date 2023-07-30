"use client";

import ErrorAlert from "@/components/ErrorAlert";
import NewItem from "@/components/study-sets/NewItem";
import SetItemCard from "@/components/study-sets/SetItemCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ExtendedStudySet } from "@/types/prisma";
import { BrainCircuit, SquareStack } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useMutation, useQuery } from "react-query";
import TextareaAutosize from "react-textarea-autosize";

export default function StudySetPage({ params }: { params: { id: string } }) {
  const [title, setTitle] = useState<string>("");

  const router = useRouter();

  const { data: set, isLoading: isSetLoading } = useQuery({
    queryKey: ["sets", { id: params.id }],
    queryFn: async (): Promise<ExtendedStudySet> => {
      const res = await fetch(`/api/study-sets/${params.id}`);
      const data = await res.json();
      return data;
    },
    onSuccess: (data) => {
      setTitle(data.title);
    },
  });

  const { mutate: updateTitle } = useMutation({
    mutationFn: async (updatedTitle: string): Promise<ExtendedStudySet> => {
      const res = await fetch(`/api/study-sets/${params.id}`, {
        method: "PATCH",
        body: JSON.stringify({
          title: updatedTitle,
        }),
      });
      const data = await res.json();
      return data;
    },
    onSuccess: (data) => {
      console.log(data);
    },
  });

  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      router.push("/signin");
    },
  });

  return (
    <div className="w-full flex-col space-y-6">
      {isSetLoading ? (
        <Skeleton className="h-7 w-4/5 mb-6" />
      ) : (
        <TextareaAutosize
          className="font-extrabold text-4xl lg:text-5xl tracking-tight bg-transparent focus:outline-none resize-none w-full"
          value={title || set?.title}
          onChange={(e) => {
            updateTitle(e.target.value);
            setTitle(e.target.value);
          }}
          placeholder="Set Title"
        />
      )}

      <div className="w-full flex justify-between items-center">
        <div className="flex space-x-2 items-center">
          <Link href={`/study-sets/${set?.id}/flashcards`}>
            <Button variant="outline">
              <SquareStack className="h-4 w-4 mr-2" />
              Flashcards
            </Button>
          </Link>
          <Link href={`/study-sets/${set?.id}/flashcards`}>
            <Button variant="outline">
              <BrainCircuit className="h-4 w-4 mr-2" />
              Quiz
            </Button>
          </Link>
        </div>
      </div>
      <div className="flex flex-col space-y-4">
        <p className="font-semibold text-lg">Set Items</p>
        {isSetLoading ? (
          <>
            {" "}
            {Array(3)
              .fill("")
              .map((s) => (
                <Card className="w-full">
                  <CardContent className="flex flex-col pt-6 space-y-4">
                    <Skeleton className="h-4 w-6/6" />
                    <Skeleton className="h-4 w-4/6" />
                  </CardContent>
                </Card>
              ))}
          </>
        ) : set ? (
          <>
            {set.items.map((item) => (
              <SetItemCard item={item} set={set} />
            ))}
            {session?.user.id == set.userId && <NewItem set={set} />}
          </>
        ) : (
          <ErrorAlert />
        )}
      </div>
    </div>
  );
}
