"use client";

import { EmptyAlert } from "@/components/alerts/EmptyAlert";
import { ErrorAlert } from "@/components/alerts/ErrorAlert";
import { SearchAlert } from "@/components/alerts/SearchAlert";
import { ListCard } from "@/components/cards/ListCard";
import { LoadingCards } from "@/components/cards/LoadingCards";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { ToastAction } from "@/components/ui/toast";
import { toast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { Limit, Quiz } from "@prisma/client";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useQuery } from "react-query";

export default function Quizzes() {
  const router = useRouter();

  const { data: disabled, isLoading: disabledLoading } = useQuery({
    queryKey: ["limit"],
    queryFn: async (): Promise<boolean> => {
      const res = await fetch("/api/limit");
      const data = await res.json();
      return data;
    },
  });

  const { data: quizzes, isLoading: quizzesLoading } = useQuery({
    queryKey: ["sets"],
    queryFn: async (): Promise<Quiz[]> => {
      const res = await fetch("/api/quizzes");
      const data = await res.json();
      return data;
    },
    onError: () => {
      toast({
        title: "Uh oh, something went wrong!",
        description: <p>There was an error loading the quizzes.</p>,
        variant: "destructive",
        action: (
          <ToastAction altText="Try again" onClick={() => router.refresh()}>
            Try again
          </ToastAction>
        ),
      });
    },
  });

  const [search, setSearch] = useState("");

  return (
    <div className="flex-1 px-4 py-10 md:py-16 max-w-5xl xl:max-w-6xl mx-auto w-full flex flex-col">
      <div className="flex flex-col space-y-1">
        <h1 className="text-3xl font-bold">Quizzes</h1>
        <p className="text-muted-foreground font-medium">
          Create and manage your AI generated quizzes.
        </p>
      </div>
      <div className="flex items-center space-x-2 mt-4">
        <Input
          onChange={(e) => setSearch(e.target.value)}
          value={search}
          placeholder="Search quizzes..."
        />
        {disabledLoading ? (
          <Skeleton className="w-[125px] h-9 shrink-0" />
        ) : disabled ? (
          <Button disabled className="shrink-0">
            Add New... <Plus className="h-4 w-4 ml-2" />
          </Button>
        ) : (
          <Link href="/tutors/new" className="shrink-0">
            <Button>
              Add New...
              <Plus className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        )}
      </div>
      <div className="mt-6">
        {quizzesLoading ? (
          <LoadingCards />
        ) : quizzes ? (
          quizzes.length == 0 ? (
            <EmptyAlert />
          ) : (
            <div className="gap-4 grid md:grid-cols-2 lg:grid-cols-3">
              {quizzes.filter((quiz) =>
                quiz.title.toLowerCase().includes(search.toLowerCase())
              ).length !== 0 ? (
                quizzes
                  .filter((quiz) =>
                    quiz.title.toLowerCase().includes(search.toLowerCase())
                  )
                  .map((quiz) => (
                    <ListCard
                      key={quiz.id}
                      title={quiz.title}
                      description={quiz.description}
                      link={`/quizzes/${quiz.id}`}
                      itemType="Quiz"
                      date={new Date(quiz.createdAt)}
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
