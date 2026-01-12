"use client"

import { useRef } from "react"
import { useScroll, useTransform, motion } from "framer-motion"
import { ShoppingCart } from "lucide-react"
import Image from "next/image"

interface FlavorScrollAnimationProps {
    flavorData: {
        id: string
        name: string
        price: string
        image: string
        category: string
        detailedDescription: string
        ingredients: string[]
        process: string[]
    }
    onAddToCart: () => void
}

export default function FlavorScrollAnimation({ flavorData, onAddToCart }: FlavorScrollAnimationProps) {
    const containerRef = useRef<HTMLDivElement>(null)

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    })

    // Scroll animations
    const heroOpacity = useTransform(scrollYProgress, [0, 0.05, 0.15], [1, 1, 0])
    const heroScale = useTransform(scrollYProgress, [0, 0.15], [1, 0.98])

    const descOpacity = useTransform(scrollYProgress, [0.18, 0.25, 0.38], [0, 1, 0])
    const descBg = useTransform(scrollYProgress, [0.18, 0.25, 0.38], [0, 0.92, 0])

    const ingredientsOpacity = useTransform(scrollYProgress, [0.42, 0.50, 0.65], [0, 1, 0])
    const ingredientsBg = useTransform(scrollYProgress, [0.42, 0.50, 0.65], [0, 0.95, 0])

    const processOpacity = useTransform(scrollYProgress, [0.68, 0.75, 0.88], [0, 1, 0])
    const processBg = useTransform(scrollYProgress, [0.68, 0.75, 0.88], [0, 0.95, 0])

    const ctaOpacity = useTransform(scrollYProgress, [0.90, 0.95, 1], [0, 1, 1])
    const ctaBg = useTransform(scrollYProgress, [0.90, 0.95], [0, 0.98])

    const imageParallax = useTransform(scrollYProgress, [0, 1], [0, -100])

    return (
        <div ref={containerRef} className="relative bg-gradient-to-b from-gray-50 to-white" style={{ height: "500vh" }}>

            {/* Sticky Background */}
            <div className="sticky top-0 h-screen w-full overflow-hidden">

                {/* Parallax Image Background */}
                <motion.div
                    style={{ y: imageParallax }}
                    className="absolute inset-0 w-full h-[120vh]"
                >
                    <div className="relative w-full h-full">
                        <Image
                            src={flavorData.image}
                            alt={flavorData.name}
                            fill
                            className="object-cover blur-sm opacity-20"
                            priority
                        />
                    </div>
                </motion.div>

                {/* Content */}
                <div className="absolute inset-0">

                    {/* Hero Section */}
                    <motion.div
                        style={{ opacity: heroOpacity, scale: heroScale }}
                        className="absolute inset-0 flex items-center justify-center"
                    >
                        <div className="text-center px-6 max-w-4xl">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8 }}
                            >
                                <div className="mb-6">
                                    <Image
                                        src={flavorData.image}
                                        alt={flavorData.name}
                                        width={300}
                                        height={300}
                                        className="mx-auto rounded-full shadow-2xl"
                                    />
                                </div>
                                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
                                    {flavorData.name}
                                </h1>
                                <p className="text-base md:text-lg text-gray-600 mb-2">
                                    {flavorData.category}
                                </p>
                                <div className="text-2xl md:text-3xl font-bold text-gray-900">
                                    {flavorData.price}
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>

                    {/* Description Section */}
                    <motion.div
                        style={{
                            opacity: descOpacity,
                            backgroundColor: descBg.get() ? `rgba(255, 255, 255, ${descBg.get()})` : 'transparent'
                        }}
                        className="absolute inset-0 flex items-center justify-center px-6"
                    >
                        <div className="max-w-2xl text-center">
                            <h2 className="text-xl md:text-2xl font-bold text-black mb-3">
                                About This Flavor
                            </h2>
                            <p className="text-sm md:text-base text-black/80 leading-relaxed">
                                {flavorData.detailedDescription}
                            </p>
                        </div>
                    </motion.div>

                    {/* Ingredients Section */}
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
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, x: -20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.05, duration: 0.4 }}
                                        className="flex items-center gap-3 bg-black/5 p-3 rounded-lg"
                                    >
                                        <div className="w-2 h-2 rounded-full bg-black shrink-0" />
                                        <span className="text-xs md:text-sm text-black">{ingredient}</span>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </motion.div>

                    {/* Process Section */}
                    <motion.div
                        style={{
                            opacity: processOpacity,
                            backgroundColor: processBg.get() ? `rgba(255, 255, 255, ${processBg.get()})` : 'transparent'
                        }}
                        className="absolute inset-0 flex items-center justify-center px-6"
                    >
                        <div className="max-w-3xl w-full">
                            <h2 className="text-xl md:text-2xl font-bold text-black mb-5 text-center">
                                How It's Made
                            </h2>
                            <div className="space-y-3">
                                {flavorData.process.slice(0, 4).map((step, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.08, duration: 0.4 }}
                                        className="flex gap-3 items-start bg-black/5 p-3 rounded-lg"
                                    >
                                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-black text-white font-bold text-sm shrink-0">
                                            {index + 1}
                                        </div>
                                        <p className="text-xs md:text-sm text-black pt-1.5 leading-relaxed">{step}</p>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </motion.div>

                    {/* CTA Section */}
                    <motion.div
                        style={{
                            opacity: ctaOpacity,
                            backgroundColor: ctaBg.get() ? `rgba(255, 255, 255, ${ctaBg.get()})` : 'transparent'
                        }}
                        className="absolute inset-0 flex items-center justify-center"
                    >
                        <div className="text-center px-6">
                            <h2 className="text-2xl md:text-3xl font-bold text-black mb-2">
                                Experience {flavorData.name}
                            </h2>
                            <p className="text-sm md:text-base text-black/70 mb-5">
                                Order your 4-liter pack today
                            </p>
                            <motion.button
                                onClick={onAddToCart}
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
