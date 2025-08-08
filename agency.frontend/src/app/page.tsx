"use client"

import { useState, useEffect } from "react"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Instagram, MessageCircle, Phone, Mail, MapPinIcon, Clock, Mountain, Info } from "lucide-react"
import { Navigation } from "@/components/navigation"
import { ToursPage } from "@/components/tours-page"
import { AboutPage } from "@/components/about-page"
import { fetchTours } from "@/lib/api"
import { Tour } from "@/types/tour"



export default function TravelAgency() {
  const [currentPage, setCurrentPage] = useState<"home" | "tours" | "about">(() => {
    // Try to get the saved page from localStorage, default to "home"
    if (typeof window !== 'undefined') {
      const savedPage = localStorage.getItem('currentPage') as "home" | "tours" | "about"
      return savedPage || "home"
    }
    return "home"
  })
  const [tours, setTours] = useState<Tour[]>([])

  // Save current page to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('currentPage', currentPage)
    }
  }, [currentPage])

  useEffect(() => {
    fetchTours()
      .then((data) => {
        // Show the latest 2 tours (the new ones we just added)
        const latestTours = data.slice(-2)
        setTours(latestTours)
      })
      .catch((err) => console.error("Error loading tours:", err))
  }, [])

  const handleViewAllTours = () => setCurrentPage("tours")
  const handleBackToHome = () => setCurrentPage("home")
  const handleOpenAbout = () => setCurrentPage("about")

  if (currentPage === "tours") {
    return <ToursPage onBackToHome={handleBackToHome} onOpenAbout={handleOpenAbout} />
  }

  if (currentPage === "about") {
    return <AboutPage onBackToHome={handleBackToHome} onViewTours={handleViewAllTours} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 via-blue-100 to-pink-100">
      <Navigation
        onNavigate={(page) => {
          if (page === "tours") setCurrentPage("tours")
          else if (page === "home") setCurrentPage("home")
          else if (page === "about") setCurrentPage("about")
        }}
      />

      {/* Hero Section - Video Background */}
      <section className="relative h-screen overflow-hidden">
        {/* Try the MOV file first */}
        <video
          src="/ScreenRecording_08-08-2025%2017-31-38_1.mov"
          autoPlay
          loop
          muted
          playsInline
          controls={false}
          className="absolute inset-0 w-full h-full object-cover"
          onError={(e) => {
            console.error('MOV video failed, trying MP4:', e);
            // If MOV fails, try MP4
            const video = e.target as HTMLVideoElement;
            video.src = "/RilindiShpk.MP4";
          }}
        />
        {/* Fallback background in case video fails */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-green-800 to-purple-900"></div>
        {/* Optional overlay for better text readability */}
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
      </section>



      {/* Company Introduction Section */}
      <section className="py-8 sm:py-12 md:py-16 px-4 bg-gradient-to-br from-green-50 via-blue-50 to-pink-50">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12">
            {/* Logo */}
            <div className="flex-shrink-0 mb-6 sm:mb-8 md:mb-0">
              <div className="w-48 h-48 sm:w-56 sm:h-56 md:w-80 md:h-80 rounded-full p-2 shadow-lg"
                style={{
                  background: "linear-gradient(to right, #4ade80, #60a5fa, #f472b6)",
                }}
              >
                <img
                  src="/logo1122.JPG"
                  alt="RILINDI SHPK Logo"
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
            </div>

            {/* Company Info */}
            <div className="text-center md:text-left max-w-2xl px-4 md:px-0">
              <h2
                className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 text-blue-900"
                style={{
                  fontFamily: "Georgia, serif"
                }}
              >
                RILINDI SHPK
              </h2>
              
              <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-700 mb-4 sm:mb-6 leading-relaxed font-medium font-playfair">
                Discover the natural beauty and rich culture of the Albanian Alps through our authentic tours, 
                guided by experienced local experts. We specialize in providing unforgettable travel experiences 
                that showcase the stunning landscapes, historical sites, and warm hospitality of Albania.
              </p>
              
              <p className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-600 leading-relaxed font-playfair">
                With years of experience in the tourism industry, RILINDI SHPK has been connecting travelers 
                with the hidden gems of Albania. Our commitment to quality service, safety, and authentic 
                cultural experiences makes us your trusted partner for exploring this beautiful country.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Tours */}
      <section className="py-8 sm:py-12 px-4">
        <div className="container mx-auto">
        <h2
  className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-6 sm:mb-8 md:mb-12 text-blue-900 px-4"
  style={{
    fontFamily: "Georgia, serif"
  }}
>
    Our Top Tours 
</h2>


          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {tours.map((tour) => (
              <Card key={tour.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative">
                  <img
                    src={tour.image || "/placeholder.svg"}
                    alt={tour.title}
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-white text-gray-900 font-semibold">{tour.location}</Badge>
                  </div>
                </div>
                <CardHeader>
                  <CardTitle className="text-xl">{tour.title}</CardTitle>
                  <CardDescription className="text-base">{tour.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <button
              onClick={handleViewAllTours}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg text-lg"
            >
              View All Tours
            </button>
          </div>
        </div>
      </section>

      {/* Fleet Section */}
<section className="mt-8 sm:mt-12 md:mt-16">
<h2
  className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-4 sm:mb-6 text-blue-900 px-4"
  style={{
    fontFamily: "Georgia, serif"
  }}
>
Our Exclusive Bus Fleet
</h2>

<p className="text-sm sm:text-base md:text-lg text-center text-blue-900 max-w-3xl mx-auto mb-6 sm:mb-8 md:mb-10 font-medium px-4 font-playfair">
  Travel with high comfort and maximum safety! Our buses are equipped with the latest technology,
  air conditioning, and ultra-comfortable seats for an unforgettable travel experience.
</p>

<div className="overflow-x-auto whitespace-nowrap py-4">
  <div className="flex gap-4 px-4" style={{ minWidth: "max-content" }}>
    <div className="rounded-lg overflow-hidden shadow-md w-100 shrink-0">
      <img src="/auto1.JPG" alt="Bus 1" className="w-full h-[40rem] object-cover rounded-lg" />
    </div>
    <div className="rounded-lg overflow-hidden shadow-md w-100 shrink-0">
      <img src="/auto2.JPG" alt="Bus 2" className="w-full h-[40rem] object-cover rounded-lg" />
    </div>
    <div className="rounded-lg overflow-hidden shadow-md w-100 shrink-0">
      <img src="/auto3.JPG" alt="Bus 3" className="w-full h-[40rem] object-cover rounded-lg" />
    </div>
    <div className="rounded-lg overflow-hidden shadow-md w-100 shrink-0">
      <img src="/auto4.JPG" alt="Bus 4" className="w-full h-[40rem] object-cover rounded-lg" />
    </div>
    <div className="rounded-lg overflow-hidden shadow-md w-100 shrink-0">
      <img src="/auto5.JPG" alt="Bus 5" className="w-full h-[40rem] object-cover rounded-lg" />
    </div>
  </div>
</div>

</section>


<footer className="bg-gradient-to-br from-blue-200 via-green-100 to-pink-100 text-blue-900 py-16 px-4">
  <div className="container mx-auto">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      
      {/* Company Info */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Mountain className="h-6 w-6 text-blue-500" />
          <span className="text-lg font-bold text-blue-900 text-xl">RILINDI SHPK</span>
        </div>
        <p className="text-green-900 mb-4 text-base font-medium">
          A travel agency based in the heart of Tropoja, offering unforgettable experiences in the Albanian Alps.
        </p>
        <p className="text-sm text-green-900 font-medium">Thank you for choosing Rilindi for your journey!</p>
      </div>

      {/* Quick Links */}
      <div>
        <h3 className="text-lg font-semibold mb-4 text-blue-900 text-xl">Quick Links</h3>
        <div className="space-y-2">
          <button onClick={handleBackToHome} className="block text-green-900 hover:text-blue-900 transition-colors font-medium text-base">
            Home
          </button>
          <button onClick={handleOpenAbout} className="block text-green-900 hover:text-blue-900 transition-colors font-medium text-base">
            About Us
          </button>
          <button onClick={handleViewAllTours} className="block text-green-900 hover:text-blue-900 transition-colors font-medium text-base">
            Explore Tours
          </button>
          <a
            href="https://www.instagram.com/rilindi_shpk?igsh=bzJwdmJ1a2JrczZq"
            target="_blank"
            className="block text-green-900 hover:text-blue-900 transition-colors font-medium text-base"
          >
            Instagram Profile
          </a>
        </div>
      </div>

      {/* Contact Info */}
      <div>
        <h3 className="text-lg font-semibold mb-4 text-blue-900 text-xl">Contact Us</h3>
        <div className="space-y-3 text-sm">
          <div className="flex items-center gap-3">
            <Phone className="h-4 w-4 text-blue-600" />
            <a href="tel:+355672121800" className="text-green-900 hover:text-blue-900 font-medium text-base">+355 672 121 800</a>
          </div>
          <div className="flex items-center gap-3">
            <Phone className="h-4 w-4 text-blue-600" />
            <a href="tel:+355676905555" className="text-green-900 hover:text-blue-900 font-medium text-base">+355 676 905 555</a>
          </div>
          <div className="flex items-center gap-3">
            <Mail className="h-4 w-4 text-red-500" />
            <a href="mailto:rilindi-shpk@hotmail.com" className="text-green-900 hover:text-blue-900 font-medium text-base">
              rilindi-shpk@hotmail.com
            </a>
          </div>
          <div className="flex items-center gap-3">
            <Instagram className="h-4 w-4 text-pink-500" />
            <a
              href="https://www.instagram.com/rilindi_shpk?igsh=bzJwdmJ1a2JrczZq"
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-900 hover:text-blue-900 font-medium text-base"
            >
              @rilindi_shpk
            </a>
          </div>
          <div className="flex items-center gap-3">
            <MessageCircle className="h-4 w-4 text-green-500" />
            <a href="https://wa.me/355672121800" target="_blank" className="text-green-900 hover:text-blue-900 font-medium text-base">
              WhatsApp available
            </a>
          </div>
        </div>
      </div>

      {/* Office Info */}
      <div>
        <h3 className="text-lg font-semibold mb-4 text-blue-900 text-xl">Visit Our Office</h3>
        <div className="space-y-2 text-sm text-green-900 font-medium text-base">
          <div className="flex items-start gap-3">
            <MapPinIcon className="h-4 w-4 text-blue-500 mt-1" />
            <p>Across the Museum, Bajram Curri, Tropoja</p>
          </div>
          <div className="flex items-start gap-3">
            <Clock className="h-4 w-4 text-yellow-500 mt-1" />
            <div>
              <p>Monday – Friday: 08:00 – 19:00</p>
              <p>Saturday & Sunday: 08:00 – 16:00</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Info className="h-4 w-4 text-green-500 mt-1" />
            <p>Full refund if canceled 48 hours before departure.</p>
          </div>
        </div>
      </div>
    </div>

    <div className="border-t border-blue-300 mt-12 pt-8 text-center text-green-900 text-sm font-semibold text-base">
      © {new Date().getFullYear()} RILINDI SHPK – Travel Agency. All rights reserved.
    </div>
    <div className="mt-1 pt-2 text-center text-green-900 text-sm font-semibold text-base">
     Designed by Alkeo Gaci & Ornela Geci.
     +355 69 685 1089
    </div> 
  </div>
</footer>
    </div>
  )
}
