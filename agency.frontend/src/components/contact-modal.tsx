"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Phone, Mail, Instagram, MessageCircle, MapPinIcon, Clock, Bus } from "lucide-react"

interface ContactModalProps {
  isOpen: boolean
  onClose: () => void
}

export function ContactModal({ isOpen, onClose }: ContactModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bus className="h-6 w-6 text-blue-600" />
              <DialogTitle className="text-xl font-bold text-gray-900">Contact Us</DialogTitle>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto pr-2 -mr-2">
          <div className="space-y-6 py-4">
            <p className="text-gray-600 text-center">
              Ready to start your Albanian Alps adventure? Get in touch with us through any of these channels:
            </p>

            {/* Contact Methods */}
            <div className="space-y-4">
              {/* Phone */}
              <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                <div className="bg-blue-600 rounded-full p-3 flex-shrink-0">
                  <Phone className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900">Call Us</h3>
                  <p className="text-sm text-gray-600">Available 9 AM - 6 PM</p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => window.open("tel:+355123456789", "_self")}
                  className="hover:bg-blue-600 hover:text-white flex-shrink-0"
                >
                  +355 123 456 789
                </Button>
              </div>

              {/* WhatsApp */}
              <div className="flex items-center gap-4 p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                <div className="bg-green-600 rounded-full p-3 flex-shrink-0">
                  <MessageCircle className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900">WhatsApp</h3>
                  <p className="text-sm text-gray-600">Quick responses 24/7</p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => window.open("https://wa.me/355123456789", "_blank")}
                  className="hover:bg-green-600 hover:text-white flex-shrink-0"
                >
                  Chat Now
                </Button>
              </div>

              {/* Email */}
              <div className="flex items-center gap-4 p-4 bg-red-50 rounded-lg hover:bg-red-100 transition-colors">
                <div className="bg-red-600 rounded-full p-3 flex-shrink-0">
                  <Mail className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900">Email</h3>
                  <p className="text-sm text-gray-600">Detailed inquiries welcome</p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => window.open("mailto:info@albanianalpstours.com", "_self")}
                  className="hover:bg-red-600 hover:text-white flex-shrink-0"
                >
                  Send Email
                </Button>
              </div>

              {/* Instagram */}
              <div className="flex items-center gap-4 p-4 bg-pink-50 rounded-lg hover:bg-pink-100 transition-colors">
                <div className="bg-pink-600 rounded-full p-3 flex-shrink-0">
                  <Instagram className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900">Instagram</h3>
                  <p className="text-sm text-gray-600">Follow our adventures</p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => window.open("https://instagram.com/albanianalpstours", "_blank")}
                  className="hover:bg-pink-600 hover:text-white flex-shrink-0"
                >
                  Follow Us
                </Button>
              </div>
            </div>

            {/* Office Info */}
            <div className="border-t pt-6">
              <h3 className="font-semibold text-gray-900 mb-4 text-center">Visit Our Office</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 justify-center">
                  <MapPinIcon className="h-4 w-4 text-blue-600 flex-shrink-0" />
                  <div className="text-sm text-gray-600 text-center">
                    <p>Rruga Kol Idromeno</p>
                    <p>Shkodër, Albania</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 justify-center">
                  <Clock className="h-4 w-4 text-green-600 flex-shrink-0" />
                  <div className="text-sm text-gray-600 text-center">
                    <p>Mon - Fri: 9:00 AM - 6:00 PM</p>
                    <p>Sat - Sun: 10:00 AM - 4:00 PM</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                onClick={() => window.open("https://wa.me/355123456789", "_blank")}
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                WhatsApp
              </Button>
              <Button
                type="button"
                variant="outline"
                className="flex-1 hover:bg-blue-50 bg-transparent"
                onClick={() => window.open("tel:+355123456789", "_self")}
              >
                <Phone className="h-4 w-4 mr-2" />
                Call Now
              </Button>
            </div>

            {/* Additional spacing at bottom for better scrolling */}
            <div className="h-4" />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
