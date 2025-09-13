"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus } from "lucide-react"

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
    image: "/images/vanilla.png",

  },
  {
    id: "butterscotch",
    name: "Butterscotch",
    description: "Rich butterscotch with crunchy caramel pieces",
    category: "4-liter",
    image: "/butterscotch-ice-cream-with-caramel-pieces.jpg",

  },
  {
    id: "chocolate",
    name: "Chocolate",
    description: "Decadent chocolate ice cream made with premium cocoa",
    category: "4-liter",
    image: "/rich-chocolate-ice-cream-scoop.jpg",

  },
  {
    id: "strawberry",
    name: "Strawberry",
    description: "Fresh strawberry ice cream with real fruit pieces",
    category: "4-liter",
    image: "/pink-strawberry-ice-cream-with-fruit-pieces.jpg",

  },
  {
    id: "mango",
    name: "Mango",
    description: "Tropical mango ice cream made with Alphonso mangoes",
    category: "4-liter",
    image: "/orange-mango-ice-cream-tropical.jpg",
 
  },
  {
    id: "black-current",
    name: "Black Current",
    description: "Tangy black current with a perfect balance of sweet and tart",
    category: "4-liter",
    image: "/purple-black-current-ice-cream.jpg",
 
  },
  {
    id: "tutti-frutti",
    name: "Tutti Frutti",
    description: "Colorful mix of candied fruits in creamy vanilla base",
    category: "4-liter",
    image: "/tutti-frutti-ice-cream-with-colorful-candied-fruit.jpg",

  },
  {
    id: "angeer-badam",
    name: "Angeer Badam",
    description: "Premium fig and almond ice cream with rich dry fruits",
    category: "4-liter",
    image: "/fig-almond-ice-cream-with-nuts.jpg",

  },

  // Dry Fruits Based Flavors
  {
    id: "carmel-nuts",
    name: "Carmel Nuts",
    description: "Caramelized nuts in rich vanilla base with crunchy texture",
    category: "dry-fruits",
    image: "/caramel-nuts-ice-cream-with-mixed-nuts.jpg",

  },
  {
    id: "honeymoon-delight",
    name: "Honeymoon Delight",
    description: "Romantic blend of honey, nuts, and rose petals",
    category: "dry-fruits",
    image: "/honeymoon-delight-ice-cream-with-rose-petals-and-n.jpg",

  },
  {
    id: "american-nuts",
    name: "American Nuts",
    description: "Premium American nuts with rich chocolate base",
    category: "dry-fruits",
    image: "/american-nuts-ice-cream-with-chocolate-and-nuts.jpg",

  },
  {
    id: "raj-bhog",
    name: "Raj Bhog",
    description: "Royal saffron and pistachio ice cream fit for kings",
    category: "dry-fruits",
    image: "/saffron-pistachio-ice-cream-royal-golden.jpg",

  },
  {
    id: "kaju-kissmis",
    name: "Kaju Kissmis",
    description: "Cashew and raisin ice cream with traditional flavors",
    category: "dry-fruits",
    image: "/cashew-raisin-ice-cream-traditional.jpg",

  },

  // Natural Fruits and Pulp Based
  {
    id: "kala-jamun",
    name: "Kala Jamun",
    description: "Exotic black plum ice cream with natural fruit pulp",
    category: "natural-fruits",
    image: "/black-plum-jamun-ice-cream-dark-purple.jpg",

  },
  {
    id: "seetapal",
    name: "Seetapal",
    description: "Custard apple ice cream with natural sweetness",
    category: "natural-fruits",
    image: "/custard-apple-seetapal-ice-cream-creamy-white.jpg",

  },
  {
    id: "chikku",
    name: "Chikku",
    description: "Sapodilla fruit ice cream with rich natural flavor",
    category: "natural-fruits",
    image: "/sapodilla-chikku-ice-cream-brown-natural.jpg",

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
}

export function IceCreamCatalog({ onFlavorSelect, selectedFlavors = [] }: IceCreamCatalogProps) {
  const [localSelectedFlavors, setLocalSelectedFlavors] = useState<string[]>([])

  const currentSelectedFlavors = selectedFlavors.length > 0 ? selectedFlavors : localSelectedFlavors

  const selectFlavor = (flavorId: string, flavorName: string) => {
    if (onFlavorSelect) {
      // If parent component handles selection, call the callback
      onFlavorSelect(flavorId, flavorName)
    } else {
      // Otherwise handle locally
      setLocalSelectedFlavors((prev) => [...prev, flavorId])
    }

    setTimeout(() => {
      document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })
    }, 100)
  }

  const getFlavorQuantity = (flavorId: string) => {
    return currentSelectedFlavors.filter((id) => id === flavorId).length
  }

  const FlavorCard = ({ flavor }: { flavor: IceCreamFlavor }) => {
    const quantity = getFlavorQuantity(flavor.id)

    return (
      <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
        <CardHeader className="p-0">
          <div className="relative overflow-hidden rounded-t-lg">
            <img
              src={flavor.image || "/placeholder.svg"}
              alt={flavor.name}
              className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
            />
            {quantity > 0 && (
              <div className="absolute top-2 left-2">
                <Badge className="bg-primary text-primary-foreground">{quantity}</Badge>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-2">
            <CardTitle className="text-lg">{flavor.name}</CardTitle>
            {flavor.price && <Badge variant="secondary">{flavor.price}</Badge>}
          </div>
          <CardDescription className="text-sm mb-4 text-pretty">{flavor.description}</CardDescription>

          <div className="flex gap-2">
            <Button
              className="flex-1"
              variant={quantity > 0 ? "default" : "outline"}
              onClick={() => selectFlavor(flavor.id, flavor.name)}
            >
              <Plus className="w-4 h-4 mr-2" />
              {quantity > 0 ? `Add More (${quantity})` : "Select & Order"}
            </Button>
          </div>
        </CardContent>
      </Card>
    )
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
            <div className="mt-6 p-4 bg-primary/10 rounded-lg inline-block">
              <p className="text-primary font-medium">
                {currentSelectedFlavors.length} item{currentSelectedFlavors.length > 1 ? "s" : ""} selected
              </p>
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
                    <FlavorCard key={flavor.id} flavor={flavor} />
                  ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  )
}
