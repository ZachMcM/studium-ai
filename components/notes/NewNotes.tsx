"use client";

import { Notes } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useMutation } from "react-query";
import { Button } from "../ui/button";
import { Loader2, Plus } from "lucide-react";

export default function NewNotes() {
  const router = useRouter();

  const { mutate: createNotes, isLoading: creatingNotes } = useMutation({
    mutationFn: async (): Promise<Notes> => {
      const res = await fetch("/api/notes", {
        method: "POST",
      });
      const data = await res.json();
      return data;
    },
    onSuccess: (data) => {
      console.log(data);
      router.push(`/notes/${data.id}?new=true`);
    },
  });

  return (
    <Button className="shrink-0" onClick={() => createNotes()}>
      Add New...{" "}
      {creatingNotes ? (
        <Loader2 className="h-4 w-4 ml-2 animate-spin" />
      ) : (
        <Plus className="h-4 w-4 ml-2" />
      )}
    </Button>
  );
}
