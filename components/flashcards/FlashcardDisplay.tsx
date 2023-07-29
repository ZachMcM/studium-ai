"use client";

import { SetItem } from "@prisma/client";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { useEffect, useState } from "react";
import ReactCardFlip from "react-card-flip";
import { Volume2 } from "lucide-react";

export default function FlashcardDisplay({
  flashcard,
  index,
}: {
  flashcard: SetItem;
  index: number;
}) {
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const synth = window.speechSynthesis;

  useEffect(() => {
    setIsFlipped(false);
  }, [index]);

  function readContent() {
    const utterThis = new SpeechSynthesisUtterance(
      isFlipped ? flashcard.answer : flashcard.question
    );
    synth.speak(utterThis);
  }

  return (
    <div className="relative">
      <ReactCardFlip isFlipped={isFlipped} flipDirection={"horizontal"}>
        <Card className="relative flex-1 w-full p-6 h-[200px]">
          <CardContent className="pt-6">
            <div className="space-y-1">
              <p className="font-medium text-muted-foreground text-sm">
                Question:
              </p>
              <p className="font-semibold overflow-auto">
                {flashcard.question}
              </p>
            </div>
          </CardContent>
          <button
            className="cursor-pointer absolute inset-0"
            onClick={() => setIsFlipped(!isFlipped)}
          />
          <button
            className="absolute top-0 right-0 m-6 z-10 text-muted-foreground hover:text-white duration-500"
            onClick={readContent}
          >
            {" "}
            <Volume2 className="h-5 w-5" />
          </button>
        </Card>
        <Card className="relative flex-1 w-full p-6 h-[200px]">
          <CardContent className="pt-6">
            <div className="space-y-1">
              <p className="font-medium text-muted-foreground text-sm">
                Answer:
              </p>
              <p className="font-semibold overflow-auto">{flashcard.answer}</p>
            </div>
          </CardContent>
          <button
            className="cursor-pointer absolute inset-0"
            onClick={() => setIsFlipped(!isFlipped)}
          />
          <button
            className="absolute top-0 right-0 m-6 z-10 text-muted-foreground hover:text-white duration-500"
            onClick={readContent}
          >
            {" "}
            <Volume2 className="h-5 w-5" />
          </button>
        </Card>
      </ReactCardFlip>
    </div>
  );
}
