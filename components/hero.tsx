"use client"

import { Button } from "@/components/ui/button"
import { ArrowDown } from "lucide-react"

export function Hero() {
  const scrollToFlavors = () => {
    document.getElementById("flavors")?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-amber-50">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="/colorful-ice-cream-scoops-and-cones-arrangement.jpg"
          alt="Delicious ice cream varieties"
          className="w-full h-full object-cover opacity-20"
        />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <h1 className="text-6xl md:text-8xl font-bold text-primary mb-6 text-balance">Moores</h1>
        <p className="text-2xl md:text-3xl text-muted-foreground mb-4 text-balance">Premium Ice Cream Experience</p>
        <p className="text-lg md:text-xl text-foreground mb-8 max-w-2xl mx-auto text-pretty">
          Indulge in our handcrafted ice cream flavors made with the finest ingredients. From classic favorites to
          exotic fruit blends and rich dry fruit varieties.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button size="lg" className="text-lg px-8 py-6" onClick={scrollToFlavors}>
            Explore Our Flavors
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="text-lg px-8 py-6 bg-transparent"
            onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
          >
            Contact Us
          </Button>
        </div>

        <div className="mt-12 animate-bounce">
          <ArrowDown className="w-8 h-8 text-primary mx-auto" />
        </div>
      </div>
    </section>
  )
}
