import { getAuthSession } from "@/lib/auth";
import { openai } from "@/lib/openai";
import { NextRequest, NextResponse } from "next/server";
import pdf from 'pdf-parse'


export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file") as File | null | undefined;
  const session = await getAuthSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized request", status: 401 });
  }

  if (!file) {
    return NextResponse.json({
      error: "Invalid request, no form data",
      status: 400,
    });
  }

  if (file.type == "text/plain") {
    const fileText = await file.text();
    return NextResponse.json(fileText);
  }

  if (file.type == "application/pdf") {
    const arrayBuffer = await file.arrayBuffer()
    const fileBuffer = Buffer.from(arrayBuffer)
    const fileData = await pdf(fileBuffer)
    return NextResponse.json(fileData.text)
  }

  if (file.type.includes("audio/") || file.type.includes("video/")) {
    const response = await openai.createTranscription(file, "whisper-1");
    return NextResponse.json(response);
  }
}
