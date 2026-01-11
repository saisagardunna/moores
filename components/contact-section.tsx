"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Phone, Mail, MapPin, Clock, Minus, Plus, Wallet, Banknote, Smartphone, Loader2 } from "lucide-react"
import dynamic from "next/dynamic"
import { useToast } from "@/hooks/use-toast"
import { PaymentQR } from "@/components/payment-qr"
import { ScheduleCall } from "@/components/schedule-call"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { generateOrderPDF } from "@/lib/pdf-export"
import styles from "@/components/ice-cream-effects.module.css"
import { flavorDetails } from "@/lib/flavor-data"
const LeafletLocationPicker = dynamic(() => import('./LeafletLocationPicker'), {
  ssr: false,
  loading: () => (
    <div className="h-[400px] w-full rounded-lg bg-orange-50 flex flex-col items-center justify-center gap-2 border-2 border-orange-100 mt-4">
      <Loader2 className="w-8 h-8 animate-spin text-orange-400" />
      <p className="text-sm text-orange-600 font-medium tracking-wide">Initializing Map Delivery View...</p>
    </div>
  ),
})




interface ContactSectionProps {
  preSelectedFlavors?: string[]
  onFlavorUpdate?: (flavors: string[]) => void
}

export function ContactSection({ preSelectedFlavors = [], onFlavorUpdate }: ContactSectionProps) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    selectedFlavors: [] as string[],
    message: "",
    inquiryType: "",
    stallName: "",
    deliveryDate: "",
    addressDetails: "", // Landmarks, house no, etc.
    paymentMethod: "", // "phonepe" or "cod"
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPayment, setShowPayment] = useState(false)
  const [location, setLocation] = useState<{ latitude: number; longitude: number; accuracy?: number } | null>(null)
  const [locationStatus, setLocationStatus] = useState<"requesting" | "granted" | "denied" | null>(null)
  const [updateKey, setUpdateKey] = useState(0) // Force re-render key
  const { toast } = useToast()


  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      selectedFlavors: preSelectedFlavors,
    }))
  }, [preSelectedFlavors])

  // Request location when user starts filling form
  useEffect(() => {
    if (formData.name && !location && locationStatus === null) {
      // Add small delay to ensure form is ready
      const timer = setTimeout(() => {
        requestLocation()
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [formData.name])

  const requestLocation = async () => {
    if (!navigator.geolocation) {
      toast({
        title: "Location Not Supported",
        description: "Your browser doesn't support location services",
        variant: "destructive"
      })
      setLocationStatus("denied")
      return
    }

    // Check if permission is already granted
    try {
      if (navigator.permissions) {
        const permissionStatus = await navigator.permissions.query({ name: 'geolocation' })

        if (permissionStatus.state === 'denied') {
          setLocationStatus("denied")
          toast({
            title: "Location Permission Blocked",
            description: "Please enable location in your browser settings and refresh.",
            variant: "destructive"
          })
          return
        }
      }
    } catch (error) {
      console.log("Permission API not available, proceeding with direct request")
    }

    setLocationStatus("requesting")

    // Primary: Browser Geolocation
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy
        }
        setLocation(coords)
        setLocationStatus("granted")

        const accuracyText = coords.accuracy < 50
          ? "High accuracy (GPS)"
          : coords.accuracy < 200
            ? "Medium accuracy (WiFi)"
            : "Low accuracy (Network)"

        toast({
          title: "📍 Location Captured",
          description: `Lat: ${coords.latitude.toFixed(4)}, Lng: ${coords.longitude.toFixed(4)}\n${accuracyText} - ±${Math.round(coords.accuracy)}m`,
        })
      },
      async (error) => {
        console.warn("Browser Geolocation failed, trying IP fallback...", error)

        try {
          // Fallback: IP-based Geolocation (Free API)
          const response = await fetch('https://ipapi.co/json/')
          const data = await response.json()

          if (data.latitude && data.longitude) {
            const coords = {
              latitude: data.latitude,
              longitude: data.longitude,
              accuracy: 5000 // IP geolocation is rough (city level)
            }
            setLocation(coords)
            setLocationStatus("granted")

            toast({
              title: "📍 Location Detected (IP Fallback)",
              description: `City: ${data.city || 'Detected'}. Accuracy: ±5km (Desktop Mode)`,
            })
            return
          }
        } catch (ipError) {
          console.error("IP Fallback failed too:", ipError)
        }

        setLocationStatus("denied")
        let errorMessage = "We'll proceed without location. You can add it manually in the message."

        if (error.code === 1) {
          errorMessage = "Location access denied. Please allow location in browser settings."
        } else if (error.code === 2) {
          errorMessage = "Location unavailable on this device. Please use a mobile phone for accurate GPS."
        } else if (error.code === 3) {
          errorMessage = "Location request timed out. Please add your address manually."
        }

        toast({
          title: "Location Access Failed",
          description: errorMessage,
          variant: "destructive"
        })
      },
      {
        enableHighAccuracy: false,
        timeout: 5000, // Faster timeout since we have a fallback
        maximumAge: 300000
      }
    )
  }



  const updateFlavorQuantity = (flavor: string, change: number) => {
    setFormData((prev) => {
      const newFlavors = [...prev.selectedFlavors]

      if (change > 0) {
        newFlavors.push(flavor)
      } else {
        const index = newFlavors.indexOf(flavor)
        if (index > -1) {
          newFlavors.splice(index, 1)
        }
      }

      const updatedData = { ...prev, selectedFlavors: newFlavors }

      if (onFlavorUpdate) {
        onFlavorUpdate(newFlavors)
      }

      // Sync with cart - update cart quantities
      if (typeof window !== 'undefined') {
        const { updateCartQuantity, getCart } = require('@/lib/cart-store')
        const cart = getCart()
        const cartItem = cart.find((item: any) => item.id === flavor)

        if (cartItem) {
          const newQuantity = newFlavors.filter((f) => f === flavor).length
          updateCartQuantity(flavor, newQuantity)
        }
      }

      return updatedData
    })

    // Force re-render to update the display
    setUpdateKey(prev => prev + 1)
  }

  const getFlavorQuantity = (flavor: string) => {
    return formData.selectedFlavors.filter((f) => f === flavor).length
  }

  const getUniqueFlavorsSummary = () => {
    const flavorCounts: { [key: string]: number } = {}
    formData.selectedFlavors.forEach((flavor) => {
      flavorCounts[flavor] = (flavorCounts[flavor] || 0) + 1
    })
    return flavorCounts
  }

  const getFormattedFlavorsList = () => {
    const flavorCounts = getUniqueFlavorsSummary()
    return Object.entries(flavorCounts)
      .map(([flavor, quantity]) => `${flavor}(${quantity})`)
      .join(", ")
  }

  // Helper function to get actual price for each flavor
  const getFlavorPrice = (flavorIdOrName: string): number => {
    // First, try to find by ID directly (e.g., "black-current")
    if (flavorDetails[flavorIdOrName]) {
      const priceStr = flavorDetails[flavorIdOrName].price
      const priceNum = parseInt(priceStr.replace(/[^0-9]/g, ''))
      return isNaN(priceNum) ? 500 : priceNum
    }

    // If not found by ID, try to find by name (case-insensitive)
    const flavorKey = Object.keys(flavorDetails).find(
      key => flavorDetails[key].name.toLowerCase() === flavorIdOrName.toLowerCase()
    )

    if (flavorKey && flavorDetails[flavorKey]) {
      const priceStr = flavorDetails[flavorKey].price
      const priceNum = parseInt(priceStr.replace(/[^0-9]/g, ''))
      return isNaN(priceNum) ? 500 : priceNum
    }

    return 500 // Default price if flavor not found
  }

  // Calculate total amount using actual flavor prices
  const calculateTotalAmount = () => {
    const flavorCounts = getUniqueFlavorsSummary()
    let total = 0

    Object.entries(flavorCounts).forEach(([flavorName, quantity]) => {
      const price = getFlavorPrice(flavorName)
      total += price * quantity
    })

    return total
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Strict Validation: Ensure all fields are filled
    if (!formData.name || !formData.phone || !formData.stallName || !formData.deliveryDate || !formData.paymentMethod || !formData.addressDetails || !formData.inquiryType || formData.selectedFlavors.length === 0) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields, including your address and payment method, before submitting.",
        variant: "destructive"
      })
      return
    }

    setIsSubmitting(true)

    try {
      const flavorCounts = getUniqueFlavorsSummary()
      const calculatedTotalAmount = calculateTotalAmount()

      // Submit order via comprehensive API (handles MongoDB, Gmail, and Web3Forms)
      const orderResponse = await fetch("/api/submit-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          stallName: formData.stallName,
          iceCreams: Object.entries(flavorCounts).map(([name, quantity]) => ({
            name,
            quantity,
            price: getFlavorPrice(name), // Use actual price instead of hardcoded 230
            category: "Mixed",
          })),
          inquiryType: formData.inquiryType,
          message: formData.message,
          deliveryDate: formData.deliveryDate,
          totalAmount: calculatedTotalAmount,
          paymentMethod: formData.paymentMethod,
          addressDetails: formData.addressDetails,
          location: location, // Include client location
        }),
      })

      const orderResult = await orderResponse.json()

      // Log the response for debugging
      console.log("Order API Response:", orderResult)
      console.log("Email sent:", orderResult.emailSent)
      if (!orderResult.emailSent) {
        console.error("❌ EMAIL FAILED REASON:", orderResult.emailError)
        toast({
          title: "Email Sending Failed",
          description: `Error: ${orderResult.emailError}. Order was still saved!`,
          variant: "destructive"
        })
      }

      if (orderResult.success) {
        // Generate PDF Receipt Automatically
        generateOrderPDF({
          orderId: orderResult.orderId,
          name: formData.name,
          phone: formData.phone,
          stallName: formData.stallName,
          deliveryDate: formData.deliveryDate,
          iceCreams: Object.entries(flavorCounts).map(([nameOrId, quantity]) => ({
            name: flavorDetails[nameOrId]?.name || nameOrId,
            quantity,
            pricePerUnit: getFlavorPrice(nameOrId)
          })),
          paymentMethod: formData.paymentMethod,
          totalAmount: calculatedTotalAmount,
          inquiryType: formData.inquiryType,
          message: formData.message,
          createdAt: new Date(),
          status: 'Confirmed'
        })

        const successMessage = orderResult.emailSent
          ? `Email sent successfully! Check spam folder at moores1807@gmail.com.`
          : `Order saved! Email sending failed - ${orderResult.emailError || 'check console'}`

        toast({
          title: "Order Submitted Successfully! 🎉",
          description: `Thank you ${formData.name}! ${successMessage} PDF Receipt downloaded.`,
        })

        if (onFlavorUpdate) {
          onFlavorUpdate([])
        }
        setFormData({
          name: "",
          phone: "",
          selectedFlavors: [],
          message: "",
          inquiryType: "",
          stallName: "",
          deliveryDate: "",
          paymentMethod: "",
          addressDetails: "",
        })
        setShowPayment(false)
        setLocation(null)
        setLocationStatus(null)
      } else {
        throw new Error(orderResult.error || "Form submission failed")
      }
    } catch (error) {
      console.error("Order submission error:", error)
      toast({
        title: "Submission Failed",
        description: error instanceof Error ? error.message : "Please try again or contact us directly at 6309312041.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id="contact" className="py-16 px-4 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4 text-balance">Place Your Order</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
            Fill in your details below. Your selected ice cream flavors are ready for ordering!
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Complete Your Order</CardTitle>
              <CardDescription>Your details and selected flavors</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {formData.selectedFlavors.length > 0 && (
                  <div className="space-y-3 p-4 bg-muted/50 rounded-lg">
                    <Label className="text-base font-medium">Your Selected Ice Creams</Label>
                    <div className="p-3 bg-background rounded-md border">
                      <p className="font-medium text-primary">{getFormattedFlavorsList()}</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Total items: {formData.selectedFlavors.length}
                      </p>
                    </div>
                    <div className="space-y-2">
                      {Object.entries(getUniqueFlavorsSummary()).map(([flavorId, quantity]) => {
                        const unitPrice = getFlavorPrice(flavorId)
                        const subtotal = unitPrice * quantity
                        return (
                          <div key={flavorId} className="flex flex-col bg-background p-4 rounded-xl border-2 border-orange-50 hover:border-orange-200 transition-all shadow-sm">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex flex-col">
                                <span className="font-bold text-gray-900">{flavorDetails[flavorId]?.name || flavorId}</span>
                                <span className="text-xs text-orange-600 font-bold">₹{unitPrice} per unit</span>
                              </div>
                              <div className="flex items-center gap-3 bg-gray-50 p-1 rounded-full border">
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 rounded-full hover:bg-white text-orange-600"
                                  onClick={() => updateFlavorQuantity(flavorId, -1)}
                                  disabled={quantity <= 0}
                                >
                                  <Minus className="w-4 h-4" />
                                </Button>
                                <span className="min-w-[1.5rem] text-center font-bold text-gray-700">
                                  {quantity}
                                </span>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 rounded-full hover:bg-white text-orange-600"
                                  onClick={() => updateFlavorQuantity(flavorId, 1)}
                                >
                                  <Plus className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                            <div className="flex justify-between items-center pt-2 border-t border-dashed border-gray-100 italic">
                              <span className="text-xs text-gray-400">Subtotal:</span>
                              <span className="text-sm font-black text-orange-600">₹{subtotal.toFixed(2)}</span>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                      required
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                      required
                      placeholder="Enter your phone number"
                    />
                  </div>
                </div>

                {/* Accurate Location Picker */}
                {locationStatus && (
                  <div className={`p-4 rounded-xl border-2 transition-all duration-500 overflow-hidden ${locationStatus === "granted"
                    ? "bg-green-50/50 border-green-100 dark:bg-green-950/20 dark:border-green-900"
                    : locationStatus === "denied"
                      ? "bg-red-50/50 border-red-100 dark:bg-red-950/20 dark:border-red-900"
                      : "bg-blue-50/50 border-blue-100 dark:bg-blue-950/20 dark:border-blue-900"
                    }`}>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full ${locationStatus === "granted" ? "bg-green-100 text-green-600" :
                          locationStatus === "denied" ? "bg-red-100 text-red-600" :
                            "bg-blue-100 text-blue-600"
                          }`}>
                          <MapPin className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-gray-900 dark:text-gray-100">
                            {locationStatus === "granted" ? "Location Detected" :
                              locationStatus === "denied" ? "Location Access Blocked" : "Detecting Your Location..."}
                          </h4>
                          <p className="text-[11px] text-gray-500 font-medium">
                            {locationStatus === "granted" ? "Drag the marker to your exact house for 100% accuracy" :
                              locationStatus === "denied" ? "Using manual address only" : "Using Industry Standard detection..."}
                          </p>
                        </div>
                      </div>

                      {locationStatus === "denied" && (
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setLocationStatus(null)
                            requestLocation()
                          }}
                          className="h-8 text-[11px] px-3 bg-white"
                        >
                          Try Again
                        </Button>
                      )}
                    </div>
                    {locationStatus === "granted" && location && (
                      <div className="mt-4 animate-in fade-in zoom-in duration-500">
                        <LeafletLocationPicker
                          initialPosition={{ lat: location.latitude, lng: location.longitude }}
                          onConfirm={async (pos: { lat: number; lng: number }) => {
                            // Save coordinates immediately
                            setLocation({ latitude: pos.lat, longitude: pos.lng, accuracy: 0 })

                            // Try to get human-readable address for the toast
                            let address = "Location confirmed"
                            try {
                              const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${pos.lat}&lon=${pos.lng}`)
                              const data = await res.json()
                              address = data.display_name ? `📍 ${data.display_name.split(',').slice(0, 3).join(',')}` : "Location coordinates captured"
                            } catch (e) {
                              console.warn("Frontend geocoding failed")
                            }

                            toast({
                              title: "✅ Accuracy Confirmed",
                              description: address,
                            })
                          }}
                        />
                      </div>
                    )}
                  </div>
                )}

                <div className="bg-orange-50/50 p-5 rounded-2xl border-2 border-orange-100 space-y-3 transition-all hover:bg-orange-50">
                  <Label htmlFor="addressDetails" className="text-orange-900 font-bold flex items-center gap-2 text-sm">
                    🏠 House No. / Landmark / Nearest Place
                  </Label>
                  <Input
                    id="addressDetails"
                    placeholder="Example: Flat 201, Near Pizza Hut, Beside SBI ATM..."
                    value={formData.addressDetails}
                    onChange={(e) => setFormData({ ...formData, addressDetails: e.target.value })}
                    className="bg-white border-orange-200 focus:border-orange-500 rounded-xl h-12 shadow-sm"
                  />
                  <p className="text-[10px] text-orange-600 font-bold uppercase tracking-wider">
                    Pinpoint Accuracy: Add your nearest famous landmark!
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="stallName">Stall Name *</Label>
                    <Input
                      id="stallName"
                      value={formData.stallName}
                      onChange={(e) => setFormData((prev) => ({ ...prev, stallName: e.target.value }))}
                      required
                      placeholder="Enter your stall name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="deliveryDate">Delivery Date *</Label>
                    <Input
                      id="deliveryDate"
                      type="date"
                      value={formData.deliveryDate}
                      onChange={(e) => setFormData((prev) => ({ ...prev, deliveryDate: e.target.value }))}
                      required
                      min={new Date().toISOString().split("T")[0]}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="inquiry-type">Inquiry Type</Label>
                  <Select
                    value={formData.inquiryType}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, inquiryType: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select inquiry type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="order">Place Order</SelectItem>
                      <SelectItem value="bulk">Bulk Order</SelectItem>
                      <SelectItem value="catering">Event Catering</SelectItem>
                      <SelectItem value="feedback">Feedback</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Additional Message</Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => setFormData((prev) => ({ ...prev, message: e.target.value }))}
                    placeholder="Any special requests, delivery instructions, or additional information..."
                    rows={4}
                  />
                </div>

                {/* Payment Method Selection */}
                <div className="space-y-4 animate-slide-up">
                  <Label className="text-lg font-semibold flex items-center gap-2">
                    <Wallet className="w-5 h-5 text-primary" />
                    Choose Payment Method
                  </Label>
                  <RadioGroup
                    value={formData.paymentMethod}
                    onValueChange={(value) => {
                      setFormData((prev) => ({ ...prev, paymentMethod: value }))
                      setShowPayment(true)
                    }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                  >
                    <div className="relative group">
                      <RadioGroupItem value="phonepe" id="phonepe" className="peer sr-only" />
                      <Label
                        htmlFor="phonepe"
                        className="relative flex flex-col items-center justify-center rounded-2xl border-4 border-muted bg-background h-48 overflow-hidden hover:border-purple-400 peer-data-[state=checked]:border-purple-600 peer-data-[state=checked]:shadow-[0_0_30px_rgba(147,51,234,0.3)] cursor-pointer transition-all duration-500 transform hover:scale-[1.02]"
                      >
                        {/* Background Video */}
                        <video
                          autoPlay
                          loop
                          muted
                          playsInline
                          className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-500"
                        >
                          <source src="/Upi.mp4" type="video/mp4" />
                        </video>

                        {/* Overlay to ensure text readability */}
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/80 to-white peer-data-[state=checked]:via-purple-50/90 peer-data-[state=checked]:to-purple-50 transition-all duration-300"></div>

                        {/* Content */}
                        <div className="relative z-10 flex flex-col items-center">
                          <div className="p-3 bg-purple-100 rounded-full mb-3 shadow-inner">
                            <Smartphone className="w-10 h-10 text-purple-600 animate-pulse" />
                          </div>
                          <span className="text-xl font-black text-purple-900 uppercase tracking-tighter">UPI / PhonePe</span>
                          <span className="text-xs text-purple-700 font-bold mt-1 bg-white/50 px-2 py-0.5 rounded-full">Scan & Pay Securely</span>
                        </div>
                      </Label>
                    </div>

                    <div className="relative group">
                      <RadioGroupItem value="cod" id="cod" className="peer sr-only" />
                      <Label
                        htmlFor="cod"
                        className="relative flex flex-col items-center justify-center rounded-2xl border-4 border-muted bg-background h-48 overflow-hidden hover:border-green-400 peer-data-[state=checked]:border-green-600 peer-data-[state=checked]:shadow-[0_0_30px_rgba(22,163,74,0.3)] cursor-pointer transition-all duration-500 transform hover:scale-[1.02]"
                      >
                        {/* Background Video */}
                        <video
                          autoPlay
                          loop
                          muted
                          playsInline
                          className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-500"
                        >
                          <source src="/Cash.mp4" type="video/mp4" />
                        </video>

                        {/* Overlay to ensure text readability */}
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/80 to-white peer-data-[state=checked]:via-green-50/90 peer-data-[state=checked]:to-green-50 transition-all duration-300"></div>

                        {/* Content */}
                        <div className="relative z-10 flex flex-col items-center">
                          <div className="p-3 bg-green-100 rounded-full mb-3 shadow-inner">
                            <Banknote className="w-10 h-10 text-green-600 animate-bounce" style={{ animationDuration: '3s' }} />
                          </div>
                          <span className="text-xl font-black text-green-900 uppercase tracking-tighter">Cash on Delivery</span>
                          <span className="text-xs text-green-700 font-bold mt-1 bg-white/50 px-2 py-0.5 rounded-full">Handover Cash</span>
                        </div>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Payment UI - Shows based on payment method */}
                {showPayment && formData.paymentMethod === "phonepe" && (
                  <div className="animate-fade-in">
                    <PaymentQR
                      amount={calculateTotalAmount()}
                      orderDetails={`${formData.name} - ${getFormattedFlavorsList()}`}
                      onPaymentComplete={() => {
                        handleSubmit({ preventDefault: () => { } } as React.FormEvent)
                      }}
                    />
                  </div>
                )}

                {showPayment && formData.paymentMethod === "cod" && (
                  <div className="animate-fade-in">
                    <Card className="border-2 border-green-500/50">
                      <CardHeader className="text-center">
                        <CardTitle className="flex items-center justify-center gap-2">
                          <Banknote className="w-6 h-6 text-green-600" />
                          Cash on Delivery Selected
                        </CardTitle>
                        <CardDescription>
                          You'll pay ₹{calculateTotalAmount()} when you receive your order
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Button
                          onClick={(e) => handleSubmit(e as any)}
                          disabled={isSubmitting}
                          className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 transition-all duration-300"
                          size="lg"
                        >
                          {isSubmitting ? "Confirming Order..." : `Confirm Order (${formData.selectedFlavors.length} items)`}
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                )}

                {/* Phone Call Scheduling */}
                {formData.name && formData.phone && (
                  <div className="mt-6 animate-fade-in">
                    <ScheduleCall customerName={formData.name} customerPhone={formData.phone} />
                  </div>
                )}

                <div className="text-xs text-muted-foreground text-center animate-fade-in bg-muted/30 p-4 rounded-lg">
                  📧 Your order will be sent to moores1807@gmail.com and we'll contact you at{" "}
                  {formData.phone || "your phone number"}
                  {" "}to confirm details and arrange delivery to {formData.stallName || "your stall"} on{" "}
                  {formData.deliveryDate || "selected date"}.
                </div>
              </form>

            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
