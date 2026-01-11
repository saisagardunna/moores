"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowDown } from "lucide-react"

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Full Screen HD Ice Cream Video */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        >
          <source src="/ice cream.mp4" type="video/mp4" />
        </video>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <h1 className="text-6xl md:text-8xl font-bold text-white mb-6 text-balance drop-shadow-2xl">Moores</h1>
        <p className="text-2xl md:text-3xl text-white/90 mb-4 text-balance drop-shadow-xl">Premium Ice Cream Experience</p>
        <p className="text-lg md:text-xl text-white/80 mb-8 max-w-2xl mx-auto text-pretty drop-shadow-lg">
          Indulge in our handcrafted ice cream flavors made with the finest ingredients. From classic favorites to
          exotic fruit blends and rich dry fruit varieties.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link href="/flavors-list">
            <Button size="lg" className="text-lg px-8 py-6 shadow-2xl hover:shadow-3xl transition-all">
              Explore Our Flavors
            </Button>
          </Link>
          <Link href="/contact">
            <Button
              variant="outline"
              size="lg"
              className="text-lg px-8 py-6 bg-white/90 shadow-2xl hover:shadow-3xl transition-all border-white/50"
            >
              Contact Us
            </Button>
          </Link>
        </div>

        <div className="mt-12">
          <Link href="/flavors-list">
            <ArrowDown className="w-8 h-8 text-white mx-auto drop-shadow-2xl animate-bounce cursor-pointer" />
          </Link>
        </div>
      </div>
    </section>
  )
}
