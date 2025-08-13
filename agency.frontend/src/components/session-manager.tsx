"use client"

import { useEffect } from 'react'

// Session storage keys that should be cleared when user leaves
const SESSION_KEYS = [
  'currentPage',
  'booking_step',
  'booking_data', 
  'selected_tour'
]

export function SessionManager() {
  useEffect(() => {
    const clearSessionData = () => {
      try {
        SESSION_KEYS.forEach(key => {
          sessionStorage.removeItem(key)
        })
        console.log('Session data cleared')
      } catch (e) {
        console.error('Failed to clear session data:', e)
      }
    }

    // Clear session data when user closes the tab/window
    const handleBeforeUnload = () => {
      clearSessionData()
    }

    // Clear session data when user navigates away (tab becomes hidden)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        // Only clear if user is actually leaving (not just switching tabs)
        // We'll use a small delay to detect if they're coming back
        setTimeout(() => {
          if (document.visibilityState === 'hidden') {
            clearSessionData()
          }
        }, 1000)
      }
    }

    // Clear session data when user navigates to a different domain
    const handlePageHide = () => {
      clearSessionData()
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('beforeunload', handleBeforeUnload)
      document.addEventListener('visibilitychange', handleVisibilityChange)
      window.addEventListener('pagehide', handlePageHide)

      return () => {
        window.removeEventListener('beforeunload', handleBeforeUnload)
        document.removeEventListener('visibilitychange', handleVisibilityChange)
        window.removeEventListener('pagehide', handlePageHide)
      }
    }
  }, [])

  // This component doesn't render anything
  return null
} 