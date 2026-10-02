'use client'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@pascal-app/editor'
import { useViewer } from '@pascal-app/viewer'
import { Download } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { ExportGlyph } from './header-glyphs'
import { Tooltip, TooltipContent, TooltipTrigger } from './toolbar-tooltip'

const EXPORT_OPTIONS = [
  { format: 'glb', label: 'Export GLB' },
  { format: 'stl', label: 'Export STL' },
  { format: 'obj', label: 'Export OBJ' },
] as const

export function ExportMenu() {
  const [open, setOpen] = useState(false)
  const exportScene = useViewer((state) => state.exportScene)

  return (
    <DropdownMenu onOpenChange={setOpen} open={open}>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="inline-flex">
            <DropdownMenuTrigger asChild>
              <button
                aria-label="Export"
                className={cn(
                  'group flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-all duration-200',
                  open
                    ? 'bg-accent text-foreground shadow-sm'
                    : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground',
                )}
                type="button"
              >
                <ExportGlyph />
              </button>
            </DropdownMenuTrigger>
          </span>
        </TooltipTrigger>
        <TooltipContent side="bottom">Export</TooltipContent>
      </Tooltip>

      <DropdownMenuContent align="end">
        {EXPORT_OPTIONS.map(({ format, label }) => (
          <DropdownMenuItem
            className="flex items-center gap-2"
            disabled={!exportScene}
            key={format}
            onClick={() => void exportScene?.(format)}
          >
            <Download className="h-4 w-4" />
            {label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
