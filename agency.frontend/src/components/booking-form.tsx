"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Users, CreditCard, Lock } from "lucide-react"

interface Tour {
  id: number
  title: string
  description: string
  price: number
  duration: string
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
  user: { name: string; email: string } | null
}

export function BookingForm({ tour, onComplete, onCancel, user }: BookingFormProps) {
  const [step, setStep] = useState<"details" | "payment">("details")
  const [bookingData, setBookingData] = useState({
    tripType: "one-way" as "one-way" | "round-trip",
    departureDate: "",
    returnDate: "",
    guests: 1,
    specialRequests: "",
  })
  const [paymentData, setPaymentData] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardholderName: user?.name || "",
    billingAddress: "",
    city: "",
    zipCode: "",
    country: "",
  })

  const basePrice = tour.price * bookingData.guests
  const totalPrice = bookingData.tripType === "round-trip" ? basePrice * 2 : basePrice
  const taxes = Math.round(totalPrice * 0.1)
  const finalTotal = totalPrice + taxes

  const [notification, setNotification] = useState<string | null>(null)


  const handleDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setStep("payment")
  }

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
  
    try {
      const response = await fetch("http://localhost:8080/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tour: { id: tour.id },
          userName: user?.name,
          userEmail: user?.email,
          departureDate: bookingData.departureDate,
          returnDate: bookingData.tripType === "round-trip" ? bookingData.returnDate : null,
          guests: bookingData.guests,
        }),
      })
  
      if (!response.ok) throw new Error("Booking failed")
  
      setNotification("Booking successful! A confirmation email has been sent to you.")
      onComplete()
    } catch (error) {
      alert("There was an error processing your booking. Please try again.")
      console.error("Booking error:", error)
    }
  }
  if (step === "payment") {
    return (
      <div className="max-w-4xl mx-auto">
        {notification && (
          <div className="mb-4 p-4 bg-green-600 text-white rounded">
            {notification}
          </div>
        )}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Payment Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Payment Information
              </CardTitle>
              <CardDescription>Enter your payment details to complete the booking</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePaymentSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="cardNumber">Card Number</Label>
                  <Input
                    id="cardNumber"
                    placeholder="1234 5678 9012 3456"
                    value={paymentData.cardNumber}
                    onChange={(e) => setPaymentData((prev) => ({ ...prev, cardNumber: e.target.value }))}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expiryDate">Expiry Date</Label>
                    <Input
                      id="expiryDate"
                      placeholder="MM/YY"
                      value={paymentData.expiryDate}
                      onChange={(e) => setPaymentData((prev) => ({ ...prev, expiryDate: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cvv">CVV</Label>
                    <Input
                      id="cvv"
                      placeholder="123"
                      value={paymentData.cvv}
                      onChange={(e) => setPaymentData((prev) => ({ ...prev, cvv: e.target.value }))}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cardholderName">Cardholder Name</Label>
                  <Input
                    id="cardholderName"
                    placeholder="John Doe"
                    value={paymentData.cardholderName}
                    onChange={(e) => setPaymentData((prev) => ({ ...prev, cardholderName: e.target.value }))}
                    required
                  />
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label htmlFor="billingAddress">Billing Address</Label>
                  <Input
                    id="billingAddress"
                    placeholder="123 Main Street"
                    value={paymentData.billingAddress}
                    onChange={(e) => setPaymentData((prev) => ({ ...prev, billingAddress: e.target.value }))}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      placeholder="New York"
                      value={paymentData.city}
                      onChange={(e) => setPaymentData((prev) => ({ ...prev, city: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zipCode">ZIP Code</Label>
                    <Input
                      id="zipCode"
                      placeholder="10001"
                      value={paymentData.zipCode}
                      onChange={(e) => setPaymentData((prev) => ({ ...prev, zipCode: e.target.value }))}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Select onValueChange={(value) => setPaymentData((prev) => ({ ...prev, country: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="us">United States</SelectItem>
                      <SelectItem value="ca">Canada</SelectItem>
                      <SelectItem value="uk">United Kingdom</SelectItem>
                      <SelectItem value="au">Australia</SelectItem>
                      <SelectItem value="de">Germany</SelectItem>
                      <SelectItem value="fr">France</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 p-3 rounded">
                  <Lock className="h-4 w-4" />
                  <span>Your payment information is secure and encrypted</span>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button type="button" variant="outline" onClick={() => setStep("details")} className="flex-1">
                    Back
                  </Button>
                  <Button type="submit" className="flex-1">
                    Complete Payment (${finalTotal})
                  </Button>
                </div>
              </form>
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
                  <MapPin className="h-4 w-4" />
                  <span>{tour.location}</span>
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
                  <span>
                    ${tour.price} {bookingData.tripType === "round-trip" ? "x2 (round-trip)" : "(one-way)"}
                  </span>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>${totalPrice}</span>
                </div>
                <div className="flex justify-between">
                  <span>Taxes & Fees:</span>
                  <span>${taxes}</span>
                </div>
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total:</span>
                  <span>${finalTotal}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
  {notification && (
    <div className="mb-4 p-4 bg-green-600 text-white rounded">
      {notification}
    </div>
  )}
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
    {/* Booking Details Form */}
        <Card>
          <CardHeader>
            <CardTitle>Booking Details</CardTitle>
            <CardDescription>Complete your booking information for {tour.title}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleDetailsSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Trip Type</Label>
                <Select
                  onValueChange={(value: "one-way" | "round-trip") =>
                    setBookingData((prev) => ({ ...prev, tripType: value }))
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

              <div className="space-y-2">
                <Label htmlFor="departureDate">Departure Date</Label>
                <Input
                  id="departureDate"
                  type="date"
                  value={bookingData.departureDate}
                  onChange={(e) => setBookingData((prev) => ({ ...prev, departureDate: e.target.value }))}
                  min={new Date().toISOString().split("T")[0]}
                  required
                />
              </div>

              {bookingData.tripType === "round-trip" && (
                <div className="space-y-2">
                  <Label htmlFor="returnDate">Return Date</Label>
                  <Input
                    id="returnDate"
                    type="date"
                    value={bookingData.returnDate}
                    onChange={(e) => setBookingData((prev) => ({ ...prev, returnDate: e.target.value }))}
                    min={bookingData.departureDate || new Date().toISOString().split("T")[0]}
                    required
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="guests">Number of Guests</Label>
                <Select
                  onValueChange={(value) => setBookingData((prev) => ({ ...prev, guests: Number.parseInt(value) }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select number of guests" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: tour.maxGuests }, (_, i) => i + 1).map((num) => (
                      <SelectItem key={num} value={num.toString()}>
                        {num} {num === 1 ? "Guest" : "Guests"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="requests">Special Requests (Optional)</Label>
                <Input
                  id="requests"
                  placeholder="Any special requirements or requests..."
                  value={bookingData.specialRequests}
                  onChange={(e) => setBookingData((prev) => ({ ...prev, specialRequests: e.target.value }))}
                />
              </div>

              <div className="flex gap-4 pt-4">
                <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
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

        {/* Tour Information */}
        <Card>
          <CardHeader>
            <CardTitle>{tour.title}</CardTitle>
            <CardDescription className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span>{tour.location}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{tour.duration}</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>Max {tour.maxGuests} guests</span>
              </div>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <img src={tour.image || "/placeholder.svg"} alt={tour.title} className="w-full h-48 object-cover rounded" />

            <p className="text-gray-600">{tour.description}</p>

            <div>
              <h4 className="font-semibold mb-2">Tour Highlights:</h4>
              <div className="flex flex-wrap gap-2">
                {tour.highlights.map((highlight, index) => (
                  <Badge key={index} variant="secondary">
                    {highlight}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded">
              <div className="text-2xl font-bold text-blue-600">${tour.price}</div>
              <div className="text-sm text-gray-600">per person</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
