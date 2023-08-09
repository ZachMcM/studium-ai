import { useInView } from "react-intersection-observer"
import { useAtBottom } from "@/lib/hooks/use-at-bottom"
import { useEffect } from "react"
import { Message } from "ai"

export function ChatScrollAnchor({ trackVisibility, messages }: { trackVisibility: boolean, messages: Message[] }) {
  const isAtBottom = useAtBottom()
  const { ref, entry, inView } = useInView({
    trackVisibility,
    delay: 100,
    rootMargin: '0px 0px -150px 0px'
  })

  useEffect(() => {
    if (isAtBottom && trackVisibility && !inView) {
      entry?.target.scrollIntoView({
        block: 'start'
      })
    }
  }, [inView, entry, isAtBottom, trackVisibility])


  useEffect(() => {
    entry?.target?.scrollIntoView({
      behavior: "auto",
      block: "start",
    });
  }, [messages.length, messages[messages.length - 1]?.content.length]);

  return <div ref={ref} className="h-px w-full" />
}