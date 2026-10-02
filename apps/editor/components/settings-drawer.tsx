'use client'

import { SettingsPanel, type SettingsPanelProps } from '@pascal-app/editor'
import { X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { cn } from '@/lib/utils'
import { SettingsGlyph } from './header-glyphs'
import { Tooltip, TooltipContent, TooltipTrigger } from './toolbar-tooltip'

const HEADER_HEIGHT_CLASS = 'top-14'

type SettingsDrawerProps = SettingsPanelProps

/**
 * Golden Papers Document-panel shell: header trigger + right drawer for Settings.
 */
export function SettingsDrawer(props: SettingsDrawerProps) {
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

  const closePanel = () => setOpen(false)

  return (
    <>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            aria-expanded={open}
            aria-label="Settings"
            aria-pressed={open}
            className={cn(
              'group flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-all duration-200',
              open
                ? 'bg-accent text-foreground shadow-sm'
                : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground',
            )}
            onClick={() => setOpen((current) => !current)}
            type="button"
          >
            <SettingsGlyph />
          </button>
        </TooltipTrigger>
        <TooltipContent side="bottom">Settings</TooltipContent>
      </Tooltip>

      {mounted && open
        ? createPortal(
            <div
              className={`fixed ${HEADER_HEIGHT_CLASS} right-0 bottom-0 left-0 z-40 flex`}
              role="presentation"
            >
              <button
                aria-label="Close settings panel"
                className="absolute inset-0 bg-background/45 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
                onClick={closePanel}
                type="button"
              />

              <aside
                aria-label="Settings"
                aria-modal="true"
                className="relative ml-auto flex h-full w-full max-w-[420px] flex-col border-border border-l bg-background shadow-2xl animate-in slide-in-from-right duration-300"
                role="dialog"
              >
                <div className="flex shrink-0 items-center justify-between gap-2 border-border border-b px-4 py-3">
                  <div className="flex min-w-0 items-center gap-2">
                    <SettingsGlyph className="h-5 w-5 shrink-0 text-muted-foreground" />
                    <h2 className="truncate font-semibold text-sm">Settings</h2>
                  </div>
                  <button
                    aria-label="Close"
                    className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                    onClick={closePanel}
                    type="button"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div className="min-h-0 flex-1 overflow-y-auto">
                  <SettingsPanel {...props} />
                </div>
              </aside>
            </div>,
            document.body,
          )
        : null}
    </>
  )
}
