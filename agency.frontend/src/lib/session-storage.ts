// Session storage utility functions
// This ensures consistent behavior across the app

export const SessionStorage = {
  // Save data to session storage
  set: (key: string, value: any) => {
    if (typeof window !== 'undefined') {
      try {
        sessionStorage.setItem(key, JSON.stringify(value))
      } catch (e) {
        console.error(`Failed to save ${key} to session storage:`, e)
      }
    }
  },

  // Get data from session storage
  get: (key: string, defaultValue: any = null) => {
    if (typeof window !== 'undefined') {
      try {
        const item = sessionStorage.getItem(key)
        return item ? JSON.parse(item) : defaultValue
      } catch (e) {
        console.error(`Failed to get ${key} from session storage:`, e)
        return defaultValue
      }
    }
    return defaultValue
  },

  // Remove data from session storage
  remove: (key: string) => {
    if (typeof window !== 'undefined') {
      try {
        sessionStorage.removeItem(key)
      } catch (e) {
        console.error(`Failed to remove ${key} from session storage:`, e)
      }
    }
  },

  // Clear all session storage
  clear: () => {
    if (typeof window !== 'undefined') {
      try {
        sessionStorage.clear()
      } catch (e) {
        console.error('Failed to clear session storage:', e)
      }
    }
  }
}

// Session storage keys used across the app
export const SESSION_KEYS = {
  CURRENT_PAGE: 'currentPage',
  BOOKING_STEP: 'booking_step',
  BOOKING_DATA: 'booking_data',
  SELECTED_TOUR: 'selected_tour'
} as const 