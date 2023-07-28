import { getAuthSession } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getAuthSession();
  const { searchParams } = new URL(req.url);

  if (session || searchParams.get("secret") == process.env.NEXTAUTH_SECRET) {
    const notes = await prisma.notes.findUnique({
      where: {
        id: params.id,
      },
    });
    return NextResponse.json(notes);
  } else {
    return NextResponse.json({ error: "Unauthorized request", status: 401 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getAuthSession();

  const { content, title } = (await req.json()) as {
    content: string;
    title: string;
  };

  if (!session)
    return NextResponse.json({ error: "Unauthorized request", status: 401 });
  if (!title)
    return NextResponse.json({ error: "Invalid request", status: 400 });

  const updatedNotes = await prisma.notes.update({
    where: {
      id: params.id,
      userId: session.user.id,
    },
    data: {
      title:
        (title.length == 0 || title == "Untitled Notes") && content.length > 100
          ? content.substring(0, content.indexOf("\n")).replace("#", "").trim()
          : title,
      content: content,
    },
  });
  return NextResponse.json(updatedNotes);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getAuthSession();

  console.log(params.id);

  if (session) {
    const deletedNotes = await prisma.notes.delete({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    });
    return NextResponse.json(deletedNotes);
  } else {
    return NextResponse.json({ error: "Unauthorized request", status: 401 });
  }
}
