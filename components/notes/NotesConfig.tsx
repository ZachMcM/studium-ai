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
  useEffect,
  useState,
} from "react";
import { RequestOptions } from "ai";
import { useSearchParams } from "next/navigation";
import SourceConfig from "../SourceConfig";

type Props = {
  complete: (
    prompt: string,
    options?: RequestOptions | undefined
  ) => Promise<string | null | undefined>;
};

export default function NotesConfig({ complete }: Props) {
  const [open, setOpen] = useState<boolean>(false);

  async function handleSave(text: string) {
    setOpen(false);
    complete(text)
  }

  const searchParams = useSearchParams();
  const isNew = new Boolean(searchParams.get("new")).valueOf();

  useEffect(() => {
    if (isNew) setOpen(true);
  }, [isNew]);

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
            Generate your notes by uploading a file, pasting text, or uploading a link to a website.
          </DialogDescription>
        </DialogHeader>
        <SourceConfig
          onContinue={handleSave}
          open={open}
        />
      </DialogContent>
    </Dialog>
  );
}
