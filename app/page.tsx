// C:\Users\vamsh\Downloads\moores-ice-cream (2)\app\page.tsx
// Fixed: Updated handleFlavorSelect to toggle/add flavors properly (assuming IDs are unique). Added type for selectedFlavors. No major issues, but improved for consistency.

"use client"

import { useState, useEffect } from "react"
import { Hero } from "@/components/hero"
import { IceCreamCatalog } from "@/components/ice-cream-catalog"
import { ContactSection } from "@/components/contact-section"
import { Footer } from "@/components/footer"

export default function HomePage() {
  const [selectedFlavors, setSelectedFlavors] = useState<string[]>([])
  const [hasLoaded, setHasLoaded] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("moores_selected_flavors")
    if (saved) {
      try {
        setSelectedFlavors(JSON.parse(saved))
      } catch (e) {
        console.error("Failed to parse saved flavors")
      }
    }
    setHasLoaded(true)
  }, [])

  // Save to localStorage whenever selectedFlavors changes
  useEffect(() => {
    if (hasLoaded) {
      localStorage.setItem("moores_selected_flavors", JSON.stringify(selectedFlavors))
    }
  }, [selectedFlavors, hasLoaded])

  const handleFlavorSelect = (flavorId: string, flavorName: string) => {
    setSelectedFlavors((prev) => {
      const newFlavors = prev.includes(flavorId)
        ? prev.filter(id => id !== flavorId)
        : [...prev, flavorId]
      return newFlavors
    })
  }

  const handleFlavorUpdate = (flavors: string[]) => {
    setSelectedFlavors(flavors)
  }

  return (
    <main className="min-h-screen">
      <Hero />
      <IceCreamCatalog
        onFlavorSelect={handleFlavorSelect}
        selectedFlavors={selectedFlavors}
        onFlavorUpdate={handleFlavorUpdate}
      />
      <ContactSection preSelectedFlavors={selectedFlavors} onFlavorUpdate={handleFlavorUpdate} />
      <Footer />
    </main>
  )
}