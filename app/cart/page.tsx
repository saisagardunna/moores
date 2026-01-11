"use client"

import { useState, useEffect } from "react"
import { ShoppingCart, Trash2, Plus, Minus, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { getCart, removeFromCart, updateCartQuantity, getCartTotal, clearCart, type CartItem } from "@/lib/cart-store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function CartPage() {
    const [cart, setCart] = useState<CartItem[]>([])

    useEffect(() => {
        loadCart()
    }, [])

    const loadCart = () => {
        setCart(getCart())
    }

    const handleUpdateQuantity = (itemId: string, newQuantity: number) => {
        updateCartQuantity(itemId, newQuantity)
        loadCart()
    }

    const handleRemove = (itemId: string) => {
        removeFromCart(itemId)
        loadCart()
    }

    const handleClearCart = () => {
        if (confirm("Are you sure you want to clear your cart?")) {
            clearCart()
            loadCart()
        }
    }

    const total = getCartTotal()
    const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0)

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 py-12 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <Link href="/">
                        <Button variant="ghost" className="mb-4">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Shop
                        </Button>
                    </Link>
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-4xl font-bold text-primary mb-2">Shopping Cart</h1>
                            <p className="text-muted-foreground">{itemCount} items in your cart</p>
                        </div>
                        {cart.length > 0 && (
                            <Button variant="outline" onClick={handleClearCart}>
                                <Trash2 className="mr-2 h-4 w-4" />
                                Clear Cart
                            </Button>
                        )}
                    </div>
                </div>

                {cart.length === 0 ? (
                    <Card className="text-center py-16">
                        <CardContent>
                            <ShoppingCart className="h-24 w-24 mx-auto text-muted-foreground mb-6" />
                            <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
                            <p className="text-muted-foreground mb-6">Add some delicious ice cream to get started!</p>
                            <Link href="/">
                                <Button size="lg">Browse Flavors</Button>
                            </Link>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Cart Items */}
                        <div className="lg:col-span-2 space-y-4">
                            {cart.map((item) => (
                                <Card key={item.id}>
                                    <CardContent className="p-6">
                                        <div className="flex gap-6">
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="w-32 h-32 object-cover rounded-lg"
                                            />
                                            <div className="flex-1">
                                                <div className="flex justify-between items-start mb-4">
                                                    <div>
                                                        <h3 className="text-xl font-semibold">{item.name}</h3>
                                                        <p className="text-lg text-primary font-medium">{item.price}</p>
                                                    </div>
                                                    <Button
                                                        size="icon"
                                                        variant="ghost"
                                                        className="text-destructive"
                                                        onClick={() => handleRemove(item.id)}
                                                    >
                                                        <Trash2 className="h-5 w-5" />
                                                    </Button>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <Button
                                                        size="icon"
                                                        variant="outline"
                                                        onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                                                    >
                                                        <Minus className="h-4 w-4" />
                                                    </Button>
                                                    <span className="text-lg font-medium w-12 text-center">{item.quantity}</span>
                                                    <Button
                                                        size="icon"
                                                        variant="outline"
                                                        onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                                                    >
                                                        <Plus className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-1">
                            <Card className="sticky top-24">
                                <CardHeader>
                                    <CardTitle>Order Summary</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Subtotal</span>
                                            <span>₹{total.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Delivery</span>
                                            <span className="text-green-600">Free</span>
                                        </div>
                                        <div className="border-t pt-2 flex justify-between text-lg font-semibold">
                                            <span>Total</span>
                                            <span className="text-primary">₹{total.toFixed(2)}</span>
                                        </div>
                                    </div>
                                    <Link href="/checkout">
                                        <Button className="w-full" size="lg">
                                            Proceed to Checkout
                                        </Button>
                                    </Link>
                                    <Link href="/flavors-list">
                                        <Button variant="outline" className="w-full">
                                            Continue Shopping
                                        </Button>
                                    </Link>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
