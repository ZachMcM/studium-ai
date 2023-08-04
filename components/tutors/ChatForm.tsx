"use client";

import { useTextareaAutosize } from "@/lib/hooks/text-area-autosize";
import { UseChatHelpers } from "ai/react";
import { ArrowRightCircle, Loader2 } from "lucide-react";
import { useRef } from "react";
import { Button } from "../ui/button";

export function ChatForm({
  input,
  handleInputChange,
  handleSubmit,
  isLoading,
}: Pick<
  UseChatHelpers,
  "input" | "handleInputChange" | "handleSubmit" | "isLoading"
>) {
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);

  useTextareaAutosize(textAreaRef.current, input);

  return (
    <div className="fixed inset-x-0 bottom-0 p-4 bg-background border-t shadow-sm">
      <form
        onSubmit={handleSubmit}
        className="h-24 flex flex-col bg-background ring-offset-background placeholder:text-muted-foreground focus-within:outline-none focus-within:ring-2 ring-ring ring-offset-2 gap-2 max-w-2xl mx-auto p-4 rounded-lg shadow-sm border"
      >
        <textarea
          className="resize-none bg-transparent border-none overflow-hidden w-full focus:outline-none text-sm"
          value={input}
          ref={textAreaRef}
          onChange={handleInputChange}
          placeholder="Send a message..."
        />
        <div className="self-end">
          <Button type="submit" disabled={isLoading} size="sm">
            Send{" "}
            {isLoading ? (
              <Loader2 className="h-4 w-4 ml-2 animate-spin" />
            ) : (
              <ArrowRightCircle className="h-4 w-4 ml-2" />
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
