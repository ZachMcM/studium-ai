"use client";

import {
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import { Loader2 } from "lucide-react";
import { Button } from "./ui/button";

export default function DeleteDialog({
  deleteFunction,
  isDeleting,
}: {
  deleteFunction: () => void;
  isDeleting: boolean;
}) {
  return (
    <AlertDialogContent className="max-w-[425px] md:max-w-[525px]">
      <AlertDialogHeader>
        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
        <AlertDialogDescription>
          This action cannot be undone. This preset will no longer be accessible
          by you or others you've shared it with.
        </AlertDialogDescription>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button onClick={deleteFunction} variant="destructive">
            Delete
            {isDeleting && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
          </Button>
        </AlertDialogFooter>
      </AlertDialogHeader>
    </AlertDialogContent>
  );
}
