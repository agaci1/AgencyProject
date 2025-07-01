"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetTrigger, SheetContent, SheetClose } from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import {
  Mountain,
  Menu,
  Home,
  MapPin,
  Info,
  Star,
  Phone as PhoneIcon,
} from "lucide-react"
import { ContactModal } from "@/components/contact-modal"

interface NavigationProps {
  onNavigate: (page: "home" | "tours" | "about" | "rate") => void
}

export function Navigation({ onNavigate }: NavigationProps) {
  const [showContactModal, setShowContactModal] = useState(false)

  const links: { label: string; icon: React.ReactNode; page: Parameters<typeof onNavigate>[0] }[] =
    [
      { label: "Home", icon: <Home className="h-5 w-5" />, page: "home" },
      { label: "Tours", icon: <MapPin className="h-5 w-5" />, page: "tours" },
      { label: "About", icon: <Info className="h-5 w-5" />, page: "about" },
      { label: "Rate us", icon: <Star className="h-5 w-5" />, page: "rate" },
    ]

  return (
    <>
      <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          {/* Logo */}
          <div
            className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => onNavigate("home")}
          >
            <Mountain className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">Albanian Alps Adventures</span>
          </div>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-6">
            {links.map((link) => (
              <Button
                key={link.label}
                variant="ghost"
                size="sm"
                onClick={() => onNavigate(link.page)}
                className="flex items-center gap-2 hover:bg-gray-100"
              >
                {link.icon}
                {link.label}
              </Button>
            ))}

            {/* Contact is its own modal trigger */}
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-2 hover:bg-gray-100"
              onClick={() => setShowContactModal(true)}
            >
              <PhoneIcon className="h-5 w-5" />
              Contact Us
            </Button>
          </div>

          {/* Mobile menu trigger */}
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="p-2 md:hidden hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>

            <SheetContent side="right" className="w-80 p-0">
              <div className="flex flex-col h-full">
                {/* Sheet header */}
                <div className="p-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                  <div className="flex items-center gap-3">
                    <Mountain className="h-8 w-8" />
                    <div>
                      <h3 className="text-lg font-semibold">Albanian Alps</h3>
                      <p className="text-blue-100 text-sm">Adventures</p>
                    </div>
                  </div>
                </div>

                {/* Sheet nav items */}
                <div className="flex-1 p-6 space-y-2">
                  {links.map((link) => (
                    <SheetClose asChild key={link.label}>
                      <Button
                        variant="ghost"
                        className="w-full justify-start gap-3 h-12 hover:bg-gray-100"
                        onClick={() => onNavigate(link.page)}
                      >
                        {link.icon}
                        <span className="font-medium">{link.label}</span>
                      </Button>
                    </SheetClose>
                  ))}

                  <SheetClose asChild>
                    <Button
                      variant="ghost"
                      className="w-full justify-start gap-3 h-12 hover:bg-gray-100"
                      onClick={() => setShowContactModal(true)}
                    >
                      <PhoneIcon className="h-5 w-5" />
                      <span className="font-medium">Contact Us</span>
                    </Button>
                  </SheetClose>
                </div>

                <Separator className="my-6" />
                <div className="p-6 border-t bg-gray-50 text-center">
                  <p className="text-xs text-gray-500">© 2024 Albanian Alps Adventures</p>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>

      <ContactModal isOpen={showContactModal} onClose={() => setShowContactModal(false)} />
    </>
  )
}
