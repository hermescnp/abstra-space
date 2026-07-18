'use client'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@pascal-app/editor'
import { useViewer } from '@pascal-app/viewer'
import { ClipboardCheck, Download, Eye, Share2 } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Tooltip, TooltipContent, TooltipTrigger } from './toolbar-tooltip'

const EXPORT_OPTIONS = [
  { format: 'glb', label: 'Export GLB' },
  { format: 'stl', label: 'Export STL' },
  { format: 'obj', label: 'Export OBJ' },
] as const

export function ShareMenu() {
  const [open, setOpen] = useState(false)
  const exportScene = useViewer((state) => state.exportScene)

  return (
    <DropdownMenu onOpenChange={setOpen} open={open}>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="inline-flex">
            <DropdownMenuTrigger asChild>
              <button
                aria-label="Share"
                className={cn(
                  'group flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-all duration-200',
                  open
                    ? 'bg-accent text-primary shadow-sm'
                    : 'text-muted-foreground hover:bg-accent/50 hover:text-primary',
                )}
                type="button"
              >
                <Share2 className="h-6 w-6" />
              </button>
            </DropdownMenuTrigger>
          </span>
        </TooltipTrigger>
        <TooltipContent side="bottom">Share</TooltipContent>
      </Tooltip>

      <DropdownMenuContent align="end">
        <DropdownMenuItem className="flex items-center gap-2" disabled>
          <ClipboardCheck className="h-4 w-4" />
          Reviewer
        </DropdownMenuItem>
        <DropdownMenuItem className="flex items-center gap-2" disabled>
          <Eye className="h-4 w-4" />
          Scene Viewer
        </DropdownMenuItem>
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
