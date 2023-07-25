import { getAuthSession } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";

export async function GET() {
  const session = await getAuthSession()

  if (session) {
    const notes = await prisma.notes.findMany({
      where: {
        userId: session.user.id
      }
    })
    return NextResponse.json(notes)
  } else {
    return NextResponse.json({ error: "Unauthorized Request", status: 400 })
  }
}

export async function POST(req: NextRequest) {
  const session = await getAuthSession()

  const { title, content }: { title?: string, content?: string } = await req.json()


  if (!session) return NextResponse.json({ error: "Unauthorized request", status: 400 })
  if (!title || !content) return NextResponse.json({ error: "Invalid request", status: 400 })

  if (session && title && content) {
    // TODO
    const newNotes = await prisma.notes.create({
      data: {
        userId: session.user.id,
        title: title,
        content: content
      }
    })

    return NextResponse.json(newNotes)
  } 
}
