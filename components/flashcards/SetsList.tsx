"use client";

import { usePathname, useRouter } from "next/navigation";
import { Mutation, useMutation, useQuery, useQueryClient } from "react-query";
import { Input } from "../ui/input";
import { useState } from "react";
import SearchAlert from "../alerts/SearchAlert";
import ErrorAlert from "../alerts/ErrorAlert";
import EmptyAlert from "../alerts/EmptyAlert";
import { FlashcardSet } from "@prisma/client";
import Link from "next/link";
import { Button } from "../ui/button";
import { AlertCircle, Check, Plus } from "lucide-react";
import LoadingCards from "../cards/LoadingCards";
import ListCard from "../cards/ListCard";
import { toast } from "../ui/use-toast";
import { ToastAction } from "../ui/toast";

export default function SetsList() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const pathname = usePathname();

  const { data: sets, isLoading: setsLoading } = useQuery({
    queryKey: ["sets"],
    queryFn: async (): Promise<FlashcardSet[]> => {
      const res = await fetch("/api/flashcard-sets");
      const data = await res.json();
      return data;
    },
    onError: () => {
      toast({
        title: "Uh oh, something went wrong!",
        description: <p>There was an error loading the flashcard sets.</p>,
        variant: "destructive",
        action: (
          <ToastAction altText="Try again" onClick={() => router.refresh()}>
            Try again
          </ToastAction>
        ),
      })
    }
  });

  const { mutate: deleteSet, isLoading: isDeleting } = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/flashcard-sets/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      return data;
    },
    onSuccess: (data) => {
      console.log(data);
      if (pathname != "/dashboard/flashcard-sets") {
        router.push("/dashboard/flashcard-sets");
      }
      queryClient.invalidateQueries({ queryKey: ["sets"] });
      toast({
        description: <p className="flex items-center"><Check className="h-4 w-4  mr-2"/>Successfully deleted the flashcard set.</p>
      })
    },
    onError(mutation: Mutation) {
      toast({
        title: "Uh oh, something went wrong!",
        description: <p>There was an error deleting the flashcard sets.</p>,
        variant: "destructive",
        action: (
          <ToastAction altText="Try again" onClick={() => mutation.execute()}>
            Try again
          </ToastAction>
        ),
      })
    },
  });

  const [search, setSearch] = useState("");

  return (
    <>
      <div className="flex items-center space-x-2 mt-4">
        <Input
          onChange={(e) => setSearch(e.target.value)}
          value={search}
          placeholder="Search flashcard sets..."
        />
        <Link href="/flashcard-sets/new" className="shrink-0">
          <Button>
            Add New...
            <Plus className="h-4 w-4 ml-2" />
          </Button>
        </Link>
      </div>
      <div className="mt-6">
        {setsLoading ? (
          <LoadingCards />
        ) : sets ? (
          sets.length == 0 ? (
            <EmptyAlert />
          ) : (
            <div className="flex flex-col border rounded-lg">
              {sets.filter((set) =>
                set.title.toLowerCase().includes(search.toLowerCase())
              ).length !== 0 ? (
                sets
                  .filter((set) =>
                    set.title.toLowerCase().includes(search.toLowerCase())
                  )
                  .map((set) => (
                    <ListCard
                      key={set.id}
                      title={set.title}
                      description={set.description}
                      deleteFunction={() => deleteSet(set.id)}
                      isDeleting={isDeleting}
                      link={`/flashcard-sets/${set.id}`}
                      itemType="Flashcards"
                    />
                  ))
              ) : (
                <SearchAlert />
              )}
            </div>
          )
        ) : (
          <ErrorAlert />
        )}
      </div>
    </>
  );
}
