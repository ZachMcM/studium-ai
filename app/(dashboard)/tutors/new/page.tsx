"use client";

import { useState } from "react";
import { Mutation, useMutation, useQueryClient } from "react-query";
import { useRouter } from "next/navigation";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FormConfig } from "@/components/forms/FormConfig";
import { Check } from "lucide-react";
import { Tutor } from "@prisma/client";
import {
  SubmitTutor,
  NewTutorFormValues,
} from "@/components/tutors/SubmitTutor";
import { toast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

export default function NewTutor() {
  const [page, setPage] = useState<"config" | "submit">("config");
  const [sourceText, setSourceText] = useState<string>("");

  function toSubmitPage(text: string) {
    setSourceText(text);
    setPage("submit");
  }

  const queryClient = useQueryClient();
  const router = useRouter();

  const { mutate: createTutor, isLoading } = useMutation({
    mutationFn: async ({
      title,
      description,
    }: NewTutorFormValues): Promise<Tutor> => {
      const res = fetch("/api/tutors", {
        method: "POST",
        body: JSON.stringify({
          title,
          description,
          source: sourceText,
        }),
      });

      const data = (await res).json();
      return data;
    },
    onSuccess: (data) => {
      console.log(data);
      queryClient.invalidateQueries({ queryKey: ["tutors"] });
      toast({
        description: (
          <p className="flex items-center">
            <Check className="h-4 w-4 mr-2 " />
            Tutor set created successfully.
          </p>
        ),
      });
      router.push(`/tutors/${data.id}`);
    },
    onError: () => {
      toast({
        title: "Uh oh, something went wrong!",
        description: (
          <p>
            Oops, there was an error creating a new AI tutor. Please try again.
          </p>
        ),
        variant: "destructive",
      });
    },
  });

  const submitForm = (values: NewTutorFormValues) => createTutor(values);

  return (
    <main className="flex-1 flex justify-center items-center relative px-4">
      <Card className="w-[500px]">
        <CardHeader>
          <CardTitle>Generate a tutor</CardTitle>
          <CardDescription>
            Generate a tutor with AI by uploading a file, pasting a link, or by
            defining your own subject.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FormConfig
            onContinue={toSubmitPage}
            className={cn(page != "config" && "hidden")}
          />
          <SubmitTutor
            onBack={() => setPage("config")}
            onSubmit={submitForm}
            isLoading={isLoading}
            className={cn(page != "submit" && "hidden")}
          />
        </CardContent>
      </Card>
    </main>
  );
}
