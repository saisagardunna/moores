"use client"

import { Hero } from "@/components/hero"
import { Footer } from "@/components/footer"
import { AnnouncementBar } from "@/components/announcement-bar"

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Hero />
      <AnnouncementBar />
      <Footer />
    </main>
  )
}