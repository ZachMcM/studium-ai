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
    <div className="fixed bottom-0 inset-x-0 p-4 bg-background border-t shadow-sm">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-2 max-w-xl mx-auto border rounded-lg p-4 ring-offset-background focus-within:ring-2 ring-offset-2 ring-ring"
      >
        <textarea
          ref={textAreaRef}
          className="resize-none overflow-hidden min-h-[32px] bg-background text-sm font-medium focus:outline-none"
          onChange={handleInputChange}
          placeholder="Send a message..."
        />
        <div className="self-end">
          <Button type="submit" disabled={isLoading}>
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
