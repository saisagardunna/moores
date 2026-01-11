"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Phone, Mail, MapPin, Clock, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: ""
    })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const { toast } = useToast()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            const response = await fetch("https://api.web3forms.com/submit", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({
                    access_key: "76e95667-3dfd-4893-8daa-0667dfb0aec2",
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone,
                    subject: formData.subject,
                    message: formData.message,
                    from_name: "Moores Ice Cream Website"
                })
            })

            const result = await response.json()

            if (result.success) {
                toast({
                    title: "Message Sent Successfully! 🎉",
                    description: "Thank you for contacting us. We'll get back to you soon!",
                })

                // Reset form
                setFormData({
                    name: "",
                    email: "",
                    phone: "",
                    subject: "",
                    message: ""
                })
            } else {
                throw new Error(result.message || "Failed to send message")
            }
        } catch (error) {
            console.error("Contact form error:", error)
            toast({
                title: "Failed to Send Message",
                description: error instanceof Error ? error.message : "Please try again or call us directly.",
                variant: "destructive"
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <main className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 py-12 px-4">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">Contact Us</h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Have a question or want to place an order? We'd love to hear from you!
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Contact Information */}
                    <div className="space-y-6">
                        <Card className="bg-gradient-to-br from-orange-100 to-amber-100">
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
                                    <a href="tel:6309312041" className="hover:text-primary transition-colors">
                                        6309312041
                                    </a>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Mail className="w-4 h-4 text-muted-foreground" />
                                    <a href="mailto:moores1807@gmail.com" className="hover:text-primary transition-colors">
                                        moores1807@gmail.com
                                    </a>
                                </div>
                                <div className="flex items-center gap-3">
                                    <MapPin className="w-4 h-4 text-muted-foreground" />
                                    <span>Moores Ice Cream Store</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Clock className="w-4 h-4 text-muted-foreground" />
                                    <span>Open Daily: 10:00 AM - 10:00 PM</span>
                                </div>

                                <a href="tel:6309312041" className="block w-full mt-6">
                                    <Button className="w-full" size="lg">
                                        <Phone className="mr-2 h-5 w-5" />
                                        Call Now
                                    </Button>
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

                    {/* Contact Form */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Send Us a Message</CardTitle>
                            <CardDescription>Fill out the form below and we'll respond as soon as possible</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Full Name *</Label>
                                    <Input
                                        id="name"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        required
                                        placeholder="Enter your full name"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email *</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            required
                                            placeholder="your@email.com"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="phone">Phone Number *</Label>
                                        <Input
                                            id="phone"
                                            type="tel"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            required
                                            placeholder="Your phone number"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="subject">Subject *</Label>
                                    <Input
                                        id="subject"
                                        value={formData.subject}
                                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                        required
                                        placeholder="What is this regarding?"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="message">Message *</Label>
                                    <Textarea
                                        id="message"
                                        value={formData.message}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                        required
                                        placeholder="Tell us more about your inquiry..."
                                        rows={6}
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full"
                                    size="lg"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Sending...
                                        </>
                                    ) : (
                                        "Send Message"
                                    )}
                                </Button>

                                <p className="text-xs text-muted-foreground text-center">
                                    Your message will be sent to moores1807@gmail.com
                                </p>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </main>
    )
}
