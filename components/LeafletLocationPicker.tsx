"use client"

import { useEffect, useState, useCallback, useRef, memo } from "react"
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import "@/lib/leafletIcon"
import { Search, MapPin, Loader2, Navigation } from "lucide-react"

// Separate Search Bar Component to prevent re-rendering the whole map on every keystroke
const SearchBar = ({ onSearch, isSearching, detectLocation }: {
    onSearch: (query: string) => void,
    isSearching: boolean,
    detectLocation: () => void
}) => {
    const [query, setQuery] = useState("")

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (query.trim()) {
            onSearch(query)
        }
    }

    return (
        <div className="relative">
            <div className="relative flex items-center">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            e.preventDefault();
                            handleSubmit(e);
                        }
                    }}
                    placeholder="Search building, area (e.g. Kompally Pizza Hut)..."
                    className="w-full h-14 pl-12 pr-32 rounded-2xl border-2 border-orange-100 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 focus:outline-none transition-all shadow-lg text-sm font-semibold bg-white"
                />
                <Search className="absolute left-4 w-6 h-6 text-orange-400" />

                <div className="absolute right-2 flex items-center gap-1 sm:gap-2">
                    <button
                        type="button"
                        onClick={detectLocation}
                        className="p-2 text-orange-500 hover:bg-orange-50 rounded-xl transition-colors shrink-0"
                        title="Locate me"
                    >
                        <Navigation className="w-5 h-5" />
                    </button>
                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={isSearching}
                        className="bg-orange-600 text-white px-3 sm:px-5 py-2.5 rounded-xl text-[10px] sm:text-xs font-black hover:bg-orange-700 disabled:opacity-50 transition-all flex items-center gap-2 shadow-md active:scale-95 shrink-0"
                    >
                        {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : "FIND"}
                    </button>
                </div>
            </div>
        </div>
    )
}

function MapEvents({ onMapClick }: { onMapClick: (latlng: any) => void }) {
    useMapEvents({
        click(e) {
            onMapClick(e.latlng)
        },
    })
    return null
}

export default function LeafletLocationPicker({ onConfirm, initialPosition }: any) {
    const [position, setPosition] = useState(initialPosition || {
        lat: 17.385044,
        lng: 78.486671,
    })
    const [mapType, setMapType] = useState<"street" | "satellite">("street")
    const [isSearching, setIsSearching] = useState(false)
    const [mapInstance, setMapInstance] = useState<any>(null)
    const [detectedAddress, setDetectedAddress] = useState<string>("")

    // Detect location helper
    const detectLocation = useCallback(() => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    const newPos = {
                        lat: pos.coords.latitude,
                        lng: pos.coords.longitude,
                    }
                    setPosition(newPos)
                    if (mapInstance) {
                        mapInstance.flyTo(newPos, 19)
                    }
                },
                () => console.warn("Location denied"),
                { enableHighAccuracy: true }
            )
        }
    }, [mapInstance])

    // Initial detection ONLY on mount
    useEffect(() => {
        if (mapInstance && !initialPosition) {
            detectLocation()
        }
    }, [mapInstance]) // Removed initialPosition and detectLocation from deps to prevent re-runs

    const handleSearch = async (query: string) => {
        if (!query.trim()) return
        setIsSearching(true)
        setDetectedAddress("") // Reset address while searching

        try {
            // Locked to India (countrycodes=in) for much higher accuracy
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=3&addressdetails=1&countrycodes=in`
            )
            const data = await response.json()

            if (data && data.length > 0) {
                // Focus on the first result
                const first = data[0]
                const newPos = {
                    lat: parseFloat(first.lat),
                    lng: parseFloat(first.lon),
                }

                setPosition(newPos)
                setDetectedAddress(first.display_name)

                if (mapInstance) {
                    // Force a hard jump if the distance is far, otherwise fly
                    mapInstance.flyTo(newPos, 19, {
                        animate: true,
                        duration: 1.5
                    })
                    setMapType("satellite")
                }
            } else {
                // Show temporary error in the address bar area
                setDetectedAddress("❌ No results found. Try adding city name (e.g. Kompally Hyderabad)")
                setTimeout(() => setDetectedAddress(""), 4000)
            }
        } catch (err) {
            console.error("Search failed:", err)
            setDetectedAddress("❌ Connection error. Please try again.")
        } finally {
            setIsSearching(false)
        }
    }

    const handleMapClick = useCallback((latlng: any) => {
        setPosition({ lat: latlng.lat, lng: latlng.lng })
    }, [])

    return (
        <div className="space-y-4">
            <SearchBar
                onSearch={handleSearch}
                isSearching={isSearching}
                detectLocation={detectLocation}
            />

            <div className="flex items-center justify-between px-1">
                <label className="text-[10px] font-black text-orange-900/40 uppercase tracking-[0.2em]">
                    Interactive Delivery Map
                </label>
                <div className="flex bg-orange-100/50 backdrop-blur-sm rounded-xl p-1 border border-orange-100">
                    <button
                        type="button"
                        onClick={() => setMapType("street")}
                        className={`px-4 py-1.5 rounded-lg text-[10px] font-extrabold transition-all ${mapType === "street" ? "bg-white text-orange-600 shadow-md" : "text-orange-400"
                            }`}
                    >
                        STREET
                    </button>
                    <button
                        type="button"
                        onClick={() => setMapType("satellite")}
                        className={`px-4 py-1.5 rounded-lg text-[10px] font-extrabold transition-all ${mapType === "satellite" ? "bg-white text-orange-600 shadow-md" : "text-orange-400"
                            }`}
                    >
                        SATELLITE
                    </button>
                </div>
            </div>

            <div className="h-[450px] w-full rounded-[2rem] overflow-hidden border-4 border-orange-100 shadow-2xl relative z-0 group">
                <MapContainer
                    center={position}
                    zoom={18}
                    ref={setMapInstance}
                    zoomControl={false}
                    style={{ height: "100%", width: "100%" }}
                >
                    {mapType === "street" ? (
                        <TileLayer
                            attribution='&copy; OpenStreetMap'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                    ) : (
                        <TileLayer
                            attribution='&copy; Google'
                            url="https://mt1.google.com/vt/lyrs=y,h&x={x}&y={y}&z={z}"
                        />
                    )}
                    <Marker
                        position={position}
                        draggable
                        eventHandlers={{
                            dragend: (e) => {
                                setPosition(e.target.getLatLng())
                            },
                        }}
                    />
                    <MapEvents onMapClick={handleMapClick} />
                </MapContainer>

                <div className="absolute top-6 left-6 right-6 z-[1000]">
                    {detectedAddress ? (
                        <div className="bg-white/95 backdrop-blur-md p-3 rounded-2xl border border-orange-100 shadow-xl flex items-start gap-2">
                            <MapPin className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
                            <p className="text-[11px] font-bold text-orange-950 leading-tight">
                                {detectedAddress.split(',').slice(0, 3).join(',')}
                            </p>
                        </div>
                    ) : (
                        <div className="bg-orange-600 text-white px-4 py-2 rounded-full shadow-lg text-[10px] font-black tracking-widest uppercase inline-flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                            Tap house or drag marker
                        </div>
                    )}
                </div>

                <div className="absolute bottom-6 right-6 z-[1000] flex flex-col gap-2">
                    <button onClick={() => mapInstance?.zoomIn()} type="button" className="w-10 h-10 bg-white rounded-xl shadow-lg border border-orange-100 flex items-center justify-center font-bold text-orange-600 hover:bg-orange-50">+</button>
                    <button onClick={() => mapInstance?.zoomOut()} type="button" className="w-10 h-10 bg-white rounded-xl shadow-lg border border-orange-100 flex items-center justify-center font-bold text-orange-600 hover:bg-orange-50">-</button>
                </div>
            </div>

            <div className="p-1">
                <button
                    type="button"
                    onClick={() => onConfirm(position)}
                    className="w-full py-5 bg-primary text-white text-lg font-black rounded-3xl shadow-[0_8px_20px_rgba(234,88,12,0.3)] hover:shadow-none hover:translate-y-1 transition-all active:scale-95 uppercase tracking-[0.2em] flex flex-col items-center gap-0.5"
                >
                    Confirm Delivery House
                    <span className="text-[10px] opacity-70 tracking-normal font-bold">Guarantees 100% accurate delivery</span>
                </button>
            </div>
        </div>
    )
}
