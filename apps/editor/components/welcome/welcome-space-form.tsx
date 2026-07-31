'use client'

import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Loader2 } from 'lucide-react'
import { useAuth } from '@/lib/auth-client'
import { cn } from '@/lib/utils'

/** Matches Golden Papers / IAteneo welcome field chrome. */
const FIELD_CLASS =
  'h-11 w-full rounded-md border border-border bg-black px-3 text-sm text-white shadow-none outline-none placeholder:text-white/35 focus-visible:border-primary/50'

const PENDING_CREATE_SPACE_NAME_KEY = 'abstra_pending_create_space_name'

const EMPTY_GRAPH = {
  nodes: {},
  rootNodeIds: [],
} as const

function storePendingCreateSpaceName(name: string): void {
  try {
    sessionStorage.setItem(PENDING_CREATE_SPACE_NAME_KEY, name.trim())
  } catch {
    // ignore
  }
}

function takePendingCreateSpaceName(): string | null {
  try {
    const value = sessionStorage.getItem(PENDING_CREATE_SPACE_NAME_KEY)?.trim() ?? ''
    sessionStorage.removeItem(PENDING_CREATE_SPACE_NAME_KEY)
    return value || null
  } catch {
    return null
  }
}

function clearPendingCreateSpaceName(): void {
  try {
    sessionStorage.removeItem(PENDING_CREATE_SPACE_NAME_KEY)
  } catch {
    // ignore
  }
}

type WelcomeSpaceFormProps = {
  className?: string
}

/**
 * Create / open form for the welcome Space tab — same structure as
 * Golden Papers document form and IAteneo session join form, including
 * sign-in-then-create when the user is signed out.
 */
export function WelcomeSpaceForm({ className }: WelcomeSpaceFormProps) {
  const router = useRouter()
  const { user, loading: authLoading, signInWithGoogle } = useAuth()
  const [spaceName, setSpaceName] = useState('')
  const [openSpaceId, setOpenSpaceId] = useState('')
  const [isCreating, setIsCreating] = useState(false)
  const [isOpening, setIsOpening] = useState(false)
  const [isSigningIn, setIsSigningIn] = useState(false)
  const [error, setError] = useState('')
  const autoResumeCreateRef = useRef(false)

  const isBusy = isCreating || isOpening || isSigningIn
  const isSignedIn = Boolean(user)

  const createSpace = useCallback(
    async (name: string) => {
      const response = await fetch('/api/scenes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, graph: EMPTY_GRAPH }),
      })
      if (!response.ok) {
        throw new Error(`Failed to create space (${response.status})`)
      }
      const meta = (await response.json()) as { id?: string }
      if (!meta.id) {
        throw new Error('Could not create space.')
      }
      clearPendingCreateSpaceName()
      router.push(`/studio/${meta.id}`)
    },
    [router],
  )

  const handleCreate = useCallback(
    async (spaceNameOverride?: string) => {
      if (authLoading || isBusy) return
      const name = (spaceNameOverride ?? spaceName).trim()
      if (!name) {
        setError('Enter a space name first.')
        return
      }

      setSpaceName(name)
      setError('')

      if (!user) {
        setIsSigningIn(true)
        storePendingCreateSpaceName(name)
        try {
          await signInWithGoogle()
          // Redirect-based OAuth navigates away; pending name resumes on return.
        } catch (err) {
          clearPendingCreateSpaceName()
          setError(err instanceof Error ? err.message : 'Sign-in failed.')
          setIsSigningIn(false)
        }
        return
      }

      setIsCreating(true)
      try {
        await createSpace(name)
      } catch (err) {
        clearPendingCreateSpaceName()
        setError(err instanceof Error ? err.message : 'Failed to create space.')
        setIsCreating(false)
      }
    },
    [authLoading, isBusy, spaceName, user, signInWithGoogle, createSpace],
  )

  useEffect(() => {
    if (authLoading || !user || isBusy || autoResumeCreateRef.current) return
    const pendingName = takePendingCreateSpaceName()
    if (!pendingName) return
    autoResumeCreateRef.current = true
    setSpaceName(pendingName)
    void handleCreate(pendingName)
  }, [authLoading, user, isBusy, handleCreate])

  const handleOpenExisting = async () => {
    if (isBusy) return
    const id = openSpaceId.trim()
    if (!id) {
      setError('Enter a space ID first.')
      return
    }

    setIsOpening(true)
    setError('')

    try {
      const response = await fetch(`/api/scenes/${encodeURIComponent(id)}`, {
        cache: 'no-store',
      })
      if (response.status === 404) {
        setError('No space found with that ID.')
        setIsOpening(false)
        return
      }
      if (!response.ok) {
        throw new Error(`Failed to open space (${response.status})`)
      }
      router.push(`/studio/${encodeURIComponent(id)}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to open space.')
      setIsOpening(false)
    }
  }

  return (
    <div className={cn('flex flex-col gap-3', className)}>
      {isBusy && !isSigningIn ? (
        <div className="flex flex-col items-center gap-4 py-6">
          <Loader2 className="size-8 animate-spin text-white/50" aria-hidden />
          <p className="text-sm text-white/60">
            {isOpening ? 'Opening space…' : 'Creating space…'}
          </p>
        </div>
      ) : (
        <>
          <div>
            <label
              htmlFor="space-name"
              className="mb-1.5 block text-xs font-medium text-muted-foreground"
            >
              Space name
            </label>
            <input
              id="space-name"
              value={spaceName}
              onChange={(e) => setSpaceName(e.target.value)}
              placeholder="e.g. Conceptual topography of climate models"
              className={FIELD_CLASS}
              disabled={isBusy}
              onKeyDown={(e) => {
                if (e.key === 'Enter') void handleCreate()
              }}
            />
          </div>

          <button
            type="button"
            onClick={() => void handleCreate()}
            disabled={isBusy || authLoading || !spaceName.trim()}
            className="btn-brand-primary flex w-full items-center justify-center gap-2 rounded-lg py-3 text-sm font-light tracking-wide disabled:opacity-50"
          >
            {isSigningIn ? (
              <>
                <Loader2 className="size-4 animate-spin" aria-hidden />
                Signing in…
              </>
            ) : authLoading ? (
              'Checking sign-in…'
            ) : isSignedIn ? (
              'Create a new space'
            ) : (
              'Sign in and create space'
            )}
          </button>

          <div className="relative py-2">
            <span className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </span>
            <span className="relative flex justify-center text-xs text-muted-foreground">or</span>
          </div>

          <div>
            <label
              htmlFor="open-space-id"
              className="mb-1.5 block text-xs font-medium text-muted-foreground"
            >
              Open existing space
            </label>
            <div className="flex gap-2">
              <input
                id="open-space-id"
                value={openSpaceId}
                onChange={(e) => {
                  setOpenSpaceId(e.target.value)
                  setError('')
                }}
                placeholder="Space ID"
                className={cn(FIELD_CLASS, 'flex-1 font-mono tracking-wide')}
                disabled={isBusy}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') void handleOpenExisting()
                }}
              />
              <button
                type="button"
                onClick={() => void handleOpenExisting()}
                disabled={isBusy || !openSpaceId.trim()}
                className="btn-brand-primary h-11 shrink-0 rounded-lg px-4 text-sm font-light tracking-wide disabled:pointer-events-none disabled:opacity-50"
              >
                Enter
              </button>
            </div>
          </div>
        </>
      )}

      {error ? (
        <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-center text-xs whitespace-pre-line text-red-400/80">
          {error}
        </div>
      ) : null}
    </div>
  )
}
