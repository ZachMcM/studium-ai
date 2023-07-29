"use client";
import { useEffect, useState } from "react";
import FlashcardDisplay from "./FlashcardDisplay";
import { ExtendedStudySet } from "@/types/prisma";
import { Button } from "../ui/button";
import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { SetItem } from "@prisma/client";

export default function FlashcardCarousel({ set }: { set: ExtendedStudySet }) {
  let setCards = set.items;

  const [index, setIndex] = useState<number>(0);
  const [currCard, setCurrCard] = useState<SetItem>(setCards[0]);

  function nextCard() {
    if (index + 1 == setCards.length) {
      setIndex(0);
    } else {
      setIndex(index + 1)
    }
  }

  function prevCard() {
    if (index - 1 >= 0) {
      setIndex(index - 1);
    }
  }

  useEffect(() => {
    console.log(index, setCards.length)
    setCurrCard(setCards[index])
  }, [index])

  return (
    <div className="w-full flex flex-col space-y-2">
      <FlashcardDisplay index={index} flashcard={currCard} />
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon" onClick={prevCard}>
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button variant="outline" size="icon" onClick={nextCard}>
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
        <p className="text-muted-foreground font-medium">
          {index + 1} / {setCards.length}
        </p>
      </div>
    </div>
  );
}
