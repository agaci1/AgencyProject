import axios from "axios"

const api = axios.create({
  baseURL: "http://localhost:8080", // Keep this if backend runs locally
  // baseURL: "https://your-deployed-backend-url", ← only if deployed backend
})

export default api
