import { Message } from "ai/react";
import { ChatMessage } from "./ChatMessage";

export function ChatList({
  messages,
}: {
  messages: Message[];
}) {
  return (
    <div className="flex flex-col mx-auto max-w-3xl">
      {messages.map((message) => {
        if (message.role == "assistant" || "user") {
          return (
            <ChatMessage
              message={message}
              key={message.id}
            />
          );
        }
      })}
    </div>
  );
}
