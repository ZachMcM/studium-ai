import { Prisma } from "@prisma/client";

export type ExtendedFlashcardSet = Prisma.FlashcardSetGetPayload<{
  include: {
    flashcards: true
  }
}>