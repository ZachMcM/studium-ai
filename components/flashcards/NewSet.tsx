"use client";

import { Plus } from "lucide-react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTrigger,
  DialogTitle
} from "../ui/dialog";
import { useState } from "react";
import SourceConfig from "../SourceConfig";

export default function NewSet() {
  const [page, setPage] = useState<number>(1);
  const [input, setInput] = useState<string>("");
  const [fileInput, setFileInput] = useState<FileList>()

  return (
    <Dialog>
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
            Generate a flashcard set by either uploading a pasting the soure or
            uploading a pdf, txt, image, or video file.
          </DialogDescription>
        </DialogHeader>
        <SourceConfig
          input={input}
          setInput={setInput}
          onContinue={() => setPage(2)}
        />
      </DialogContent>
    </Dialog>
  );
}
