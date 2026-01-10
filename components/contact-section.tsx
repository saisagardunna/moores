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
import { Phone, Mail, MapPin, Clock, Minus, Plus, Wallet, Banknote, Smartphone } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { PaymentQR } from "@/components/payment-qr"
import { ScheduleCall } from "@/components/schedule-call"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { exportOrderToExcel } from "@/lib/excel-export"
import { generateOrderPDF } from "@/lib/pdf-export"
import styles from "@/components/ice-cream-effects.module.css"
import { flavorDetails } from "@/lib/flavor-data"




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
    paymentMethod: "", // "phonepe" or "cod"
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPayment, setShowPayment] = useState(false)
  const { toast } = useToast()


  useEffect(() => {
    if (preSelectedFlavors.length > 0) {
      setFormData((prev) => ({
        ...prev,
        selectedFlavors: preSelectedFlavors,
      }))
    }
  }, [preSelectedFlavors])

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

      return updatedData
    })
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
      return isNaN(priceNum) ? 230 : priceNum
    }

    // If not found by ID, try to find by name (case-insensitive)
    const flavorKey = Object.keys(flavorDetails).find(
      key => flavorDetails[key].name.toLowerCase() === flavorIdOrName.toLowerCase()
    )

    if (flavorKey && flavorDetails[flavorKey]) {
      const priceStr = flavorDetails[flavorKey].price
      const priceNum = parseInt(priceStr.replace(/[^0-9]/g, ''))
      return isNaN(priceNum) ? 230 : priceNum
    }

    return 230 // Default price if flavor not found
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

    // Prevent duplicate submissions
    if (isSubmitting) {
      console.log("Already submitting, ignoring duplicate request")
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
        // Export order data to Excel
        const excelFileName = exportOrderToExcel({
          name: formData.name,
          phone: formData.phone,
          stallName: formData.stallName,
          deliveryDate: formData.deliveryDate,
          iceCreams: Object.entries(flavorCounts).map(([name, quantity]) => ({
            name,
            quantity,
          })),
          paymentMethod: formData.paymentMethod,
          totalAmount: calculatedTotalAmount,
          inquiryType: formData.inquiryType,
          message: formData.message,
          createdAt: new Date(),
          status: 'Completed'
        })

        const successMessage = orderResult.emailSent
          ? `Email sent successfully! Check spam folder at chvamshi482@gmail.com.`
          : `Order saved! Email sending failed - ${orderResult.emailError || 'check console'}`

        toast({
          title: "Order Submitted Successfully! 🎉",
          description: `Thank you ${formData.name}! ${successMessage} Excel: "${excelFileName}"`,
        })

        setFormData({
          name: "",
          phone: "",
          selectedFlavors: [],
          message: "",
          inquiryType: "",
          stallName: "",
          deliveryDate: "",
          paymentMethod: "",
        })
        setShowPayment(false)
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-8">
            <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="w-5 h-5 text-primary" />
                  Contact Information
                </CardTitle>
                <CardDescription>Get in touch with us directly</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <span>6309312041</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <span>chvamshi482@gmail.com</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span>Moores Ice Cream Store</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span>Open Daily: 10:00 AM - 10:00 PM</span>
                  </div>
                </div>

                <a href="tel:6309312041" className="block w-full">
                  <div className={styles.contactButton}>
                    <span>Call Now</span>
                    <div className={styles.contactButtonIcon}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                      </svg>
                    </div>
                  </div>
                </a>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Why Choose Moores?</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>• Premium quality ingredients</li>
                  <li>• Handcrafted with traditional recipes</li>
                  <li>• Wide variety of unique flavors</li>
                  <li>• Fresh delivery to your doorstep</li>
                  <li>• Family-owned business since years</li>
                </ul>
              </CardContent>
            </Card>
          </div>

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
                      {Object.entries(getUniqueFlavorsSummary()).map(([flavor, quantity]) => (
                        <div key={flavor} className="flex items-center justify-between bg-background p-3 rounded-md">
                          <span className="font-medium">{flavor}</span>
                          <div className="flex items-center gap-2">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => updateFlavorQuantity(flavor, -1)}
                              disabled={quantity <= 0}
                            >
                              <Minus className="w-3 h-3" />
                            </Button>
                            <Badge variant="secondary" className="min-w-[2rem] text-center">
                              {quantity}
                            </Badge>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => updateFlavorQuantity(flavor, 1)}
                            >
                              <Plus className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
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
                    <div className="relative">
                      <RadioGroupItem value="phonepe" id="phonepe" className="peer sr-only" />
                      <Label
                        htmlFor="phonepe"
                        className="flex flex-col items-center justify-center rounded-lg border-2 border-muted bg-background p-6 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10 cursor-pointer transition-all duration-300 transform hover:scale-105"
                      >
                        <Smartphone className="w-10 h-10 mb-3 text-purple-600" />
                        <span className="text-lg font-semibold">PhonePe</span>
                        <span className="text-xs text-muted-foreground mt-1">Scan QR & Pay</span>
                      </Label>
                    </div>

                    <div className="relative">
                      <RadioGroupItem value="cod" id="cod" className="peer sr-only" />
                      <Label
                        htmlFor="cod"
                        className="flex flex-col items-center justify-center rounded-lg border-2 border-muted bg-background p-6 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10 cursor-pointer transition-all duration-300 transform hover:scale-105"
                      >
                        <Banknote className="w-10 h-10 mb-3 text-green-600" />
                        <span className="text-lg font-semibold">Cash on Delivery</span>
                        <span className="text-xs text-muted-foreground mt-1">Pay when you receive</span>
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
                  📧 Your order will be sent to chvamshi482@gmail.com and we'll contact you at{" "}
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
