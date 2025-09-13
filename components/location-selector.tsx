"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MapPin, Navigation, Search } from "lucide-react"

interface LocationSelectorProps {
  onLocationSelect: (location: { address: string; coordinates: { lat: number; lng: number } }) => void
  selectedLocation?: { address: string; coordinates: { lat: number; lng: number } }
}

export function LocationSelector({ onLocationSelect, selectedLocation }: LocationSelectorProps) {
  const [searchAddress, setSearchAddress] = useState("")
  const [isLoadingLocation, setIsLoadingLocation] = useState(false)
  const [mapCenter, setMapCenter] = useState({ lat: 17.385, lng: 78.4867 }) // Hyderabad default

  // Popular delivery areas in Hyderabad
  const popularAreas = [
    { name: "Banjara Hills", coordinates: { lat: 17.4126, lng: 78.4482 } },
    { name: "Jubilee Hills", coordinates: { lat: 17.4239, lng: 78.4738 } },
    { name: "Gachibowli", coordinates: { lat: 17.4399, lng: 78.3487 } },
    { name: "Kondapur", coordinates: { lat: 17.4615, lng: 78.3657 } },
    { name: "Madhapur", coordinates: { lat: 17.4483, lng: 78.3915 } },
    { name: "Hitech City", coordinates: { lat: 17.4435, lng: 78.3772 } },
    { name: "Secunderabad", coordinates: { lat: 17.504, lng: 78.503 } },
    { name: "Begumpet", coordinates: { lat: 17.4399, lng: 78.4482 } },
  ]

  const getCurrentLocation = () => {
    setIsLoadingLocation(true)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          }
          setMapCenter(coords)
          // Reverse geocoding would go here in a real implementation
          onLocationSelect({
            address: "Current Location",
            coordinates: coords,
          })
          setIsLoadingLocation(false)
        },
        (error) => {
          console.error("Error getting location:", error)
          setIsLoadingLocation(false)
        },
      )
    }
  }

  const selectPopularArea = (area: { name: string; coordinates: { lat: number; lng: number } }) => {
    setMapCenter(area.coordinates)
    onLocationSelect({
      address: area.name,
      coordinates: area.coordinates,
    })
  }

  const handleAddressSearch = () => {
    if (searchAddress.trim()) {
      // In a real implementation, this would use a geocoding service
      onLocationSelect({
        address: searchAddress,
        coordinates: mapCenter,
      })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-primary" />
          Select Delivery Location
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Location Button */}
        <Button
          type="button"
          variant="outline"
          className="w-full bg-transparent"
          onClick={getCurrentLocation}
          disabled={isLoadingLocation}
        >
          <Navigation className="w-4 h-4 mr-2" />
          {isLoadingLocation ? "Getting Location..." : "Use Current Location"}
        </Button>

        {/* Address Search */}
        <div className="space-y-2">
          <Label htmlFor="address-search">Search Address</Label>
          <div className="flex gap-2">
            <Input
              id="address-search"
              value={searchAddress}
              onChange={(e) => setSearchAddress(e.target.value)}
              placeholder="Enter your delivery address"
              onKeyPress={(e) => e.key === "Enter" && handleAddressSearch()}
            />
            <Button type="button" variant="outline" onClick={handleAddressSearch}>
              <Search className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Popular Areas */}
        <div className="space-y-2">
          <Label>Popular Delivery Areas</Label>
          <div className="grid grid-cols-2 gap-2">
            {popularAreas.map((area) => (
              <Button
                key={area.name}
                type="button"
                variant={selectedLocation?.address === area.name ? "default" : "outline"}
                size="sm"
                onClick={() => selectPopularArea(area)}
                className="text-xs"
              >
                {area.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Selected Location Display */}
        {selectedLocation && (
          <div className="p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary" />
              <span className="font-medium">Selected Location:</span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">{selectedLocation.address}</p>
          </div>
        )}

        {/* Simple Map Visualization */}
        <div className="h-48 bg-muted rounded-lg flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-green-100"></div>
          <div className="relative z-10 text-center">
            <MapPin className="w-8 h-8 text-primary mx-auto mb-2" />
            <p className="text-sm font-medium">
              {selectedLocation ? selectedLocation.address : "Select a location above"}
            </p>
            <p className="text-xs text-muted-foreground">
              {selectedLocation
                ? `${selectedLocation.coordinates.lat.toFixed(4)}, ${selectedLocation.coordinates.lng.toFixed(4)}`
                : "Coordinates will appear here"}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
