import { Prisma } from "@prisma/client";

export type ExtendedQuiz = Prisma.QuizGetPayload<{
  include: {
    questions: true,
  }
}>