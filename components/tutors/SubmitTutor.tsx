"use client";

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
import { Button } from "../ui/button";
import { ArrowLeft, Loader2, UploadCloud } from "lucide-react";
import { AspectRatio } from "../ui/aspect-ratio";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Avatar, AvatarImage } from "../ui/avatar";
import { useEffect, useState } from "react";

const formSchema = z.object({
  title: z
    .string()
    .min(5, { message: "Your title must be at least 5 characters." })
    .max(50, { message: "Your title must be less than 50 characters." }),
  description: z
    .string()
    .min(5, { message: "Your description must be at least 5 characters." })
    .max(200, { message: "Your title must be less than 200 characters." }),
  image: z.instanceof(FileList).optional(),
});

export type NewTutorFormValues = z.infer<typeof formSchema>;

export default function SubmitTutor({
  onSubmit,
  onBack,
  isLoading,
}: {
  onSubmit: (values: NewTutorFormValues) => any;
  onBack: () => any;
  isLoading: boolean;
}) {
  const form = useForm<NewTutorFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      image: undefined,
    },
  });

  const [previewImage, setPreviewImage] = useState<string>("");

  function createPreviewImage(file: File) {
    const url = URL.createObjectURL(file);
    setPreviewImage(url);
  }

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
                <Textarea placeholder="Enter description..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tutor Image (Optional)</FormLabel>
              <FormControl>
                <div className="relative hover:bg-secondary duration-500 cursor-pointer rounded-lg">
                  <AspectRatio
                    ratio={16 / 9}
                    className="border rounded-lg border-dashed flex items-center justify-center"
                  >
                    {!field.value && (
                      <div className="flex flex-col items-center text-center space-y-1">
                        <UploadCloud className="h-9 w-9" />
                        <p className="text-muted-foreground font-medium text-sm">
                          Click to upload or drag and drop
                        </p>
                        <p className="text-muted-foreground text-xs font-extralight">
                          SVG, PNG or JPG.
                        </p>
                      </div>
                    )}
                    {previewImage && (
                      <Avatar className="h-14 w-14">
                        <AvatarImage
                          src={previewImage}
                          alt="your uploaded image"
                        />
                      </Avatar>
                    )}
                  </AspectRatio>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files) { 
                        createPreviewImage(e.target.files[0])
                        field.onChange(e.target.files)
                      }
                    }}
                    className="cursor-pointer opacity-0 absolute inset-0 w-full h-full"
                  />
                </div>
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
          <Button type="submit">
            Submit {isLoading && <Loader2 className="h-4 w-4 ml-2 animate-spin" />}
          </Button>
        </div>
      </form>
    </Form>
  );
}
