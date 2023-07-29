"use client";

import { ExtendedStudySet } from "@/types/prisma";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { Skeleton } from "../ui/skeleton";
import LogoIcon from "../LogoIcon";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import UserDropdown from "../UserDropdown";
import { AlertDialog, AlertDialogTrigger } from "../ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { Copy, Edit, Forward, MoreHorizontal, Trash2 } from "lucide-react";
import DeleteDialog from "../DeleteDialog";

export default function SetHeader({ id }: { id: string }) {
  const queryClient = useQueryClient();
  const pathname = usePathname();
  const router = useRouter();

  const { data: set, isLoading: isSetLoading } = useQuery({
    queryKey: ["sets", { id: id }],
    queryFn: async (): Promise<ExtendedStudySet> => {
      const res = await fetch(`/api/study-sets/${id}`);
      const data = await res.json();
      console.log(data);
      return data;
    },
  });

  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      router.push("/signin");
    },
  });

  const { mutate: deleteSet, isLoading: isDeleting } = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/study-sets/${set?.id}`, {
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

  return (
    <div className="w-full sticky top-0 left-0 h-16 border-b flex items-center px-6 justify-between bg-background">
      <div className="flex items-center space-x-2 shrink-0">
        <Link href="/dashboard/study-sets" className="flex space-x-2 items-center">
          <LogoIcon />
          <span className="font-semibold">Study AI</span>
        </Link>
      </div>
      <div className="flex space-x-2 items-center">
        {session?.user.id == set?.userId && (
          <AlertDialog>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="icon" variant="outline">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="mr-2">
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    {/* TODO */}
                    <Forward className="h-4 w-4 mr-2" />
                    Share
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Copy className="h-4 w-4 mr-2" />
                    Duplicate
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <AlertDialogTrigger asChild>
                    <DropdownMenuItem className="!text-destructive">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </AlertDialogTrigger>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            <DeleteDialog deleteFunction={deleteSet} isDeleting={isDeleting} />
          </AlertDialog>
        )}
        <UserDropdown />
      </div>
    </div>
  );
}
