"use client"

import { useRef, useEffect, useState } from "react"
import { useScroll, useTransform, motion, AnimatePresence } from "framer-motion"
import { ShoppingCart, Check } from "lucide-react"

interface VanillaScrollAnimationProps {
    flavorData: {
        id: string
        name: string
        price: string
        image: string
        detailedDescription: string
        ingredients: string[]
        process: string[]
    }
}

export default function VanillaScrollAnimation({ flavorData }: VanillaScrollAnimationProps) {
    const containerRef = useRef<HTMLDivElement>(null)
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [images, setImages] = useState<HTMLImageElement[]>([])
    const [imagesLoaded, setImagesLoaded] = useState(false)
    const [showToast, setShowToast] = useState(false)

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    })

    // Preload all 40 frames
    useEffect(() => {
        const loadedImages: HTMLImageElement[] = []
        const totalFrames = 40
        let loadedCount = 0

        for (let i = 1; i <= totalFrames; i++) {
            const img = new Image()
            const frameNum = i.toString().padStart(3, "0")
            img.src = `/vanilla-sequence/ezgif-frame-${frameNum}.jpg`

            img.onload = () => {
                loadedCount++
                if (loadedCount === totalFrames) {
                    setImagesLoaded(true)
                }
            }

            loadedImages.push(img)
        }

        setImages(loadedImages)
    }, [])

    // Draw frame based on scroll progress
    useEffect(() => {
        if (!canvasRef.current || !imagesLoaded || images.length === 0) return

        const canvas = canvasRef.current
        const context = canvas.getContext("2d")
        if (!context) return

        const unsubscribe = scrollYProgress.on("change", (latest: number) => {
            const frameProgress = latest < 0.5 ? latest / 0.5 : 1
            const frameIndex = Math.min(
                Math.floor(frameProgress * (images.length - 1)),
                images.length - 1
            )

            const img = images[frameIndex]
            if (img && img.complete) {
                canvas.width = window.innerWidth
                canvas.height = window.innerHeight

                const scale = Math.max(
                    canvas.width / img.width,
                    canvas.height / img.height
                )

                const x = (canvas.width / 2) - (img.width / 2) * scale
                const y = (canvas.height / 2) - (img.height / 2) * scale

                context.clearRect(0, 0, canvas.width, canvas.height)
                context.drawImage(img, x, y, img.width * scale, img.height * scale)
            }
        })

        return () => unsubscribe()
    }, [scrollYProgress, images, imagesLoaded])

    // Scroll animations
    const heroOpacity = useTransform(scrollYProgress, [0, 0.05, 0.15], [1, 1, 0])
    const descOpacity = useTransform(scrollYProgress, [0.18, 0.25, 0.38], [0, 1, 0])
    const descBg = useTransform(scrollYProgress, [0.18, 0.25, 0.38], [0, 0.92, 0])
    const ingredientsOpacity = useTransform(scrollYProgress, [0.42, 0.50, 0.65], [0, 1, 0])
    const ingredientsBg = useTransform(scrollYProgress, [0.42, 0.50, 0.65], [0, 0.95, 0])
    const ctaOpacity = useTransform(scrollYProgress, [0.70, 0.78, 1], [0, 1, 1])
    const ctaBg = useTransform(scrollYProgress, [0.70, 0.78], [0, 0.98])

    const handleAddToCart = () => {
        const { addToCart } = require("@/lib/cart-store")
        addToCart({
            id: flavorData.id,
            name: flavorData.name,
            price: flavorData.price,
            image: flavorData.image
        }, 1)
        window.dispatchEvent(new Event('cartUpdated'))
        setShowToast(true)
        setTimeout(() => setShowToast(false), 3000)
    }

    return (
        <div ref={containerRef} className="relative bg-[#050505]" style={{ height: "450vh" }}>
            {/* Loading */}
            {!imagesLoaded && (
                <div className="fixed inset-0 flex items-center justify-center bg-[#050505] z-50">
                    <div className="text-center">
                        <motion.div
                            className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full mx-auto mb-4"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                        />
                        <p className="text-white/60 text-sm">Loading...</p>
                    </div>
                </div>
            )}

            {/* Toast */}
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

            {/* Sticky Canvas */}
            <div className="sticky top-0 h-screen w-full overflow-hidden">
                <canvas
                    ref={canvasRef}
                    className="absolute inset-0 w-full h-full"
                    style={{ backgroundColor: "#050505" }}
                />

                {/* Content */}
                <div className="absolute inset-0">

                    {/* Hero */}
                    <motion.div
                        style={{ opacity: heroOpacity }}
                        className="absolute inset-0 flex items-center justify-center"
                    >
                        <div className="text-center px-6">
                            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
                                Pure Vanilla
                            </h1>
                            <p className="text-base md:text-lg text-white/70 mb-2">
                                Madagascar's Finest
                            </p>
                            <div className="text-xl md:text-2xl font-bold text-white/90">
                                {flavorData.price}
                            </div>
                        </div>
                    </motion.div>

                    {/* Description - White BG, Black Text */}
                    <motion.div
                        style={{
                            opacity: descOpacity,
                            backgroundColor: descBg.get() ? `rgba(255, 255, 255, ${descBg.get()})` : 'transparent'
                        }}
                        className="absolute inset-0 flex items-center justify-center px-6"
                    >
                        <div className="max-w-2xl text-center">
                            <h2 className="text-xl md:text-2xl font-bold text-black mb-3">
                                Artisan Crafted Ice Cream
                            </h2>
                            <p className="text-sm md:text-base text-black/80 leading-relaxed">
                                {flavorData.detailedDescription}
                            </p>
                        </div>
                    </motion.div>

                    {/* Ingredients - White BG, Black Text */}
                    <motion.div
                        style={{
                            opacity: ingredientsOpacity,
                            backgroundColor: ingredientsBg.get() ? `rgba(255, 255, 255, ${ingredientsBg.get()})` : 'transparent'
                        }}
                        className="absolute inset-0 flex items-center justify-center px-6"
                    >
                        <div className="max-w-3xl w-full">
                            <h2 className="text-xl md:text-2xl font-bold text-black mb-5 text-center">
                                Premium Ingredients
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {flavorData.ingredients.map((ingredient, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center gap-3 bg-black/5 p-3 rounded-lg"
                                    >
                                        <div className="w-2 h-2 rounded-full bg-black shrink-0" />
                                        <span className="text-xs md:text-sm text-black">{ingredient}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>

                    {/* CTA - White BG, Black Text */}
                    <motion.div
                        style={{
                            opacity: ctaOpacity,
                            backgroundColor: ctaBg.get() ? `rgba(255, 255, 255, ${ctaBg.get()})` : 'transparent'
                        }}
                        className="absolute inset-0 flex items-center justify-center"
                    >
                        <div className="text-center px-6">
                            <h2 className="text-2xl md:text-3xl font-bold text-black mb-2">
                                Experience Pure Vanilla
                            </h2>
                            <p className="text-sm md:text-base text-black/70 mb-5">
                                Add to your cart now
                            </p>
                            <motion.button
                                onClick={handleAddToCart}
                                className="bg-black text-white px-8 py-3 rounded-full text-sm md:text-base font-semibold inline-flex items-center gap-2 shadow-lg"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <ShoppingCart className="w-4 h-4" />
                                Add to Cart - {flavorData.price}
                            </motion.button>
                        </div>
                    </motion.div>

                </div>
            </div>
        </div>
    )
}
