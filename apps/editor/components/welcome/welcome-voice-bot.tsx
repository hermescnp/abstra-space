'use client'

import { cn } from '@/lib/utils'
import { WelcomeBotface } from './welcome-botface'
import styles from './welcome-voice-bot.module.css'

/** The Resonance bot face shown in the welcome header; visual only for now. */
export function WelcomeVoiceBot({ className }: { className?: string }) {
  return (
    <div className={cn(styles.voiceBot, 'relative flex h-14 w-14 items-center justify-center rounded-full', className)} aria-hidden>
      <span className={cn(styles.voiceBotFace, 'relative h-full w-full rounded-full ring-4 ring-[#050508]')}>
        <WelcomeBotface />
      </span>
    </div>
  )
}
