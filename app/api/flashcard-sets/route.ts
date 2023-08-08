import { FlashcardGeneration, schema } from "@/config/schemas/flashcard-set";
import { getAuthSession } from "@/lib/auth";
import { openai } from "@/lib/openai";
import prisma from "@/prisma/client";
import { Flashcard } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { ResponseTypes } from "openai-edge";

export async function GET(req: NextRequest) {
  const session = await getAuthSession();
  if (session) {
    const flashcardSets = await prisma.flashcardSet.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        flashcards: {
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });
    return NextResponse.json(flashcardSets);
  } else {
    return NextResponse.json({ error: "Unauthorized request", status: 401 });
  }
}

export async function POST(req: NextRequest) {
  const { source, num, title, description } = (await req.json()) as {
    source?: string;
    num?: number;
    title?: string;
    description?: string;
  };

  const session = await getAuthSession();
  if (!session)
    return NextResponse.json({ error: "Unauthorized Request", status: 401 });
  if (!source || !num || !title || !description)
    return NextResponse.json({
      error: "Invalid request, incorrect paylod",
      status: 400,
    });

  const aiCardsGeneration = await generate(source, num);
  const generatedSet = aiCardsGeneration.flashcards.map(
    (flashcard) => {
      return {
        userId: session.user.id,
        answer: flashcard.answer,
        question: flashcard.question,
      };
    }
  );

  const newFlashcardSet = await prisma.flashcardSet.create({
    data: {
      title,
      description,
      userId: session.user.id,
      flashcards: {
        createMany: {
          data: generatedSet,
        },
      },
    },
  });

  return NextResponse.json(newFlashcardSet);
}

async function generate(
  source: string,
  numCards: number
): Promise<FlashcardGeneration> {
  const response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo-16k",
    messages: [
      {
        role: "system",
        content: `You area a flashcard set generation AI. when given a source, create a flashcard set of only ${numCards} cards based on that source. If the source has insufficient data, use your own information and training data to create the flashcards.`,
      },
      {
        role: "user",
        content: source,
      },
    ],
    functions: [
      {
        name: "flashcard_set",
        parameters: schema,
      },
    ],
    function_call: {
      name: "flashcard_set",
    },
    temperature: 1,
  });

  const data = (await response.json()) as ResponseTypes["createChatCompletion"];
  const json = JSON.parse(data.choices[0].message?.function_call?.arguments!)
  console.log(json)
  console.log(json.flashcards)
  return json;
}
