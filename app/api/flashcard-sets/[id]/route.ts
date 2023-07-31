import { getAuthSession } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";

export async function GET(req: NextRequest, { params }: { params: { id: string }}) {
  const session = await getAuthSession()
  const { searchParams } = new URL(req.url)

  if (session || searchParams.get("secret") == process.env.NEXTAUTH_SECRET) {
    const flashcardSet = await prisma.flashcardSet.findUnique({
      where: {
        id: params.id
      },
      include: {
        flashcards: true
      }
    })
    return NextResponse.json(flashcardSet)
  } else {
    return NextResponse.json({ error: "Unauthorized request", status: 401 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string }}) {
  const session = await getAuthSession()

  if (session) {
    const deletedFlashcardSet = await prisma.flashcardSet.delete({
      where: {
        id: params.id,
        userId: session.user.id
      }
    })
    return NextResponse.json(deletedFlashcardSet)
  } else {
    return NextResponse.json({ error: "Unauthorized request", status: 401 })
  }
}