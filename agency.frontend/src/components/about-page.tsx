"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  Bus,
  Mountain,
  Star,
  Phone,
  Mail,
  Instagram,
  MessageCircle,
  Camera,
} from "lucide-react"
import { Navigation } from "@/components/navigation"

interface AboutPageProps {
  onBackToHome: () => void
  onViewTours: () => void
}

export function AboutPage({ onBackToHome, onViewTours }: AboutPageProps) {
  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-green-100">
      {/* Top navigation */}
      <Navigation
        onNavigate={(page) => {
          if (page === "home") onBackToHome()
          else if (page === "tours") onViewTours()
          // other pages (rate/bookings) handled inside Navigation
        }}
      />

      {/* Header Section */}
      <section className="py-12 px-4">
        <div className="container mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <Button
              variant="ghost"
              onClick={onBackToHome}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
          </div>
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <Bus className="h-16 w-16 text-blue-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              About Albanian Alps Adventures
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We are passionate local guides dedicated to sharing the incredible
              beauty and rich culture of the Albanian Alps with travelers from
              around the world.
            </p>
          </div>
        </div>
      </section>

      {/* Magical Waterfalls of Valbona */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
            <div className="lg:col-span-2">
              <h2 className="text-3xl font-bold text-blue-700 mb-6">
                Magical Waterfalls of Valbona
              </h2>
              <p className="text-lg text-gray-700 mb-4">
                Hidden deep within the Valbona Valley, cascading waterfalls
                create a symphony of nature that has enchanted visitors for
                generations. Our founder Arben discovered these secret spots as a
                child, following ancient shepherd paths that wind through
                pristine forests.
              </p>
              <p className="text-gray-600 mb-6">
                The Blue Eye waterfall, with its crystal-clear turquoise pool,
                reflects the sky like a mirror. Local legends speak of mountain
                spirits that guard these sacred waters, blessing those who
                approach with respect and wonder.
              </p>
              <div className="flex items-center gap-4">
                <Badge className="bg-blue-100 text-blue-800 px-4 py-2">
                  Crystal Clear Waters
                </Badge>
                <Badge className="bg-green-100 text-green-800 px-4 py-2">
                  Ancient Legends
                </Badge>
              </div>
            </div>
            <div className="lg:col-span-1">
              <img
                src="/placeholder.svg?height=400&width=300"
                alt="Valbona Waterfall"
                className="w-full h-80 object-cover rounded-2xl shadow-2xl transform rotate-2 hover:rotate-0 transition-transform duration-300"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stone Houses of Theth */}
      <section className="py-16 px-4 bg-gradient-to-r from-green-100 to-blue-100">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
            <div className="lg:col-span-1 order-2 lg:order-1">
              <img
                src="/placeholder.svg?height=350&width=400"
                alt="Traditional Stone Houses"
                className="w-full h-72 object-cover rounded-3xl shadow-xl transform -rotate-1 hover:rotate-0 transition-transform duration-300"
              />
            </div>
            <div className="lg:col-span-2 order-1 lg:order-2">
              <h2 className="text-3xl font-bold text-green-700 mb-6">
                Traditional Stone Houses of Theth
              </h2>
              <p className="text-lg text-gray-700 mb-4">
                Built from local stone and weathered by centuries of mountain
                storms, these architectural marvels tell stories of resilience
                and tradition. Each house is a fortress of family history, where
                generations have shared meals, stories, and dreams.
              </p>
              <p className="text-gray-600 mb-6">
                The thick stone walls keep homes cool in summer and warm in
                winter, while wooden balconies offer breathtaking views of
                towering peaks. Our guides grew up in these very houses,
                learning the old ways from their grandparents.
              </p>
              <div className="flex flex-wrap gap-3">
                <Badge className="bg-green-100 text-green-800 px-3 py-1">
                  Centuries Old
                </Badge>
                <Badge className="bg-blue-100 text-blue-800 px-3 py-1">
                  Family Heritage
                </Badge>
                <Badge className="bg-gray-100 text-gray-800 px-3 py-1">
                  Mountain Architecture
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Alpine Adventures */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-blue-800 mb-6">
                Alpine Adventures Beyond Imagination
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
              <div className="transform translate-y-8">
                <img
                  src="/placeholder.svg?height=300&width=400"
                  alt="Mountain Adventure"
                  className="w-full h-64 object-cover rounded-xl shadow-lg"
                />
                <div className="bg-white p-6 rounded-b-xl shadow-lg -mt-4 relative z-10">
                  <h3 className="text-xl font-bold text-green-700 mb-3">
                    Highland Trekking
                  </h3>
                  <p className="text-gray-600">
                    Follow ancient shepherd trails through untouched wilderness,
                    where eagles soar overhead and wildflowers carpet the
                    meadows.
                  </p>
                </div>
              </div>
              <div className="transform -translate-y-4">
                <div className="bg-gradient-to-br from-blue-500 to-green-500 p-6 rounded-t-xl text-white">
                  <h3 className="text-xl font-bold mb-3">
                    Cultural Immersion
                  </h3>
                  <p>
                    Share meals with local families, learn traditional crafts,
                    and hear stories passed down through generations of mountain
                    dwellers.
                  </p>
                </div>
                <img
                  src="/placeholder.svg?height=300&width=400"
                  alt="Cultural Experience"
                  className="w-full h-64 object-cover rounded-b-xl shadow-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact & Call to Action */}
      <section className="py-16 px-4 bg-gradient-to-br from-green-600 via-blue-600 to-green-700 text-white">
        <div className="container mx-auto text-center">
          <div className="flex justify-center mb-6">
            <Bus className="h-12 w-12" />
          </div>
          <h2 className="text-3xl font-bold mb-8">Ready to Start Your Adventure?</h2>
          <p className="text-xl mb-12 max-w-2xl mx-auto">
            Let's plan your perfect Albanian Alps journey together. Our local
            expertise ensures unforgettable experiences.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            <div className="flex flex-col items-center transform hover:scale-105 transition-transform">
              <div className="bg-white/20 rounded-full p-4 mb-3">
                <Phone className="h-6 w-6" />
              </div>
              <h3 className="font-semibold mb-2">Call Us</h3>
              <a href="tel:+355123456789" className="hover:underline">
                +355 123 456 789
              </a>
            </div>

            <div className="flex flex-col items-center transform hover:scale-105 transition-transform">
              <div className="bg-white/20 rounded-full p-4 mb-3">
                <MessageCircle className="h-6 w-6" />
              </div>
              <h3 className="font-semibold mb-2">WhatsApp</h3>
              <a
                href="https://wa.me/355123456789"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                Chat with us
              </a>
            </div>

            <div className="flex flex-col items-center transform hover:scale-105 transition-transform">
              <div className="bg-white/20 rounded-full p-4 mb-3">
                <Mail className="h-6 w-6" />
              </div>
              <h3 className="font-semibold mb-2">Email</h3>
              <a href="mailto:info@albanianalpstours.com" className="hover:underline">
                info@albanianalpstours.com
              </a>
            </div>

            <div className="flex flex-col items-center transform hover:scale-105 transition-transform">
              <div className="bg-white/20 rounded-full p-4 mb-3">
                <Instagram className="h-6 w-6" />
              </div>
              <h3 className="font-semibold mb-2">Instagram</h3>
              <a
                href="https://instagram.com/albanianalpstours"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                @albanianalpstours
              </a>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              variant="secondary"
              className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3"
              onClick={onViewTours}
            >
              View Our Tours
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
