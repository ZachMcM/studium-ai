"use client";

import { Plus } from "lucide-react";
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
import { useMutation } from "react-query";
import { Input } from "../ui/input";

const formSchema = z.object({
  title: z
    .string()
    .min(5, { message: "Your title must be at least 5 characters." })
    .max(50, { message: "Your title must be less than 50 characters." }),
});

export default function NewSet() {
  const [page, setPage] = useState<"config" | "submit">("config");
  const [open, setOpen] = useState<boolean>(false);
  const [sourceText, setSourceText] = useState<string>("");

  function toSubmitPage(text: string) {
    setSourceText(text);
    setPage("submit");
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
    },
  });

  // TODO
  const {} = useMutation({
    mutationFn: async () => {},
  });

  // TODO
  function onSubmit() {}

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
          <DialogTitle>Generate a flashcard set</DialogTitle>
          <DialogDescription>
            Generate your flashcard set by uploading a file, pasting text, or
            uploading a link to a website.
          </DialogDescription>
        </DialogHeader>
        {page == "config" && (
          <SourceConfig open={open} onContinue={toSubmitPage} />
        )}
        {page == "submit" && (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your flashcard set title..."
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      This will be how you identify your flashcard set.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">
                Submit
              </Button>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}
