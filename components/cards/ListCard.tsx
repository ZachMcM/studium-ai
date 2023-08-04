import Link from "next/link";
import { Button } from "../ui/button";
import { ExternalLink } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { daysAgo } from "@/lib/days-ago";

export function ListCard({
  title,
  description,
  link,
  itemType,
  date,
}: {
  title: string;
  description?: string;
  link: string;
  itemType: "Quiz" | "Flashcards" | "Chatbot" | "Tutor";
  date: Date;
}) {
  return (
    <Card className="relative flex flex-col justify-between group hover:border-primary duration-300">
      <CardHeader>
        <div className="flex flex-col">
          <CardTitle>
            <Link href={link} className="text-xl hover:underline font-semibold">
              {title || "Untitled" + itemType}
            </Link>
          </CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
      </CardHeader>
      <CardFooter>
        <time className="text-xs text-muted-foreground">{daysAgo(date)}</time>
      </CardFooter>
      <div className="opacity-0 group-hover:opacity-100 duration-300 absolute -top-4 -right-4">
        <Link href={link}>
          <Button className="rounded-full h-9 w-9" size="icon">
            <ExternalLink className="h-4 w-4" />
          </Button>
        </Link>
      </div>
      <Link href={link} className="absolute inset-0" />
    </Card>
  );
}
