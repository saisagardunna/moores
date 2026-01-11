"use client"

import { useState, useEffect } from "react"
import { Heart, X, ArrowLeft, ShoppingCart } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { getWishlist, removeFromWishlist, clearWishlist, type WishlistItem } from "@/lib/cart-store"
import { addToCart } from "@/lib/cart-store"
import { Card, CardContent } from "@/components/ui/card"
import { useRouter } from "next/navigation"

export default function WishlistPage() {
    const [wishlist, setWishlist] = useState<WishlistItem[]>([])
    const router = useRouter()

    useEffect(() => {
        loadWishlist()
    }, [])

    const loadWishlist = () => {
        setWishlist(getWishlist())
    }

    const handleRemove = (itemId: string) => {
        removeFromWishlist(itemId)
        loadWishlist()
    }

    const handleClearWishlist = () => {
        if (confirm("Are you sure you want to clear your wishlist?")) {
            clearWishlist()
            loadWishlist()
        }
    }

    const handleAddToCart = (item: WishlistItem) => {
        addToCart({
            id: item.id,
            name: item.name,
            price: item.price,
            image: item.image
        }, 1)
        router.push('/cart')
    }

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
                            <h1 className="text-4xl font-bold text-primary mb-2">My Wishlist</h1>
                            <p className="text-muted-foreground">{wishlist.length} favorite flavors</p>
                        </div>
                        {wishlist.length > 0 && (
                            <Button variant="outline" onClick={handleClearWishlist}>
                                <X className="mr-2 h-4 w-4" />
                                Clear Wishlist
                            </Button>
                        )}
                    </div>
                </div>

                {wishlist.length === 0 ? (
                    <Card className="text-center py-16">
                        <CardContent>
                            <Heart className="h-24 w-24 mx-auto text-muted-foreground mb-6" />
                            <h2 className="text-2xl font-semibold mb-2">Your wishlist is empty</h2>
                            <p className="text-muted-foreground mb-6">Save your favorite ice cream flavors here!</p>
                            <Link href="/">
                                <Button size="lg">Browse Flavors</Button>
                            </Link>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {wishlist.map((item) => (
                            <Card key={item.id} className="group overflow-hidden hover:shadow-lg transition-shadow">
                                <CardContent className="p-0">
                                    <div className="relative">
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="w-full h-48 object-cover"
                                        />
                                        <Button
                                            size="icon"
                                            variant="destructive"
                                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                            onClick={() => handleRemove(item.id)}
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                    <div className="p-4">
                                        <h3 className="text-lg font-semibold mb-1">{item.name}</h3>
                                        <p className="text-primary font-medium mb-4">{item.price}</p>
                                        <Button
                                            className="w-full"
                                            onClick={() => handleAddToCart(item)}
                                        >
                                            <ShoppingCart className="mr-2 h-4 w-4" />
                                            Add to Cart
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
