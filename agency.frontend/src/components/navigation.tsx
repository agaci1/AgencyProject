"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { Mountain, User, Menu, Star, MapPin, LogIn, Home, Info, Phone, BookOpen } from "lucide-react"
import { ContactModal } from "@/components/contact-modal"

interface NavigationProps {
  isLoggedIn: boolean
  user: { name: string; email: string } | null
  onLogout: () => void
  onLoginClick: () => void
  onNavigate: (page: "home" | "tours" | "login" | "about" | "rate" | "bookings") => void
}

export function Navigation({ isLoggedIn, user, onLogout, onLoginClick, onNavigate }: NavigationProps) {
  const [showContactModal, setShowContactModal] = useState(false)

  const handleMenuItemClick = (page: "home" | "tours" | "login" | "about" | "rate" | "bookings") => {
    if (page === "rate") {
      window.open("https://www.google.com/search?q=Albanian+Alps+Adventures+reviews", "_blank")
    } else {
      onNavigate(page)
    }
  }

  const handleContactClick = () => {
    setShowContactModal(true)
  }

  return (
    <>
      <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div
            className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => onNavigate("home")}
          >
            <Mountain className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">Albanian Alps Adventures</span>
          </div>

          <div className="flex items-center gap-4">
            {isLoggedIn && user ? (
              <div className="hidden md:flex items-center gap-3">
                <Avatar className="ring-2 ring-blue-100">
                  <AvatarFallback className="bg-blue-600 text-white">
                    {user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden lg:block">
                  <div className="text-sm font-medium">{user.name}</div>
                  <div className="text-xs text-gray-500">{user.email}</div>
                </div>
                <Button variant="outline" size="sm" onClick={onLogout} className="hover:bg-red-50 hover:border-red-200">
                  Logout
                </Button>
              </div>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={onLoginClick}
                className="hidden md:flex items-center gap-2 hover:bg-blue-50"
              >
                <User className="h-4 w-4" />
                Login
              </Button>
            )}

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 p-0">
                <div className="flex flex-col h-full">
                  <div className="p-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                    <div className="flex items-center gap-3">
                      <Mountain className="h-8 w-8" />
                      <div>
                        <h3 className="text-lg font-semibold">Albanian Alps</h3>
                        <p className="text-blue-100 text-sm">Adventures</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 p-6">
                    <div className="space-y-2">
                      <SheetClose asChild>
                        <Button
                          variant="ghost"
                          className="w-full justify-start gap-3 h-12 hover:bg-blue-50 hover:text-blue-700"
                          onClick={() => handleMenuItemClick("home")}
                        >
                          <Home className="h-5 w-5" />
                          <span className="font-medium">Home</span>
                        </Button>
                      </SheetClose>

                      <SheetClose asChild>
                        <Button
                          variant="ghost"
                          className="w-full justify-start gap-3 h-12 hover:bg-green-50 hover:text-green-700"
                          onClick={() => handleMenuItemClick("tours")}
                        >
                          <MapPin className="h-5 w-5" />
                          <span className="font-medium">Available Tours</span>
                        </Button>
                      </SheetClose>

                      <SheetClose asChild>
                        <Button
                          variant="ghost"
                          className="w-full justify-start gap-3 h-12 hover:bg-purple-50 hover:text-purple-700"
                          onClick={() => handleMenuItemClick("about")}
                        >
                          <Info className="h-5 w-5" />
                          <span className="font-medium">About Us</span>
                        </Button>
                      </SheetClose>

                      <SheetClose asChild>
                        <Button
                          variant="ghost"
                          className="w-full justify-start gap-3 h-12 hover:bg-orange-50 hover:text-orange-700"
                          onClick={handleContactClick}
                        >
                          <Phone className="h-5 w-5" />
                          <span className="font-medium">Contact Us</span>
                        </Button>
                      </SheetClose>

                      <SheetClose asChild>
                        <Button
                          variant="ghost"
                          className="w-full justify-start gap-3 h-12 hover:bg-yellow-50 hover:text-yellow-700"
                          onClick={() => handleMenuItemClick("rate")}
                        >
                          <Star className="h-5 w-5" />
                          <span className="font-medium">Rate us on Google</span>
                        </Button>
                      </SheetClose>

                      {isLoggedIn && (
                        <SheetClose asChild>
                          <Button
                            variant="ghost"
                            className="w-full justify-start gap-3 h-12 hover:bg-cyan-50 hover:text-cyan-700"
                            onClick={() => handleMenuItemClick("bookings")}
                          >
                            <BookOpen className="h-5 w-5" />
                            <span className="font-medium">My Bookings</span>
                          </Button>
                        </SheetClose>
                      )}
                    </div>

                    <Separator className="my-6" />

                    {!isLoggedIn ? (
                      <SheetClose asChild>
                        <Button
                          variant="default"
                          className="w-full justify-start gap-3 h-12 bg-blue-600 hover:bg-blue-700 text-white"
                          onClick={() => handleMenuItemClick("login")}
                        >
                          <LogIn className="h-5 w-5" />
                          <span className="font-medium">Log In</span>
                        </Button>
                      </SheetClose>
                    ) : (
                      <div className="space-y-4">
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <Avatar className="ring-2 ring-blue-100">
                            <AvatarFallback className="bg-blue-600 text-white">
                              {user?.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="text-sm font-medium text-gray-900">{user?.name}</div>
                            <div className="text-xs text-gray-500">{user?.email}</div>
                          </div>
                        </div>
                        <SheetClose asChild>
                          <Button
                            variant="outline"
                            className="w-full hover:bg-red-50 hover:border-red-200 hover:text-red-700"
                            onClick={onLogout}
                          >
                            Logout
                          </Button>
                        </SheetClose>
                      </div>
                    )}
                  </div>

                  <div className="p-6 border-t bg-gray-50">
                    <p className="text-xs text-gray-500 text-center">© 2024 Albanian Alps Adventures</p>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>

      <ContactModal isOpen={showContactModal} onClose={() => setShowContactModal(false)} />
    </>
  )
}
