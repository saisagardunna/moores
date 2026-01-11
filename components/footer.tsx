"use client"

import Link from "next/link"
import { Phone, Mail, MapPin, Clock, Facebook, Instagram, Twitter, Heart } from "lucide-react"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gradient-to-br from-orange-50 to-amber-50 border-t-2 border-orange-100">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* About Section */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-gradient-to-br from-orange-500 to-amber-500 p-2 rounded-xl shadow-md">
                <span className="text-2xl">🍦</span>
              </div>
              <h3 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-amber-600">
                Moores
              </h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Premium handcrafted ice cream made with the finest ingredients. Serving happiness since years.
            </p>
            <div className="flex gap-3">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-white rounded-lg hover:bg-orange-100 transition-colors shadow-sm"
              >
                <Facebook className="h-5 w-5 text-orange-600" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-white rounded-lg hover:bg-orange-100 transition-colors shadow-sm"
              >
                <Instagram className="h-5 w-5 text-orange-600" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-white rounded-lg hover:bg-orange-100 transition-colors shadow-sm"
              >
                <Twitter className="h-5 w-5 text-orange-600" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-lg mb-4 text-gray-900">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-sm text-muted-foreground hover:text-orange-600 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/flavors-list" className="text-sm text-muted-foreground hover:text-orange-600 transition-colors">
                  Our Flavors
                </Link>
              </li>
              <li>
                <Link href="/cart" className="text-sm text-muted-foreground hover:text-orange-600 transition-colors">
                  Shopping Cart
                </Link>
              </li>
              <li>
                <Link href="/wishlist" className="text-sm text-muted-foreground hover:text-orange-600 transition-colors">
                  Wishlist
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-muted-foreground hover:text-orange-600 transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Information */}
          <div>
            <h4 className="font-bold text-lg mb-4 text-gray-900">Information</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-sm text-muted-foreground hover:text-orange-600 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-muted-foreground hover:text-orange-600 transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/faqs" className="text-sm text-muted-foreground hover:text-orange-600 transition-colors">
                  FAQs
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm text-muted-foreground hover:text-orange-600 transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-sm text-muted-foreground hover:text-orange-600 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="text-sm text-muted-foreground hover:text-orange-600 transition-colors">
                  Shipping & Return Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-bold text-lg mb-4 text-gray-900">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <Phone className="h-4 w-4 text-orange-600 mt-0.5 shrink-0" />
                <a href="tel:6309312041" className="text-sm text-muted-foreground hover:text-orange-600 transition-colors">
                  6309312041
                </a>
              </li>
              <li className="flex items-start gap-2">
                <Mail className="h-4 w-4 text-orange-600 mt-0.5 shrink-0" />
                <a href="mailto:moores1807@gmail.com" className="text-sm text-muted-foreground hover:text-orange-600 transition-colors break-all">
                  moores1807@gmail.com
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-orange-600 mt-0.5 shrink-0" />
                <span className="text-sm text-muted-foreground">
                  Moores Ice Cream Store
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Clock className="h-4 w-4 text-orange-600 mt-0.5 shrink-0" />
                <span className="text-sm text-muted-foreground">
                  Open Daily: 10:00 AM - 10:00 PM
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-orange-200">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground text-center md:text-left">
              © {2012} Moores Ice Cream. All rights reserved.
            </p>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              Made with <Heart className="h-4 w-4 text-red-500 fill-red-500 mx-1" /> for ice cream lovers
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
