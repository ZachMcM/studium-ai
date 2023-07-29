"use client";

import { AlertTriangle, ArrowLeft, Loader2, Plus } from "lucide-react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTrigger,
  DialogTitle,
} from "../ui/dialog";
import { useEffect, useState } from "react";
import SourceConfig from "../SourceConfig";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { useMutation, useQueries, useQueryClient } from "react-query";
import { Input } from "../ui/input";
import { useRouter } from "next/navigation";
import { toast } from "../ui/use-toast";
import { cn } from "@/lib/utils";
import { ExtendedStudySet } from "@/types/prisma";

const formSchema = z.object({
  title: z
    .string()
    .min(5, { message: "Your title must be at least 5 characters." })
    .max(50, { message: "Your title must be less than 50 characters." }),
  numCards: z
    .number()
    .min(1, { message: "You must have a least 1 card." })
    .max(25, { message: "You must have less than 25 cards." }),
});

export default function NewSet() {
  const [page, setPage] = useState<"config" | "submit">("config");
  const [open, setOpen] = useState<boolean>(false);
  const [sourceText, setSourceText] = useState<string>("");

  function toSubmitPage(text: string) {
    setSourceText(text);
    setPage("submit");
  }

  const queryClient = useQueryClient();
  const router = useRouter();

  type FormValues = z.infer<typeof formSchema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      numCards: 1,
    },
  });

  const { mutate: createSet, isLoading: creatingSet } = useMutation({
    mutationFn: async ({
      title,
      numCards,
    }: FormValues): Promise<ExtendedStudySet> => {
      const res = fetch("/api/study-sets", {
        method: "POST",
        body: JSON.stringify({
          title,
          numCards,
          sourceText: sourceText,
        }),
      });

      const data = (await res).json();
      return data;
    },
    onSuccess: (data) => {
      console.log(data);
      queryClient.invalidateQueries({ queryKey: ["sets"] });
      toast({
        title: "Successfully created your study set.",
      });
      router.push(`/study-sets/${data.id}`);
    },
  });

  const onSubmit = (values: FormValues) => createSet(values);

  useEffect(() => {
    setSourceText(sourceText);
    setPage("config");
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={() => setOpen(!open)}>
      <DialogTrigger asChild className="shrink-0">
        <Button>
          Add New...
          <Plus className="h-4 w-4 ml-2" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[425px] md:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Generate a study set</DialogTitle>
          <DialogDescription>
            Generate your study set by uploading a file, pasting text, or
            uploading a link to a website.
          </DialogDescription>
        </DialogHeader>
        {page == "config" && (
          <SourceConfig open={open} onContinue={toSubmitPage} />
        )}
        {page == "submit" && (
          <>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your study set title..."
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        This will be how you identify your study set.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="numCards"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Number of cards</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormDescription>
                        This is the number of cards that will be in the set.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full">
                  Submit{" "}
                  {creatingSet && (
                    <Loader2 className="h-4 w-4 ml-2 animate-spin" />
                  )}
                </Button>
                {creatingSet && (
                  <p className="text-yellow-500 font-medium text-sm flex items-center">
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    This might take a while, do not close this tab!
                  </p>
                )}
              </form>
            </Form>
            <Button
              onClick={() => setPage("config")}
              className="w-full"
              variant="outline"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
