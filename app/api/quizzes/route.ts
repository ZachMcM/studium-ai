import { QuizGeneration, schema } from "@/config/schemas/quiz";
import { getAuthSession } from "@/lib/auth";
import { openai } from "@/lib/openai";
import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { ResponseTypes } from "openai-edge";

export async function GET(req: NextRequest) {
  const session = await getAuthSession();

  if (!session)
    return NextResponse.json({ error: "Unauthorized Request", status: 401 });

  const userQuizes = await prisma.quiz.findMany({
    where: {
      userId: session.user.id,
    },
  });

  return NextResponse.json(userQuizes);
}

export async function POST(req: NextRequest) {
  const { title, description, num, source } = (await req.json()) as {
    title?: string;
    description?: string;
    num?: number;
    source?: string;
  };
  const session = await getAuthSession();

  if (!session)
    return NextResponse.json({ error: "Unauthorized Request", status: 401 });
  if (!title || !description || !num || !source)
    return NextResponse.json({
      error: "Invalid request, incorrect payload",
      status: 400,
    });

  const aiQuestonGeneration = await generate(source, num);
  const generatedQuizQuestions = aiQuestonGeneration.questions.map(
    (question) => {


      return {
        userId: session.user.id,
        question: question.question,
        possibleAnswers: question.possibleAnswers,
        correctAnswer: question.correctAnswer,
      };
    }
  );

  for (let i = 0; i < generatedQuizQuestions.length; i++) {
    const curr = generatedQuizQuestions[i]
    for (let i = curr.possibleAnswers.length - 1; i > 0; i--) {
      let randomIndex = Math.floor(Math.random() * (i + 1));
      let temp = curr.possibleAnswers[randomIndex];

      curr.possibleAnswers[randomIndex] = curr.possibleAnswers[i];
      curr.possibleAnswers[i] = temp;
    }
  }

  const newQuiz = await prisma.quiz.create({
    data: {
      userId: session.user.id,
      title,
      description,
      questions: {
        createMany: {
          data: generatedQuizQuestions,
        },
      },
    },
  });

  return NextResponse.json(newQuiz);
}

async function generate(
  source: string,
  numQuestions: number
): Promise<QuizGeneration> {
  const response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo-16k",
    messages: [
      {
        role: "system",
        content: `You area a quiz generation AI. when given a source, create a quiz of only ${numQuestions} questions based on that source. There are 5 possible answer choices. Make sure the correct answer isn't the same number for each question. If the source has insufficient data, use your own information and training data to create the quiz.`,
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
  const json = JSON.parse(data.choices[0].message?.function_call?.arguments!);
  return json;
}
