"use client";

import { Copy, Forward, MoreHorizontal, Trash2 } from "lucide-react";
import { AlertDialog, AlertDialogTrigger } from "../ui/alert-dialog";

import { Button } from "../ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Notes } from "@prisma/client";
import DeleteDialog from "../DeleteDialog";
import { useMutation, useQueryClient } from "react-query";
import { usePathname, useRouter } from "next/navigation";

export default function NotesMore({
  deleteFunction,
  isDeleting,
}: {
  deleteFunction: () => void;
  isDeleting: boolean;
}) {
  return (
    <AlertDialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary">
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
      <DeleteDialog deleteFunction={deleteFunction} isDeleting={isDeleting} />
    </AlertDialog>
  );
}
