import axios from "axios"

const api = axios.create({
  baseURL: "https://agencyproject-production-dbfc.up.railway.app",
  timeout: 10000, // 10 second timeout
  headers: {
    "Content-Type": "application/json",
  },
})

// Add request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`)
    return config
  },
  (error) => {
    console.error("API Request Error:", error)
    return Promise.reject(error)
  }
)

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    console.error("API Response Error:", error.response?.data || error.message)
    return Promise.reject(error)
  }
)

export async function fetchTours() {
  const response = await api.get("/tours")
  return response.data
}

export default api
