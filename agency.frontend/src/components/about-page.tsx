"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Mountain, Star, Phone, Mail, Instagram, MessageCircle, Camera, Bus } from "lucide-react"
import { Navigation } from "@/components/navigation"

interface AboutPageProps {
  isLoggedIn: boolean
  user: { name: string; email: string } | null
  onLogout: () => void
  onBackToHome: () => void
  onLoginClick: () => void
  onViewTours: () => void
}

export function AboutPage({ isLoggedIn, user, onLogout, onBackToHome, onLoginClick, onViewTours }: AboutPageProps) {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-green-100">
     <Navigation
  isLoggedIn={isLoggedIn}
  user={user}
  onLogout={onLogout}
  onLoginClick={onLoginClick}
  onNavigate={(page) => {
    if (page === "home") onBackToHome()
    else if (page === "tours") onViewTours()
    else if (page === "login") onLoginClick()
  }}
    />
      {/* Header Section */}
      <section className="py-12 px-4">
        <div className="container mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <Button variant="ghost" onClick={onBackToHome} className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
          </div>
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <Bus className="h-16 w-16 text-blue-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">About Albanian Alps Adventures</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We are passionate local guides dedicated to sharing the incredible beauty and rich culture of the Albanian
              Alps with travelers from around the world.
            </p>
          </div>
        </div>
      </section>

      {/* Magical Waterfalls of Valbona - Left aligned */}
      <div className="py-16 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
            <div className="lg:col-span-2">
              <h2 className="text-3xl font-bold text-blue-700 mb-6">Magical Waterfalls of Valbona</h2>
              <p className="text-lg text-gray-700 mb-4">
                Hidden deep within the Valbona Valley, cascading waterfalls create a symphony of nature that has
                enchanted visitors for generations. Our founder Arben discovered these secret spots as a child,
                following ancient shepherd paths that wind through pristine forests.
              </p>
              <p className="text-gray-600 mb-6">
                The Blue Eye waterfall, with its crystal-clear turquoise pool, reflects the sky like a mirror. Local
                legends speak of mountain spirits that guard these sacred waters, blessing those who approach with
                respect and wonder.
              </p>
              <div className="flex items-center gap-4">
                <Badge className="bg-blue-100 text-blue-800 px-4 py-2">Crystal Clear Waters</Badge>
                <Badge className="bg-green-100 text-green-800 px-4 py-2">Ancient Legends</Badge>
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
      </div>

      {/* Stone Houses of Theth - Right aligned */}
      <div className="py-16 px-4 bg-gradient-to-r from-green-100 to-blue-100">
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
              <h2 className="text-3xl font-bold text-green-700 mb-6">Traditional Stone Houses of Theth</h2>
              <p className="text-lg text-gray-700 mb-4">
                Built from local stone and weathered by centuries of mountain storms, these architectural marvels tell
                stories of resilience and tradition. Each house is a fortress of family history, where generations have
                shared meals, stories, and dreams.
              </p>
              <p className="text-gray-600 mb-6">
                The thick stone walls keep homes cool in summer and warm in winter, while wooden balconies offer
                breathtaking views of towering peaks. Our guides grew up in these very houses, learning the old ways
                from their grandparents.
              </p>
              <div className="flex flex-wrap gap-3">
                <Badge className="bg-green-100 text-green-800 px-3 py-1">Centuries Old</Badge>
                <Badge className="bg-blue-100 text-blue-800 px-3 py-1">Family Heritage</Badge>
                <Badge className="bg-gray-100 text-gray-800 px-3 py-1">Mountain Architecture</Badge>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Alpine Adventures - Center with offset */}
      <div className="py-20 px-4">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-blue-800 mb-6">Alpine Adventures Beyond Imagination</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
              <div className="transform translate-y-8">
                <img
                  src="/placeholder.svg?height=300&width=400"
                  alt="Mountain Adventure"
                  className="w-full h-64 object-cover rounded-xl shadow-lg"
                />
                <div className="bg-white p-6 rounded-b-xl shadow-lg -mt-4 relative z-10">
                  <h3 className="text-xl font-bold text-green-700 mb-3">Highland Trekking</h3>
                  <p className="text-gray-600">
                    Follow ancient shepherd trails through untouched wilderness, where eagles soar overhead and
                    wildflowers carpet the meadows.
                  </p>
                </div>
              </div>
              <div className="transform -translate-y-4">
                <div className="bg-gradient-to-br from-blue-500 to-green-500 p-6 rounded-t-xl text-white">
                  <h3 className="text-xl font-bold mb-3">Cultural Immersion</h3>
                  <p>
                    Share meals with local families, learn traditional crafts, and hear stories passed down through
                    generations of mountain dwellers.
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
      </div>

      {/* Our Passionate Team - Asymmetric cards */}
      <div className="py-16 px-4 bg-gradient-to-l from-blue-50 to-green-50">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center text-green-800 mb-16">Our Passionate Mountain Guides</h2>

          <div className="space-y-16">
            {/* Arben - Left aligned */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-center">
              <div className="lg:col-span-1">
                <img
                  src="/placeholder.svg?height=250&width=250"
                  alt="Arben Krasniqi"
                  className="w-48 h-48 rounded-full object-cover mx-auto border-4 border-blue-200 shadow-xl"
                />
              </div>
              <div className="lg:col-span-3">
                <div className="bg-white p-8 rounded-2xl shadow-lg transform rotate-1">
                  <h3 className="text-2xl font-bold text-blue-700 mb-2">Arben Krasniqi</h3>
                  <p className="text-green-600 font-semibold mb-4">Founder & Lead Guide • 15+ years</p>
                  <p className="text-gray-700 mb-4">
                    Born in the heart of Theth village, Arben spent his childhood exploring every hidden trail and
                    secret valley. His grandfather taught him to read the mountains like a book - understanding weather
                    patterns, animal tracks, and the ancient stories carved into every rock face.
                  </p>
                  <div className="flex items-center gap-2">
                    <Mountain className="h-5 w-5 text-blue-600" />
                    <span className="text-sm text-gray-600">Climbed over 50 peaks in the Albanian Alps</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Lira - Right aligned */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-center">
              <div className="lg:col-span-3 order-2 lg:order-1">
                <div className="bg-gradient-to-br from-green-500 to-blue-500 p-8 rounded-2xl shadow-lg transform -rotate-1 text-white">
                  <h3 className="text-2xl font-bold mb-2">Lira Berisha</h3>
                  <p className="text-green-100 font-semibold mb-4">Cultural Guide & Photographer • 8+ years</p>
                  <p className="mb-4">
                    With an artist's eye and a historian's heart, Lira captures not just images but the soul of the
                    Albanian Alps. She speaks four languages and has documented over 100 traditional songs and stories
                    from mountain villages.
                  </p>
                  <div className="flex items-center gap-2">
                    <Camera className="h-5 w-5" />
                    <span className="text-sm">Published photographer in National Geographic</span>
                  </div>
                </div>
              </div>
              <div className="lg:col-span-1 order-1 lg:order-2">
                <img
                  src="/placeholder.svg?height=250&width=250"
                  alt="Lira Berisha"
                  className="w-48 h-48 rounded-full object-cover mx-auto border-4 border-green-200 shadow-xl"
                />
              </div>
            </div>

            {/* Gent - Center with offset */}
            <div className="max-w-3xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="transform translate-x-4">
                  <img
                    src="/placeholder.svg?height=250&width=250"
                    alt="Gent Hoxha"
                    className="w-48 h-48 rounded-full object-cover mx-auto border-4 border-blue-200 shadow-xl"
                  />
                </div>
                <div className="transform -translate-x-4">
                  <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-green-500">
                    <h3 className="text-xl font-bold text-green-700 mb-2">Gent Hoxha</h3>
                    <p className="text-blue-600 font-semibold mb-3">Adventure Guide • 10+ years</p>
                    <p className="text-gray-700 mb-3">
                      Former mountain rescue specialist turned adventure guide. Gent knows every challenging route and
                      can navigate by stars alone.
                    </p>
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm text-gray-600">Wilderness survival expert</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Koman Lake Experience - Full width with overlay */}
      <div className="py-20 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-green-600/20"></div>
        <div className="container mx-auto relative z-10">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl font-bold text-blue-800 mb-6">The Norwegian Fjords of Albania</h2>
                <p className="text-xl text-gray-700 mb-6">
                  Koman Lake stretches like a emerald ribbon between towering cliffs, creating one of Europe's most
                  spectacular boat journeys. The morning mist dances on the water while eagles circle overhead.
                </p>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-white/80 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">36km</div>
                    <div className="text-sm text-gray-600">Lake Length</div>
                  </div>
                  <div className="bg-white/80 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">400m</div>
                    <div className="text-sm text-gray-600">Cliff Heights</div>
                  </div>
                </div>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3" onClick={onViewTours}>
                  Explore Lake Tours
                </Button>
              </div>
              <div className="relative">
                <img
                  src="/placeholder.svg?height=400&width=600"
                  alt="Koman Lake"
                  className="w-full h-80 object-cover rounded-3xl shadow-2xl"
                />
                <div className="absolute -bottom-6 -right-6 bg-white p-4 rounded-xl shadow-lg">
                  <div className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-yellow-500 fill-current" />
                    <span className="font-bold text-gray-800">4.9/5</span>
                  </div>
                  <p className="text-sm text-gray-600">Traveler Rating</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <section className="py-16 px-4 bg-gradient-to-br from-green-600 via-blue-600 to-green-700 text-white">
        <div className="container mx-auto text-center">
          <div className="flex justify-center mb-6">
            <Bus className="h-12 w-12" />
          </div>
          <h2 className="text-3xl font-bold mb-8">Ready to Start Your Adventure?</h2>
          <p className="text-xl mb-12 max-w-2xl mx-auto">
            Let's plan your perfect Albanian Alps journey together. Our local expertise ensures unforgettable
            experiences.
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
            <Button
              size="lg"
              className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-600 transition-colors px-8 py-3"
              onClick={() => window.open("https://wa.me/355123456789", "_blank")}
            >
              Contact Us Now
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
