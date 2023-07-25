"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import { useCompletion } from "ai/react";
import { Textarea } from "../ui/textarea";
import { Input } from "../ui/input";
import { ChangeEvent } from "react";
import { useMutation, useQueryClient } from "react-query";
import { useToast } from "../ui/use-toast";

export default function NotesCreator() {
  const { completion, input, handleInputChange, handleSubmit, setInput } =
    useCompletion({
      api: "/api/ai/notes",
    });

  async function handleFileUpload(e: ChangeEvent<HTMLInputElement>) {
    const fileList = e.target.files
    if (fileList) {
      const fileContents = await fileList[0].text()
      setInput(fileContents)
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild className="shrink-0">
        <Button>
          Add New... <Plus className="h-4 w-4 ml-2" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Create Notes</DialogTitle>
          <DialogDescription>
            Upload or paste a source to create new notes.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6">
          <Textarea value={input} onChange={handleInputChange} />
          <div className="space-y-2">
            <Input
              type="file"
              id="data"
              accept="text/plain, application/pdf"
              onChange={handleFileUpload}
            />
            <p className="text-xs font-medium text-muted-foreground">
              Upload a pdf or txt file as a data source.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
