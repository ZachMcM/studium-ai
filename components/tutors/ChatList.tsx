import { Message } from "ai/react";
import { ChatMessage } from "./ChatMessage";
import { useEffect, useRef } from "react";

export function ChatList({ messages }: { messages: Message[] }) {


  return (
    <div className="flex flex-1 flex-col">
      {messages.map((message) => {
        if (message.role == "assistant" || "user") {
          return <ChatMessage message={message} key={message.id} />;
        }
      })}
    </div>
  );
}
