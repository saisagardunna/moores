"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ShoppingCart, Heart, Menu, X, Phone, Mail, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { getCartCount, getWishlist } from "@/lib/cart-store"

export function Header() {
    const [cartCount, setCartCount] = useState(0)
    const [wishlistCount, setWishlistCount] = useState(0)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const pathname = usePathname()

    useEffect(() => {
        const updateCounts = () => {
            setCartCount(getCartCount())
            setWishlistCount(getWishlist().length)
        }

        updateCounts()
        window.addEventListener('storage', updateCounts)
        window.addEventListener('cartUpdated', updateCounts)

        return () => {
            window.removeEventListener('storage', updateCounts)
            window.removeEventListener('cartUpdated', updateCounts)
        }
    }, [])

    const navLinks = [
        { href: "/", label: "Home" },
        { href: "/flavors-list", label: "Flavors" },
        { href: "/contact", label: "Contact Us" },
    ]

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-white/98 backdrop-blur-lg border-b-2 border-orange-100 shadow-lg">
            <div className="max-w-7xl mx-auto px-6 py-3">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
                        <div className="bg-gradient-to-br from-orange-500 to-amber-500 p-2 rounded-xl shadow-md">
                            <span className="text-xl">🍦</span>
                        </div>
                        <div>
                            <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-amber-600">
                                Moores
                            </h1>
                            <p className="text-[10px] text-muted-foreground font-medium tracking-wide">Premium Ice Cream</p>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-6">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`text-sm font-semibold transition-all hover:text-orange-600 relative group ${pathname === link.href ? "text-orange-600" : "text-gray-700"
                                    }`}
                            >
                                {link.label}
                                {pathname === link.href && (
                                    <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full" />
                                )}
                                <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full scale-x-0 group-hover:scale-x-100 transition-transform" />
                            </Link>
                        ))}
                    </nav>

                    {/* Icons */}
                    <div className="flex items-center gap-2">
                        <Link href="/wishlist" className="hidden sm:block">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="relative hover:bg-orange-50 transition-colors rounded-xl"
                            >
                                <Heart className="h-5 w-5 text-orange-600" />
                                {wishlistCount > 0 && (
                                    <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-gradient-to-br from-orange-500 to-amber-500 border-2 border-white shadow-md">
                                        {wishlistCount}
                                    </Badge>
                                )}
                            </Button>
                        </Link>

                        <Link href="/cart">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="relative hover:bg-orange-50 transition-colors rounded-xl"
                            >
                                <ShoppingCart className="h-5 w-5 text-orange-600" />
                                {cartCount > 0 && (
                                    <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-gradient-to-br from-orange-500 to-amber-500 border-2 border-white shadow-md">
                                        {cartCount}
                                    </Badge>
                                )}
                            </Button>
                        </Link>

                        {/* Mobile Menu Button */}
                        <Button
                            variant="ghost"
                            size="lg"
                            className="md:hidden hover:bg-orange-50 rounded-xl"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            {mobileMenuOpen ? (
                                <X className="h-6 w-6 text-orange-600" />
                            ) : (
                                <Menu className="h-6 w-6 text-orange-600" />
                            )}
                        </Button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <nav className="md:hidden mt-6 pb-4 space-y-2 border-t border-orange-100 pt-4">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`block px-5 py-3 rounded-xl font-semibold transition-colors ${pathname === link.href
                                    ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md"
                                    : "hover:bg-orange-50 text-gray-700"
                                    }`}
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                {link.label}
                            </Link>
                        ))}
                        <Link
                            href="/wishlist"
                            className="block px-5 py-3 rounded-xl hover:bg-orange-50 text-gray-700 font-semibold"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Wishlist ({wishlistCount})
                        </Link>

                        {/* Mobile Contact Info */}
                        <div className="px-5 py-3 space-y-3 border-t border-orange-100 mt-3 pt-3">
                            <p className="text-xs font-bold text-orange-600 uppercase tracking-wider">Contact Us</p>
                            <a href="tel:6309312041" className="flex items-center gap-3 text-sm font-medium text-gray-700 hover:text-orange-600 transition-colors">
                                <Phone className="h-4 w-4" />
                                6309312041
                            </a>
                            <a href="mailto:moores1807@gmail.com" className="flex items-center gap-3 text-sm font-medium text-gray-700 hover:text-orange-600 transition-colors">
                                <Mail className="h-4 w-4" />
                                moores1807@gmail.com
                            </a>
                        </div>
                    </nav>
                )}
            </div>
        </header>
    )
}
