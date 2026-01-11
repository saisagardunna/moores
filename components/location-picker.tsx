'use client'

import dynamic from 'next/dynamic'
import { Loader2 } from 'lucide-react'

// Dynamically import the map component with SSR disabled
const LocationMap = dynamic(() => import('./location-map'), {
    ssr: false,
    loading: () => (
        <div className="h-[400px] w-full rounded-lg bg-orange-50 flex flex-col items-center justify-center gap-2 border-2 border-orange-100 mt-4">
            <Loader2 className="w-8 h-8 animate-spin text-orange-400" />
            <p className="text-sm text-orange-600 font-medium tracking-wide">Initializing Map Delivery View...</p>
        </div>
    ),
})

interface LocationPickerProps {
    latitude: number
    longitude: number
    onLocationUpdate: (lat: number, lng: number) => void
}

export default function LocationPicker({ latitude, longitude, onLocationUpdate }: LocationPickerProps) {
    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between">
                <label className="text-xs font-semibold uppercase tracking-wider text-orange-900/60 transition-colors group-hover:text-orange-900 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.6)]" />
                    Confirm Your Delivery Location (FREE Map)
                </label>
                <span className="text-[10px] text-green-600 font-medium bg-green-50 px-2 py-0.5 rounded-full border border-green-100">
                    100% Free - No API Key Needed
                </span>
            </div>
            <LocationMap
                center={{ lat: latitude, lng: longitude }}
                onLocationSelect={onLocationUpdate}
            />
            <p className="text-[10px] text-gray-500 italic mt-1 px-1">
                If the map doesn't show your house, just drag the pin to your exact spot. It sends the perfect coordinates to our system.
            </p>
        </div>
    )
}
