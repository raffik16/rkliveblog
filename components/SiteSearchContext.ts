'use client'

import { createContext, useContext } from 'react'

// Kept apart from components/SiteSearch.tsx, which provides it, so editing the search in
// development hot-reloads it without making a second context the buttons can't see.

export interface SiteSearchApi {
  /** Opens the dialog with the field focused */
  open: () => void
  /** Starts loading the post index, so it's ready by the time the dialog opens */
  preload: () => void
}

export const SiteSearchContext = createContext<SiteSearchApi | null>(null)

export function useSiteSearch() {
  const api = useContext(SiteSearchContext)
  if (!api) throw new Error('useSiteSearch() needs <SiteSearch> above it')
  return api
}
