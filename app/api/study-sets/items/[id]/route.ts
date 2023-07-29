import { getAuthSession } from "@/lib/auth";
import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest, { params}: { params: { id: string }}) {
  const session = await getAuthSession()

  const { answer, question } = await req.json() as { answer?: string, question?: string }

  if (!session) return NextResponse.json({ error: "Unauthorized request", status: 401 })
  if (!answer || !question) return NextResponse.json({ error: "Invalid request, incorrect payload", status: 400 })

  const item = await prisma.setItem.findUnique({
    where: {
      id: params.id,
    }
  })

  const itemsSet = await prisma.studySet.findUnique({
    where: {
      id: item?.setId,
      userId: session.user.id
    }
  })

  if (!itemsSet) return NextResponse.json({ error: "Unauthorized request", status: 401 })

  const updatedItem = await prisma.setItem.update({
    where: {
      id: params.id
    },
    data: {
      answer,
      question
    }
  })

  return NextResponse.json(updatedItem)
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string }}) {
  const session = await getAuthSession()

  if (!session) return NextResponse.json({ error: "Unauthorized request", status: 401 })

  const item = await prisma.setItem.findUnique({
    where: {
      id: params.id,
    }
  })

  const itemsSet = await prisma.studySet.findUnique({
    where: {
      id: item?.setId,
      userId: session.user.id
    }
  })

  if (!itemsSet) return NextResponse.json({ error: "Unauthorized request", status: 401 })

  const deletedSetItem = await prisma.setItem.delete({
    where: {
      id: params.id,
    }
  })

  return NextResponse.json(deletedSetItem)
}