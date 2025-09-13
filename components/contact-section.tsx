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
import { Phone, Mail, MapPin, Clock, Send, Minus, Plus } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

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
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const flavorCounts = getUniqueFlavorsSummary()

      const orderResponse = await fetch("/api/orders", {
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
            price: 0,
            category: "Mixed",
          })),
          inquiryType: formData.inquiryType,
          message: formData.message,
          deliveryDate: formData.deliveryDate,
          totalAmount: 0,
        }),
      })

      const orderResult = await orderResponse.json()

      const web3FormsResponse = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: "04af488a-752c-4a97-905b-1fcd534bca2d",
          name: formData.name,
          phone: formData.phone,
          selected_flavors: getFormattedFlavorsList(),
          delivery_date: formData.deliveryDate,
          inquiry_type: formData.inquiryType,
          message: formData.message,
          stall_name: formData.stallName,
          subject: `New Ice Cream Order from ${formData.name}`,
          from_name: "Moores Ice Cream Website",
          to: "chvamshi482@gmail.com",
        }),
      })

      const web3Result = await web3FormsResponse.json()

      if (web3Result.success && orderResult.success) {
        toast({
          title: "Order Submitted Successfully!",
          description: `Thank you ${formData.name}! Your order has been saved and we'll contact you at ${formData.phone} soon.`,
        })
        setFormData({
          name: "",
          phone: "",
          selectedFlavors: [],
          message: "",
          inquiryType: "",
          stallName: "",
          deliveryDate: "",
        })
      } else {
        throw new Error("Form submission failed")
      }
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "Please try again or contact us directly at 6309312041.",
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
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="w-5 h-5 text-primary" />
                  Contact Information
                </CardTitle>
                <CardDescription>Get in touch with us directly</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
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

                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  disabled={
                    isSubmitting ||
                    formData.selectedFlavors.length === 0 ||
                    !formData.stallName ||
                    !formData.deliveryDate
                  }
                >
                  <Send className="w-4 h-4 mr-2" />
                  {isSubmitting ? "Submitting..." : `Submit Order (${formData.selectedFlavors.length} items)`}
                </Button>

                <div className="text-xs text-muted-foreground text-center">
                  Your order will be sent to chvamshi482@gmail.com and we'll contact you at{" "}
                  {formData.phone || "your phone number"}
                  to confirm details and arrange delivery to {formData.stallName || "your stall"} on{" "}
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
