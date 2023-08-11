import { getAuthSession } from "@/lib/auth";
import prisma from "@/prisma/client";
import { Session } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const session = await getAuthSession();

  if (!session)
    return NextResponse.json({ error: "Unauthorized Request", status: 401 });

  const limit = await prisma.limit.findUnique({
    where: {
      userId: session.user.id,
    },
  });

  if (!limit) {
    await prisma.limit.create({
      data: {
        userId: session.user.id,
        count: 0,
        unlimited: false,
      },
    });

    return NextResponse.json(false);
  }

  if (limit.unlimited) return NextResponse.json(false);

  if (limit.count >= 25) return NextResponse.json(true);

  return NextResponse.json(false);
}