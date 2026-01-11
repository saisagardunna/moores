"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Plus, Minus, ShoppingCart, BookOpen } from "lucide-react"
import styles from "./ice-cream-effects.module.css"

interface IceCreamFlavor {
  id: string
  name: string
  description: string
  category: "4-liter" | "dry-fruits" | "natural-fruits"
  image: string
  price?: string
}

const iceCreamFlavors: IceCreamFlavor[] = [
  // 4 Liter Pack Flavors
  {
    id: "vanilla",
    name: "Vanilla",
    description: "Classic creamy vanilla made with real vanilla beans",
    category: "4-liter",
    image: "/white_vanilla_icecream.png",
    price: "₹250",
  },
  {
    id: "butterscotch",
    name: "Butterscotch",
    description: "Rich butterscotch with crunchy caramel pieces",
    category: "4-liter",
    image: "/butterscotch-ice-cream-with-caramel-pieces.jpg",
    price: "₹350",
  },
  {
    id: "chocolate",
    name: "Chocolate",
    description: "Decadent chocolate ice cream made with premium cocoa",
    category: "4-liter",
    image: "/chocolate_scoops.png",
    price: "₹350",
  },
  {
    id: "strawberry",
    name: "Strawberry",
    description: "Fresh strawberry ice cream with real fruit pieces",
    category: "4-liter",
    image: "/pink-strawberry-ice-cream-with-fruit-pieces.jpg",
    price: "₹250",
  },
  {
    id: "mango",
    name: "Mango",
    description: "Tropical mango ice cream made with Alphonso mangoes",
    category: "4-liter",
    image: "/orange-mango-ice-cream-tropical.jpg",
    price: "₹350",
  },
  {
    id: "black-current",
    name: "Black Current",
    description: "Tangy black current with a perfect balance of sweet and tart",
    category: "4-liter",
    image: "/purple-black-current-ice-cream.jpg",
    price: "₹550",
  },
  {
    id: "tutti-frutti",
    name: "Tutti Frutti",
    description: "Colorful mix of candied fruits in creamy vanilla base",
    category: "4-liter",
    image: "/tutti-frutti-ice-cream-with-colorful-candied-fruit.jpg",
    price: "₹450",
  },
  {
    id: "angeer-badam",
    name: "Angeer Badam",
    description: "Premium fig and almond ice cream with rich dry fruits",
    category: "4-liter",
    image: "/angeer_badam_scoop.png",
    price: "₹500",
  },

  // Dry Fruits Based Flavors
  {
    id: "carmel-nuts",
    name: "Carmel Nuts",
    description: "Caramelized nuts in rich vanilla base with crunchy texture",
    category: "dry-fruits",
    image: "/caramel-nuts-ice-cream-with-mixed-nuts.jpg",
    price: "₹650",
  },
  {
    id: "honeymoon-delight",
    name: "Honeymoon Delight",
    description: "Romantic blend of honey, nuts, and rose petals",
    category: "dry-fruits",
    image: "/honeymoon-delight-ice-cream-with-rose-petals-and-n.jpg",
    price: "₹750",
  },
  {
    id: "american-nuts",
    name: "American Nuts",
    description: "Premium American nuts with rich chocolate base",
    category: "dry-fruits",
    image: "/american-nuts-ice-cream-with-chocolate-and-nuts.jpg",
    price: "₹750",
  },
  {
    id: "raj-bhog",
    name: "Raj Bhog",
    description: "Royal saffron and pistachio ice cream fit for kings",
    category: "dry-fruits",
    image: "/saffron-pistachio-ice-cream-royal-golden.jpg",
    price: "₹550",
  },
  {
    id: "kaju-kissmis",
    name: "Kaju Kissmis",
    description: "Cashew and raisin ice cream with traditional flavors",
    category: "dry-fruits",
    image: "/cashew-raisin-ice-cream-traditional.jpg",
    price: "₹700",
  },

  // Natural Fruits and Pulp Based
  {
    id: "kala-jamun",
    name: "Kala Jamun",
    description: "Exotic black plum ice cream with natural fruit pulp",
    category: "natural-fruits",
    image: "/black-plum-jamun-ice-cream-dark-purple.jpg",
    price: "₹1250",
  },
  {
    id: "seetapal",
    name: "Seetapal",
    description: "Custard apple ice cream with natural sweetness",
    category: "natural-fruits",
    image: "/custard-apple-seetapal-ice-cream-creamy-white.jpg",
    price: "₹1250",
  },
  {
    id: "chikku",
    name: "Chikku",
    description: "Sapodilla fruit ice cream with rich natural flavor",
    category: "natural-fruits",
    image: "/sapodilla-chikku-ice-cream-brown-natural.jpg",
    price: "₹1050",
  },
]

const categoryLabels = {
  "4-liter": "4 Liter Packs",
  "dry-fruits": "Dry Fruits Based",
  "natural-fruits": "Natural Fruits & Pulp",
}

const categoryDescriptions = {
  "4-liter": "Our classic collection in convenient 4-liter family packs",
  "dry-fruits": "Premium flavors enriched with finest dry fruits and nuts",
  "natural-fruits": "Fresh fruit pulp based ice creams with natural goodness",
}

interface IceCreamCatalogProps {
  onFlavorSelect?: (flavorId: string, flavorName: string) => void
  selectedFlavors?: string[]
  onFlavorUpdate?: (flavors: string[]) => void
}

const FlavorCard = ({
  flavor,
  quantity,
  onUpdateQuantity
}: {
  flavor: IceCreamFlavor
  quantity: number
  onUpdateQuantity: (id: string, qty: number) => void
}) => {
  return (
    <div className={styles.cardContainer}>
      <Card className={`${styles.glassCard} group transition-all duration-300`}>
        {/* Image with Neumorphism Effect */}
        <CardHeader className="p-0">
          <div className="relative overflow-hidden rounded-t-[30px]">
            <img
              src={flavor.image || "/placeholder.svg"}
              alt={flavor.name}
              className={styles.flipCardImage}
            />
            {quantity > 0 && (
              <div className="absolute top-2 left-2 z-10">
                <Badge className="bg-primary text-primary-foreground">{quantity}</Badge>
              </div>
            )}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
              <h3 className="text-xl font-bold text-white">{flavor.name}</h3>
              {flavor.price && <p className="text-lg font-semibold text-orange-400">{flavor.price}</p>}
            </div>
          </div>
        </CardHeader>

        {/* Card Details Below */}
        <CardContent className="p-4">
          <CardDescription className="text-sm mb-3">{flavor.description}</CardDescription>

          <div className="flex flex-col gap-2">
            <Link href={`/flavors/${flavor.id}`} passHref>
              <button className={styles.readMoreButton}>
                <BookOpen className="w-4 h-4 mr-2 inline" />
                Read More
              </button>
            </Link>
            {quantity > 0 ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-10 w-10 shrink-0"
                    onClick={() => onUpdateQuantity(flavor.id, quantity - 1)}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <Input
                    type="number"
                    min="0"
                    value={quantity}
                    onChange={(e) => onUpdateQuantity(flavor.id, parseInt(e.target.value) || 0)}
                    className="text-center text-lg font-medium h-10"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-10 w-10 shrink-0"
                    onClick={() => onUpdateQuantity(flavor.id, quantity + 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <button
                  className={styles.deleteButton}
                  onClick={() => onUpdateQuantity(flavor.id, 0)}
                  title="Remove from cart"
                >
                  <svg
                    viewBox="0 0 1.625 1.625"
                    className={styles.lidSvg}
                    height="15"
                    width="15"
                  >
                    <path d="M.471 1.024v-.52a.1.1 0 0 0-.098.098v.618c0 .054.044.098.098.098h.487a.1.1 0 0 0 .098-.099h-.39c-.107 0-.195 0-.195-.195"></path>
                    <path d="M1.219.601h-.163A.1.1 0 0 1 .959.504V.341A.033.033 0 0 0 .926.309h-.26a.1.1 0 0 0-.098.098v.618c0 .054.044.098.098.098h.487a.1.1 0 0 0 .098-.099v-.39a.033.033 0 0 0-.032-.033"></path>
                    <path d="m1.245.465-.15-.15a.02.02 0 0 0-.016-.006.023.023 0 0 0-.023.022v.108c0 .036.029.065.065.065h.107a.023.023 0 0 0 .023-.023.02.02 0 0 0-.007-.016"></path>
                  </svg>
                  <svg
                    width="16"
                    fill="none"
                    viewBox="0 0 39 7"
                    className={styles.linesSvg}
                  >
                    <line strokeWidth="4" stroke="white" y2="5" x2="39" y1="5"></line>
                    <line strokeWidth="3" stroke="white" y2="1.5" x2="26.0357" y1="1.5" x1="12"></line>
                  </svg>
                  <svg width="16" fill="none" viewBox="0 0 33 39" className={styles.binSvg}>
                    <mask fill="white" id="path-1-inside-1_8_19">
                      <path d="M0 0H33V35C33 37.2091 31.2091 39 29 39H4C1.79086 39 0 37.2091 0 35V0Z"></path>
                    </mask>
                    <path
                      mask="url(#path-1-inside-1_8_19)"
                      fill="white"
                      d="M0 0H33H0ZM37 35C37 39.4183 33.4183 43 29 43H4C-0.418278 43 -4 39.4183 -4 35H4H29H37ZM4 43C-0.418278 43 -4 39.4183 -4 35V0H4V35V43ZM37 0V35C37 39.4183 33.4183 43 29 43V35V0H37Z"
                    ></path>
                    <path strokeWidth="4" stroke="white" d="M12 6L12 29"></path>
                    <path strokeWidth="4" stroke="white" d="M21 6V29"></path>
                  </svg>
                </button>
              </div>
            ) : (
              <Button
                className="w-full"
                onClick={() => onUpdateQuantity(flavor.id, 1)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add to Order
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export function IceCreamCatalog({ onFlavorSelect, selectedFlavors = [], onFlavorUpdate }: IceCreamCatalogProps) {
  const [localSelectedFlavors, setLocalSelectedFlavors] = useState<string[]>([])

  // Use local state only if the prop is not provided
  const currentSelectedFlavors = onFlavorUpdate ? selectedFlavors : localSelectedFlavors

  const updateQuantity = (flavorId: string, newQuantity: number) => {
    const quantity = Math.max(0, Math.floor(newQuantity))

    // Create new array with other flavors preserved
    const otherFlavors = currentSelectedFlavors.filter(id => id !== flavorId)

    // Add the flavor 'quantity' times
    const newFlavorEntries = Array(quantity).fill(flavorId)
    const newFlavors = [...otherFlavors, ...newFlavorEntries]

    if (onFlavorUpdate) {
      onFlavorUpdate(newFlavors)
    } else {
      setLocalSelectedFlavors(newFlavors)
    }
  }

  const scrollToOrder = () => {
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })
  }

  const getFlavorQuantity = (flavorId: string) => {
    return currentSelectedFlavors.filter((id) => id === flavorId).length
  }

  return (
    <section id="flavors" className="py-16 px-4 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4 text-balance">Our Ice Cream Collection</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
            Click on any flavor to automatically go to the order section. Use the + button to add multiple quantities!
          </p>
          {currentSelectedFlavors.length > 0 && (
            <div className="mt-6 flex flex-col items-center gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="p-4 bg-primary/10 rounded-lg inline-block">
                <p className="text-primary font-medium text-lg">
                  {currentSelectedFlavors.length} item{currentSelectedFlavors.length > 1 ? "s" : ""} selected
                </p>
              </div>
              <Button
                size="lg"
                className="text-lg px-8 py-6 shadow-lg hover:shadow-xl transition-all"
                onClick={scrollToOrder}
              >
                <ShoppingCart className="mr-2 h-6 w-6" />
                Place Order Now
              </Button>
            </div>
          )}
        </div>

        <Tabs defaultValue="4-liter" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            {Object.entries(categoryLabels).map(([key, label]) => (
              <TabsTrigger key={key} value={key} className="text-sm md:text-base">
                {label}
              </TabsTrigger>
            ))}
          </TabsList>

          {Object.entries(categoryLabels).map(([category, label]) => (
            <TabsContent key={category} value={category}>
              <div className="mb-8 text-center">
                <h3 className="text-2xl font-semibold text-foreground mb-2">{label}</h3>
                <p className="text-muted-foreground">
                  {categoryDescriptions[category as keyof typeof categoryDescriptions]}
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {iceCreamFlavors
                  .filter((flavor) => flavor.category === category)
                  .map((flavor) => (
                    <FlavorCard
                      key={flavor.id}
                      flavor={flavor}
                      quantity={getFlavorQuantity(flavor.id)}
                      onUpdateQuantity={updateQuantity}
                    />
                  ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  )
}
