import { AuthButton } from "@/components/AuthButton";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Sign Up | Studium AI",
  description: "Create a Studium AI account",
};

export default function SignIn() {
  return (
    <main className="flex flex-col space-y-6 max-w-sm items-center text-center">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold">Create an account</h1>
        <p className="text-sm text-muted-foreground">
          By continuing, you are setting up a Studium AI account and agree to
          our User Agreement and Privacy Policy.
        </p>
      </div>
      <AuthButton />
      <p className="text-sm text-muted-foreground">
        Already with Studium AI?{" "}
        <Link className="underline" href="/signin">
          Sign In
        </Link>
      </p>
    </main>
  );
}
