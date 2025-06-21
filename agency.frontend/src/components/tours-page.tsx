"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Clock, Star, Users, ArrowLeft } from "lucide-react"
import { BookingForm } from "@/components/booking-form"
import { Navigation } from "@/components/navigation"

interface Tour {
  id: number
  title: string
  description: string
  price: number
  duration: string
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

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    fetch("http://localhost:8080/tours")
      .then((res) => res.json())
      .then(setTours)
      .catch((err) => console.error("Failed to fetch tours:", err))
  }, [])

  const handleTourSelect = (tour: Tour) => {
    setSelectedTour(tour)
  }

  const handleBookingComplete = () => {
    setSelectedTour(null)
    alert(
      "Booking completed successfully! You will receive a confirmation email shortly."
    )
  }

  const displayedTours = showAllTours ? tours : tours.slice(0, 4)

  // — PAYMENT FORM VIEW —
  if (selectedTour) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <Navigation
          onNavigate={(page) => {
            if (page === "home") onBackToHome()
            else if (page === "about") onOpenAbout()
          }}
        />

        <div className="container mx-auto px-4 py-8">
          <Button
            variant="ghost"
            onClick={() => setSelectedTour(null)}
            className="mb-4 flex items-center gap-2 text-blue-600 hover:text-blue-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Tours
          </Button>

          <BookingForm
            tour={{
              ...selectedTour,
              // ensure highlights is always defined
              highlights: selectedTour.highlights ?? [],
            }}
            onComplete={handleBookingComplete}
            onCancel={() => setSelectedTour(null)}
          />
        </div>
      </div>
    )
  }

  // — TOURS LIST VIEW —
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navigation
        onNavigate={(page) => {
          if (page === "home") onBackToHome()
          else if (page === "about") onOpenAbout()
        }}
      />

      <section className="py-12 px-4">
        <div className="container mx-auto flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            onClick={onBackToHome}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Button>
        </div>
        <div className="container mx-auto text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Available Tours
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choose from our carefully crafted tours and embark on an unforgettable journey through the Albanian Alps.
          </p>
        </div>
      </section>

      <section className="pb-16 px-4">
        <div className="container mx-auto grid md:grid-cols-2 gap-8">
          {displayedTours.map((tour) => (
            <Card
              key={tour.id}
              className="flex flex-col h-full overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="relative">
                <img
                  src={tour.image || "/placeholder.svg"}
                  alt={tour.title}
                  className="w-full h-48 object-cover"
                />
                <Badge className="absolute top-4 left-4 bg-white text-gray-900">
                  {tour.duration}
                </Badge>
                <div className="absolute top-4 right-4 bg-white rounded-full px-2 py-1 flex items-center gap-1">
                  <Star className="h-3 w-3 text-yellow-500" />
                  <span className="text-xs font-medium">{tour.rating}</span>
                </div>
              </div>

              <CardHeader className="flex-grow">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <CardTitle className="text-xl mb-2">{tour.title}</CardTitle>
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                      <MapPin className="h-4 w-4" />
                      <span>{tour.location}</span>
                      <Clock className="h-4 w-4 ml-2" />
                      <span>{tour.duration}</span>
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    <div className="text-2xl font-bold text-blue-600">
                      ${tour.price}
                    </div>
                    <div className="text-sm text-gray-500">per person</div>
                  </div>
                </div>

                <CardDescription className="mb-4">{tour.description}</CardDescription>

                {tour.routeDescription && (
                  <div className="text-sm text-gray-600 mb-2">
                    <strong>Route:</strong> {tour.routeDescription}
                  </div>
                )}

                {tour.startLocationLink && (
                  <div className="text-sm text-blue-600 underline mb-4">
                    <a
                      href={tour.startLocationLink}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      📍 View Start Point on Map
                    </a>
                  </div>
                )}

                {tour.highlights && (
                  <div className="mb-4">
                    <h4 className="font-semibold mb-2">Highlights:</h4>
                    <div className="flex flex-wrap gap-2">
                      {tour.highlights.slice(0, 3).map((hl, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">
                          {hl}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                  <Users className="h-4 w-4" />
                  <span>Max {tour.maxGuests} guests</span>
                </div>
              </CardHeader>

              <CardContent className="pt-0 mt-auto">
                <div className="space-y-4">
                  <div className="text-sm text-gray-600 bg-gray-50 rounded px-3 py-3 text-center">
                    <span className="font-medium">Flexible booking:</span> Choose your own departure and return dates
                  </div>

                  <Button
                    className="w-full h-12 text-base font-medium"
                    onClick={() => handleTourSelect(tour)}
                  >
                    Book Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {!showAllTours && (
          <div className="text-center mt-12">
            <Button
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white px-12 py-4 text-lg"
              onClick={() => setShowAllTours(true)}
            >
              View All Available Tours
            </Button>
          </div>
        )}
      </section>
    </div>
  )
}
