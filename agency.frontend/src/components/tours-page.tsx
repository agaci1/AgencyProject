"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Navigation } from "@/components/navigation"
import { BookingForm } from "@/components/booking-form"
import { fetchTours } from "@/lib/api"
import { ArrowLeft, Star, Users, MapPin, Clock } from "lucide-react"

interface Tour {
  id: number
  title: string
  description: string
  price: number
  departureTime: string
  location: string
  rating: number
  image: string
  maxGuests: number
  highlights?: string[]
  routeDescription?: string
  startLocationLink?: string
}

interface ToursPageProps {
  onBackToHome: () => void
  onOpenAbout: () => void
}

export function ToursPage({ onBackToHome, onOpenAbout }: ToursPageProps) {
  const [tours, setTours] = useState<Tour[]>([])
  const [selectedTour, setSelectedTour] = useState<Tour | null>(null)
  const [showAllTours, setShowAllTours] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => window.scrollTo(0, 0), [])

  useEffect(() => {
    setLoading(true)
    setError(null)
    fetchTours()
      .then((data) => {
        setTours(data)
        setLoading(false)
      })
      .catch((err) => {
        console.error("Failed to fetch tours:", err)
        setError("Failed to load tours. Please try again later.")
        setLoading(false)
      })
  }, [])

  const displayedTours = showAllTours ? tours : tours.slice(0, 4)

  if (selectedTour) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-100 via-blue-100 to-pink-100">
        <Navigation onNavigate={(p) => (p === "home" ? onBackToHome() : p === "about" && onOpenAbout())} />

        <div className="max-w-7xl mx-auto px-4 py-8">
          <Button variant="ghost" onClick={() => setSelectedTour(null)} className="mb-4 flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" /> Back to Tours
          </Button>

          <BookingForm
            tour={{ ...selectedTour, highlights: selectedTour.highlights ?? [] }}
            onComplete={() => {
              setSelectedTour(null)
              // Success notification will be handled by the booking form
            }}
            onCancel={() => setSelectedTour(null)}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 via-blue-100 to-pink-100">
      <Navigation onNavigate={(p) => (p === "home" ? onBackToHome() : p === "about" && onOpenAbout())} />

      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto flex items-center gap-4 mb-8">
          <Button variant="ghost" onClick={onBackToHome} className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" /> Back to Home
          </Button>
        </div>
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-blue-900 mb-4">Available Tours</h1>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto font-playfair">
            Choose from our carefully crafted tours and embark on an unforgettable journey through the Albanian Alps.
          </p>
        </div>
      </section>

      <section className="pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          {loading && (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading tours...</p>
            </div>
          )}
          
          {error && (
            <div className="text-center py-12">
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
                <p className="text-red-800 font-medium mb-2">Error Loading Tours</p>
                <p className="text-red-600 text-sm mb-4">{error}</p>
                <Button onClick={() => window.location.reload()} variant="outline">
                  Try Again
                </Button>
              </div>
            </div>
          )}
          
          {!loading && !error && (
            <div className="grid md:grid-cols-2 gap-8">
              {displayedTours.map((tour) => (
                <Card key={tour.id} className="flex flex-col h-full overflow-hidden bg-white/70 backdrop-blur rounded-2xl shadow-lg hover:shadow-2xl transition-shadow">
                  <div className="relative">
                    <img src={tour.image || "/placeholder.svg"} alt={tour.title} className="w-full h-48 object-cover" />
                    <Badge className="absolute top-4 left-4 bg-white/80 text-gray-900 backdrop-blur">
                      {tour.departureTime}
                    </Badge>
                    <div className="absolute top-4 right-4 bg-white/80 backdrop-blur rounded-full px-2 py-1 flex items-center gap-1">
                      <Star className="h-3 w-3 text-yellow-500" />
                      <span className="text-xs font-medium">{tour.rating}</span>
                    </div>
                  </div>

                  <CardHeader className="flex-grow">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <CardTitle className="text-xl mb-2 text-blue-900">{tour.title}</CardTitle>
                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                          <MapPin className="h-4 w-4" /> {tour.location}
                          <Clock className="h-4 w-4 ml-2" /> {tour.departureTime}
                        </div>
                      </div>
                      <div className="text-right ml-4">
                        <div className="text-2xl font-bold text-emerald-600">
                          €{tour.price}
                        </div>
                        <div className="text-xs text-gray-500 font-playfair">per person</div>
                      </div>
                    </div>

                    <CardDescription className="mb-4 text-gray-700">{tour.description}</CardDescription>

                    {tour.routeDescription && (
                      <p className="text-sm text-gray-600 mb-2 font-playfair"><strong>Route:</strong> {tour.routeDescription}</p>
                    )}

                    {tour.startLocationLink && (
                      <a href={tour.startLocationLink} target="_blank" rel="noopener noreferrer" className="text-sm text-emerald-600 underline mb-4 inline-block">
                        📍 View Start Point on Map
                      </a>
                    )}

                    {tour.highlights?.length && (
                      <div className="mb-4">
                        <h4 className="font-semibold mb-2">Highlights:</h4>
                        <div className="flex flex-wrap gap-2">
                          {tour.highlights.slice(0, 3).map((hl, i) => (
                            <Badge key={i} variant="secondary" className="text-xs bg-emerald-50 text-emerald-700">
                              {hl}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                      <Users className="h-4 w-4" /> Max {tour.maxGuests} guests
                    </div>
                  </CardHeader>

                  <CardContent className="pt-0 mt-auto">
                    <div className="space-y-4">
                      <div className="text-sm text-gray-700 bg-gray-50 rounded px-3 py-3 text-center font-playfair">
                        <span className="font-medium">Flexible booking:</span> Choose your own departure and return dates
                      </div>

                      <Button className="w-full h-12 text-base font-medium bg-emerald-600 hover:bg-emerald-700 rounded-full shadow-md hover:shadow-lg transition" onClick={() => setSelectedTour(tour)}>
                        Book Now
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {!showAllTours && !loading && !error && (
            <div className="text-center mt-12">
              <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white px-12 py-4 text-lg rounded-full shadow-lg hover:shadow-xl transition" onClick={() => setShowAllTours(true)}>
                View All Available Tours
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
