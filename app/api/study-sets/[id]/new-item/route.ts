import { getAuthSession } from "@/lib/auth";
import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getAuthSession()

  const { answer, question } = await req.json() as { answer?: string, question?: string }

  if (!session) return NextResponse.json({ error: "Unauthorized request", status: 401 })
  if (!answer || !question) return NextResponse.json({ error: "Invalid request, incorrect payload", status: 400 })

  const updatedStudySet = await prisma.studySet.update({
    where: {
      userId: session.user.id,
      id: params.id
    },
    data: {
      items: {
        create: {
          answer,
          question
        }
      }
    },
    include: {
      items: true
    }
  })

  return NextResponse.json(updatedStudySet)
}