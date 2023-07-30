"use client"

import { ExtendedStudySet } from "@/types/prisma";
import { useQuery } from "react-query";

export default function SetQuiz({ params }: { params: { id: string }}) {
  const { data: set, isLoading: isSetLoading } = useQuery({
    queryFn: async (): Promise<ExtendedStudySet> => {
      const res = await fetch(`/api/study-set/${params.id}`);
      const data = await res.json();
      return data;
    },
    queryKey: ["sets", { id: params.id }],
  });

  return (
    
  )
}