"use client";

import { Message } from "ai";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { Check, Copy } from "lucide-react";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "../ui/tooltip";
import { useSession } from "next-auth/react";
import { Button } from "../ui/button";
import { MarkdownRenderer } from "../MarkdownRenderer";
import { useCopy } from "@/lib/hooks/use-copy";
import { SiOpenai } from "react-icons/si"

export function ChatMessage({
  message,
}: {
  message: Message;
}) {
  const { data: session } = useSession();

  const { copied, copyToClipboard } = useCopy(message.content)

  return (
    <div className="py-10 border-b flex items-start relative">
      <div className="flex items-start space-x-3">
        {
          message.role == "user" ? 
          <Avatar className="h-8 w-8 ">
          <AvatarImage
            src={session?.user.image!}
          />
          <AvatarFallback className="h-6 w-6 md:h-8 md:w-8 bg-secondary" />
        </Avatar> :
        <div className="w-8 h-8 bg-primary rounded-full flex justify-center items-center">
          <div className="h-4 w-4 text-background"><SiOpenai/></div>
        </div>
        }

        <MarkdownRenderer content={message.content} />
      </div>
      {message.role == "assistant" && (
        <div className="absolute top-4 right-0">
          {copied ? (
            <div className="h-7 w-7">
              <Check className="h-4 w-4" />
            </div>
          ) : (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    className="h-7 w-7"
                    size="icon"
                    variant="ghost"
                    onClick={() => copyToClipboard(message.content)}
                  >
                    {" "}
                    <Copy className="h-3 w-3" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Copy to clipboard</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      )}
    </div>
  );
}
