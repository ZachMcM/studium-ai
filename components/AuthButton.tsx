"use client";

import { useSession, signIn } from "next-auth/react";
import { redirect } from "next/navigation";
import { Button } from "./ui/button";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { FaGoogle } from "react-icons/fa6"

export default function AuthButton() {
  const { data: session } = useSession();

  if (session) redirect("/dashboard/notes");

  const [isLoading, setIsLoading] = useState<boolean>(false);

  return (
    <Button onClick={() => {
      setIsLoading(true)
      signIn("google")
      setIsLoading(false)
    }} className="w-full">
      {isLoading ? (
        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
      ) : (
        <FaGoogle className="h-4 w-4 mr-2" />
      )}
      Continue With Google{" "}
    </Button>
  );
}
