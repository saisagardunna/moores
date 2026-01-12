"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Check } from "lucide-react"
import { flavorDetails } from "@/lib/flavor-data"
import VanillaScrollAnimation from "@/components/VanillaScrollAnimation"
import CanvasScrollAnimation from "@/components/CanvasScrollAnimation"
import FlavorScrollAnimation from "@/components/FlavorScrollAnimation"
import { motion, AnimatePresence } from "framer-motion"

// Flavor configuration for canvas animations
const CANVAS_FLAVORS = {
    "vanilla": { folder: "vanilla-sequence", bgColor: "#050505", textColor: "#ffffff" },
    "chocolate": { folder: "chocolate-sequence", bgColor: "#3B2516", textColor: "#ffffff" },
    "caramel-nuts": { folder: "caramel-nuts-sequence-new", bgColor: "#8B4513", textColor: "#ffffff" },
    "strawberry": { folder: "strawberry-sequence", bgColor: "#FFB6C1", textColor: "#000000" },
    "mango": { folder: "mango-sequence", bgColor: "#FFA500", textColor: "#000000" },
    "chikku": { folder: "chikku-sequence", bgColor: "#8B7355", textColor: "#ffffff" },
    "seetapal": { folder: "seetapal-sequence", bgColor: "#E8E4D0", textColor: "#000000" },
    "kala-jamun": { folder: "kala-jamun-sequence", bgColor: "#2F1B3C", textColor: "#ffffff" },
    "tutti-frutti": { folder: "tutti-frutti-sequence", bgColor: "#FFE4E1", textColor: "#000000" },
    "raj-bhog": { folder: "raj-bhog-sequence-new", bgColor: "#FFD700", textColor: "#000000" },
    "black-current": { folder: "black-current-sequence", bgColor: "#4B0082", textColor: "#ffffff" },
    "kaju-kissmis": { folder: "kaju-kissmis-sequence", bgColor: "#D2B48C", textColor: "#000000" },
    "american-nuts": { folder: "american-nuts-sequence", bgColor: "#8B7355", textColor: "#ffffff" },
    "angeer-badam": { folder: "angeer-badam-sequence", bgColor: "#8B6914", textColor: "#ffffff" },
    "butterscotch": { folder: "butterscotch-sequence", bgColor: "#DAA520", textColor: "#000000" },
}

export default function FlavorDetailPage() {
    const params = useParams()
    const router = useRouter()
    const flavorId = params.id as string
    const [showToast, setShowToast] = useState(false)

    const flavor = flavorDetails[flavorId]

    if (!flavor) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Card className="max-w-md">
                    <CardHeader>
                        <CardTitle>Flavor Not Found</CardTitle>
                        <CardDescription>The ice cream flavor you're looking for doesn't exist.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button onClick={() => router.push("/")}>Return to Home</Button>
                    </CardContent>
                </Card>
            </div>
        )
    }

    const handleAddToCart = () => {
        const { addToCart } = require("@/lib/cart-store")
        addToCart({
            id: flavorId,
            name: flavor.name,
            price: flavor.price,
            image: flavor.image || "/placeholder.svg"
        }, 1)
        window.dispatchEvent(new Event('cartUpdated'))
        setShowToast(true)
        setTimeout(() => setShowToast(false), 3000)
    }

    // Toast notification component
    const Toast = () => (
        <AnimatePresence>
            {showToast && (
                <motion.div
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -50 }}
                    className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-white text-black px-6 py-3 rounded-full shadow-xl flex items-center gap-2"
                >
                    <Check className="w-5 h-5 text-green-600" />
                    <span className="font-semibold text-sm">Added to Cart!</span>
                </motion.div>
            )}
        </AnimatePresence>
    )

    // Check if this flavor has a canvas animation
    const canvasConfig = CANVAS_FLAVORS[flavorId as keyof typeof CANVAS_FLAVORS]

    // Special vanilla canvas animation (original component)
    if (flavorId === "vanilla") {
        return (
            <>
                <Toast />
                <VanillaScrollAnimation flavorData={flavor} />
            </>
        )
    }

    // Canvas animation for flavors with image sequences
    if (canvasConfig) {
        return (
            <>
                <Toast />
                <CanvasScrollAnimation
                    flavorData={flavor}
                    sequenceFolder={canvasConfig.folder}
                    backgroundColor={canvasConfig.bgColor}
                    textColor={canvasConfig.textColor}
                />
            </>
        )
    }

    // Regular scrollytelling for all other flavors
    return (
        <>
            <Toast />
            <FlavorScrollAnimation flavorData={flavor} onAddToCart={handleAddToCart} />
        </>
    )
}
