import SetHeader from "@/components/study-sets/SetHeader";
import { getAuthSession } from "@/lib/auth";
import { StudySet } from "@prisma/client";
import { Metadata, ResolvingMetadata } from "next";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

type Props = {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
};
export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  // read route params
  const id = params.id;

  // fetch data
  const res = await fetch(
    `${process.env.NEXTAUTH_URL}/api/study-sets/${id}?secret=${process.env.NEXTAUTH_SECRET}`
  );
  const set = (await res.json()) as StudySet;

  // optionally access and extend (rather than replace) parent metadata

  return {
    title: `${set.title} | Study AI`,
  };
}

export default async function SetLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: { id: string };
}) {
  const session = await getAuthSession();
  if (!session) redirect("/signin");

  return (
    <div className="flex flex-col w-full">
      <SetHeader id={params.id} />
      <main className="p-6 md:py-16 w-full mx-auto max-w-4xl">{children}</main>
    </div>
  );
}
