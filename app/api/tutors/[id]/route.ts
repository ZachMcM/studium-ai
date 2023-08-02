import { getAuthSession } from "@/lib/auth";
import prisma from "@/prisma/client";
import { supabase } from "@/supabase/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getAuthSession()

  if (!session) return NextResponse.json({ error: "Unauthroized request", status: 401 })

  const tutor = await prisma.tutor.findUnique({
    where: {
      userId: session.user.id,
      id: params.id
    },
    include: {
      messages: {
        orderBy: {
          createdAt: "asc"
        }
      }
    }
  })

  return NextResponse.json(tutor)
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string }}) {
  const session = await getAuthSession()

  if (!session) return NextResponse.json({ error: "Unauthroized request", status: 401 })

  const deletedTutor = await prisma.tutor.delete({
    where: {
      id: params.id,
      userId: session.user.id
    }
  })

  return NextResponse.json(deletedTutor)
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getAuthSession()
  const formData = await req.formData()

  const title = formData.get("title") as string | undefined
  const description = formData.get("description") as string | undefined
  const imageFile = formData.get("image") as File | undefined
  let image: string | undefined

  if (!session) return NextResponse.json({ error: "Unauthroized request", status: 401 })

  if (imageFile) {
    const { data: uploadData, error: uploadError } = await supabase.storage.from("files").upload(`/${imageFile.name}`, imageFile)
    if (uploadError) return NextResponse.json(uploadError)
    image = supabase.storage.from("files").getPublicUrl(uploadData.path).data.publicUrl
  }

  const updatedTutor = await prisma.tutor.update({
    where: {
      userId: session?.user.id,
      id: params.id
    },
    data: {
      title,  
      image,
      description
    }
  })

  return NextResponse.json(updatedTutor)
}