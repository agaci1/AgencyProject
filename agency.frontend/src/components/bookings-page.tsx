"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Navigation } from "@/components/navigation"
import { MapPin, Calendar, Users, DollarSign, User, ArrowLeft } from "lucide-react"

interface Booking {
  id: string
  tourName: string
  startPlace: string
  destination: string
  startDate: string
  endDate: string
  price: number
  totalPrice: number
  customerName: string
  status: "Confirmed" | "Paid" | "Pending" | "Cancelled"
  groupSize: number
  guide: string
}

interface BookingsPageProps {
  isLoggedIn: boolean
  user: { name: string; email: string } | null
  bookings?: Booking[]
  onLogout: () => void
  onBackToHome: () => void
  onLoginClick: () => void
  onViewTours: () => void
  onOpenAbout: () => void
}

export function BookingsPage({
  isLoggedIn,
  user,
  bookings = [],
  onLogout,
  onBackToHome,
  onLoginClick,
  onViewTours,
  onOpenAbout,
}: BookingsPageProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Confirmed":
        return "bg-green-100 text-green-800"
      case "Paid":
        return "bg-blue-100 text-blue-800"
      case "Pending":
        return "bg-yellow-100 text-yellow-800"
      case "Cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
   <Navigation
  isLoggedIn={isLoggedIn}
  user={user}
  onLogout={onLogout}
  onLoginClick={onLoginClick}
  onNavigate={(page) => {
    if (page === "login") onLoginClick()
    else if (page === "tours") onViewTours()
    else if (page === "home") onBackToHome()
    else if (page === "about") onOpenAbout()
  }}
    />
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            onClick={onBackToHome}
            variant="ghost"
            className="mb-4 flex items-center gap-2 text-blue-600 hover:text-blue-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Bookings</h1>
          <p className="text-gray-600">View and manage your tour bookings</p>
        </div>

        {/* User Info */}
        {user && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Account Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Name</p>
                  <p className="font-semibold">{user.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-semibold">{user.email}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Bookings List */}
        {bookings.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <h3 className="text-xl font-semibold mb-2">No Bookings Found</h3>
              <p className="text-gray-600 mb-6">You haven't made any bookings yet.</p>
              <Button onClick={onViewTours} className="bg-blue-600 hover:bg-blue-700">
                Browse Tours
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {bookings.map((booking) => (
              <Card key={booking.id} className="overflow-hidden">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl">{booking.tourName}</CardTitle>
                      <CardDescription>Booking ID: {booking.id}</CardDescription>
                    </div>
                    <Badge className={getStatusColor(booking.status)}>{booking.status}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Location Details */}
                    <div className="space-y-3">
                      <h4 className="font-semibold text-gray-900">Location Details</h4>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="h-4 w-4 text-blue-500" />
                          <span className="text-gray-600">From:</span>
                          <span className="font-medium">{booking.startPlace}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="h-4 w-4 text-green-500" />
                          <span className="text-gray-600">To:</span>
                          <span className="font-medium">{booking.destination}</span>
                        </div>
                      </div>
                    </div>

                    {/* Date & Group Details */}
                    <div className="space-y-3">
                      <h4 className="font-semibold text-gray-900">Trip Details</h4>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-4 w-4 text-blue-500" />
                          <span className="text-gray-600">Start:</span>
                          <span className="font-medium">{formatDate(booking.startDate)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-4 w-4 text-red-500" />
                          <span className="text-gray-600">End:</span>
                          <span className="font-medium">{formatDate(booking.endDate)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Users className="h-4 w-4 text-purple-500" />
                          <span className="text-gray-600">Group Size:</span>
                          <span className="font-medium">
                            {booking.groupSize} {booking.groupSize === 1 ? "person" : "people"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <User className="h-4 w-4 text-orange-500" />
                          <span className="text-gray-600">Guide:</span>
                          <span className="font-medium">{booking.guide}</span>
                        </div>
                      </div>
                    </div>

                    {/* Pricing Details */}
                    <div className="space-y-3">
                      <h4 className="font-semibold text-gray-900">Pricing</h4>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <DollarSign className="h-4 w-4 text-green-500" />
                          <span className="text-gray-600">Price per person:</span>
                          <span className="font-medium">${booking.price}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <DollarSign className="h-4 w-4 text-blue-500" />
                          <span className="text-gray-600">Total Price:</span>
                          <span className="font-bold text-lg text-blue-600">${booking.totalPrice}</span>
                        </div>
                        <div className="text-xs text-gray-500">Customer: {booking.customerName}</div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-6 pt-4 border-t flex gap-3">
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                    {booking.status === "Confirmed" && (
                      <Button variant="outline" size="sm">
                        Download Voucher
                      </Button>
                    )}
                    {booking.status === "Pending" && (
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                        Complete Payment
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Summary Stats */}
        {bookings.length > 0 && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Booking Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{bookings.length}</div>
                  <div className="text-sm text-gray-600">Total Bookings</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {bookings.filter((b) => b.status === "Confirmed" || b.status === "Paid").length}
                  </div>
                  <div className="text-sm text-gray-600">Confirmed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">
                    {bookings.filter((b) => b.status === "Pending").length}
                  </div>
                  <div className="text-sm text-gray-600">Pending</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    ${bookings.reduce((sum, booking) => sum + booking.totalPrice, 0)}
                  </div>
                  <div className="text-sm text-gray-600">Total Spent</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
