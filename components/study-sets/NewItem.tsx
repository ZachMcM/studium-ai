"use client";

import { ExtendedStudySet } from "@/types/prisma";
import { StudySet } from "@prisma/client";
import { useMutation, useQueryClient } from "react-query";
import * as z from "zod";
import { toast } from "../ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { CopyPlus, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";

const formSchema = z.object({
  question: z
    .string()
    .min(2, { message: "The question must be at least 2 characters" }),
  answer: z
    .string()
    .min(2, { message: "The answer must be at least 2 characters" }),
});

type FormValues = z.infer<typeof formSchema>;

export default function NewItem({ set }: { set: StudySet }) {
  const queryClient = useQueryClient();

  const { mutate: add, isLoading: isAdding } = useMutation({
    mutationFn: async (values: FormValues): Promise<ExtendedStudySet> => {
      const res = await fetch(`/api/study-sets/${set.id}/new-item`, {
        method: "POST",
        body: JSON.stringify(values),
      });
      const data = await res.json();
      return data;
    },
    onSuccess: (data) => {
      console.log(data);
      queryClient.invalidateQueries({ queryKey: ["sets", { id: set.id }] });
      toast({
        title: "New study set item added successfully.",
      });
    },
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      answer: "",
      question: "",
    },
  });

  function onSubmit(values: FormValues) {
    add(values);
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          Add new item to study set <CopyPlus className="h-4 w-4 ml-2" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add new study set item</DialogTitle>
          <DialogDescription>
            Add a new item to the study set by entering a question and an answer.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="question"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Question</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter the item question..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="answer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Answer</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter the item answer..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="w-full" type="submit">
              Submit{" "}
              {isAdding && <Loader2 className="h-4 w-4 ml-2 animate-spin" />}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
