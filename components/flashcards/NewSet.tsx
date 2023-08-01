"use client";

import { useState } from "react";
import { Mutation, useMutation, useQueryClient } from "react-query";
import { useRouter } from "next/navigation";
import { toast } from "../ui/use-toast";
import { ExtendedFlashcardSet } from "@/types/prisma";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import FormConfig from "../forms/FormConfig";
import FormSubmit, { FormSubmitVaues } from "../forms/FormSubmit";
import LoadingPage from "../LoadingPage";
import { Check } from "lucide-react";
import { ToastAction } from "../ui/toast";
import { AnimatePresence } from "framer-motion";
import { Button } from "../ui/button";

export default function NewSet() {
  const [page, setPage] = useState<"config" | "submit">("config");
  const [sourceText, setSourceText] = useState<string>("");
  const [finished, setFinished] = useState<boolean>(false)
  const [isLoadingPage, setIsLoadingPage] = useState<boolean>(false)

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
      description
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
      setFinished(true)
      setTimeout(() => {
        toast({
          description: <p className="flex items-center"><Check className="h-4 w-4 mr-2 "/>Flashcard set created successfully.</p>
        });
        router.push(`/flashcard-sets/${data.id}`);
      }, 1500);
    },
    onError: (mutate: Mutation) => {
      toast({
        title: "Uh oh, something went wrong!",
        description: <p>There was an error loading the flashcard set.</p>,
        variant: "destructive",
        action: (
          <ToastAction altText="Try again" onClick={() => mutate.execute()}>
            Try again
          </ToastAction>
        ),
      })
    }
  });

  const submitForm = (values: FormSubmitVaues) => {
    try {
      setIsLoadingPage(true)
      createSet(values)
    } catch (e) {
      console.log(e)
      setIsLoadingPage(false)
      toast({
        title: "Uh oh, something went wrong!",
        description: <p>Oops, there was an error creating a new flashcard set. Please try again.</p>,
        variant: "destructive",
      })
    }
  };

  return (
    <main className="flex-1 flex justify-center items-center relative">
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
        {isLoadingPage && <LoadingPage finished={finished}/>}
      </AnimatePresence>
    </main>
  );
}
