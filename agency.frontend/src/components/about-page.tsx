"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  Bus,
  Phone,
  Mail,
  Instagram,
  MessageCircle,
} from "lucide-react"
import { Navigation } from "@/components/navigation"

interface AboutPageProps {
  onBackToHome: () => void
  onViewTours: () => void
}

export function AboutPage({ onBackToHome, onViewTours }: AboutPageProps) {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-100 via-slate-50 to-green-100">
      <Navigation
        onNavigate={(page) => {
          if (page === "home") onBackToHome()
          else if (page === "tours") onViewTours()
        }}
      />

      {/* Header Section */}
      <section className="w-full bg-gradient-to-br from-green-50 via-blue-50 to-pink-100 py-12 px-4">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex items-center gap-4 mb-8">
            <Button
              variant="ghost"
              onClick={onBackToHome}
              className="flex items-center gap-2 text-black"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="md:w-2/3">
              <div className="flex items-center gap-3 mb-4">
                <Bus className="h-10 w-10 text-pink-500" />
                <h2 className="text-3xl md:text-4xl font-bold text-blue-900">
                  RILINDI SHPK – Travel Agency
                </h2>
              </div>
              <p className="text-gray-800 text-lg leading-relaxed font-playfair">
                RILINDI SHPK is a transport agency based in Bajram Curri, Tropoja. We are dedicated to providing quality service and comfort to our passengers through safe and regular routes between cities across Albania. Our fleet is composed of well-maintained vehicles equipped for smooth journeys, and our staff is trained to offer professional and respectful customer care.
                <br /><br />
                Our principle is commitment to punctuality, respect, and accurate schedules, making us a reliable partner for daily or seasonal trips. We believe that travel is not just about movement — it's about care, trust, and respecting your time and needs.
              </p>
            </div>

            <div className="md:w-1/3 flex justify-center">
              <img
                src="/agjensiLogo.jpg"
                alt="Logo RILINDI"
                className="w-72 h-auto rounded-2xl shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Magical Waterfalls of Valbona */}
<section className="py-16 px-4 bg-gradient-to-br from-blue-100 to-green-100">
  <div className="container mx-auto">
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
      <div className="lg:col-span-2">
        <h2 className="text-3xl font-bold text-pink-800 mb-6">
          Discover the Natural Beauty of Tropoja
        </h2>
        <p className="text-lg text-gray-700 mb-4 font-playfair">
          Travel through Valbona, alpine lakes, waterfalls, and much more with dedicated local guides.
        </p>
        <p className="text-gray-600 mb-6 font-playfair">
          The destinations include untouched landscapes, centuries-old history, and authentic Albanian hospitality.
        </p>
        <div className="flex items-center gap-4">
          <Badge className="bg-blue-200 text-blue-900 px-4 py-2">
            Untouched Nature
          </Badge>
          <Badge className="bg-green-200 text-green-900 px-4 py-2">
            Local Experience
          </Badge>
        </div>
      </div>
      <div className="lg:col-span-1">
        <img
          src="/tropojaFoto.jpg"
          className="w-full h-80 object-cover rounded-2xl shadow-xl transform rotate-2 hover:rotate-0 transition-transform duration-300"
          alt="Valbona nature"
        />
      </div>
    </div>
  </div>
</section>


      {/* Stone Houses of Theth */}
<section className="py-16 px-4 bg-gradient-to-r from-pink-100 via-slate-50 to-blue-100">
  <div className="container mx-auto">
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
      <div className="lg:col-span-1 order-2 lg:order-1">
        <img
          src="/stoneHouse.jpg"
          alt="Stone Houses"
          className="w-full h-72 object-cover rounded-3xl shadow-xl transform -rotate-1 hover:rotate-0 transition-transform duration-300"
        />
      </div>
      <div className="lg:col-span-2 order-1 lg:order-2">
        <h2 className="text-3xl font-bold text-green-900 mb-6">
          Cultural Destinations
        </h2>
        <p className="text-lg text-gray-700 mb-4 font-playfair">
          Discover the heritage and traditional architecture of the region.
        </p>
        <p className="text-gray-600 mb-6 font-playfair">
          Our tours include visits to historic villages and stone houses that preserve Tropoja's culture and hospitality.
        </p>
        <div className="flex flex-wrap gap-3">
          <Badge className="bg-green-200 text-green-900 px-3 py-1">
            Tradition
          </Badge>
          <Badge className="bg-blue-200 text-blue-900 px-3 py-1">
            History
          </Badge>
          <Badge className="bg-pink-200 text-pink-900 px-3 py-1">
            Architecture
          </Badge>
        </div>
      </div>
    </div>
  </div>
</section>


      {/* Stunning Landscapes */}
<section className="py-16 px-4 bg-gradient-to-r from-blue-100 to-green-100">
  <div className="container mx-auto">
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
      <div className="lg:col-span-2">
        <h2 className="text-3xl font-bold text-blue-900 mb-6">
          Stunning Landscapes
        </h2>
        <p className="text-lg text-gray-700 mb-4 font-playfair">
          Hidden among the mountains of Valbona, Xhema Lake is an alpine lake that offers serenity
          and indescribable beauty.
        </p>
        <p className="text-gray-600 mb-6 font-playfair">
          Surrounded by trees and wildflowers, it's an ideal place for rest and reflection.
        </p>
        <div className="flex flex-wrap gap-3">
          <Badge className="bg-blue-200 text-blue-900 px-3 py-1">
            Alpine Lake
          </Badge>
          <Badge className="bg-green-200 text-green-900 px-3 py-1">
            Peace & Tranquility
          </Badge>
        </div>
      </div>
      <div className="lg:col-span-1">
        <img
          src="/liqeniXhemes.jpeg"
          alt="Xhema Lake"
          className="w-full h-72 object-cover rounded-3xl shadow-xl transform rotate-1 hover:rotate-0 transition-transform duration-300"
        />
      </div>
    </div>
  </div>
</section>

{/* Wonders Flowing from the Heights */}
<section className="py-16 px-4 bg-gradient-to-r from-pink-100 via-white to-green-100">
  <div className="container mx-auto">
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
      <div className="lg:col-span-1 order-2 lg:order-1">
        <img
          src="/ujvaraSh.jpg"
          alt="Shoshani Waterfall"
          className="w-full h-72 object-cover rounded-3xl shadow-xl transform -rotate-1 hover:rotate-0 transition-transform duration-300"
        />
      </div>
      <div className="lg:col-span-2 order-1 lg:order-2">
        <h2 className="text-3xl font-bold text-pink-800 mb-6">
          Wonders Flowing from the Heights
        </h2>
        <p className="text-lg text-gray-700 mb-4 font-playfair">
          A natural gem in Tropoja, Shoshani Waterfall flows from a high altitude
          between steep rocks.
        </p>
        <p className="text-gray-600 mb-6 font-playfair">
          It's a perfect destination for hiking and photography, and a well-known site
          with a rich ancient history.
        </p>
        <div className="flex flex-wrap gap-3">
          <Badge className="bg-pink-200 text-pink-900 px-3 py-1">
            Natural Waterfall
          </Badge>
          <Badge className="bg-blue-200 text-blue-900 px-3 py-1">
            Hiking & Adventure
          </Badge>
        </div>
      </div>
    </div>
  </div>
</section>


 {/* Fleet Section */}
<section className="mt-16">
  <h2
    className="text-4xl md:text-5xl font-bold text-center mb-6 text-blue-900"
    style={{
      fontFamily: "Georgia, serif"
    }}
  >
    Our Exclusive Bus Fleet
  </h2>

  <p className="text-lg text-center text-blue-900 max-w-3xl mx-auto mb-10 font-medium font-playfair">
    Travel in ultimate comfort and maximum safety! Our buses are equipped with the most modern technology,
    air conditioning, and ultra-comfortable seating for an unforgettable experience on every trip.
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


    {/* Contact & Call to Action */}
<section className="py-16 px-4 bg-gradient-to-br from-green-200 via-blue-200 to-pink-200">
  <div className="container mx-auto text-center text-black">
    <div className="flex justify-center mb-6">
      <Bus className="h-12 w-12 text-blue-700" />
    </div>
    <h2 className="text-3xl font-bold mb-8 text-pink-900">
      Ready to travel with us?
    </h2>
    <p className="text-xl mb-12 max-w-2xl mx-auto text-gray-800 font-playfair">
      Contact us and we'll help plan your unforgettable trip.
    </p>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
      {[
        {
          icon: <Phone />,
          label: "Call Us",
          link: "tel:+355672121800",
          text: "+355 672 121 800",
        },
        {
          icon: <MessageCircle />,
          label: "WhatsApp",
          link: "https://wa.me/355676905555",
          text: "+355 676 905 555",
        },
        {
          icon: <Mail />,
          label: "Email",
          link: "mailto:rilindi-shpk@hotmail.com",
          text: "rilindi-shpk@hotmail.com",
        },
        {
          icon: <Instagram />,
          label: "Instagram",
          link: "https://www.instagram.com/rilindi_shpk",
          text: "@rilindi_shpk",
        },
        {
          icon: (
            <div className="w-6 h-6 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.8}
                className="w-full h-full"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3V2z"
                />
              </svg>
            </div>
          ),
          label: "Facebook",
          link: "https://www.facebook.com/share/16qYyk2afu/?mibextid=wvXlfr",
          text: "Rilindi Shpk",
        },
      ].map((item, index) => (
        <div key={index} className="flex flex-col items-center hover:scale-105 transition-transform">
          <div className="bg-white/30 rounded-full p-4 mb-3">{item.icon}</div>
          <h3 className="font-semibold mb-2 text-blue-900">{item.label}</h3>
          <a href={item.link} className="hover:underline" target="_blank" rel="noopener noreferrer">
            {item.text}
          </a>
        </div>
      ))}
    </div>

    <div className="flex justify-center">
      <Button
        size="lg"
        className="bg-white text-blue-800 hover:bg-blue-100 px-8 py-3 rounded-xl shadow"
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
