import { getAuthSession } from "@/lib/auth";
import prisma from "@/prisma/client";
import { supabase } from "@/supabase/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const session = await getAuthSession()
  const formData = await req.formData()

  const title = formData.get("title") as string | null
  const description = formData.get("description") as string | null
  const imageFile = formData.get("image") as File | null
  const source = formData.get("source") as string | null

  if (!title || !description || !source) return NextResponse.json({ error: "Invalid request, incorrect payload", status: 400 })
  if (!session) return NextResponse.json({ error: "Unauthroized request", status: 401 })

  let image: string | undefined

  if (imageFile) {
    const { data: uploadData, error: uploadError } = await supabase.storage.from("files").upload(`/${imageFile.name}`, imageFile)
    if (uploadError) return NextResponse.json(uploadError)
    image = supabase.storage.from("files").getPublicUrl(uploadData.path).data.publicUrl
  }

  const newTutor = await prisma.tutor.create({
    data: {
      title,  
      description,
      image,
      source,
      userId: session.user.id,
    }
  })

  return NextResponse.json(newTutor)
}