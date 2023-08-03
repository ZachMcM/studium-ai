"use client";

import { usePathname, useRouter } from "next/navigation";
import { Mutation, useMutation, useQuery, useQueryClient } from "react-query";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import SearchAlert from "@/components/alerts/SearchAlert";
import ErrorAlert from "@/components/alerts/ErrorAlert";
import EmptyAlert from "@/components/alerts/EmptyAlert";
import { FlashcardSet } from "@prisma/client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AlertCircle, Check, Plus } from "lucide-react";
import LoadingCards from "@/components/cards/LoadingCards";
import ListCard from "@/components/cards/ListCard";
import { toast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";

export default function FlashcardSets() {
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
      });
    },
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
        description: (
          <p className="flex items-center">
            <Check className="h-4 w-4  mr-2" />
            Successfully deleted the flashcard set.
          </p>
        ),
      });
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
      });
    },
  });

  const [search, setSearch] = useState("");

  return (
    <div className="w-full flex flex-col">
      <h1 className="text-4xl font-bold font-cal">Flashcards</h1>
      <p className="text-muted-foreground font-medium">
        Create and manage your AI generated flashcard sets.
      </p>
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
            <div className="gap-4 grid md:grid-cols-2 lg:grid-cols-3">
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
                      date={new Date(set.createdAt)}
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
    </div>
  );
}
