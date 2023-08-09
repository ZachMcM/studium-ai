import { getAuthSession } from "@/lib/auth";
import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const session = await getAuthSession()

  if (!session) return NextResponse.json({ error: "Unauthenticated request", status: 401 })

  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id
    },
    include: {
      quizAttempts: {
        include: {
          quiz: true
        },
        take: 3
      },
      flashcardSets: {
        take: 3
      },
      tutors: {
        take: 3
      },
    }
  })

  return NextResponse.json(user)
}