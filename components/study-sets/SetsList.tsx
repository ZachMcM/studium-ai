"use client";

import { usePathname, useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { Input } from "../ui/input";
import { useState } from "react";
import { StudySet } from "@prisma/client";
import SearchAlert from "../SearchAlert";
import ErrorAlert from "../ErrorAlert";
import EmptyAlert from "../EmptyAlert";
import NewSet from "./NewSet";
import ItemCard from "../ItemCard";
import ItemsLoading from "../ItemsLoading";

export default function SetsList() {
  const { data: sets, isLoading: setsLoading } = useQuery({
    queryKey: ["sets"],
    queryFn: async (): Promise<StudySet[]> => {
      const res = await fetch("/api/study-sets");
      const data = await res.json();
      return data;
    },
  });

  const router = useRouter();
  const queryClient = useQueryClient();
  const pathname = usePathname()

  const { mutate: deleteSet, isLoading: isDeleting } = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/study-sets/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      return data;
    },
    onSuccess: (data) => {
      console.log(data);
      if (pathname != "/dashboard/study-sets") {
        router.push("/dashboard/study-sets");
      }
      queryClient.invalidateQueries({ queryKey: ["sets"] });
    },
  });

  const [search, setSearch] = useState("");

  return (
    <>
      <div className="flex items-center space-x-2 mt-4">
        <Input
          onChange={(e) => setSearch(e.target.value)}
          value={search}
          placeholder="Search study sets..."
        />
        <NewSet/>
      </div>
      <div className="mt-6">
        {setsLoading ? (
          <ItemsLoading/>
        ) : sets ? (
          sets.length == 0 ? (
            <EmptyAlert/>
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
                    <ItemCard
                      title={set.title}
                      deleteFunction={() => deleteSet(set.id)}
                      isDeleting={isDeleting}
                      link={`/study-sets/${set.id}`}
                      createdAt={(new Date(set.createdAt)).toLocaleDateString()}
                      itemType="Study Set"
                    />
                  ))
              ) : (
                <SearchAlert/>
              )}
            </div>
          )
        ) : (
          <ErrorAlert/>
        )}
      </div>
    </>
  );
}
