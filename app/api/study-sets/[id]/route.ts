import { getAuthSession } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";

export async function GET(req: NextRequest, { params }: { params: { id: string }}) {
  const session = await getAuthSession()
  const { searchParams } = new URL(req.url)

  if (session || searchParams.get("secret") == process.env.NEXTAUTH_SECRET) {
    const studySet = await prisma.studySet.findUnique({
      where: {
        id: params.id
      },
      include: {
        items: true
      }
    })
    return NextResponse.json(studySet)
  } else {
    return NextResponse.json({ error: "Unauthorized request", status: 401 })
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string }}) {
  const session = await getAuthSession()
  const { title } = await req.json() as { title?: string }

  if (!session) return NextResponse.json({ error: "Unauthorized Request", status: 401 })
  if (!title) return NextResponse.json({ error: "Invalid request, incorrect paylod", status: 400 })

  const updatedSet = await prisma.studySet.update({
    where: {
      id: params.id,
      userId: session.user.id
    },
    data: {
      title: title
    }
  })

  return NextResponse.json(updatedSet)
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string }}) {
  const session = await getAuthSession()

  if (session) {
    const deletedSet = await prisma.studySet.delete({
      where: {
        id: params.id,
        userId: session.user.id
      }
    })
    return NextResponse.json(deletedSet)
  } else {
    return NextResponse.json({ error: "Unauthorized request", status: 401 })
  }
}