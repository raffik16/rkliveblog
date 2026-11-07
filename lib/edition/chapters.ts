'use client'

import { useSyncExternalStore } from 'react'

// The page's chapters, as EdBackdrop finds them: every top-level [data-chapter] element, in
// document order, with data-chapter-label / -num / -color. EdBackdrop publishes the list and the
// active chapter here; EdRail renders them (except data-chapter-rail="off" ones). Progress through the active chapter is not stored
// (it changes every frame): EdBackdrop writes it to the --ed-progress custom property instead.
// Mirrors raffi.website's composables/useChapters.js.

export interface Chapter {
  id: string
  label: string
  num: string
  color: string
  /** false when the element has data-chapter-rail="off": it colours the backdrop only */
  rail: boolean
}

interface ChapterState {
  chapters: Chapter[]
  active: string | null
}

const EMPTY: ChapterState = { chapters: [], active: null }

let state: ChapterState = EMPTY
const listeners = new Set<() => void>()

function emit() {
  listeners.forEach((fn) => fn())
}

export function setChapters(chapters: Chapter[]) {
  state = { ...state, chapters }
  emit()
}

export function setActiveChapter(active: string | null) {
  if (state.active === active) return
  state = { ...state, active }
  emit()
}

function subscribe(fn: () => void) {
  listeners.add(fn)
  return () => {
    listeners.delete(fn)
  }
}

export function useChapters(): ChapterState {
  return useSyncExternalStore(
    subscribe,
    () => state,
    () => EMPTY
  )
}

/** Smooth-scroll to a chapter, leaving room for the fixed navbar. */
export function scrollToChapter(id: string) {
  const el = document.getElementById(id)
  if (!el) return
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const top = el.getBoundingClientRect().top + window.scrollY - 24
  window.scrollTo({ top, behavior: reduce ? 'auto' : 'smooth' })
  history.replaceState(null, '', `#${id}`)
}

// The navbar tucks away while scrolling down; the mobile progress strip follows it up.
let navHidden = false
const navListeners = new Set<() => void>()

export function setNavHidden(hidden: boolean) {
  if (navHidden === hidden) return
  navHidden = hidden
  navListeners.forEach((fn) => fn())
}

export function useNavHidden(): boolean {
  return useSyncExternalStore(
    (fn) => {
      navListeners.add(fn)
      return () => {
        navListeners.delete(fn)
      }
    },
    () => navHidden,
    () => false
  )
}
