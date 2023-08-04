import { getAuthSession } from "@/lib/auth";
import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const session = await getAuthSession()

 const { title, description, source } = await req.json() as { title?: string, description?: string, source?: string}

  if (!title || !description || !source) return NextResponse.json({ error: "Invalid request, incorrect payload", status: 400 })
  if (!session) return NextResponse.json({ error: "Unauthroized request", status: 401 })

  const newTutor = await prisma.tutor.create({
    data: {
      title,  
      description,
      source,
      userId: session.user.id,
    }
  })

  return NextResponse.json(newTutor)
}

export async function GET(req: NextRequest) {
  const session = await getAuthSession()
  if (!session) return NextResponse.json({ error: "Unauthroized request", status: 401 })

  const tutors = await prisma.tutor.findMany({
    where: {
      userId: session.user.id
    }
  })

  return NextResponse.json(tutors)
}