import { Prisma } from "@prisma/client";

export type ExtendedQuiz = Prisma.QuizGetPayload<{
  include: {
    questions: true,
  }
}>

export type ExtendedFlashCardSet = Prisma.FlashcardSetGetPayload<{
  include: {
    cards: true
  }
}>