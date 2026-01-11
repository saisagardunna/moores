"use client"

import { useState, useEffect } from "react"
import { Heart, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { getWishlist, removeFromWishlist, type WishlistItem } from "@/lib/cart-store"

export function WishlistSheet() {
    const [wishlist, setWishlist] = useState<WishlistItem[]>([])
    const [isOpen, setIsOpen] = useState(false)

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

    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="relative">
                    <Heart className="h-5 w-5" />
                    {wishlist.length > 0 && (
                        <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
                            {wishlist.length}
                        </Badge>
                    )}
                </Button>
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
                <SheetHeader>
                    <SheetTitle className="flex items-center gap-2">
                        <Heart className="h-5 w-5" />
                        Wishlist ({wishlist.length} items)
                    </SheetTitle>
                </SheetHeader>

                <div className="mt-8 space-y-4">
                    {wishlist.length === 0 ? (
                        <div className="text-center py-12">
                            <Heart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                            <p className="text-muted-foreground">Your wishlist is empty</p>
                            <Button className="mt-4" onClick={() => setIsOpen(false)}>
                                Browse Flavors
                            </Button>
                        </div>
                    ) : (
                        wishlist.map((item) => (
                            <div key={item.id} className="flex gap-4 p-4 border rounded-lg group">
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-20 h-20 object-cover rounded-md"
                                />
                                <div className="flex-1">
                                    <h4 className="font-semibold">{item.name}</h4>
                                    <p className="text-sm text-muted-foreground">{item.price}</p>
                                </div>
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    className="text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                                    onClick={() => handleRemove(item.id)}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        ))
                    )}
                </div>
            </SheetContent>
        </Sheet>
    )
}
