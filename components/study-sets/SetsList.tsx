"use client";

import { useSession } from "next-auth/react";
import { redirect, usePathname, useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { Input } from "../ui/input";
import { useState } from "react";
import { Button } from "../ui/button";
import {
  Edit,
  Forward,
  Loader2,
  MoreVertical,
  Trash2,
} from "lucide-react";
import { StudySet } from "@prisma/client";
import Link from "next/link";
import {
  AlertDialog,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import SearchAlert from "../SearchAlert";
import ErrorAlert from "../ErrorAlert";
import EmptyAlert from "../EmptyAlert";
import DeleteDialog from "../DeleteDialog";
import NewSet from "./NewSet";

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
          <Loader2 className="h-4 w-4 animate-spin" />
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
                    <div key={set.id} className="flex items-center justify-between border-b last:border-none px-6 py-4">
                      <div className="space-y-1">
                        <Link
                          href={`/study-sets/${set.id}`}
                          className="text-lg hover:underline font-semibold"
                        >
                          {set.title || "Untitled Set"}
                        </Link>
                        <p className="text-muted-foreground font-medium text-sm">
                          {new Date(set.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <AlertDialog>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <Link href={`/study-sets/${set.id}`}>
                              <DropdownMenuItem>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                            </Link>
                            {/* TODO */}
                            <DropdownMenuItem>
                              <Forward className="h-4 w-4 mr-2" />
                              Share
                            </DropdownMenuItem>
                            <AlertDialogTrigger asChild>
                              <DropdownMenuItem className="!text-destructive">
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </AlertDialogTrigger>
                          </DropdownMenuContent>
                        </DropdownMenu>
                        {set && <DeleteDialog deleteFunction={() => deleteSet(set.id)} isDeleting={isDeleting}/>}
                      </AlertDialog>
                    </div>
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
