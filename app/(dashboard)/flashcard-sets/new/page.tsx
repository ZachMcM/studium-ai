"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/use-toast";
import { ExtendedFlashcardSet } from "@/types/prisma";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FormConfig } from "@/components/forms/FormConfig";
import { FormSubmit, FormSubmitVaues } from "@/components/forms/FormSubmit";
import { LoadingPage } from "@/components/LoadingPage";
import { Check } from "lucide-react";
import { AnimatePresence } from "framer-motion";

export default function NewFlashcardsPage() {
  const [page, setPage] = useState<"config" | "submit">("config");
  const [sourceText, setSourceText] = useState<string>("");
  const [finished, setFinished] = useState<boolean>(false);
  const [isLoadingPage, setIsLoadingPage] = useState<boolean>(false);

  function toSubmitPage(text: string) {
    setSourceText(text);
    setPage("submit");
  }

  const queryClient = useQueryClient();
  const router = useRouter();

  const { mutate: createSet } = useMutation({
    mutationFn: async ({
      title,
      num,
      description,
    }: FormSubmitVaues): Promise<ExtendedFlashcardSet> => {
      const res = fetch("/api/flashcard-sets", {
        method: "POST",
        body: JSON.stringify({
          title,
          num,
          description,
          sourceText: sourceText,
        }),
      });

      const data = (await res).json();
      return data;
    },
    onSuccess: (data) => {
      console.log(data);
      queryClient.invalidateQueries({ queryKey: ["sets"] });
      setFinished(true);
      setTimeout(() => {
        toast({
          description: (
            <p className="flex items-center">
              <Check className="h-4 w-4 mr-2 " />
              Flashcard set created successfully.
            </p>
          ),
        });
        router.push(`/flashcard-sets/${data.id}`);
      }, 1500);
    },
    onError: () => {
      toast({
        title: "Uh oh, something went wrong!",
        description: (
          <p>
            Oops, there was an error creating a new flashcard set. Please try
            again.
          </p>
        ),
        variant: "destructive",
      });
    },
  });

  const submitForm = (values: FormSubmitVaues) => {
    setIsLoadingPage(true)
    createSet(values)
  };

  return (
    <main className="flex-1 flex justify-center items-center relative px-4">
      <Card className="w-[500px]">
        <CardHeader>
          <CardTitle>Generate a flashcard set</CardTitle>
          <CardDescription>
            Generate your flashcard set by uploading a file, pasting text, or
            uploading a link to a website.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {page == "config" && <FormConfig onContinue={toSubmitPage} />}
          {page == "submit" && (
            <FormSubmit
              itemType="cards"
              onSubmit={submitForm}
              onBack={() => setPage("config")}
            />
          )}
        </CardContent>
      </Card>
      <AnimatePresence>
        {isLoadingPage && <LoadingPage finished={finished} />}
      </AnimatePresence>
    </main>
  );
}
