"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Users, MapPin, Instagram, MessageCircle, Phone, Mail, MapPinIcon, Clock, Mountain } from "lucide-react"
import { LoginForm } from "@/components/login-form"
import { Navigation } from "@/components/navigation"
import { ToursPage } from "@/components/tours-page"
import { AboutPage } from "@/components/about-page"
import { BookingsPage } from "@/components/bookings-page"

const destinations = [
  {
    id: "1",
    name: "Tropoja",
    description: "A hidden gem in the Albanian Alps, known for its pristine nature and traditional mountain culture.",
    image: "/placeholder.svg?height=300&width=400",
    highlights: ["Alpine landscapes", "Traditional villages", "Hiking trails"],
  },
  {
    id: "2",
    name: "Theth",
    description: "A spectacular mountain village surrounded by dramatic peaks and crystal-clear streams.",
    image: "/placeholder.svg?height=300&width=400",
    highlights: ["Waterfall hikes", "Stone houses", "Mountain peaks"],
  },
  {
    id: "3",
    name: "Valbona",
    description: "The crown jewel of Albanian Alps with breathtaking valley views and pristine wilderness.",
    image: "/placeholder.svg?height=300&width=400",
    highlights: ["Valley views", "River rafting", "Wildlife spotting"],
  },
  {
    id: "4",
    name: "Koman Lake",
    description: "Often called the 'Norwegian fjords of Albania' with stunning turquoise waters.",
    image: "/placeholder.svg?height=300&width=400",
    highlights: ["Boat tours", "Scenic views", "Photography"],
  },
]

export default function TravelAgency() {
  const [currentPage, setCurrentPage] = useState<"home" | "tours" | "about" | "bookings">("home")
  const [showLogin, setShowLogin] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState<{ name: string; email: string } | null>(null)

  // Scroll to top when page changes
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [currentPage, showLogin])

  const handleLogin = (userData: { name: string; email: string }) => {
    setIsLoggedIn(true)
    setUser(userData)
    setShowLogin(false)
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setUser(null)
  }

  const handleViewAllTours = () => {
    setCurrentPage("tours")
    setShowMenu(false)
  }

  const handleBackToHome = () => {
    setCurrentPage("home")
    setShowMenu(false)
  }

  const handleOpenAbout = () => {
    setCurrentPage("about")
    setShowMenu(false)
  }

  if (showLogin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navigation
  isLoggedIn={isLoggedIn}
  user={user}
  onLogout={handleLogout}
  onLoginClick={() => setShowLogin(true)}
  onNavigate={(page) => {
    if (page === "login") setShowLogin(true)
    else if (page === "tours") setCurrentPage("tours")
    else if (page === "home") setCurrentPage("home")
    else if (page === "about") setCurrentPage("about")
    else if (page === "bookings") setCurrentPage("bookings")
  }}
/>
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-md mx-auto">
            <LoginForm onLogin={handleLogin} onCancel={() => setShowLogin(false)} />
          </div>
        </div>
      </div>
    )
  }

  if (currentPage === "tours") {
    return (
      <ToursPage
        isLoggedIn={isLoggedIn}
        user={user}
        onLogout={handleLogout}
        onBackToHome={handleBackToHome}
        onLoginClick={() => setShowLogin(true)}
        onOpenAbout={handleOpenAbout}
      />
    )
  }

  if (currentPage === "about") {
    return (
      <AboutPage
        isLoggedIn={isLoggedIn}
        user={user}
        onLogout={handleLogout}
        onBackToHome={handleBackToHome}
        onLoginClick={() => setShowLogin(true)}
        onViewTours={handleViewAllTours}
      />
    )
  }

  if (currentPage === "bookings") {
    return (
      <BookingsPage
        isLoggedIn={isLoggedIn}
        user={user}
        onLogout={handleLogout}
        onBackToHome={handleBackToHome}
        onLoginClick={() => setShowLogin(true)}
        onViewTours={handleViewAllTours}
        onOpenAbout={handleOpenAbout}
        bookings={[]} // replace with fetched bookings if applicable
      />
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
     <Navigation
  isLoggedIn={isLoggedIn}
  user={user}
  onLogout={handleLogout}
  onLoginClick={() => setShowLogin(true)}
  onNavigate={(page) => {
    if (page === "login") setShowLogin(true)
    else if (page === "tours") setCurrentPage("tours")
    else if (page === "home") setCurrentPage("home")
    else if (page === "about") setCurrentPage("about")
    else if (page === "bookings") setCurrentPage("bookings")
  }}
/>
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">Albanian Alps Adventures</h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Discover the untouched beauty of the Albanian Alps with our expert-guided tours. From pristine mountain
            villages to breathtaking valleys, we offer authentic experiences in one of Europe's last hidden gems.
          </p>
          <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-500 mb-8">
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-yellow-500" />
              <span>4.9+ Average Rating</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-blue-500" />
              <span>5,000+ Happy Travelers</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-green-500" />
              <span>15+ Destinations</span>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about-section" className="py-16 px-4 bg-white">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-8">About Albanian Alps Adventures</h2>
            <p className="text-lg text-gray-600 mb-8">
              Founded by local mountain guides with over 15 years of experience, we specialize in showcasing the raw
              beauty and rich culture of the Albanian Alps. Our small-group tours ensure personalized attention while
              supporting local communities and preserving the natural environment.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <MapPin className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Local Expertise</h3>
                <p className="text-gray-600">
                  Born and raised in the Albanian Alps, our guides know every trail and story
                </p>
              </div>
              <div className="text-center">
                <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Small Groups</h3>
                <p className="text-gray-600">
                  Maximum 8 people per tour for a more intimate and personalized experience
                </p>
              </div>
              <div className="text-center">
                <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Star className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Sustainable Tourism</h3>
                <p className="text-gray-600">Supporting local communities while preserving natural beauty</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Destinations Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Discover Our Destinations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {destinations.map((destination) => (
              <Card key={destination.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative">
                  <img
                    src={destination.image || "/placeholder.svg"}
                    alt={destination.name}
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-white text-gray-900 font-semibold">{destination.name}</Badge>
                  </div>
                </div>
                <CardHeader>
                  <CardTitle className="text-xl">{destination.name}</CardTitle>
                  <CardDescription className="text-base">{destination.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {destination.highlights.map((highlight, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {highlight}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">15+</div>
              <div className="text-gray-600">Years Experience</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">5000+</div>
              <div className="text-gray-600">Happy Customers</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600 mb-2">15+</div>
              <div className="text-gray-600">Destinations</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-orange-600 mb-2">4.9</div>
              <div className="text-gray-600">Average Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Company Info */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Mountain className="h-6 w-6 text-blue-400" />
                <span className="text-lg font-bold">Albanian Alps Adventures</span>
              </div>
              <p className="text-gray-300 mb-4">
                Discover the untouched beauty of the Albanian Alps with our expert-guided tours.
              </p>
              <p className="text-sm text-gray-400">Thank you for choosing us for your adventure!</p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <div className="space-y-2">
                <button onClick={handleBackToHome} className="block text-gray-300 hover:text-white transition-colors">
                  Home
                </button>
                <button onClick={handleOpenAbout} className="block text-gray-300 hover:text-white transition-colors">
                  About Us
                </button>
                <button onClick={handleViewAllTours} className="block text-gray-300 hover:text-white transition-colors">
                  Available Tours
                </button>
                <button
                  onClick={() =>
                    window.open("https://www.google.com/search?q=Albanian+Alps+Adventures+reviews", "_blank")
                  }
                  className="block text-gray-300 hover:text-white transition-colors"
                >
                  Rate us on Google
                </button>
              </div>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-blue-400" />
                  <a href="tel:+355123456789" className="text-gray-300 hover:text-white transition-colors">
                    +355 123 456 789
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <MessageCircle className="h-4 w-4 text-green-400" />
                  <a
                    href="https://wa.me/355123456789"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    WhatsApp
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-red-400" />
                  <a
                    href="mailto:info@albanianalpstours.com"
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    info@albanianalpstours.com
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <Instagram className="h-4 w-4 text-pink-400" />
                  <a
                    href="https://instagram.com/albanianalpstours"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    Follow us on Instagram
                  </a>
                </div>
              </div>
            </div>

            {/* Location & Hours */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Visit Us</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <MapPinIcon className="h-4 w-4 text-blue-400 mt-1" />
                  <div className="text-gray-300">
                    <p>Rruga Kol Idromeno</p>
                    <p>Shkodër, Albania</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="h-4 w-4 text-yellow-400 mt-1" />
                  <div className="text-gray-300">
                    <p>Mon - Fri: 9:00 AM - 6:00 PM</p>
                    <p>Sat - Sun: 10:00 AM - 4:00 PM</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-700 mt-12 pt-8 text-center">
            <p className="text-gray-400">
              © 2024 Albanian Alps Adventures. All rights reserved. | Designed with ❤️ for adventure seekers
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
