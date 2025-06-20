"use client"

import { useEffect, useState } from "react"
import api from "@/lib/api"

interface Tour {
  id: number
  title: string
  location: string
  price: number
}

export default function Page() {
  const [tours, setTours] = useState<Tour[]>([])

  useEffect(() => {
    api.get("/tours") // backend should respond to GET /tours
      .then(res => setTours(res.data))
      .catch(err => console.error("Failed to fetch tours:", err))
  }, [])

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Available Tours</h1>
      <ul className="space-y-4">
        {tours.map(tour => (
          <li key={tour.id} className="p-4 border rounded">
            <h2 className="text-lg font-semibold">{tour.title}</h2>
            <p>{tour.location}</p>
            <p>${tour.price}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}
