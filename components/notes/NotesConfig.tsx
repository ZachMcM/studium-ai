"use client";

import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import {
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { RequestOptions } from "ai";
import { useSearchParams } from "next/navigation";
import SourceConfig from "../SourceConfig";

type Props = {
  input: string;
  setInput: Dispatch<SetStateAction<string>>;
  complete: (
    prompt: string,
    options?: RequestOptions | undefined
  ) => Promise<string | null | undefined>;
};

export default function NotesConfig({ input, setInput, complete }: Props) {
  const [open, setOpen] = useState<boolean>(false);
  const [fileInput, setFileInput] = useState<FileList | null>(null)
  const [tabValue, setTabValue] = useState<"upload" | "paste">("upload")

  async function handleSave() {
    setOpen(false);
    if (tabValue == "upload" && fileInput) {
      const formData = new FormData()
      formData.append("file", fileInput[0])
      const res = await fetch("/api/files", {
        method: "POST",
        body: formData
      })
      const data = await res.json() as string
      complete(data);
    } else {
      complete(input)
    }
  }

  const searchParams = useSearchParams();
  const isNew = new Boolean(searchParams.get("new")).valueOf();

  useEffect(() => {
    if (isNew) setOpen(true);
  }, [isNew]);

  useEffect(() => {
    setInput("")
    setFileInput(null)
    setTabValue("upload")
  }, [open])

  return (
    <Dialog open={open} onOpenChange={() => setOpen(!open)}>
      <DialogTrigger asChild>
        <Button variant="outline">
          Generate... <Plus className="h-4 w-4 ml-2" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[425px] md:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Generate notes</DialogTitle>
          <DialogDescription>
            Generate your notes by either uploading a pasting the soure or
            uploading a pdf, txt, image, or video file.
          </DialogDescription>
        </DialogHeader>
        <SourceConfig
          setTabValue={setTabValue}
          setFileInput={setFileInput}
          input={input}
          setInput={setInput}
          onContinue={() => handleSave()}
        />
      </DialogContent>
    </Dialog>
  );
}
