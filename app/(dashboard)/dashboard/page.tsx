import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChevronRight,
  FileText,
  MessagesSquare,
  SquareStack,
} from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  return (
      <main className="flex-1 px-4 py-10 md:py-16 max-w-5xl xl:max-w-6xl mx-auto flex flex-col space-y-10">
        <div className="flex items-center">
          <h1 className="text-4xl lg:text-5xl font-extrabold">
            Welcome!
          </h1>
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
                  <SquareStack className="h-5 w-5 mr-2" />
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
          <Link href="/tutors" className="hover:opacity-70 duration-500">
            <Card className="flex justify-between items-center h-full">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessagesSquare className="h-5 w-5 mr-2" />
                  AI Tutors
                </CardTitle>
                <CardDescription>
                  View, create, edit, and deleted AI tutors!
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
