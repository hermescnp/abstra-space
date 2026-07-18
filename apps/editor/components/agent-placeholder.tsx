'use client'

import Image from 'next/image'

/**
 * Placeholder for the Agent sidebar tab until a real scene Agent ships.
 */
export function AgentPlaceholder() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 p-6 text-center">
      <Image
        alt=""
        aria-hidden
        className="h-16 w-16 object-contain opacity-90"
        height={64}
        src="/icons/agent.png"
        unoptimized
        width={64}
      />
      <div className="space-y-1.5">
        <h2 className="font-semibold text-base text-foreground">Agent</h2>
        <p className="max-w-[240px] text-muted-foreground text-sm leading-relaxed">
          Scene Agent is coming soon. Use Scene and Models to build for now.
        </p>
      </div>
    </div>
  )
}
