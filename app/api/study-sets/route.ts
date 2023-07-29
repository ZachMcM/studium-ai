import { StudySetResponse, schema } from "@/config/schemas/study-set";
import { getAuthSession } from "@/lib/auth";
import { openai } from "@/lib/openai";
import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { ResponseTypes } from "openai-edge";

export async function GET() {
  const session = await getAuthSession();
  if (session) {
    const studySets = await prisma.studySet.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        items: true,
      },
    });
    return NextResponse.json(studySets);
  } else {
    return NextResponse.json({ error: "Unauthorized request", status: 401 });
  }
}

export async function POST(req: NextRequest) {
  const { sourceText, numCards, title } = (await req.json()) as {
    sourceText?: string;
    numCards?: number;
    title?: string;
  };

  const session = await getAuthSession()
  if (!session) return NextResponse.json({ error: "Unauthorized Request", status: 401 })
  if (!sourceText || !numCards || !title) return NextResponse.json({ error: "Invalid request, incorrect paylod", status: 400 })

  const generatedSet = await createSet(sourceText, numCards)
  
  const newStudySet = await prisma.studySet.create({
    data: {
      title: title,
      userId: session.user.id,
      items: {
        createMany: {
          data: generatedSet.items
        }
      }
    }
  })

  return NextResponse.json(newStudySet)
}

async function createSet(sourceText: string, numCards: number): Promise<StudySetResponse> {
  const response = await openai.createChatCompletion({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: `You area a study set generation AI. when given a data source, create a study set of ${numCards} cards based on that data source.`,
      },
      {
        role: "user",
        content: sourceText,
      },
    ],
    functions: [
      {
        name: "study_set",
        parameters: schema,
      },
    ],
    function_call: {
      name: "study_set",
    },
  });

  const data = (await response.json()) as ResponseTypes["createChatCompletion"];
  console.log(data.choices[0].message?.function_call?.arguments)
  return JSON.parse(data.choices[0].message?.function_call?.arguments || "");
}
