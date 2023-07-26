'use client'

import { useMutation, useQueryClient } from "react-query";
import { usePathname, useRouter } from "next/navigation";
import {
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { Loader2 } from "lucide-react";
import { Button } from "../ui/button";

export default function DeleteNotes({ id }: { id: string }) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const pathname = usePathname()

  const { mutate: deleteNotes, isLoading: isDeleting } = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/notes/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      return data;
    },
    onSuccess: (data) => {
      console.log(data);
      if (pathname != "/dashboard/notes") {
        router.push("/dashboard/notes");
      }
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });

  return (
    <AlertDialogContent className="max-w-[425px] md:max-w-[525px]">
    <AlertDialogHeader>
      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
      <AlertDialogDescription>
        This action cannot be undone. This preset will no longer be
        accessible by you or others you've shared it with.
      </AlertDialogDescription>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <Button
          onClick={() => deleteNotes()}
          variant="destructive"
        >
          {isDeleting ? <Loader2 className="h-4 w-4 animate-spin"/> : "Delete"}
        </Button>
      </AlertDialogFooter>
    </AlertDialogHeader>
  </AlertDialogContent>
  )
}