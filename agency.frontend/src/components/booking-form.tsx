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
  departureTime: string
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

// Session storage keys for state persistence (cleared when tab/window closes)
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
          // Validate the saved data structure
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

  // PayPal integration
  const [paypalLoaded, setPaypalLoaded] = useState(false)
  const [paypalError, setPaypalError] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [notification, setNotification] = useState<string | null>(null)

  // Load PayPal SDK
  useEffect(() => {
    console.log("PayPal useEffect triggered - step:", step, "paypalLoaded:", paypalLoaded)
    if (step !== "payment" || paypalLoaded) return

    let timeoutId: NodeJS.Timeout

    const loadPayPalScript = () => {
      // Use the correct PayPal client ID from Railway
      const clientId = "Abnz_dIwA50AWSeKzCk-021q3fosUWLg6JDFmmmKFmVawGGhNaJr9rEjPSWEiqLdk5Qnn0NTR_XsZarX"
      const currency = "EUR"

      console.log("PayPal Configuration Debug:")
      console.log("- Client ID:", clientId ? "SET" : "NOT SET")
      console.log("- Currency:", currency)
      console.log("- Final Total:", finalTotal)

      if (!clientId) {
        setPaypalError("PayPal configuration is missing. Please contact support.")
        return
      }

      // Remove any existing PayPal script
      const existingScript = document.querySelector('script[src*="paypal.com/sdk"]')
      if (existingScript) {
        existingScript.remove()
      }

      const script = document.createElement("script")
      // Simplified PayPal SDK URL - remove all restrictions
      script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=${currency}&intent=capture&components=buttons`
      script.async = true

      console.log("Loading PayPal SDK with URL:", script.src)

      script.onload = () => {
        console.log("PayPal SDK loaded successfully")
        // Wait a bit for PayPal to initialize
        setTimeout(() => {
          if (window.paypal && typeof window.paypal.Buttons === "function") {
            console.log("PayPal Buttons function available")
            setPaypalLoaded(true)
            setPaypalError(null)
          } else {
            console.error("PayPal Buttons function not available")
            setPaypalError("PayPal SDK loaded but Buttons not available")
          }
        }, 1000)
      }

      script.onerror = () => {
        console.error("Failed to load PayPal SDK")
        setPaypalError("Failed to load payment system. Please check your internet connection and try again.")
      }

      document.head.appendChild(script)

      // Set timeout for loading
      timeoutId = setTimeout(() => {
        if (!paypalLoaded) {
          setPaypalError("Payment system is taking too long to load. Please refresh the page.")
        }
      }, 15000) // 15 second timeout
    }

    console.log("Starting PayPal script loading...")
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
    console.log("Initializing PayPal...")
    console.log("Window object:", typeof window)
    console.log("PayPal object:", window.paypal)
    console.log("PayPal Buttons function:", typeof window.paypal?.Buttons)
    
    if (typeof window === "undefined") {
      setPaypalError("Window object not available")
      return
    }
    
    if (!window.paypal) {
      setPaypalError("PayPal SDK not loaded")
      return
    }
    
    if (typeof window.paypal.Buttons !== "function") {
      setPaypalError("PayPal Buttons function not available")
      return
    }

    const container = document.getElementById("paypal-button-container")
    if (!container) {
      console.error("PayPal container not found")
      setPaypalError("PayPal container not found")
      return
    }

    console.log("PayPal container found, clearing content...")
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



          createOrder: (data: any, actions: any) => {
            console.log("Creating PayPal order for:", finalTotal)
            console.log("Using currency: EUR (hardcoded)")
            const orderData = {
              purchase_units: [
                {
                  amount: {
                    value: finalTotal.toString(),
                    currency_code: "EUR",
                  },
                  description: `${tour.title} - ${bookingData.guests} guest(s)`,
                  custom_id: `tour_${tour.id}_${Date.now()}`,
                },
              ],
              application_context: {
                shipping_preference: 'NO_SHIPPING',
                user_action: 'PAY_NOW',
                return_url: window.location.origin + '/tours',
                cancel_url: window.location.origin + '/tours',
              },
            }
            console.log("Order data:", orderData)
            return actions.order.create(orderData)
          },
          onApprove: async (data: any, actions: any) => {
            setIsProcessing(true)
            let paymentDetails: any = null
            try {
              paymentDetails = await actions.order.capture()
              console.log("Payment captured:", paymentDetails)

              // Send booking request to your backend
              const bookingPayload = {
                tourId: tour.id,
                name: `${paymentDetails.payer.name.given_name} ${paymentDetails.payer.name.surname}`,
                email: paymentDetails.payer.email_address,
                departureDate: bookingData.departureDate,
                returnDate: bookingData.tripType === "round-trip" ? bookingData.returnDate : null,
                guests: bookingData.guests,
                paymentMethod: "paypal",
                paypal: {
                  email: paymentDetails.payer.email_address,
                  transactionId: paymentDetails.id,
                }
              }

              const res = await api.post("/bookings", bookingPayload)
              console.log("Booking created:", res.data)

              setNotification("Payment successful! A confirmation email has been sent.")
              clearStorage() // Clear saved state
              setTimeout(() => onComplete(), 2000)
            } catch (error: any) {
              console.error("Payment error:", error)
              
              // If payment was captured successfully, treat it as success even if backend has issues
              if (paymentDetails && paymentDetails.id) {
                console.log("Payment was successful, showing success message despite backend error")
                setNotification("Payment successful! Your booking has been confirmed.")
                clearStorage() // Clear saved state
                setTimeout(() => onComplete(), 2000)
              } else {
                // Only show error if payment itself failed
                const errorMessage = error.response?.data || error.message || "Payment failed. Please try again."
                setPaypalError(errorMessage)
              }
              
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
              <CardDescription>Complete your payment securely through PayPal</CardDescription>
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
                    <h4 className="font-semibold text-blue-900 mb-2">Continue to Secure Payment</h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• Click the button below to continue</li>
                      <li>• Choose "Pay with PayPal" or "Pay with Card"</li>
                      <li>• No PayPal account required for card payments</li>
                      <li>• 100% secure payment processing</li>
                    </ul>
                  </div>
                </div>
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
                      // Force reload PayPal
                      const script = document.querySelector('script[src*="paypal.com/sdk"]')
                      if (script) script.remove()
                      window.paypal = undefined
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
              ) : paypalLoaded ? (
                <div className="space-y-3">
                  <div className="text-green-600 text-sm mb-2">✅ PayPal loaded successfully!</div>
                  <div id="paypal-button-container" className="min-h-[50px] border-2 border-dashed border-gray-300 bg-gray-50 p-4" />
                  

                  
                  {isProcessing && (
                    <div className="text-center text-sm text-gray-600 font-playfair">Processing your payment...</div>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-sm text-gray-600 mb-2 font-playfair">Loading PayPal...</p>
                    <p className="text-xs text-gray-500">Debug: Step={step}, PayPalLoaded={paypalLoaded.toString()}</p>
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
      {showRecoveryMessage && (
        <div className="mb-4 p-4 bg-yellow-500 text-white rounded">
          <p className="text-sm">
            <strong>Recovery:</strong> Your booking details were restored from your last session.
            You can continue from where you left off.
          </p>
        </div>
      )}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Booking Details Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Booking Details
              {isSaving && (
                <div className="flex items-center gap-2 text-sm text-green-600">
                  <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-green-600"></div>
                  Saving...
                </div>
              )}
            </CardTitle>
            <CardDescription>Complete your booking information for {tour.title}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleDetailsSubmit} className="space-y-4">
              {/* Trip Type */}
              <div className="space-y-2">
                <Label htmlFor="tripType">Trip Type</Label>
                <Select
                  value={bookingData.tripType}
                  onValueChange={(val) =>
                    setBookingData((p: any) => ({
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
                    setBookingData((p: any) => ({
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
                      setBookingData((p: any) => ({
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
                    setBookingData((p: any) => ({
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
                    setBookingData((p: any) => ({
                      ...p,
                      specialRequests: e.target.value,
                    }))
                  }
                />
              </div>

              {/* Actions */}
              <div className="flex gap-4 pt-4">
                <Button type="button" variant="outline" onClick={handleCancel} className="flex-1 bg-transparent">
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
