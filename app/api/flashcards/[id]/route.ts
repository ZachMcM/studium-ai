import { getAuthSession } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";

export async function GET(req: NextRequest, { params }: { params: { id: string }}) {
  const session = await getAuthSession()
  const { searchParams } = new URL(req.url)

  if (session || searchParams.get("secret") == process.env.NEXTAUTH_SECRET) {
    const flashCardSet = await prisma.flashcardSet.findUnique({
      where: {
        userId: session?.user.id,
        id: params.id
      }
    })
    return NextResponse.json(flashCardSet)
  } else {
    return NextResponse.json({ error: "Unauthorized request", status: 401 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string }}) {
  const session = await getAuthSession()

  const { content, title } = await req.json()

  if (!session) return NextResponse.json({ error: "Unauthorized request", status: 401 })
  if (!title) return NextResponse.json({ error: "Invalid request", status: 400 })

  // TODO
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string }}) {
  const session = await getAuthSession()

  console.log(params.id)

  if (session) {
    const deletedNotes = await prisma.flashcardSet.delete({
      where: {
        id: params.id,
        userId: session.user.id
      }
    })
    return NextResponse.json(deletedNotes)
  } else {
    return NextResponse.json({ error: "Unauthorized request", status: 401 })
  }
}