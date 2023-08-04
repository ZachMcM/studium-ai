"use client";

import { ArrowLeft } from "lucide-react";
import { Button } from "../ui/button";
import * as z from "zod";
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
import { Textarea } from "../ui/textarea";

const formSchema = z.object({
  title: z
    .string()
    .min(5, { message: "Your title must be at least 5 characters." })
    .max(50, { message: "Your title must be less than 50 characters." }),
  num: z.coerce
    .number()
    .min(1, { message: "You must have a least 1 card." })
    .max(25, { message: "You must have less than 25 cards." }),
  description: z
    .string()
    .min(5, { message: "Your description must be at least 5 characters." })
    .max(200, { message: "Your title must be less than 200 characters." }),
});

export type FormSubmitVaues = z.infer<typeof formSchema>;

export function FormSubmit({
  itemType,
  onSubmit,
  onBack,
}: {
  itemType: "questions" | "cards";
  onSubmit: (values: FormSubmitVaues) => any;
  onBack: () => any;
}) {
  const form = useForm<FormSubmitVaues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      num: 1,
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter title..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter description..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="num"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Number of {itemType}</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex items-center space-x-2">
          <Button onClick={onBack} variant="ghost">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <Button type="submit">Submit </Button>
        </div>
      </form>
    </Form>
  );
}
