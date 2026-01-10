"use client"

import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, ShoppingCart, Clock, Users, Award } from "lucide-react"
import { flavorDetails } from "@/lib/flavor-data"
import Image from "next/image"

export default function FlavorDetailPage() {
    const params = useParams()
    const router = useRouter()
    const flavorId = params.id as string

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

    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
            {/* Header */}
            <div className="bg-primary/5 border-b">
                <div className="max-w-6xl mx-auto px-4 py-6">
                    <Button variant="ghost" onClick={() => router.push("/")} className="mb-4">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to All Flavors
                    </Button>
                    <div className="flex flex-col md:flex-row gap-8 items-start">
                        <div className="relative w-full md:w-1/3 aspect-square rounded-xl overflow-hidden shadow-2xl">
                            <img
                                src={flavor.image || "/placeholder.svg"}
                                alt={flavor.name}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="flex-1">
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <h1 className="text-4xl md:text-5xl font-bold text-primary mb-2">{flavor.name}</h1>
                                    <Badge variant="secondary" className="text-sm">
                                        {flavor.category}
                                    </Badge>
                                </div>
                                <div className="text-right">
                                    <div className="text-3xl md:text-4xl font-bold text-primary">{flavor.price}</div>
                                    <div className="text-sm text-muted-foreground">per 4L pack</div>
                                </div>
                            </div>
                            <p className="text-lg text-muted-foreground mb-6">{flavor.shortDescription}</p>
                            <div className="flex gap-4 flex-wrap">
                                <Button size="lg" className="text-lg" onClick={() => router.push("/#contact")}>
                                    <ShoppingCart className="mr-2 h-5 w-5" />
                                    Order Now
                                </Button>
                                <Button size="lg" variant="outline" onClick={() => router.push("/#flavors")}>
                                    View All Flavors
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-6xl mx-auto px-4 py-12">
                <div className="grid md:grid-cols-2 gap-8">
                    {/* About This Flavor */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Award className="h-5 w-5 text-primary" />
                                About This Flavor
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground leading-relaxed">{flavor.detailedDescription}</p>
                        </CardContent>
                    </Card>

                    {/* Quick Info */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Quick Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-start gap-3">
                                <Clock className="h-5 w-5 text-primary mt-0.5" />
                                <div>
                                    <div className="font-semibold">Available In</div>
                                    <div className="text-sm text-muted-foreground">4 Liter Family Packs</div>
                                </div>
                            </div>
                            <Separator />
                            <div className="flex items-start gap-3">
                                <Users className="h-5 w-5 text-primary mt-0.5" />
                                <div>
                                    <div className="font-semibold">Perfect For</div>
                                    <div className="text-sm text-muted-foreground">Families, Parties & Special Occasions</div>
                                </div>
                            </div>
                            <Separator />
                            <div className="flex items-start gap-3">
                                <Award className="h-5 w-5 text-primary mt-0.5" />
                                <div>
                                    <div className="font-semibold">Quality Promise</div>
                                    <div className="text-sm text-muted-foreground">Made with premium ingredients, no artificial flavors</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Ingredients */}
                <Card className="mt-8">
                    <CardHeader>
                        <CardTitle>Premium Ingredients</CardTitle>
                        <CardDescription>We use only the finest ingredients to create our ice cream</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
                            {flavor.ingredients.map((ingredient, index) => (
                                <div key={index} className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                                    <div className="h-2 w-2 rounded-full bg-primary shrink-0" />
                                    <span className="text-sm">{ingredient}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* How It's Made */}
                <Card className="mt-8">
                    <CardHeader>
                        <CardTitle>How We Make It</CardTitle>
                        <CardDescription>Our traditional process ensures authentic taste and quality</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {flavor.process.map((step, index) => (
                                <div key={index} className="flex gap-4">
                                    <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary text-primary-foreground font-bold shrink-0">
                                        {index + 1}
                                    </div>
                                    <p className="text-muted-foreground pt-1">{step}</p>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Serving Suggestions */}
                <div className="grid md:grid-cols-2 gap-8 mt-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Serving Suggestions</CardTitle>
                            <CardDescription>Ways to enjoy this delicious flavor</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-3">
                                {flavor.servingSuggestions.map((suggestion, index) => (
                                    <li key={index} className="flex items-start gap-2">
                                        <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2 shrink-0" />
                                        <span className="text-muted-foreground">{suggestion}</span>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Nutritional Highlights</CardTitle>
                            <CardDescription>Health benefits of our ingredients</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-3">
                                {flavor.nutritionalHighlights.map((highlight, index) => (
                                    <li key={index} className="flex items-start gap-2">
                                        <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2 shrink-0" />
                                        <span className="text-muted-foreground">{highlight}</span>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                </div>

                {/* CTA Section */}
                <Card className="mt-8 bg-primary/5 border-primary/20">
                    <CardContent className="p-8 text-center">
                        <h3 className="text-2xl font-bold mb-2">Ready to Experience {flavor.name}?</h3>
                        <p className="text-muted-foreground mb-6">Order your 4-liter pack today and enjoy premium quality ice cream at home</p>
                        <div className="flex gap-4 justify-center flex-wrap">
                            <Button size="lg" onClick={() => router.push("/#contact")}>
                                <ShoppingCart className="mr-2 h-5 w-5" />
                                Place Your Order
                            </Button>
                            <Button size="lg" variant="outline" onClick={() => router.push("/#flavors")}>
                                Explore More Flavors
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
