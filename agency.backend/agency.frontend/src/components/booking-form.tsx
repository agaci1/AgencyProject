"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { MapPin, Calendar, Users, CreditCard, Lock } from "lucide-react"

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
  const [paymentData, setPaymentData] = useState({
    email: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardholderName: "",
    billingAddress: "",
    city: "",
    zipCode: "",
    country: "",
  })

  const basePrice = tour.price * bookingData.guests
  const totalPrice =
    bookingData.tripType === "round-trip" ? basePrice * 2 : basePrice
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
      const res = await fetch("http://localhost:8080/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tourId: tour.id,
          name: paymentData.cardholderName,
          email: paymentData.email,
          departureDate: bookingData.departureDate,
          returnDate:
            bookingData.tripType === "round-trip"
              ? bookingData.returnDate
              : null,
          guests: bookingData.guests,
          payment: {
            number: paymentData.cardNumber,
            expiry: paymentData.expiryDate,
            cvv: paymentData.cvv,
            name: paymentData.cardholderName,
            address: paymentData.billingAddress,
            city: paymentData.city,
            zip: paymentData.zipCode,
            country: paymentData.country,
          },
        }),
      })
      if (!res.ok) throw new Error("Booking failed")
      setNotification(
        "Booking successful! A confirmation email has been sent."
      )
      onComplete()
    } catch {
      alert("Error processing booking. Please try again.")
    }
  }

  // PAYMENT STEP
  if (step === "payment") {
    return (
      <div className="max-w-4xl mx-auto">
        {notification && (
          <div className="mb-4 p-4 bg-green-600 text-white rounded">
            {notification}
          </div>
        )}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Payment Information
              </CardTitle>
              <CardDescription>
                Enter your payment details
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={handlePaymentSubmit}
                className="space-y-4"
              >
                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={paymentData.email}
                    onChange={(e) =>
                      setPaymentData((p) => ({
                        ...p,
                        email: e.target.value,
                      }))
                    }
                    required
                  />
                </div>

                {/* Card Number */}
                <div className="space-y-2">
                  <Label htmlFor="cardNumber">Card Number</Label>
                  <Input
                    id="cardNumber"
                    placeholder="1234 5678 9012 3456"
                    value={paymentData.cardNumber}
                    onChange={(e) =>
                      setPaymentData((p) => ({
                        ...p,
                        cardNumber: e.target.value,
                      }))
                    }
                    required
                  />
                </div>

                {/* Expiry & CVV */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expiryDate">Expiry Date</Label>
                    <Input
                      id="expiryDate"
                      placeholder="MM/YY"
                      value={paymentData.expiryDate}
                      onChange={(e) =>
                        setPaymentData((p) => ({
                          ...p,
                          expiryDate: e.target.value,
                        }))
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cvv">CVV</Label>
                    <Input
                      id="cvv"
                      placeholder="123"
                      value={paymentData.cvv}
                      onChange={(e) =>
                        setPaymentData((p) => ({
                          ...p,
                          cvv: e.target.value,
                        }))
                      }
                      required
                    />
                  </div>
                </div>

                {/* Cardholder Name */}
                <div className="space-y-2">
                  <Label htmlFor="cardholderName">
                    Name on Card
                  </Label>
                  <Input
                    id="cardholderName"
                    placeholder="Your Name"
                    value={paymentData.cardholderName}
                    onChange={(e) =>
                      setPaymentData((p) => ({
                        ...p,
                        cardholderName: e.target.value,
                      }))
                    }
                    required
                  />
                </div>

                <Separator />

                {/* Billing Address */}
                <div className="space-y-2">
                  <Label htmlFor="billingAddress">
                    Billing Address
                  </Label>
                  <Input
                    id="billingAddress"
                    placeholder="123 Main St"
                    value={paymentData.billingAddress}
                    onChange={(e) =>
                      setPaymentData((p) => ({
                        ...p,
                        billingAddress: e.target.value,
                      }))
                    }
                    required
                  />
                </div>

                {/* City & ZIP */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      placeholder="City"
                      value={paymentData.city}
                      onChange={(e) =>
                        setPaymentData((p) => ({
                          ...p,
                          city: e.target.value,
                        }))
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zipCode">ZIP Code</Label>
                    <Input
                      id="zipCode"
                      placeholder="Postal Code"
                      value={paymentData.zipCode}
                      onChange={(e) =>
                        setPaymentData((p) => ({
                          ...p,
                          zipCode: e.target.value,
                        }))
                      }
                      required
                    />
                  </div>
                </div>

                {/* Country */}
                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Select
                    onValueChange={(value) =>
                      setPaymentData((p) => ({
                        ...p,
                        country: value,
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="us">
                        United States
                      </SelectItem>
                      <SelectItem value="ca">Canada</SelectItem>
                      <SelectItem value="uk">
                        United Kingdom
                      </SelectItem>
                      <SelectItem value="de">
                        Germany
                      </SelectItem>
                      <SelectItem value="fr">France</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Security Note */}
                <div className="flex items-center gap-2 text-sm bg-gray-50 p-3 rounded">
                  <Lock className="h-4 w-4" />
                  <span>Your payment is secure</span>
                </div>

                {/* Actions */}
                <div className="flex gap-4 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep("details")}
                    className="flex-1"
                  >
                    Back
                  </Button>
                  <Button type="submit" className="flex-1">
                    Pay ${finalTotal}
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
                  src={tour.image}
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
                  <span>
                    {new Date(
                      bookingData.departureDate
                    ).toLocaleDateString()}
                  </span>
                </div>
                {bookingData.tripType === "round-trip" && (
                  <div className="flex justify-between">
                    <span>Return:</span>
                    <span>
                      {new Date(
                        bookingData.returnDate
                      ).toLocaleDateString()}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Guests:</span>
                  <span>{bookingData.guests}</span>
                </div>
                <div className="flex justify-between">
                  <span>Price/person:</span>
                  <span>${tour.price}</span>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>${totalPrice}</span>
                </div>
                <div className="flex justify-between">
                  <span>Taxes:</span>
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

  // DETAILS STEP
  return (
    <div className="max-w-4xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Booking Details Form */}
        <Card>
          <CardHeader>
            <CardTitle>Booking Details</CardTitle>
            <CardDescription>
              Complete your booking information for {tour.title}
            </CardDescription>
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
                    min={
                      bookingData.departureDate ||
                      new Date().toISOString().split("T")[0]
                    }
                    required
                  />
                </div>
              )}

              {/* Guests */}
              <div className="space-y-2">
                <Label htmlFor="guests">Number of Guests</Label>
                <Select
                  onValueChange={(val) =>
                    setBookingData((p) => ({
                      ...p,
                      guests: parseInt(val),
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select guests" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from(
                      { length: tour.maxGuests },
                      (_, i) => (
                        <SelectItem key={i} value={`${i + 1}`}>
                          {i + 1} {i === 0 ? "Guest" : "Guests"}
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
              </div>

              {/* Special Requests */}
              <div className="space-y-2">
                <Label htmlFor="requests">
                  Special Requests (Optional)
                </Label>
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
                <Button
                  type="button"
                  variant="outline"
                  onClick={onCancel}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={
                    !bookingData.departureDate ||
                    !bookingData.guests ||
                    (bookingData.tripType === "round-trip" &&
                      !bookingData.returnDate)
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
              <Calendar className="h-4 w-4" /> {tour.duration} &nbsp;
              <Users className="h-4 w-4" /> Max {tour.maxGuests}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <img
              src={tour.image}
              alt={tour.title}
              className="w-full h-48 object-cover rounded"
            />
            <p className="text-gray-600">{tour.description}</p>
            <div>
              <h4 className="font-semibold mb-2">Highlights:</h4>
              <div className="flex flex-wrap gap-2">
                {tour.highlights.map((hl, i) => (
                  <span
                    key={i}
                    className="px-2 py-1 bg-gray-200 rounded text-sm"
                  >
                    {hl}
                  </span>
                ))}
              </div>
            </div>
            <div className="bg-blue-50 p-4 rounded">
              <div className="text-2xl font-bold text-blue-600">
                ${tour.price}
              </div>
              <div className="text-sm text-gray-600">per person</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
