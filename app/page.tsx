// C:\Users\vamsh\Downloads\moores-ice-cream (2)\app\page.tsx
// Fixed: Updated handleFlavorSelect to toggle/add flavors properly (assuming IDs are unique). Added type for selectedFlavors. No major issues, but improved for consistency.

"use client"

import { useState } from "react"
import { Hero } from "@/components/hero"
import { IceCreamCatalog } from "@/components/ice-cream-catalog"
import { ContactSection } from "@/components/contact-section"
import { Footer } from "@/components/footer"

export default function HomePage() {
  const [selectedFlavors, setSelectedFlavors] = useState<string[]>([])

  const handleFlavorSelect = (flavorId: string, flavorName: string) => {
    setSelectedFlavors((prev) => {
      if (prev.includes(flavorId)) {
        return prev.filter(id => id !== flavorId)
      }
      return [...prev, flavorId]
    })
  }

  const handleFlavorUpdate = (flavors: string[]) => {
    setSelectedFlavors(flavors)
  }

  return (
    <main className="min-h-screen">
      <Hero />
      <IceCreamCatalog onFlavorSelect={handleFlavorSelect} selectedFlavors={selectedFlavors} />
      <ContactSection preSelectedFlavors={selectedFlavors} onFlavorUpdate={handleFlavorUpdate} />
      <Footer />
    </main>
  )
}