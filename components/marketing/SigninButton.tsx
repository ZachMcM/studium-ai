"use client";

import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { Button } from "../ui/button";

export default function SigninButton() {
  const { data: session } = useSession();

  return (
    <>
      {session ? (
        <Link href="/dashboard">
          <Button variant="secondary" size="sm">Dashboard</Button>
        </Link>
      ) : (
        <Button variant="secondary" size="sm" onClick={() => signIn()}>Sign In</Button>
      )}
    </>
  );
}
