"use client";

import { SetItem, StudySet } from "@prisma/client";
import { useMutation, useQueryClient } from "react-query";
import * as z from "zod";
import { toast } from "../ui/use-toast";
import { Card, CardContent } from "../ui/card";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { Edit, Loader2, MoreVertical, Trash2 } from "lucide-react";
import { AlertDialog, AlertDialogTrigger } from "../ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import DeleteDialog from "../DeleteDialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

const formSchema = z.object({
  question: z
    .string()
    .min(2, { message: "The question must be at least 2 characters" }),
  answer: z
    .string()
    .min(2, { message: "The answer must be at least 2 characters" }),
});

type FormValues = z.infer<typeof formSchema>;

export default function SetItemCard({
  item,
  set,
}: {
  item: SetItem;
  set: StudySet;
}) {
  const queryClient = useQueryClient();
  const router = useRouter();

  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      router.push("/signin");
    },
  });

  const { mutate: updateItem, isLoading: isUpdating } = useMutation({
    mutationFn: async (values: FormValues): Promise<SetItem> => {
      const res = await fetch(`/api/study-sets/items/${item.id}`, {
        method: "PUT",
        body: JSON.stringify(values),
      });
      const data = await res.json();
      return data;
    },
    onSuccess: (data) => {
      console.log(data);
      queryClient.invalidateQueries({ queryKey: ["sets", { id: item.setId }] });
      toast({
        title: "Successfully updated this study set item.",
      });
    },
  });

  const { mutate: deleteItem, isLoading: isItemDeleting } = useMutation({
    mutationFn: async (): Promise<SetItem> => {
      const res = await fetch(`/api/study-sets/items/${item.id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      return data;
    },
    onSuccess: (data) => {
      console.log(data);
      queryClient.invalidateQueries({ queryKey: ["sets", { id: item.setId }] });
      toast({
        title: "Successfully deleted this study set item.",
      });
    },
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      answer: item.answer,
      question: item.question,
    },
  });

  function onSubmit(values: FormValues) {
    updateItem(values);
  }

  return (
    <Card>
      <CardContent className="pt-6 flex flex-col md:flex-row md:items-center space-y-6 md:space-y-0 items-start md:space-x-6 text-sm font-medium">
        <p className="text-muted-foreground basis-1/4 pb-6 md:pb-0 md:pr-6 border-b md:border-b-0 md:border-r">
          {item.question}
        </p>
        <p className="basis-3/4">{item.answer}</p>
        {session?.user.id == set.userId && (
          <Dialog>
            <AlertDialog>
              <DropdownMenu>
                <DropdownMenuTrigger asChild className="self-end md:self-center">
                  <Button variant="outline" size="icon" className="shrink-0">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuGroup>
                    <DialogTrigger asChild>
                      <DropdownMenuItem>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                    </DialogTrigger>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <AlertDialogTrigger asChild>
                      <DropdownMenuItem className="!text-destructive">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </AlertDialogTrigger>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
              <DeleteDialog
                deleteFunction={() => deleteItem()}
                isDeleting={isItemDeleting}
              />
            </AlertDialog>
            <DialogContent className="max-w-[425px] md:max-w-[525px] !rounded-lg">
              <DialogHeader>
                <DialogTitle>Edit</DialogTitle>
                <DialogDescription>
                  Edit this study set item's answer or question.
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="question"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Question</FormLabel>
                        <FormControl>
                          <Textarea
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
                          <Textarea
                            placeholder="Enter the item answer..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button className="w-full" type="submit">
                    Submit{" "}
                    {isUpdating && (
                      <Loader2 className="h-4 w-4 ml-2 animate-spin" />
                    )}
                  </Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        )}
      </CardContent>
    </Card>
  );
}
