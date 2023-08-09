"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/use-toast";
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
import { FlashcardSet } from "@prisma/client";
import { cn } from "@/lib/utils";

export default function NewFlashcardsPage() {
  const [page, setPage] = useState<"config" | "submit">("config");
  const [source, setSource] = useState<string>("");
  const [finished, setFinished] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  function toSubmitPage(text: string) {
    setSource(text);
    setPage("submit");
  }

  const queryClient = useQueryClient();
  const router = useRouter();

  const { mutate: createSet } = useMutation({
    mutationFn: async ({
      title,
      num,
      description,
    }: FormSubmitVaues): Promise<FlashcardSet> => {
      const res = fetch("/api/flashcard-sets", {
        method: "POST",
        body: JSON.stringify({
          title,
          num,
          description,
          source,
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
    setIsLoading(true);
    createSet(values);
  };

  return (
    <main className="flex-1 flex justify-center items-center w-full relative px-4">
      <Card className="w-[500px]">
        <CardHeader>
          <CardTitle>Generate a flashcard set</CardTitle>
          <CardDescription>
            Generate a flashcard set with AI by uploading a file, pasting a
            link, or by defining your own subject.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FormConfig
            onContinue={toSubmitPage}
            className={cn(page != "config" && "hidden")}
          />
          <FormSubmit
            itemType="cards"
            onSubmit={submitForm}
            onBack={() => setPage("config")}
            className={cn(page != "submit" && "hidden")}
          />
        </CardContent>
      </Card>
      <AnimatePresence>
        {isLoading && <LoadingPage finished={finished} />}
      </AnimatePresence>
    </main>
  );
}
