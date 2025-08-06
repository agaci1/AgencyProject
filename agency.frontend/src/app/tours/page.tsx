"use client"

import { useEffect, useState } from "react"
import api from "@/lib/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin } from "lucide-react"

interface Tour {
  id: number
  title: string
  location: string
  price: number
}

export default function Page() {
  const [tours, setTours] = useState<Tour[]>([])

  useEffect(() => {
    api
      .get("/tours")
      .then(res => setTours(res.data))
      .catch(err => console.error("Failed to fetch tours:", err))
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 via-blue-100 to-pink-100 py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-12 text-blue-900">
          Available Tours
        </h1>
        <div className="grid gap-8 md:grid-cols-2">
          {tours.map(tour => (
            <Card
              key={tour.id}
              className="hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
            >
              <CardHeader className="pb-2">
                <CardTitle className="text-xl text-pink-800">{tour.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-gray-600 text-sm">
                  <MapPin className="h-4 w-4" />
                  {tour.location}
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 text-sm">Starting from</span>
                  <Badge className="text-lg px-4 py-1 bg-blue-600 text-white">€{tour.price}</Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
