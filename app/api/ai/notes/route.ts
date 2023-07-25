import { notesPrompt } from "@/config/prompts";
import { getAuthSession } from "@/lib/auth";
import { openai } from "@/lib/openai";
import { OpenAIStream, StreamingTextResponse } from "ai";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  const { content } = (await req.json()) as {
    content?: string;
  };

  const session = await getAuthSession();

  if (!content)
    return NextResponse.json({
      error: "Invalid request, no data source",
      status: 400,
    });
  if (!session)
    return NextResponse.json({ error: "Unauthorized request", status: 400 });

  if (session && content) {
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      stream: true,
      prompt: `${notesPrompt} Source: ${content}`,
    });

    const stream = OpenAIStream(response)

    return new StreamingTextResponse(stream)
  }
}