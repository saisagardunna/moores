"use client"

import { useState, useEffect } from "react"
import { ShoppingCart, X, Plus, Minus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { getCart, removeFromCart, updateCartQuantity, getCartTotal, getCartCount, type CartItem } from "@/lib/cart-store"

export function CartSheet() {
    const [cart, setCart] = useState<CartItem[]>([])
    const [isOpen, setIsOpen] = useState(false)

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

    const cartCount = getCartCount()
    const total = getCartTotal()

    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="relative">
                    <ShoppingCart className="h-5 w-5" />
                    {cartCount > 0 && (
                        <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
                            {cartCount}
                        </Badge>
                    )}
                </Button>
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
                <SheetHeader>
                    <SheetTitle className="flex items-center gap-2">
                        <ShoppingCart className="h-5 w-5" />
                        Shopping Cart ({cartCount} items)
                    </SheetTitle>
                </SheetHeader>

                <div className="mt-8 space-y-4">
                    {cart.length === 0 ? (
                        <div className="text-center py-12">
                            <ShoppingCart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                            <p className="text-muted-foreground">Your cart is empty</p>
                            <Button className="mt-4" onClick={() => setIsOpen(false)}>
                                Continue Shopping
                            </Button>
                        </div>
                    ) : (
                        <>
                            {cart.map((item) => (
                                <div key={item.id} className="flex gap-4 p-4 border rounded-lg">
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="w-20 h-20 object-cover rounded-md"
                                    />
                                    <div className="flex-1">
                                        <h4 className="font-semibold">{item.name}</h4>
                                        <p className="text-sm text-muted-foreground">{item.price}</p>
                                        <div className="flex items-center gap-2 mt-2">
                                            <Button
                                                size="icon"
                                                variant="outline"
                                                className="h-7 w-7"
                                                onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                                            >
                                                <Minus className="h-3 w-3" />
                                            </Button>
                                            <span className="w-8 text-center">{item.quantity}</span>
                                            <Button
                                                size="icon"
                                                variant="outline"
                                                className="h-7 w-7"
                                                onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                                            >
                                                <Plus className="h-3 w-3" />
                                            </Button>
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                className="h-7 w-7 ml-auto text-destructive"
                                                onClick={() => handleRemove(item.id)}
                                            >
                                                <Trash2 className="h-3 w-3" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            <div className="border-t pt-4 mt-4">
                                <div className="flex justify-between text-lg font-semibold mb-4">
                                    <span>Total:</span>
                                    <span>₹{total.toFixed(2)}</span>
                                </div>
                                <Button className="w-full" size="lg">
                                    Proceed to Checkout
                                </Button>
                            </div>
                        </>
                    )}
                </div>
            </SheetContent>
        </Sheet>
    )
}
