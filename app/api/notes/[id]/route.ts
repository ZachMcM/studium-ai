import { getAuthSession } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";

export async function GET(req: NextRequest, { params }: { params: { id: string }}) {
  const session = await getAuthSession()

  if (session) {
    const notes = await prisma.notes.findUnique({
      where: {
        id: params.id
      }
    })
    return NextResponse.json(notes)
  } else {
    return NextResponse.json({ error: "Unauthorized request", status: 400 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string }}) {
  const session = await getAuthSession()

  const { content, title } = await req.json()

  if (!session) return NextResponse.json({ error: "Unauthorized request", status: 400 })
  if (!title) return NextResponse.json({ error: "Invalid request", status: 400 })

  const updatedNotes = await prisma.notes.update({
    where: {
      id: params.id
    },
    data: {
      title: title,
      content: content
    }
  })
  return NextResponse.json(updatedNotes)
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string }}) {
  const session = await getAuthSession()

  console.log(params.id)

  if (session) {
    const deletedNotes = await prisma.notes.delete({
      where: {
        id: params.id,
        userId: session.user.id
      }
    })
    return NextResponse.json(deletedNotes)
  } else {
    return NextResponse.json({ error: "Unauthorized request", status: 400 })
  }
}