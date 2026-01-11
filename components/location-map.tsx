'use client'

import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

interface LocationMapProps {
    center: { lat: number; lng: number }
    onLocationSelect: (lat: number, lng: number) => void
}

// Helper component to handle map movement and clicks
function MapEvents({ center, onLocationSelect }: LocationMapProps) {
    const map = useMap()

    // Follow the auto-detected location when it arrives
    useEffect(() => {
        map.setView(center, map.getZoom())
    }, [center, map])

    useMapEvents({
        click(e) {
            onLocationSelect(e.latlng.lat, e.latlng.lng)
        },
    })

    return null
}

export default function LocationMap({ center, onLocationSelect }: LocationMapProps) {
    // Fix for default Leaflet icons in Next.js
    useEffect(() => {
        delete (L.Icon.Default.prototype as any)._getIconUrl;
        L.Icon.Default.mergeOptions({
            iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
            iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
            shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        });
    }, []);

    return (
        <div className="h-[400px] w-full rounded-lg overflow-hidden border-2 border-orange-100 shadow-inner mt-4 relative z-0">
            <MapContainer
                center={center}
                zoom={16}
                scrollWheelZoom={false}
                style={{ height: '100%', width: '100%' }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <MapEvents center={center} onLocationSelect={onLocationSelect} />
                <Marker
                    position={center}
                    draggable={true}
                    eventHandlers={{
                        dragend: (e: any) => {
                            const marker = e.target
                            const { lat, lng } = marker.getLatLng()
                            onLocationSelect(lat, lng)
                        },
                    }}
                />
            </MapContainer>
            <div className="absolute bottom-2 left-2 bg-white/90 px-3 py-1.5 rounded-full text-[10px] z-[1000] text-orange-800 font-bold pointer-events-none border border-orange-100 shadow-sm animate-bounce-subtle">
                📍 Hint: click map or drag pin to your house
            </div>
        </div>
    )
}
