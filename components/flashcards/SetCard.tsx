"use client";

import { Flashcard } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card } from "../ui/card";
import CardMore from "./CardMore";
import { Separator } from "../ui/separator";

export default function SetCard({ flashcard }: { flashcard: Flashcard }) {
  const router = useRouter();

  const { data: session } = useSession();

  return (
    <Card className="p-6 flex items-center space-x-10 justify-between">
      <div className="flex flex-col space-y-4">
        <p className="text-muted-foreground font-medium">
          {flashcard.question}
        </p>
        <Separator/>
        <p className="font-semibold">{flashcard.answer}</p>
      </div>
      {flashcard.userId == session?.user.id && (
        <div className="self-end md:self-center shrink-0">
          <CardMore flashcard={flashcard}/>
        </div>
      )}
    </Card>
  );
}
