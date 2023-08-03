import { AlertDialog } from "@radix-ui/react-alert-dialog";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { ExternalLink, Forward, MoreHorizontal, Trash2 } from "lucide-react";
import { AlertDialogTrigger } from "../ui/alert-dialog";
import DeleteDialog from "./DeleteDialog";
import { useAbsoluteUrl } from "@/lib/absolute-url";
import { share } from "@/lib/share";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import Image from "next/image";
import { Avatar, AvatarImage } from "../ui/avatar";
import { daysAgo } from "@/lib/days-ago";

export default function ListCard({
  title,
  description,
  image,
  deleteFunction,
  isDeleting,
  link,
  itemType,
  date,
}: {
  title: string;
  description?: string;
  image?: string;
  deleteFunction: () => void;
  isDeleting: boolean;
  link: string;
  itemType: "Quiz" | "Flashcards" | "Chatbot" | "Tutor";
  date: Date;
}) {
  const shareData = {
    title: `Check out these ${itemType.toLowerCase()} on Study AI!`,
    text: `${title}: ${description}`,
    url: useAbsoluteUrl(),
  };

  return (
    <Card className="relative flex flex-col justify-between group hover:border-primary duration-300">
      <CardHeader>
        <div className="flex items-start justify-between space-x-4">
          <div className="flex items-center space-x-4">
            {image && (
              <Avatar>
                <AvatarImage src={image} />
              </Avatar>
            )}
            <div className="">
              <CardTitle>
                {" "}
                <Link
                  href={link}
                  className="text-xl hover:underline font-semibold"
                >
                  {title || "Untitled" + itemType}
                </Link>
              </CardTitle>
              <CardDescription>{description}</CardDescription>
            </div>
          </div>
          <AlertDialog>
            <DropdownMenu>
              <DropdownMenuTrigger asChild className="shrink-0">
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
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
            <DeleteDialog
              deleteFunction={deleteFunction}
              isDeleting={isDeleting}
            />
          </AlertDialog>
        </div>
      </CardHeader>
      <CardFooter>
        <time className="text-xs text-muted-foreground">{daysAgo(date)}</time>
      </CardFooter>
      <div className="opacity-0 group-hover:opacity-100 duration-300 absolute -top-4 -right-4">
        <Link href={link}><Button className="rounded-full h-9 w-9" size="icon"><ExternalLink className="h-4 w-4"/></Button></Link>
      </div>
    </Card>
  );
}
