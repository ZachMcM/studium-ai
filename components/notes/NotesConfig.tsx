"use client";

import { Settings2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Notes } from "@prisma/client";

export default function NotesConfig({ notes }: { notes?: Notes }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          Configuration <Settings2 className="h-4 w-4 ml-2" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle></DialogTitle>
      </DialogContent>
    </Dialog>
  );
}
