'use client'

import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'

import {
  AgoraHeader,
  parseAgoraMainTabFromSearchParam,
  type AgoraMainTab,
} from '@/components/agora'
import { CreateSceneButton } from '@/components/save-button'
import type { SceneMeta } from '@/components/scene-loader'
import { cn } from '@/lib/utils'

import layoutStyles from './agora-layout.module.css'

const PLACEHOLDER_COPY: Record<Exclude<AgoraMainTab, 'spaces'>, { title: string; body: string }> = {
  pieces: {
    title: 'Pieces',
    body: 'Reusable pieces are coming soon.',
  },
  derived: {
    title: 'Derived',
    body: 'Derived views are coming soon.',
  },
  circles: {
    title: 'Circles',
    body: 'Circles are coming soon.',
  },
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleString()
  } catch {
    return iso
  }
}

function syncTabToUrl(tab: AgoraMainTab) {
  if (typeof window === 'undefined') return
  const url = new URL(window.location.href)
  if (tab === 'spaces') {
    url.searchParams.delete('tab')
  } else {
    url.searchParams.set('tab', tab)
  }
  window.history.replaceState(null, '', `${url.pathname}${url.search}${url.hash}`)
}

export function AgoraPageClient({ scenes }: { scenes: SceneMeta[] }) {
  const [mainTab, setMainTab] = useState<AgoraMainTab>('spaces')

  useEffect(() => {
    const fromUrl = parseAgoraMainTabFromSearchParam(
      new URLSearchParams(window.location.search).get('tab'),
    )
    if (fromUrl) setMainTab(fromUrl)
  }, [])

  const handleMainTabChange = useCallback((tab: AgoraMainTab) => {
    setMainTab(tab)
    syncTabToUrl(tab)
  }, [])

  return (
    <div className={cn(layoutStyles.brandField, layoutStyles.agoraRoot)} data-agora-scroll-root="">
      <AgoraHeader mainTab={mainTab} onMainTabChange={handleMainTabChange} />

      <div className={layoutStyles.agoraBody}>
        <div className="mx-auto w-full max-w-5xl px-6 pb-12">
          {mainTab === 'spaces' ? (
            <SpacesContent scenes={scenes} />
          ) : (
            <PlaceholderPanel tab={mainTab} />
          )}
        </div>
      </div>
    </div>
  )
}

function SpacesContent({ scenes }: { scenes: SceneMeta[] }) {
  return (
    <>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="mb-1 font-semibold text-2xl text-white">Spaces</h1>
          <p className="text-sm text-white/55">
            {scenes.length === 0
              ? 'No scenes yet. Create one to get started.'
              : `${scenes.length} scene${scenes.length === 1 ? '' : 's'}.`}
          </p>
        </div>
        <CreateSceneButton />
      </div>

      {scenes.length === 0 ? (
        <div className="rounded-xl border border-dashed border-white/15 bg-white/[0.03] p-12 text-center">
          <p className="text-sm text-white/55">You haven&apos;t saved any scenes yet.</p>
          <div className="mt-4 flex justify-center">
            <CreateSceneButton />
          </div>
        </div>
      ) : (
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {scenes.map((scene) => (
            <li key={scene.id}>
              <Link
                className="group block rounded-xl border border-white/10 bg-white/[0.03] p-4 transition-colors hover:border-white/22 hover:bg-white/[0.06]"
                href={`/studio/${scene.id}`}
              >
                <div className="flex aspect-video items-center justify-center overflow-hidden rounded-lg bg-white/[0.04]">
                  {scene.thumbnailUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      alt={scene.name}
                      className="h-full w-full object-cover"
                      src={scene.thumbnailUrl}
                    />
                  ) : (
                    <span className="text-xs text-white/40">No thumbnail</span>
                  )}
                </div>
                <div className="mt-3">
                  <h2 className="truncate font-semibold text-sm text-white">{scene.name}</h2>
                  <div className="mt-1 flex items-center justify-between text-xs text-white/45">
                    <span>{scene.nodeCount} nodes</span>
                    <time dateTime={scene.updatedAt}>{formatDate(scene.updatedAt)}</time>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  )
}

function PlaceholderPanel({ tab }: { tab: Exclude<AgoraMainTab, 'spaces'> }) {
  const copy = PLACEHOLDER_COPY[tab]
  return (
    <div className="rounded-xl border border-dashed border-white/15 bg-white/[0.03] px-8 py-16 text-center">
      <h1 className="mb-2 font-semibold text-2xl text-white">{copy.title}</h1>
      <p className="text-sm text-white/55">{copy.body}</p>
    </div>
  )
}
