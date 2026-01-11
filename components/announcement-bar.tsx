"use client"

import { Megaphone } from "lucide-react"

export function AnnouncementBar() {
    return (
        <section className="relative z-50 w-full bg-orange-500 block">
            <div className="bg-gradient-to-r from-orange-500 via-amber-500 to-orange-500 py-4 relative overflow-hidden shadow-2xl border-y-2 border-white/30 animate-shimmer">
                <div className="w-full overflow-hidden flex group">
                    <div className="animate-marquee whitespace-nowrap flex items-center gap-12 text-white font-black text-base md:text-lg tracking-wide min-w-full drop-shadow-md group-hover:[animation-play-state:paused] py-1">
                        <span className="flex items-center gap-3"><Megaphone className="h-6 w-6 animate-bounce-subtle text-yellow-200" /> Upcoming Attraction: Delicious Cone Ice Creams coming soon to Moores! 🍦</span>
                        <span className="text-yellow-200">✨</span>
                        <span className="flex items-center gap-2 text-white/90">Stay Tuned for the Crunch! 🥜</span>
                        <span className="text-yellow-200">✨</span>

                        <span className="text-yellow-200">✨</span>

                        {/* Duplicates for seamless loop */}
                        <span className="flex items-center gap-3"><Megaphone className="h-6 w-6 animate-bounce-subtle text-yellow-200" /> Upcoming Attraction: Delicious Cone Ice Creams coming soon to Moores! 🍦</span>
                        <span className="text-yellow-200">✨</span>
                        <span className="flex items-center gap-2 text-white/90">Stay Tuned for the Crunch! 🥜</span>
                        <span className="text-yellow-200">✨</span>

                        <span className="text-yellow-200">✨</span>
                    </div>
                </div>
            </div>
        </section>
    )
}
