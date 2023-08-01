import { AlertDialog } from "@radix-ui/react-alert-dialog";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { ExternalLink, Forward, MoreVertical, Trash2 } from "lucide-react";
import { AlertDialogTrigger } from "../ui/alert-dialog";
import DeleteDialog from "./DeleteDialog";
import { useAbsoluteUrl } from "@/lib/absolute-url";
import { share } from "@/lib/share";

export default function ListCard({
  title,
  description,
  deleteFunction,
  isDeleting,
  link,
  itemType,
}: {
  title: string;
  description?: string;
  deleteFunction: () => void;
  isDeleting: boolean;
  link: string;
  itemType: "Quiz" | "Flashcards" | "Chatbot" | "Tutor";
}) {
  const shareData = {
    title: `Check out these ${itemType.toLowerCase()} on Study AI!`,
    text: `${title}: ${description}`,
    url: useAbsoluteUrl(),
  };

  return (
    <div className="flex items-center justify-between border-b last:border-none py-6 px-8">
      <div className="space-y-0.5">
        <Link href={link} className="text-xl hover:underline font-semibold">
          {title || "Untitled" + itemType}
        </Link>
        <p className="text-muted-foreground font-medium text-sm">
          {description}
        </p>
      </div>
      <AlertDialog>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <Link href={link}>
              <DropdownMenuItem>
                <ExternalLink className="h-4 w-4 mr-2" />
                Open
              </DropdownMenuItem>
            </Link>
            {/* TODO */}
            <DropdownMenuItem onClick={() => share(shareData)}>
              <Forward className="h-4 w-4 mr-2" />
              Share
            </DropdownMenuItem>
            <AlertDialogTrigger asChild>
              <DropdownMenuItem className="!text-destructive">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </AlertDialogTrigger>
          </DropdownMenuContent>
        </DropdownMenu>
        <DeleteDialog deleteFunction={deleteFunction} isDeleting={isDeleting} />
      </AlertDialog>
    </div>
  );
}
