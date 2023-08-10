import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Copy, File, FileText, Globe, MessagesSquare } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import { SiOpenai } from "react-icons/si";
import { v4 as uuidv4 } from "uuid";

export const metadata: Metadata = {
  title: "Home | Study AI",
};

const cards = [
  {
    icon: <SiOpenai className="h-8 w-8" />,
    title: "OpenAI",
    description:
      "We use OpenAI's latest LLMs to provide the most accurate and performant generations.",
  },
  {
    icon: <MessagesSquare className="h-8 w-8" />,
    title: "AI Tutor Chatbots",
    description: "AI tutors that you can talk to about any subject.",
  },
  {
    icon: <Copy className="h-8 w-8" />,
    title: "Flashcards",
    description: "AI flashcard set generation. Full UI to study on the go.",
  },
  {
    icon: <FileText className="h-8 w-8" />,
    title: "Quizzes",
    description: "AI multiple quiz quiz generation.",
  },
  {
    icon: <File className="h-8 w-8" />,
    title: "Upload Files",
    description:
      "File handling. Give the AI a txt of pdf to generate an item of choice.",
  },
  {
    icon: <Globe className="h-8 w-8" />,
    title: "Paste Links",
    description:
      "Link handling. Give the AI a link to generate an item of choice.",
  },
];

const faq = [
  {
    question: "What are the limits?",
    answer:
      "We currently allow up to 5 quiz, 5 AI tutor, and 5 flashcard set generations per month on our hobby plan.",
  },
  {
    question: "Who are we?",
    answer: (
      <>
        I am{" "}
        <a
          href="https://twitter.com/dzachmcm"
          className="text-primary underline"
        >
          Zach McMullen
        </a>
        . An entrepreneur and current freshmen studying CS at Purdue University.
      </>
    ),
  },
  {
    question: "How does it work?",
    answer:
      "Behind the scenes we use OpenAI's API. This ensures that your generations are accurate and fast.",
  },
  {
    question: "How can I get in touch",
    answer: (
      <>
        We have a{" "}
        <a href="" className="text-primary underline">
          discord
        </a>{" "}
        where users can interact with each other, provide feedback and
        suggestions, and get the latest news.
      </>
    ),
  },
];

export default function Home() {
  return (
    <div className="flex flex-col">
      <main className="p-10 flex-1 mx-auto max-w-4xl md:max-w-6xl flex flex-col space-y-52 pt-24">
        <div className="flex flex-col space-y-4 items-center text-center">
          <div className="rounded-full border text-xs font-medium px-6 py-1.5">
            v1.0.0 Live Now
          </div>
          <h1 className="font-extrabold text-4xl lg:text-5xl xl:text-6xl tracking-tight">
            Helping Students Study Better Using AI
          </h1>
          <p className="leading-normal text-muted-foreground sm:text-xl sm:leading-8 font-medium max-w-[42rem]">
            We harnesses the power of artificial intelligence to revolutionize
            the way students study and excel in their academic pursuits.
          </p>
          <div className="flex items-center gap-3">
            <Link href="/dashboard">
              <Button className="p-6 text-base">Get Started</Button>
            </Link>{" "}
            <Link href="/signup">
              <Button variant="outline" className="p-6 text-base">
                Sign Up
              </Button>
            </Link>
          </div>
        </div>
        <div className="flex flex-col space-y-8 items-center">
          <div className="space-y-4 text-center">
            <h1 className="font-extrabold text-4xl lg:text-5xl xl:text-6xl tracking-tight">
              Features
            </h1>
            <p className="leading-normal text-muted-foreground sm:text-xl sm:leading-8 font-medium max-w-[42rem]">
              Study AI includes many different features like file uploading, and
              link pasting, and flashcard set generation to help students study
              efficiently.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {cards.map((card) => (
              <Card key={uuidv4()}>
                <CardHeader>
                  <div className="pb-4">{card.icon}</div>
                  <CardTitle>{card.title}</CardTitle>
                  <CardDescription>{card.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <h3 className="font-semibold text-center text-xl md:text-3xl">FAQ</h3>
          <div className="flex flex-col space-y-8 items-center">
            <Accordion type="single" collapsible className="w-full">
              {faq.map(({ question, answer }, i) => (
                <AccordionItem value={`item=${i}`}>
                  <AccordionTrigger>{question}</AccordionTrigger>
                  <AccordionContent>{answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </main>
    </div>
  );
}
