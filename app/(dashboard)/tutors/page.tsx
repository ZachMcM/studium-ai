import TutorsList from "@/components/tutors/TutorsList";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Tutors | Study AI"
}

export default function TutorsPage() {
  return <TutorsList/>
}