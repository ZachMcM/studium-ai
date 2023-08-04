'use client'

import { useInView } from 'react-intersection-observer'
import { useCallback, useEffect, useRef } from 'react'
import { useAtBottom } from '@/lib/hooks/use-at-bottom'

interface ChatScrollAnchorProps {
  trackVisibility?: boolean
}

export function ChatScrollAnchor({ trackVisibility }: ChatScrollAnchorProps) {
  const ref = useRef<HTMLDivElement | null>(null)

  const isAtBottom = useAtBottom()
  const { ref: inViewRef, entry, inView } = useInView({
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

  const setRefs = useCallback(
    (node: any) => {
      ref.current = node;
      inViewRef(node);
    },
    [inViewRef],
  );

  useEffect(() => {
    ref.current?.scrollIntoView({
      block: 'start',
      behavior: 'auto'
    })
  }, [])

  return <div ref={setRefs} className="h-px w-full" />
}