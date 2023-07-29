"use client";

import { Notes } from "@prisma/client";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Button } from "../ui/button";
import { Forward, Menu, Trash2 } from "lucide-react";
import { TabsList, TabsTrigger } from "../ui/tabs";
import NotesConfig from "./NotesConfig";
import { AlertDialog, AlertDialogTrigger } from "../ui/alert-dialog";
import { RequestOptions } from "ai";
import { Dispatch, SetStateAction } from "react";
import DeleteDialog from "../DeleteDialog";

type Props = {
  deleteFunction: () => void;
  isDeleting: boolean;
  complete: (
    prompt: string,
    options?: RequestOptions | undefined
  ) => Promise<string | null | undefined>;
};

export default function NotesSiderbar({
  complete,
  deleteFunction,
  isDeleting,
}: Props) {
  return (
    <Sheet>
      <SheetTrigger asChild className="md:hidden">
        <Button variant="outline">
          <Menu className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right">
        <div className="flex flex-col space-y-2.5 mt-8">
          <NotesConfig complete={complete} />
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="markdown">Markdown</TabsTrigger>
          </TabsList>
          {/* TODO */}
          <Button variant="secondary">
            <Forward className="h-4 w-4 mr-2" />
            Share
          </Button>
          <AlertDialog>
            <AlertDialogTrigger>
              <Button variant="outline" className="w-full !text-destructive">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </AlertDialogTrigger>
            <DeleteDialog
              deleteFunction={deleteFunction}
              isDeleting={isDeleting}
            />
          </AlertDialog>
        </div>
      </SheetContent>
    </Sheet>
  );
}
