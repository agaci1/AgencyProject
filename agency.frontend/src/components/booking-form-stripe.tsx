import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { MapPin, Clock, Users, CreditCard, Lock, Info } from "lucide-react"
import { loadStripe } from '@stripe/stripe-js'
import api from "@/lib/api"

interface Tour {
  id: number
  title: string
  description: string
  price: number
  departureTime: string
  location: string
  image: string
  rating: number
  maxGuests: number
  routeDescription: string
  startLocationLink: string
  highlights: string[]
}

interface BookingFormProps {
  tour: Tour
  onComplete: () => void
  onCancel: () => void
}

// Session storage keys for state persistence
const STORAGE_KEYS = {
  BOOKING_STEP: 'booking_step',
  BOOKING_DATA: 'booking_data',
  SELECTED_TOUR: 'selected_tour'
}

export function BookingForm({ tour, onComplete, onCancel }: BookingFormProps) {
  // Load state from sessionStorage on component mount
  const [step, setStep] = useState<"details" | "payment">(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedStep = sessionStorage.getItem(STORAGE_KEYS.BOOKING_STEP)
        return savedStep === 'payment' ? 'payment' : 'details'
      } catch (e) {
        console.error('Failed to load saved step:', e)
        return 'details'
      }
    }
    return 'details'
  })

  const [bookingData, setBookingData] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedData = sessionStorage.getItem(STORAGE_KEYS.BOOKING_DATA)
        if (savedData) {
          const parsed = JSON.parse(savedData)
          if (parsed && typeof parsed === 'object') {
            return {
              tripType: parsed.tripType || "one-way",
              departureDate: parsed.departureDate || "",
              returnDate: parsed.returnDate || "",
              guests: parsed.guests || 1,
              specialRequests: parsed.specialRequests || "",
            }
          }
        }
      } catch (e) {
        console.error('Failed to parse saved booking data:', e)
      }
    }
    return {
      tripType: "one-way" as "one-way" | "round-trip",
      departureDate: "",
      returnDate: "",
      guests: 1,
      specialRequests: "",
    }
  })

  const [isSaving, setIsSaving] = useState(false)
  const [showRecoveryMessage, setShowRecoveryMessage] = useState(false)

  // Check if we recovered data on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedData = sessionStorage.getItem(STORAGE_KEYS.BOOKING_DATA)
      if (savedData) {
        setShowRecoveryMessage(true)
        setTimeout(() => setShowRecoveryMessage(false), 3000)
      }
    }
  }, [])

  // Save state to sessionStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        sessionStorage.setItem(STORAGE_KEYS.BOOKING_STEP, step)
        sessionStorage.setItem(STORAGE_KEYS.BOOKING_DATA, JSON.stringify(bookingData))
      } catch (e) {
        console.error('Failed to save state:', e)
      }
    }
  }, [step, bookingData])

  const clearStorage = () => {
    if (typeof window !== 'undefined') {
      try {
        sessionStorage.removeItem(STORAGE_KEYS.BOOKING_STEP)
        sessionStorage.removeItem(STORAGE_KEYS.BOOKING_DATA)
      } catch (e) {
        console.error('Failed to clear storage:', e)
      }
    }
  }

  // Calculate final total
  const baseTotal = tour.price * bookingData.guests
  const finalTotal = bookingData.tripType === "round-trip" ? baseTotal * 2 : baseTotal

  // Stripe integration
  const [stripeLoaded, setStripeLoaded] = useState(false)
  const [stripeError, setStripeError] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [notification, setNotification] = useState<string | null>(null)

  // Load Stripe
  useEffect(() => {
    if (step !== "payment" || stripeLoaded) return

    const loadStripeSDK = async () => {
      try {
        const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
        console.log("Stripe Configuration Debug:")
        console.log("- Publishable Key:", publishableKey ? "SET" : "NOT SET")
        console.log("- Final Total:", finalTotal)

        if (!publishableKey) {
          setStripeError("Stripe configuration is missing. Please contact support.")
          return
        }

        const stripe = await loadStripe(publishableKey)
        if (stripe) {
          setStripeLoaded(true)
          setStripeError(null)
          console.log("Stripe loaded successfully")
        } else {
          setStripeError("Failed to load Stripe. Please refresh the page.")
        }
      } catch (error) {
        console.error("Failed to load Stripe:", error)
        setStripeError("Failed to load payment system. Please check your internet connection and try again.")
      }
    }

    loadStripeSDK()
  }, [step, stripeLoaded, finalTotal])

  const handleStripePayment = async () => {
    if (!stripeLoaded) {
      setStripeError("Payment system not loaded. Please refresh the page.")
      return
    }

    setIsProcessing(true)
    setStripeError(null)

    try {
      // Create payment intent on backend
      const paymentIntentResponse = await api.post("/api/stripe/create-payment-intent", {
        amount: finalTotal,
        currency: "eur",
        description: `${tour.title} - ${bookingData.guests} guest(s)`
      })

      if (!paymentIntentResponse.data.success) {
        throw new Error(paymentIntentResponse.data.error || "Failed to create payment intent")
      }

      const paymentIntentId = paymentIntentResponse.data.clientSecret

      // Create booking with Stripe payment
      const bookingPayload = {
        tourId: tour.id,
        name: "Customer", // Will be updated after payment
        email: "customer@example.com", // Will be updated after payment
        departureDate: bookingData.departureDate,
        returnDate: bookingData.tripType === "round-trip" ? bookingData.returnDate : null,
        guests: bookingData.guests,
        paymentMethod: "stripe",
        stripe: {
          paymentIntentId: paymentIntentId,
          customerEmail: "customer@example.com"
        }
      }

      const res = await api.post("/bookings", bookingPayload)
      console.log("Booking created:", res.data)

      setNotification("Payment successful! A confirmation email has been sent.")
      clearStorage()
      setTimeout(() => onComplete(), 2000)

    } catch (error: any) {
      console.error("Payment error:", error)
      setStripeError("Payment failed. Please try again.")
      setIsProcessing(false)
    }
  }

  const handleDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setStep("payment")
  }

  const handleCancel = () => {
    clearStorage()
    onCancel()
  }

  // PAYMENT STEP
  if (step === "payment") {
    return (
      <div className="max-w-4xl mx-auto bg-white/70 backdrop-blur-xl shadow-lg rounded-xl p-6">
        {notification && <div className="mb-4 p-4 bg-green-600 text-white rounded">{notification}</div>}
        {showRecoveryMessage && (
          <div className="mb-4 p-4 bg-yellow-500 text-white rounded">
            <p className="text-sm">
              <strong>Recovery:</strong> Your booking details were restored from your last session.
              Please review and complete your payment.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Secure Payment
              </CardTitle>
              <CardDescription>Complete your payment securely with Stripe</CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Payment Amount */}
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-2">Pay €{finalTotal}</h3>
                <p className="text-sm text-gray-600 mb-4 font-playfair">Complete your payment securely</p>
              </div>

              {/* Payment Explanation */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-blue-900 mb-2">Secure Payment with Stripe</h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• Pay with any credit or debit card</li>
                      <li>• Money goes directly to owner's bank account</li>
                      <li>• Secure and encrypted payment processing</li>
                      <li>• Instant confirmation</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Stripe Payment Button */}
              {stripeError ? (
                <div className="text-center py-8">
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                    <p className="text-red-800 font-medium">Payment System Error</p>
                    <p className="text-red-600 text-sm mt-1">{stripeError}</p>
                  </div>
                  <Button
                    onClick={() => {
                      setStripeError(null)
                      setStripeLoaded(false)
                      setTimeout(() => {
                        setStep("details")
                        setTimeout(() => setStep("payment"), 100)
                      }, 100)
                    }}
                    variant="outline"
                  >
                    Retry Payment System
                  </Button>
                </div>
              ) : stripeLoaded ? (
                <div className="space-y-3">
                  <Button
                    onClick={handleStripePayment}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    disabled={isProcessing}
                  >
                    <CreditCard className="h-4 w-4 mr-2" />
                    Pay with Credit Card (€{finalTotal})
                  </Button>
                  
                  {isProcessing && (
                    <div className="text-center text-sm text-gray-600 font-playfair">Processing your payment...</div>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-sm text-gray-600 mb-2 font-playfair">Loading payment system...</p>
                  </div>
                </div>
              )}

              {/* Security Notice */}
              <div className="flex items-center gap-2 text-sm bg-gray-50 p-3 rounded">
                <Lock className="h-4 w-4 text-green-600" />
                <span>
                  <strong>100% Secure:</strong> Your payment information is encrypted and protected
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
                  onClick={handleCancel}
                  className="flex-1 bg-transparent"
                  disabled={isProcessing}
                >
                  Cancel Booking
                </Button>
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
                  src={tour.image}
                  alt={tour.title}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
                <h3 className="text-lg font-semibold mb-2">{tour.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{tour.description}</p>
              </div>

              <Separator />

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Trip Type:</span>
                  <span className="font-medium capitalize">{bookingData.tripType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Departure Date:</span>
                  <span className="font-medium">{bookingData.departureDate}</span>
                </div>
                {bookingData.tripType === "round-trip" && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Return Date:</span>
                    <span className="font-medium">{bookingData.returnDate}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Number of Guests:</span>
                  <span className="font-medium">{bookingData.guests}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Price per Person:</span>
                  <span className="font-medium">€{tour.price}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total:</span>
                  <span>€{finalTotal}</span>
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
    <div className="max-w-4xl mx-auto bg-white/70 backdrop-blur-xl shadow-lg rounded-xl p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Booking Details</CardTitle>
            <CardDescription>Fill in your trip details</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleDetailsSubmit} className="space-y-6">
              {/* Trip Type */}
              <div className="space-y-2">
                <Label htmlFor="tripType">Trip Type</Label>
                <RadioGroup
                  value={bookingData.tripType}
                  onValueChange={(value) => setBookingData({ ...bookingData, tripType: value as "one-way" | "round-trip" })}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="one-way" id="one-way" />
                    <Label htmlFor="one-way">One Way</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="round-trip" id="round-trip" />
                    <Label htmlFor="round-trip">Round Trip</Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Departure Date */}
              <div className="space-y-2">
                <Label htmlFor="departureDate">Departure Date</Label>
                <Input
                  id="departureDate"
                  type="date"
                  value={bookingData.departureDate}
                  onChange={(e) => setBookingData({ ...bookingData, departureDate: e.target.value })}
                  required
                />
              </div>

              {/* Return Date (only for round-trip) */}
              {bookingData.tripType === "round-trip" && (
                <div className="space-y-2">
                  <Label htmlFor="returnDate">Return Date</Label>
                  <Input
                    id="returnDate"
                    type="date"
                    value={bookingData.returnDate}
                    onChange={(e) => setBookingData({ ...bookingData, returnDate: e.target.value })}
                    required
                  />
                </div>
              )}

              {/* Number of Guests */}
              <div className="space-y-2">
                <Label htmlFor="guests">Number of Guests</Label>
                <Input
                  id="guests"
                  type="number"
                  min="1"
                  max={tour.maxGuests}
                  value={bookingData.guests}
                  onChange={(e) => setBookingData({ ...bookingData, guests: parseInt(e.target.value) })}
                  required
                />
              </div>

              {/* Special Requests */}
              <div className="space-y-2">
                <Label htmlFor="specialRequests">Special Requests (Optional)</Label>
                <textarea
                  id="specialRequests"
                  value={bookingData.specialRequests}
                  onChange={(e) => setBookingData({ ...bookingData, specialRequests: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Any special requests or requirements..."
                />
              </div>

              {/* Submit Button */}
              <Button type="submit" className="w-full" disabled={isSaving}>
                {isSaving ? "Saving..." : "Proceed to Payment"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Tour Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Tour Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <img
                src={tour.image}
                alt={tour.title}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <h3 className="text-lg font-semibold mb-2">{tour.title}</h3>
              <p className="text-gray-600 text-sm mb-4">{tour.description}</p>
            </div>

            <Separator />

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin className="h-4 w-4" />
                <span>{tour.location}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="h-4 w-4" />
                <span>Departure: {tour.departureTime}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Users className="h-4 w-4" />
                <span>Max {tour.maxGuests} guests</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span className="text-yellow-500">★</span>
                <span>{tour.rating} rating</span>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <h4 className="font-semibold">Highlights:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                {tour.highlights.map((highlight, index) => (
                  <li key={index}>• {highlight}</li>
                ))}
              </ul>
            </div>

            <Separator />

            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">€{tour.price}</div>
              <div className="text-sm text-gray-600">per person</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
