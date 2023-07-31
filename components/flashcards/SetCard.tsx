"use client";

import { Flashcard } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card } from "../ui/card";
import CardMore from "./CardMore";
import { DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { MoreVertical } from "lucide-react";

export default function SetCard({ flashcard }: { flashcard: Flashcard }) {
  const router = useRouter();

  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      router.push("/signin");
    },
  });

  return (
    <Card className="p-6 flex flex-col space-y-2 md:space-x-8 md:space-y-0 md:flex-row md:items-center">
      <p className="text-muted-foreground font-medium basis-1/6 shrink-0">
        {flashcard.question}
      </p>
      <p className="font-semibold">{flashcard.answer}</p>
      {flashcard.userId == session?.user.id && (
        <div className="self-end md:self-center">
          <CardMore flashcard={flashcard}/>
        </div>
      )}
    </Card>
  );
}
