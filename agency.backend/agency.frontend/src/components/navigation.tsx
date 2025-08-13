"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetTrigger, SheetContent, SheetClose } from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import {
  Bus,
  Menu,
  Home,
  MapPin,
  Info,
  Star,
  Phone as PhoneIcon,
  LocateIcon,
} from "lucide-react"
import { ContactModal } from "@/components/contact-modal"

interface NavigationProps {
  onNavigate: (page: "home" | "tours" | "about" | "rate") => void
}

export function Navigation({ onNavigate }: NavigationProps) {
  const [showContactModal, setShowContactModal] = useState(false)

  const links: { label: string; icon: React.ReactNode; page?: Parameters<typeof onNavigate>[0]; action?: () => void }[] = [
    { label: "Home", icon: <Home className="h-5 w-5" />, page: "home" },
    { label: "About", icon: <Info className="h-5 w-5" />, page: "about" },
    { label: "Tours", icon: <MapPin className="h-5 w-5" />, page: "tours" },
    {
      label: "Rate us",
      icon: <Star className="h-5 w-5" />,
      action: () => window.open("https://www.google.com/search?sca_esv=7ccf99ac88a794c7&sxsrf=AE3TifNsKgMnYyW-7X84fttJ_FmOoy6xZg:1751903976281&si=AMgyJEvkVjFQtirYNBhM3ZJIRTaSJ6PxY6y1_6WZHGInbzDnMZNaE8tFJy8jUk_SG0lv2EndP1RUlphuhrqLFnBJihtS30ivHuM-h_7LxCCh-4cWdZ4MdHk2ifp0Mg8YBJrzAIzn95LLGZAruCh_rU1b3Nmind9cIw%3D%3D&q=RILINDI+SHPK+%2811492%29+Reviews&sa=X&ved=2ahUKEwiai7_xjquOAxUphf0HHXoFDUMQ0bkNegQIHhAD&cshid=1751903986871466&biw=1440&bih=812&dpr=2", "_blank"),
    },
    {
      label: "Find Us",
      icon: <LocateIcon className="h-5 w-5" />,
      action: () => window.open("https://www.google.com/maps/place/RILINDI+SHPK+(11492)/@42.3566148,20.0736442,16.97z/data=!4m6!3m5!1s0x135246ebe24383bd:0x9d6e6747e4e53425!8m2!3d42.356608!4d20.0736571!16s%2Fg%2F1q665w65f?entry=ttu&g_ep=EgoyMDI1MDYzMC4wIKXMDSoASAFQAw%3D%3D", "_blank"),
    },
  ]

  const handleNav = (page?: "home" | "tours" | "about" | "rate", action?: () => void) => {
    if (action) action()
    else if (page) onNavigate(page)
  }

  return (
    <>
      {/* Navbar */}
      <nav className="sticky top-0 z-50 shadow-sm border-b bg-gradient-to-br from-green-100 via-blue-100 to-pink-100 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          {/* Logo & Brand */}
          <div
            className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => handleNav("home")}
          >
            <Bus className="h-8 w-8 text-pink-500" />
            <span className="text-2xl font-bold text-blue-900 select-none">
              RILINDI&nbsp;SHPK
            </span>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-6">
            {links.map((link) => (
              <Button
                key={link.label}
                variant="ghost"
                size="sm"
                onClick={() => handleNav(link.page, link.action)}
                className="flex items-center gap-2 text-blue-900 hover:bg-white/40 hover:ring-2 hover:ring-offset-2 hover:ring-offset-white hover:ring-[conic-gradient(at_top_left,_var(--tw-gradient-stops))] rounded-full transition-all"
              >
                {link.icon}
                {link.label}
              </Button>
            ))}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowContactModal(true)}
              className="flex items-center gap-2 text-blue-900 hover:bg-white hover:border-black border rounded-full px-3"
            >
              <PhoneIcon className="h-5 w-5" />
              Contact&nbsp;Us
            </Button>
          </div>

          {/* Mobile Hamburger */}
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="p-2 md:hidden hover:bg-white/40 hover:ring-2 hover:ring-[conic-gradient(at_top_left,_var(--tw-gradient-stops))] rounded-full"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>

            {/* Mobile Drawer */}
            <SheetContent side="right" className="w-80 p-0">
              <div className="flex flex-col h-full">
                <div className="p-6 bg-gradient-to-r from-green-200 via-blue-300 to-pink-300 text-blue-950">
                  <div className="flex items-center gap-3">
                    <Bus className="h-8 w-8 text-pink-600" />
                    <div>
                      <h3 className="text-lg font-semibold">RILINDI SHPK</h3>
                      <p className="text-xs opacity-70">Agjensi Udhëtimesh</p>
                    </div>
                  </div>
                </div>

                <div className="flex-1 p-6 space-y-2">
                  {links.map((link) => (
                    <SheetClose asChild key={link.label}>
                      <Button
                        variant="ghost"
                        className="w-full justify-start gap-3 h-12 text-blue-900 hover:bg-white/40 hover:ring-2 hover:ring-[conic-gradient(at_top_left,_var(--tw-gradient-stops))] rounded-full"
                        onClick={() => handleNav(link.page, link.action)}
                      >
                        {link.icon}
                        {link.label}
                      </Button>
                    </SheetClose>
                  ))}
                  <SheetClose asChild>
                    <Button
                      variant="ghost"
                      className="w-full justify-start gap-3 h-12 text-blue-900 hover:bg-white border hover:border-black rounded-full"
                      onClick={() => setShowContactModal(true)}
                    >
                      <PhoneIcon className="h-5 w-5" />
                      Contact&nbsp;Us
                    </Button>
                  </SheetClose>
                </div>

                <Separator />

                <div className="p-4 text-center text-xs text-gray-500 bg-gray-50">
                  © 2024 RILINDI SHPK
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
