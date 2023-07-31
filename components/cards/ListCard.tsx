import { AlertDialog } from "@radix-ui/react-alert-dialog";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { Edit, Forward, MoreVertical, Trash2 } from "lucide-react";
import { AlertDialogTrigger } from "../ui/alert-dialog";
import DeleteDialog from "./DeleteDialog";

export default function ListCard({
  title,
  description,
  deleteFunction,
  isDeleting,
  link,
  createdAt,
  itemType,
}: {
  title: string;
  description?: string;
  deleteFunction: () => void;
  isDeleting: boolean;
  link: string;
  createdAt: string;
  itemType: "Quiz" | "Flashcards" | "Chatbot";
}) {
  return (
    <div className="flex items-center justify-between border-b last:border-none px-6 py-4">
      <div className="space-y-4">
        <div>
          <Link href={link} className="text-lg hover:underline font-semibold">
            {title || "Untitled" + itemType}
          </Link>
          <p className="text-muted-foreground font-medium text-sm">{description}</p>
        </div>
        <p className="text-muted-foreground font-medium text-xs">{createdAt}</p>
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
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </DropdownMenuItem>
            </Link>
            {/* TODO */}
            <DropdownMenuItem>
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
