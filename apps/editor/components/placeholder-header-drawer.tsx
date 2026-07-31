'use client'

import type { LucideIcon } from 'lucide-react'
import { X } from 'lucide-react'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { cn } from '@/lib/utils'
import { Tooltip, TooltipContent, TooltipTrigger } from './toolbar-tooltip'

type PlaceholderHeaderDrawerProps = {
  label: string
  /** Lucide icon shown in the drawer header. */
  icon: LucideIcon
  /** Illustrated PNG for the trigger button (Golden Papers header style). */
  iconSrc?: string
  /** Render the trigger as a round avatar button instead of an icon tile. */
  avatarSrc?: string
  /**
   * Golden Papers studio account trigger: 40×40 rounded-xl dark tile with
   * Lucide user icon (signed-out look).
   */
  variant?: 'default' | 'account'
}

export function PlaceholderHeaderDrawer({
  label,
  icon: Icon,
  iconSrc,
  avatarSrc,
  variant = 'default',
}: PlaceholderHeaderDrawerProps) {
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!open) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }

    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open])

  useEffect(() => {
    if (!open) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [open])

  const trigger =
    variant === 'account' ? (
      <button
        aria-expanded={open}
        aria-label={label}
        aria-pressed={open}
        className={cn(
          'relative flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-xl',
          'border-[0.5px] border-[#416679] bg-[#0A1727] text-white transition-all duration-200',
          'hover:scale-105 hover:border-[#68DBFF] hover:bg-black/20',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#68DBFF]/45',
          'active:scale-95',
          open && 'border-[#68DBFF]',
        )}
        onClick={() => setOpen((current) => !current)}
        title="Account"
        type="button"
      >
        <Icon aria-hidden className="size-5" strokeWidth={1.5} />
      </button>
    ) : avatarSrc ? (
      <button
        aria-expanded={open}
        aria-label={label}
        aria-pressed={open}
        className={cn(
          'relative flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border bg-muted',
          'ring-offset-background transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        )}
        onClick={() => setOpen((current) => !current)}
        type="button"
      >
        <Image
          alt=""
          aria-hidden
          className="h-full w-full object-cover object-[center_20%]"
          height={32}
          src={avatarSrc}
          unoptimized
          width={32}
        />
      </button>
    ) : (
      <button
        aria-expanded={open}
        aria-label={label}
        aria-pressed={open}
        className={cn(
          'group flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-all duration-200',
          '[&_img]:transition-[opacity,filter] [&_img]:duration-200',
          open
            ? 'bg-accent text-foreground shadow-sm [&_img]:opacity-100 [&_img]:grayscale-0'
            : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground [&_img]:opacity-60 [&_img]:grayscale hover:[&_img]:opacity-100 hover:[&_img]:grayscale-0',
        )}
        onClick={() => setOpen((current) => !current)}
        type="button"
      >
        {iconSrc ? (
          <Image
            alt=""
            aria-hidden
            className="h-8 w-8 object-contain"
            height={32}
            src={iconSrc}
            unoptimized
            width={32}
          />
        ) : (
          <Icon className="h-6 w-6" />
        )}
      </button>
    )

  return (
    <>
      <Tooltip>
        <TooltipTrigger asChild>{trigger}</TooltipTrigger>
        <TooltipContent side="bottom">{label}</TooltipContent>
      </Tooltip>

      {mounted && open
        ? createPortal(
            <div
              className="fixed top-14 right-0 bottom-0 left-0 z-40 flex"
              role="presentation"
            >
              <button
                aria-label={`Close ${label.toLowerCase()} panel`}
                className="absolute inset-0 bg-background/45 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
                onClick={() => setOpen(false)}
                type="button"
              />

              <aside
                aria-label={label}
                aria-modal="true"
                className="relative ml-auto flex h-full w-full max-w-[420px] flex-col border-border border-l bg-background shadow-2xl animate-in slide-in-from-right duration-300"
                role="dialog"
              >
                <div className="flex shrink-0 items-center justify-between gap-2 border-border border-b px-4 py-3">
                  <div className="flex min-w-0 items-center gap-2">
                    <Icon className="h-5 w-5 shrink-0 text-muted-foreground" />
                    <h2 className="truncate font-semibold text-sm">{label}</h2>
                  </div>
                  <button
                    aria-label="Close"
                    className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                    onClick={() => setOpen(false)}
                    type="button"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div className="min-h-0 flex-1" />
              </aside>
            </div>,
            document.body,
          )
        : null}
    </>
  )
}
