import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Book, ChevronRight, FileText, GraduationCap, MessagesSquare } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Dashboard | Study AI",
  description: "Create and manage your AI generated notes",
};

export default function DashboardPage() {
  return (
    <main className="w-full flex flex-col space-y-10">
      <div className="flex items-center">
        <GraduationCap className="mr-4 h-14 w-14" />
        <h1 className="text-4xl lg:text-5xl font-extrabold">Welcome!</h1>
      </div>
      <div className="flex flex-col space-y-4 md:space-y-0 md:grid grid-cols-3 gap-4">
        <Link href="/quizes" className="hover:opacity-70 duration-500">
          <Card className="flex justify-between items-center h-full">
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Quizes
              </CardTitle>
              <CardDescription>
                View, create, edit, and delete AI generated quizes!
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChevronRight />
            </CardContent>
          </Card>
        </Link>
        <Link
          href="/flashcard-sets"
          className="hover:opacity-70 duration-500"
        >
          <Card className="flex justify-between items-center h-full">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Book className="h-5 w-5 mr-2" />
                Flashcards
              </CardTitle>
              <CardDescription>
                View, create, edit, and delete AI generated flashcard sets!
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChevronRight />
            </CardContent>
          </Card>
        </Link>
        <Link
          href="/chatbots"
          className="hover:opacity-70 duration-500"
        >
          <Card className="flex justify-between items-center h-full">
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessagesSquare className="h-5 w-5 mr-2" />
                Chat Bots
              </CardTitle>
              <CardDescription>
                View, create, edit, and deleted AI chat bots!
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChevronRight />
            </CardContent>
          </Card>
        </Link>
      </div>
    </main>
  );
}
