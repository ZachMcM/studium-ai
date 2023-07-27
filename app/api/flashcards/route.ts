import { getAuthSession } from "@/lib/auth";
import prisma from "@/prisma/client";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getAuthSession()
  if (session) {
    const flashcardSets = await prisma.flashcardSet.findMany({
      where: {
        userId: session.user.id
      },
      include: {
        cards: true
      }
    })
    return NextResponse.json(flashcardSets)
  } else {
    return NextResponse.json({ error: "Unauthorized request", status: 401 })
  }
}

export async function POST() {
  // TODO

  const session = await getAuthSession()

  if (!session) return NextResponse.json({ error: "Unauthorized request", status: 401 })
}