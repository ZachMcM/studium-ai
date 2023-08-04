"use client";

import { usePathname, useRouter } from "next/navigation";
import { Mutation, useMutation, useQuery, useQueryClient } from "react-query";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { SearchAlert } from "@/components/alerts/SearchAlert";
import { ErrorAlert } from "@/components/alerts/ErrorAlert";
import { EmptyAlert } from "@/components/alerts/EmptyAlert";
import { Tutor } from "@prisma/client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Check, Plus } from "lucide-react";
import { LoadingCards } from "@/components/cards/LoadingCards";
import { ListCard } from "@/components/cards/ListCard";
import { toast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";

export default function TutorsPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const pathname = usePathname();

  const { data: tutors, isLoading: tutorsLoading } = useQuery({
    queryKey: ["tutors"],
    queryFn: async (): Promise<Tutor[]> => {
      const res = await fetch("/api/tutors");
      const data = await res.json();
      return data;
    },
    onError: () => {
      toast({
        title: "Uh oh, something went wrong!",
        description: <p>There was an error loading your AI tutors.</p>,
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
      <h1 className="text-4xl font-bold">AI Tutors</h1>
      <p className="text-muted-foreground font-medium">
        Create and manage your AI tutors.
      </p>
      <div className="flex items-center space-x-2 mt-4">
        <Input
          onChange={(e) => setSearch(e.target.value)}
          value={search}
          placeholder="Search AI tutors..."
        />
        <Link href="/tutors/new" className="shrink-0">
          <Button>
            Add New...
            <Plus className="h-4 w-4 ml-2" />
          </Button>
        </Link>
      </div>
      <div className="mt-6">
        {tutorsLoading ? (
          <LoadingCards />
        ) : tutors ? (
          tutors.length == 0 ? (
            <EmptyAlert />
          ) : (
            <div className="gap-4 grid md:grid-cols-2 lg:grid-cols-3">
              {tutors.filter((tutor) =>
                tutor.title.toLowerCase().includes(search.toLowerCase())
              ).length !== 0 ? (
                tutors
                  .filter((tutor) =>
                    tutor.title.toLowerCase().includes(search.toLowerCase())
                  )
                  .map((tutor) => (
                    <ListCard
                      key={tutor.id}
                      title={tutor.title}
                      description={tutor.description}
                      link={`/tutors/${tutor.id}`}
                      itemType="Tutor"
                      date={new Date(tutor.createdAt)}
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
