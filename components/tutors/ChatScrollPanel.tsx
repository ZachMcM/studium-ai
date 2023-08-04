import { useInView } from "react-intersection-observer"
import { useAtBottom } from "@/lib/hooks/use-at-bottom"
import { useEffect } from "react"

export function ChatScrollAnchor({ trackVisibility }: { trackVisibility: boolean }) {
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

  return <div ref={ref} className="h-px w-full" />
}