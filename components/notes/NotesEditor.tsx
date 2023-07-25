"use client";

import { Notes } from "@prisma/client";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem } from "../ui/form";
import TextareaAutosize from "react-textarea-autosize";
import { Button } from "../ui/button";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

const notesFormSchema = z.object({
  title: z
    .string()
    .min(5, { message: "Your title must be at least 5 characters." })
    .max(50, { message: "Your title must be less than 50 characters." }),
  content: z.string(),
});

type NotesFormValues = z.infer<typeof notesFormSchema>;

export default function NotesEditor({ notes }: { notes: Notes }) {
  const form = useForm<NotesFormValues>({
    resolver: zodResolver(notesFormSchema),
    defaultValues: {
      title: notes.title,
      content: notes.content,
    },
  });

  function onSubmit(values: NotesFormValues) {
    console.log(values);
    // TODO
  }

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="p-4 md:p-6 flex items-center justify-between w-full">
            <Link href="/dashboard/notes">
              <Button type="submit" variant="ghost">
                <ChevronLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </Link>
            <Button>Save</Button>
          </div>
          <div className="mx-auto max-w-2xl py-8 min-h-[600px]">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <TextareaAutosize
                      {...field}
                      className="text-4xl placeholder:text-muted-foreground md:text-5xl font-bold bg-transparent w-full resize-none focus:outline-none"
                      placeholder="Untitled Notes"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <TextareaAutosize
                      {...field}
                      className="prose text-primary prose-zinc bg-transparent w-full resize-none focus:outline-none"
                      placeholder="Write your notes here..."
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </form>
      </Form>
    </div>
  );
}
