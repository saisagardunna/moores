"use client"

import { useState, useEffect } from "react"
import { ContactSection } from "@/components/contact-section"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getCart, type CartItem } from "@/lib/cart-store"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ShoppingCart } from "lucide-react"

export default function CheckoutPage() {
    const [cartItems, setCartItems] = useState<CartItem[]>([])
    const [selectedFlavors, setSelectedFlavors] = useState<string[]>([])

    const loadCartItems = () => {
        // Load cart items
        const items = getCart()
        setCartItems(items)

        // Convert cart items to flavor IDs for the contact form
        const flavorIds: string[] = []
        items.forEach(item => {
            // Add the flavor ID multiple times based on quantity
            for (let i = 0; i < item.quantity; i++) {
                flavorIds.push(item.id)
            }
        })
        setSelectedFlavors(flavorIds)
    }

    useEffect(() => {
        loadCartItems()

        // Listen for cart updates
        const handleCartUpdate = () => {
            loadCartItems()
        }

        window.addEventListener('cartUpdated', handleCartUpdate)
        window.addEventListener('storage', handleCartUpdate)

        // Also poll for updates every 500ms to catch any changes
        const interval = setInterval(() => {
            loadCartItems()
        }, 500)

        return () => {
            window.removeEventListener('cartUpdated', handleCartUpdate)
            window.removeEventListener('storage', handleCartUpdate)
            clearInterval(interval)
        }
    }, [])

    const handleFlavorUpdate = (flavors: string[]) => {
        setSelectedFlavors(flavors)
    }

    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0)
    const totalPrice = cartItems.reduce((sum, item) => {
        const price = parseFloat(item.price.replace('₹', ''))
        return sum + (price * item.quantity)
    }, 0)

    return (
        <main className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 py-12 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Cart Items Summary */}
                {cartItems.length > 0 && (
                    <Card className="mb-8 shadow-lg">
                        <CardHeader className="bg-gradient-to-r from-orange-100 to-amber-100">
                            <CardTitle className="flex items-center justify-between">
                                <span className="flex items-center gap-2">
                                    <ShoppingCart className="h-6 w-6 text-primary" />
                                    Your Cart Items
                                </span>
                                <Badge variant="secondary" className="text-lg px-4 py-1">
                                    {totalItems} items
                                </Badge>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                                {cartItems.map((item) => (
                                    <div key={item.id} className="flex gap-3 p-4 border-2 border-orange-100 rounded-xl bg-white hover:shadow-md transition-shadow">
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="w-24 h-24 object-cover rounded-lg"
                                        />
                                        <div className="flex-1">
                                            <h4 className="font-bold text-sm text-gray-900">{item.name}</h4>
                                            <p className="text-lg font-semibold text-primary">{item.price}</p>
                                            <Badge className="mt-2">
                                                Qty: {item.quantity}
                                            </Badge>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="flex justify-between items-center pt-4 border-t-2 border-orange-100">
                                <Link href="/cart">
                                    <Button variant="outline" size="lg">
                                        ← Edit Cart
                                    </Button>
                                </Link>
                                <div className="text-right">
                                    <p className="text-sm text-muted-foreground">Total Amount</p>
                                    <p className="text-3xl font-bold text-primary">₹{totalPrice.toFixed(2)}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Contact/Order Form */}
                <ContactSection
                    preSelectedFlavors={selectedFlavors}
                    onFlavorUpdate={handleFlavorUpdate}
                />
            </div>
        </main>
    )
}
