"use client"

import type React from "react"
import { useState, useEffect } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { MapPin, Clock, Users, CreditCard, Lock, Info } from "lucide-react"
import api from "@/lib/api"

interface Tour {
  id: number
  title: string
  description: string
  price: number
  departureTime: string // changed from duration
  location: string
  rating: number
  image: string
  maxGuests: number
  highlights: string[]
}

interface BookingFormProps {
  tour: Tour
  onComplete: () => void
  onCancel: () => void
}

export function BookingForm({ tour, onComplete, onCancel }: BookingFormProps) {
  const [step, setStep] = useState<"details" | "payment">("details")
  const [bookingData, setBookingData] = useState({
    tripType: "one-way" as "one-way" | "round-trip",
    departureDate: "",
    returnDate: "",
    guests: 1,
    specialRequests: "",
  })

  const basePrice = tour.price * bookingData.guests
  const totalPrice = bookingData.tripType === "round-trip" ? basePrice * 2 : basePrice
  const finalTotal = totalPrice 

  const [notification, setNotification] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [paypalLoaded, setPaypalLoaded] = useState(false)
  const [paypalError, setPaypalError] = useState<string | null>(null)

  // Load PayPal SDK
  useEffect(() => {
    if (step !== "payment") return

    let timeoutId: NodeJS.Timeout

    const loadPayPalScript = () => {
      // Check if PayPal script is already loaded
      if (window.paypal) {
        console.log("PayPal already loaded")
        setPaypalLoaded(true)
        return
      }

      // Check if script is already being loaded
      const existingScript = document.querySelector('script[src*="paypal.com/sdk"]')
      if (existingScript) {
        console.log("PayPal script already loading, waiting...")
        // Wait for existing script to load
        existingScript.addEventListener("load", () => {
          if (window.paypal) {
            setPaypalLoaded(true)
          }
        })
        return
      }

      console.log("Loading PayPal SDK...")
      const script = document.createElement("script")
      const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "YOUR_CLIENT_ID"
      const currency = process.env.NEXT_PUBLIC_PAYPAL_CURRENCY || "EUR"
      script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=${currency}`
      script.async = true

      script.onload = () => {
        console.log("PayPal SDK loaded successfully")
        if (window.paypal && typeof window.paypal.Buttons === "function") {
          setPaypalLoaded(true)
          setPaypalError(null)
        } else {
          setPaypalError("PayPal SDK loaded but Buttons not available")
        }
      }
      

      script.onerror = () => {
        console.error("Failed to load PayPal SDK")
        setPaypalError("Failed to load payment system. Please refresh the page.")
      }

      document.head.appendChild(script)

      // Set timeout for loading
      timeoutId = setTimeout(() => {
        if (!paypalLoaded) {
          setPaypalError("Payment system is taking too long to load. Please refresh the page.")
        }
      }, 10000) // 10 second timeout
    }

    loadPayPalScript()

    // Cleanup function
    return () => {
      if (timeoutId) clearTimeout(timeoutId)
    }
  }, [step, paypalLoaded])

  useEffect(() => {
    if (step === "payment" && paypalLoaded) {
      initializePayPal()
    }
  }, [step, paypalLoaded])
  

  const initializePayPal = () => {
    if (typeof window === "undefined" || !window.paypal || typeof window.paypal.Buttons !== "function") {
      setPaypalError("PayPal SDK not available")
      return
    }

    const container = document.getElementById("paypal-button-container")
    if (!container) {
      console.error("PayPal container not found")
      return
    }

    // Clear any existing content
    container.innerHTML = ""

    try {
      window.paypal
        .Buttons({
          style: {
            layout: "vertical",
            color: "blue",
            shape: "rect",
            label: "pay",
            height: 50,
          },
          createOrder: (_data: unknown, actions: unknown) => {
            console.log("Creating PayPal order for:", finalTotal)
            return actions.order.create({
              purchase_units: [
                {
                  amount: {
                    value: finalTotal.toString(),
                    currency_code: "EUR",
                  },
                  description: `${tour.title} - ${bookingData.guests} guest(s)`,
                },
              ],
            })
          },
          onApprove: async (_data: unknown, actions: unknown) => {
            setIsProcessing(true)
            try {
              const details = await actions.order.capture()
              console.log("Payment captured:", details)

              // Send booking request to your backend
              const bookingPayload = {
                tourId: tour.id,
                name: `${details.payer.name.given_name} ${details.payer.name.surname}`,
                email: details.payer.email_address,
                departureDate: bookingData.departureDate,
                returnDate: bookingData.tripType === "round-trip" ? bookingData.returnDate : null,
                guests: bookingData.guests,
                paymentMethod: "paypal",
                paypal: {
                  transactionId: details.id,
                  email: details.payer.email_address,
                },
              }

              const res = await api.post("/bookings", bookingPayload)

              setNotification("Payment successful! A confirmation email has been sent.")
              setTimeout(() => onComplete(), 2000)
            } catch (error) {
              console.error("Payment error:", error)
              setPaypalError("Payment was successful but booking failed. Please contact support.")
              setIsProcessing(false)
            } finally {
              setIsProcessing(false)
            }
          },
          onError: (err: Error) => {
            console.error("PayPal error:", err)
            setPaypalError("Payment failed. Please try again.")
            setIsProcessing(false)
          },
          onCancel: () => {
            console.log("Payment cancelled by user")
            setIsProcessing(false)
          },
        })
        .render("#paypal-button-container")

      // Add success logging after render
      console.log("PayPal buttons rendered successfully")
    } catch (error) {
      console.error("PayPal initialization error:", error)
      setPaypalError("Failed to initialize payment system. Please refresh the page.")
    }
  }

  const handleDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setStep("payment")
  }

  // PAYMENT STEP
  if (step === "payment") {
    return (
      <div className="max-w-4xl mx-auto bg-white/70 backdrop-blur-xl shadow-lg rounded-xl p-6">
        {notification && <div className="mb-4 p-4 bg-green-600 text-white rounded">{notification}</div>}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Secure Payment
              </CardTitle>
              <CardDescription>Complete your payment securely through PayPal</CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Payment Explanation */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-blue-900 mb-2">How Payment Works</h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• Click the PayPal button below to open the secure payment window</li>
                      <li>• You can pay with your PayPal account OR with any credit/debit card</li>
                      <li>• No PayPal account required - guest checkout available</li>
                      <li>• All payments are secured by PayPal's buyer protection</li>
                    </ul>
                  </div>
                </div>
              </div>

              <Separator />

              {/* PayPal Payment Section */}
              <div className="space-y-4">
                <div className="text-center">
                  <h3 className="text-lg font-semibold mb-2">Pay €{finalTotal}</h3>
                  <p className="text-sm text-gray-600 mb-4 font-playfair">Choose PayPal or Credit/Debit Card in the next step</p>
                </div>

                {/* PayPal Button Container */}
                {paypalError ? (
                  <div className="text-center py-8">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                      <p className="text-red-800 font-medium">Payment System Error</p>
                      <p className="text-red-600 text-sm mt-1">{paypalError}</p>
                    </div>
                    <Button
                      onClick={() => {
                        setPaypalError(null)
                        setPaypalLoaded(false)
                        window.location.reload()
                      }}
                      variant="outline"
                    >
                      Refresh Page
                    </Button>
                  </div>
                ) : paypalLoaded ? (
                  <div className="space-y-3">
                    <div id="paypal-button-container" className="min-h-[50px]" />
                    {isProcessing && (
                      <div className="text-center text-sm text-gray-600 font-playfair">Processing your payment...</div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                                <p className="text-sm text-gray-600 mb-2 font-playfair">Loading secure payment options...</p>
            <p className="text-xs text-gray-400 mb-4 font-playfair">This may take a few seconds</p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setPaypalLoaded(false)
                        setPaypalError(null)
                        // Force reload by changing step and back
                        setStep("details")
                        setTimeout(() => setStep("payment"), 100)
                      }}
                      className="text-xs"
                    >
                      Retry Loading Payment
                    </Button>
                  </div>
                )}

                {/* Security Notice */}
                <div className="flex items-center gap-2 text-sm bg-gray-50 p-3 rounded">
                  <Lock className="h-4 w-4 text-green-600" />
                  <span>
                    <strong>100% Secure:</strong> Your payment information is encrypted and protected by PayPal
                  </span>
                </div>

                {/* Alternative Actions */}
                <div className="flex gap-4 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep("details")}
                    className="flex-1"
                    disabled={isProcessing}
                  >
                    Back to Details
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onCancel}
                    className="flex-1 bg-transparent"
                    disabled={isProcessing}
                  >
                    Cancel Booking
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Booking Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Booking Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <img
                  src={tour.image || "/placeholder.svg"}
                  alt={tour.title}
                  className="w-full h-32 object-cover rounded"
                />
                <h3 className="font-semibold mt-2">{tour.title}</h3>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <MapPin className="h-4 w-4" /> {tour.location}
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Trip Type:</span>
                  <span className="capitalize">{bookingData.tripType}</span>
                </div>
                <div className="flex justify-between">
                  <span>Departure:</span>
                  <span>{new Date(bookingData.departureDate).toLocaleDateString()}</span>
                </div>
                {bookingData.tripType === "round-trip" && (
                  <div className="flex justify-between">
                    <span>Return:</span>
                    <span>{new Date(bookingData.returnDate).toLocaleDateString()}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Guests:</span>
                  <span>{bookingData.guests}</span>
                </div>
                <div className="flex justify-between">
                  <span>Price per person:</span>
                  <span>€{tour.price}</span>
                </div>
                {bookingData.specialRequests && (
                  <div className="flex justify-between">
                    <span>Special Requests:</span>
                    <span className="text-sm text-gray-600 font-playfair">{bookingData.specialRequests}</span>
                  </div>
                )}
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total Amount:</span>
                  <span className="text-blue-600">€{finalTotal}</span>
                </div>
              </div>

              {/* Payment Methods Accepted */}
              <div className="bg-gray-50 p-3 rounded text-center">
                <p className="text-xs text-gray-600 mb-2 font-playfair">We accept:</p>
                <div className="flex justify-center items-center gap-2 text-xs text-gray-500">
                  <span>PayPal</span> • <span>Visa</span> • <span>Mastercard</span> • <span>American Express</span> •{" "}
                  <span>Discover</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // DETAILS STEP
  return (
    <div className="max-w-4xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Booking Details Form */}
        <Card>
          <CardHeader>
            <CardTitle>Booking Details</CardTitle>
            <CardDescription>Complete your booking information for {tour.title}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleDetailsSubmit} className="space-y-4">
              {/* Trip Type */}
              <div className="space-y-2">
                <Label htmlFor="tripType">Trip Type</Label>
                <Select
                  onValueChange={(val) =>
                    setBookingData((p) => ({
                      ...p,
                      tripType: val as any,
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select trip type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="one-way">One Way</SelectItem>
                    <SelectItem value="round-trip">Round Trip</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Departure Date */}
              <div className="space-y-2">
                <Label htmlFor="departureDate">Departure Date</Label>
                <Input
                  id="departureDate"
                  type="date"
                  value={bookingData.departureDate}
                  onChange={(e) =>
                    setBookingData((p) => ({
                      ...p,
                      departureDate: e.target.value,
                    }))
                  }
                  min={new Date().toISOString().split("T")[0]}
                  required
                />
              </div>

              {/* Return Date */}
              {bookingData.tripType === "round-trip" && (
                <div className="space-y-2">
                  <Label htmlFor="returnDate">Return Date</Label>
                  <Input
                    id="returnDate"
                    type="date"
                    value={bookingData.returnDate}
                    onChange={(e) =>
                      setBookingData((p) => ({
                        ...p,
                        returnDate: e.target.value,
                      }))
                    }
                    min={bookingData.departureDate ? new Date(bookingData.departureDate).toISOString().split("T")[0] : new Date().toISOString().split("T")[0]}
                    required
                  />
                </div>
              )}

              {/* Guests */}
              <div className="space-y-2">
                <Label htmlFor="guests">Number of Guests</Label>
                <Select
                  value={bookingData.guests.toString()}
                  onValueChange={(val) =>
                    setBookingData((p) => ({
                      ...p,
                      guests: Number.parseInt(val) || 1,
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select guests" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: tour.maxGuests }, (_, i) => (
                      <SelectItem key={i} value={`${i + 1}`}>
                        {i + 1} {i === 0 ? "Guest" : "Guests"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Special Requests */}
              <div className="space-y-2">
                <Label htmlFor="requests">Special Requests (Optional)</Label>
                <Input
                  id="requests"
                  placeholder="Any special requirements"
                  value={bookingData.specialRequests}
                  onChange={(e) =>
                    setBookingData((p) => ({
                      ...p,
                      specialRequests: e.target.value,
                    }))
                  }
                />
              </div>

              {/* Actions */}
              <div className="flex gap-4 pt-4">
                <Button type="button" variant="outline" onClick={onCancel} className="flex-1 bg-transparent">
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={
                    !bookingData.departureDate ||
                    !bookingData.guests ||
                    (bookingData.tripType === "round-trip" && !bookingData.returnDate)
                  }
                >
                  Continue to Payment
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Tour Info */}
        <Card>
        <CardHeader>
  <CardTitle>{tour.title}</CardTitle>
  <CardDescription className="flex items-center gap-4">
    <MapPin className="h-4 w-4" /> {tour.location} &nbsp;
    <Clock className="h-4 w-4" /> {tour.departureTime} &nbsp;
    <Users className="h-4 w-4" /> Max {tour.maxGuests}
  </CardDescription>
</CardHeader>
          <CardContent className="space-y-4">
            <img src={tour.image || "/placeholder.svg"} alt={tour.title} className="w-full h-48 object-cover rounded" />

            <p className="text-gray-600">{tour.description}</p>
            {/* Highlights */}
<div className="space-y-2">
  <h4 className="font-semibold">Highlights:</h4>
  <div className="flex flex-wrap gap-2">
    {tour.highlights && tour.highlights.length > 0 ? (
      tour.highlights.map((hl, i) => (
        <span key={i} className="bg-gray-200 px-2 py-1 rounded text-sm">
          {hl}
        </span>
      ))
    ) : (
                  <p className="text-sm text-gray-500 font-playfair">No highlights provided.</p>
    )}
  </div>
</div>


            <div className="bg-blue-50 p-4 rounded">
            <div className="text-2xl font-bold text-blue-600">€{tour.price}</div>
              <div className="text-sm text-gray-600 font-playfair">per person</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
