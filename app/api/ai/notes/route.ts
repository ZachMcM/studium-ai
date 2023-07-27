import { notesPrompt } from "@/config/prompts";
import { getAuthSession } from "@/lib/auth";
import { openai } from "@/lib/openai";
import { OpenAIStream, StreamingTextResponse } from "ai";
import { NextRequest, NextResponse } from "next/server";
import { ChatCompletionRequestMessage } from "openai-edge";

function buildPrompt(prompt: string): ChatCompletionRequestMessage[] {
  return prompt.split("\n").map((message) => ({
    role: "user",
    content: message,
  }));
}

export async function POST(req: NextRequest) {
  const { prompt } = await req.json();

  const structuredPrompt = `${notesPrompt} ${prompt}`;

  const session = await getAuthSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized request", status: 401 });
  } else {
    const response = await openai.createChatCompletion({
      model: "gpt-4",
      stream: true,
      messages: buildPrompt(structuredPrompt),
    });

    const stream = OpenAIStream(response);

    return new StreamingTextResponse(stream);
  }
}
