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
} from "@/components/ui/card"
import FormConfig from "@/components/forms/FormConfig";
import FormSubmit, { FormSubmitVaues } from "@/components/forms/FormSubmit";
import LoadingPage from "@/components/LoadingPage";
import { Check } from "lucide-react";
import { ToastAction } from "@/components/ui/toast";
import { AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Tutor } from "@prisma/client";
import SubmitTutor, { NewTutorFormValues } from "@/components/tutors/SubmitTutor";
import { toast } from "@/components/ui/use-toast";

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
      image
    }: NewTutorFormValues): Promise<Tutor> => {
      const formData = new FormData()
      formData.append("title", title)
      formData.append("description", description)
      formData.append("source", sourceText)
      if (image) formData.append("image", image[0])

      const res = fetch("/api/tutors", {
        method: "POST",
        body: formData,
      });

      const data = (await res).json();
      return data;
    },
    onSuccess: (data) => {
      console.log(data);
      queryClient.invalidateQueries({ queryKey: ["sets"] });
      toast({
        description: <p className="flex items-center"><Check className="h-4 w-4 mr-2 "/>Tutor set created successfully.</p>
      });
      router.push(`/tutors/${data.id}`);
    },
    onError: () => {
      toast({
        title: "Uh oh, something went wrong!",
        description: <p>Oops, there was an error creating a new AI tutor. Please try again.</p>,
        variant: "destructive",
      })
    }
  });

  const submitForm = (values: NewTutorFormValues) => createTutor(values);

  return (
    <main className="flex-1 flex justify-center items-center relative">
      <Card className="w-[500px]">
        <CardHeader>
          <CardTitle>Generate an AI tutor</CardTitle>
          <CardDescription>
            Generate your AI tutor by uploading a file, pasting text, or
            uploading a link to a website.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {page == "config" && <FormConfig onContinue={toSubmitPage} />}
          {page == "submit" && (
            <SubmitTutor
              onBack={() => setPage("config")}
              onSubmit={submitForm}
              isLoading={isLoading}
            />
          )}
        </CardContent>
      </Card>
    </main>
  );
}
