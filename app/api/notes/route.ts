import { getAuthSession } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";

export async function GET() {
  const session = await getAuthSession();

  if (session) {
    const notes = await prisma.notes.findMany({
      where: {
        userId: session.user.id,
      },
    });
    return NextResponse.json(notes);
  } else {
    return NextResponse.json({ error: "Unauthorized Request", status: 400 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getAuthSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized request", status: 400 });
  } else {
    // TODO
    const newNotes = await prisma.notes.create({
      data: {
        userId: session.user.id,
        title: "Untitled Notes",
        content: "",
      },
    });

    return NextResponse.json(newNotes);
  }
}
