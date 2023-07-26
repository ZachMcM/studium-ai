"use client";

import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { Button } from "./ui/button";

export default function NavAuth() {
  const { data: session } = useSession();

  return (
    <>
      {session ? (
        <Link href="/dashboard/notes">
          <Button variant="secondary">Dashboard</Button>
        </Link>
      ) : (
        <Button variant="secondary" onClick={() => signIn()}>Sign In</Button>
      )}
    </>
  );
}
