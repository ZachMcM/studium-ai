import { Prisma } from "@prisma/client";

export type ExtendedStudySet = Prisma.StudySetGetPayload<{
  include: {
    items: true
  }
}>