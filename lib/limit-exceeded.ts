import prisma from "@/prisma/client";
import { Session } from "next-auth";

export async function limitExceeded(session: Session) {
  const limit = await prisma.limit.findUnique({
    where: {
      userId: session.user.id,
    },
  });

  if (!limit) {
    await prisma.limit.create({
      data: {
        userId: session.user.id,
        count: 1,
        unlimited: false,
      },
    });

    return false;
  }

  if (limit.unlimited) {
    await incrementLimit(session, limit.count);
    return false;
  }

  if (limit.count >= 50) {
    return true;
  }

  await incrementLimit(session, limit.count);
  return false;
}

async function incrementLimit(session: Session, prev: number) {
  await prisma.limit.update({
    where: {
      userId: session.user.id,
    },
    data: {
      count: prev + 1,
    },
  });
}
