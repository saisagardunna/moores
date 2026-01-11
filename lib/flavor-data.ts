export interface FlavorDetails {
    id: string
    name: string
    price: string
    category: string
    image: string
    shortDescription: string
    detailedDescription: string
    ingredients: string[]
    process: string[]
    servingSuggestions: string[]
    nutritionalHighlights: string[]
}

export const flavorDetails: Record<string, FlavorDetails> = {
    "vanilla": {
        id: "vanilla",
        name: "Vanilla",
        price: "₹250",
        category: "4 Liter Pack",
        image: "/images/vanilla.png",
        shortDescription: "Classic creamy vanilla made with real vanilla beans",
        detailedDescription: "Our signature Vanilla ice cream is crafted using premium Madagascar vanilla beans, slow-infused into fresh cream to create a rich, aromatic base. We use traditional churning methods to achieve the perfect smooth and creamy texture that melts beautifully on your tongue.",
        ingredients: [
            "Fresh dairy cream (Grade A)",
            "Whole milk from local farms",
            "Premium Madagascar vanilla beans",
            "Pure cane sugar",
            "Natural stabilizers",
            "Vanilla extract"
        ],
        process: [
            "Select and split premium Madagascar vanilla beans to extract maximum flavor",
            "Infuse vanilla beans in fresh cream for 24 hours at controlled temperature",
            "Blend infused cream with whole milk and pure cane sugar",
            "Pasteurize the mixture at precise temperature to ensure safety and quality",
            "Cool the base mixture rapidly to preserve flavor compounds",
            "Age the mixture for 12 hours to develop deeper vanilla notes",
            "Churn using traditional ice cream makers for optimal texture",
            "Freeze at -18°C to achieve perfect consistency"
        ],
        servingSuggestions: [
            "Enjoy on its own for pure vanilla bliss",
            "Perfect accompaniment to warm desserts like brownies or apple pie",
            "Create classic milkshakes and smoothies",
            "Pair with fresh berries for a delightful contrast"
        ],
        nutritionalHighlights: [
            "Rich in calcium from fresh dairy",
            "Natural vanilla contains antioxidants",
            "No artificial flavors or colors",
            "Made with real cream for authentic taste"
        ]
    },
    "chocolate": {
        id: "chocolate",
        name: "Chocolate",
        price: "₹350",
        category: "4 Liter Pack",
        image: "/rich-chocolate-ice-cream-scoop.jpg",
        shortDescription: "Decadent chocolate ice cream made with premium cocoa",
        detailedDescription: "Indulge in our luxurious Chocolate ice cream, made from the finest Belgian cocoa and dark chocolate. We blend multiple chocolate varieties to create a deep, complex flavor profile that satisfies even the most discerning chocolate lovers.",
        ingredients: [
            "Premium Belgian cocoa powder",
            "Dark chocolate (70% cocoa)",
            "Fresh dairy cream",
            "Whole milk",
            "Pure cane sugar",
            "Natural vanilla extract",
            "Dutch-processed cocoa for richness"
        ],
        process: [
            "Melt premium dark Belgian chocolate in a double boiler",
            "Bloom cocoa powder in warm milk to enhance chocolate flavor",
            "Combine melted chocolate with bloomed cocoa mixture",
            "Blend with fresh cream and sugar until smooth",
            "Pasteurize at optimal temperature to maintain chocolate notes",
            "Cool and age for 24 hours to develop intense chocolate flavor",
            "Churn to incorporate air for creamy texture",
            "Quick-freeze to lock in rich chocolate taste"
        ],
        servingSuggestions: [
            "Serve in a waffle cone for classic enjoyment",
            "Top with chocolate sauce and nuts for extra indulgence",
            "Create chocolate sundaes with whipped cream",
            "Perfect base for chocolate milkshakes"
        ],
        nutritionalHighlights: [
            "Rich in antioxidants from dark chocolate",
            "Contains natural mood-boosting compounds",
            "Good source of calcium",
            "Made with real cocoa, not artificial chocolate flavor"
        ]
    },
    "butterscotch": {
        id: "butterscotch",
        name: "Butterscotch",
        price: "₹350",
        category: "4 Liter Pack",
        image: "/butterscotch-ice-cream-with-caramel-pieces.jpg",
        shortDescription: "Rich butterscotch with crunchy caramel pieces",
        detailedDescription: "Our Butterscotch ice cream features a golden, buttery base studded with crunchy caramel pieces. We make our butterscotch from scratch, slowly caramelizing butter and brown sugar to create that authentic, nostalgic flavor.",
        ingredients: [
            "Fresh cream and whole milk",
            "Real butter (unsalted)",
            "Brown sugar for deep caramel notes",
            "Pure cane sugar",
            "Handmade butterscotch candy pieces",
            "Natural vanilla extract",
            "Sea salt for balance"
        ],
        process: [
            "Caramelize butter and brown sugar in copper pots until golden",
            "Add cream gradually while stirring to create butterscotch base",
            "Blend with milk and additional sugar",
            "Separately prepare crunchy butterscotch candy pieces",
            "Pasteurize the butterscotch cream mixture",
            "Cool and age for 18 hours",
            "Churn ice cream base to creamy perfection",
            "Fold in butterscotch candy pieces just before final freezing"
        ],
        servingSuggestions: [
            "Top with additional caramel sauce",
            "Pair with warm apple crumble",
            "Add to coffee for a butterscotch latte float",
            "Serve with salted pretzels for sweet-salty combo"
        ],
        nutritionalHighlights: [
            "Made with real butter for authentic taste",
            "Contains calcium from dairy",
            "Natural brown sugar provides molasses minerals",
            "No artificial butterscotch flavoring"
        ]
    },
    "strawberry": {
        id: "strawberry",
        name: "Strawberry",
        price: "₹250",
        category: "4 Liter Pack",
        image: "/pink-strawberry-ice-cream-with-fruit-pieces.jpg",
        shortDescription: "Fresh strawberry ice cream with real fruit pieces",
        detailedDescription: "Made with handpicked fresh strawberries at peak ripeness, our Strawberry ice cream captures the essence of summer. We use whole fruit pieces to ensure every spoonful delivers authentic strawberry flavor and delightful texture.",
        ingredients: [
            "Fresh strawberries (seasonal, locally sourced)",
            "Strawberry puree",
            "Fresh dairy cream",
            "Whole milk",
            "Pure cane sugar",
            "Lemon juice for brightness",
            "Natural strawberry extract"
        ],
        process: [
            "Select ripe, sweet strawberries and wash thoroughly",
            "Macerate strawberries with sugar to draw out natural juices",
            "Puree half the strawberries for smooth base",
            "Dice remaining strawberries for fruit pieces",
            "Blend strawberry puree with cream and milk",
            "Add lemon juice to brighten fruit flavor",
            "Pasteurize and cool the mixture",
            "Churn and fold in fresh strawberry pieces"
        ],
        servingSuggestions: [
            "Classic pairing with chocolate ice cream",
            "Top with fresh strawberries and whipped cream",
            "Create strawberry shortcake desserts",
            "Blend into strawberry smoothies"
        ],
        nutritionalHighlights: [
            "Rich in Vitamin C from fresh strawberries",
            "Contains antioxidants and fiber from real fruit",
            "Natural fruit sugars",
            "Good source of calcium"
        ]
    },
    "mango": {
        id: "mango",
        name: "Mango",
        price: "₹350",
        category: "4 Liter Pack",
        image: "/orange-mango-ice-cream-tropical.jpg",
        shortDescription: "Tropical mango ice cream made with Alphonso mangoes",
        detailedDescription: "Experience the king of fruits in every scoop! Our Mango ice cream is made exclusively with premium Alphonso mangoes, known for their rich flavor and creamy texture. We capture the sweet, tropical essence that makes mangoes India's favorite fruit.",
        ingredients: [
            "Alphonso mango pulp (premium grade)",
            "Fresh mango pieces",
            "Fresh dairy cream",
            "Whole milk",
            "Pure cane sugar",
            "Natural mango essence",
            "Hint of cardamom (optional)"
        ],
        process: [
            "Source premium Alphonso mangoes at peak ripeness",
            "Extract pulp using traditional methods to preserve flavor",
            "Blend mango pulp with cream and milk",
            "Add natural sweeteners to complement mango's natural sugars",
            "Strain mixture for smooth consistency",
            "Pasteurize while maintaining fruit flavor",
            "Cool and age to develop tropical notes",
            "Churn and add fresh mango pieces for texture"
        ],
        servingSuggestions: [
            "Enjoy as a refreshing summer treat",
            "Create mango lassi-style drinks",
            "Pair with coconut for tropical combination",
            "Serve in mango shell for presentation"
        ],
        nutritionalHighlights: [
            "High in Vitamin A from mangoes",
            "Rich in antioxidants and fiber",
            "Natural fruit enzymes aid digestion",
            "Contains beta-carotene for eye health"
        ]
    },
    "black-current": {
        id: "black-current",
        name: "Black Current",
        price: "₹550",
        category: "4 Liter Pack",
        image: "/purple-black-current-ice-cream.jpg",
        shortDescription: "Tangy black current with a perfect balance of sweet and tart",
        detailedDescription: "Our Black Current ice cream offers a sophisticated flavor profile with its distinctive tangy-sweet taste. Made from premium black currant berries, this purple-hued delight provides a refreshing alternative to traditional fruit flavors.",
        ingredients: [
            "Premium black currant berries",
            "Black currant concentrate",
            "Fresh dairy cream",
            "Whole milk",
            "Pure cane sugar",
            "Natural black currant extract",
            "Citric acid for tartness"
        ],
        process: [
            "Select high-quality black currant berries",
            "Create concentrated juice from fresh berries",
            "Blend concentrate with cream base",
            "Balance sweetness and tartness with precision",
            "Pasteurize mixture to ensure quality",
            "Age for 24 hours to develop complex berry flavors",
            "Churn to achieve smooth, creamy texture",
            "Quick-freeze to preserve vibrant color and taste"
        ],
        servingSuggestions: [
            "Pair with lemon desserts for citrus contrast",
            "Create berry medleys with other fruit flavors",
            "Top with fresh berries",
            "Mix with sparkling water for a float"
        ],
        nutritionalHighlights: [
            "Extremely high in Vitamin C",
            "Rich in anthocyanins (powerful antioxidants)",
            "Supports immune system health",
            "Natural anti-inflammatory properties"
        ]
    },
    "tutti-frutti": {
        id: "tutti-frutti",
        name: "Tutti Frutti",
        price: "₹450",
        category: "4 Liter Pack",
        image: "/tutti-frutti-ice-cream-with-colorful-candied-fruit.jpg",
        shortDescription: "Colorful mix of candied fruits in creamy vanilla base",
        detailedDescription: "A celebration of colors and flavors! Our Tutti Frutti ice cream combines a premium vanilla base with vibrant, sweet candied fruit pieces. Each spoonful is a delightful surprise of different fruit flavors and textures.",
        ingredients: [
            "Premium vanilla ice cream base",
            "Candied papaya pieces",
            "Candied pineapple",
            "Candied cherries",
            "Candied orange peel",
            "Fresh cream and milk",
            "Natural fruit colors"
        ],
        process: [
            "Prepare premium vanilla base using real vanilla",
            "Dice various candied fruits into uniform pieces",
            "Soak candied fruits in fruit syrup to enhance flavor",
            "Pasteurize cream base",
            "Cool and age vanilla base",
            "Churn ice cream to optimal consistency",
            "Fold in colorful candied fruit pieces evenly",
            "Freeze quickly to maintain fruit texture"
        ],
        servingSuggestions: [
            "Perfect for children's parties",
            "Top birthday cakes for festive touch",
            "Serve in colorful bowls to match the theme",
            "Create rainbow sundaes"
        ],
        nutritionalHighlights: [
            "Variety of fruits provides multiple vitamins",
            "Calcium from dairy base",
            "Natural fruit flavors",
            "Colorful and fun for all ages"
        ]
    },
    "angeer-badam": {
        id: "angeer-badam",
        name: "Angeer Badam",
        price: "₹500",
        category: "4 Liter Pack",
        image: "/angeer_badam_scoop.png",
        shortDescription: "Premium fig and almond ice cream with rich dry fruits",
        detailedDescription: "An elegant fusion of Mediterranean figs (Angeer) and roasted almonds (Badam), this premium ice cream offers a sophisticated taste experience. We use the finest Afghan figs and California almonds for unmatched quality.",
        ingredients: [
            "Premium dried figs (Afghan variety)",
            "Roasted California almonds",
            "Fresh dairy cream",
            "Whole milk",
            "Honey for natural sweetness",
            "Almond paste",
            "Rose water (subtle hint)"
        ],
        process: [
            "Soak premium figs in warm water to soften",
            "Roast almonds to enhance nutty flavor",
            "Chop figs and almonds into small pieces",
            "Create fig puree for smooth distribution",
            "Blend cream base with honey and almond paste",
            "Pasteurize mixture",
            "Age for enhanced flavor development",
            "Churn and fold in fig and almond pieces"
        ],
        servingSuggestions: [
            "Drizzle with honey for extra richness",
            "Pair with baklava or Middle Eastern desserts",
            "Serve with cardamom tea",
            "Top with additional slivered almonds"
        ],
        nutritionalHighlights: [
            "Almonds provide healthy fats and protein",
            "Figs are rich in dietary fiber",
            "Natural honey provides enzymes",
            "Good source of calcium and iron"
        ]
    },
    "carmel-nuts": {
        id: "carmel-nuts",
        name: "Carmel Nuts",
        price: "₹650",
        category: "Dry Fruits Based",
        image: "/caramel-nuts-ice-cream-with-mixed-nuts.jpg",
        shortDescription: "Caramelized nuts in rich vanilla base with crunchy texture",
        detailedDescription: "A premium creation featuring an assortment of caramelized nuts - cashews, almonds, and walnuts - suspended in a luxurious vanilla cream base. The nuts are hand-caramelized to achieve perfect crunch and sweetness.",
        ingredients: [
            "Cashews, almonds, walnuts",
            "Caramel sauce (made in-house)",
            "Fresh dairy cream",
            "Whole milk",
            "Brown sugar",
            "Real butter",
            "Sea salt",
            "Natural vanilla"
        ],
        process: [
            "Roast premium nuts to perfection",
            "Prepare caramel sauce from scratch using butter and brown sugar",
            "Coat nuts in warm caramel",
            "Cool caramelized nuts and chop coarsely",
            "Create rich vanilla ice cream base",
            "Pasteurize and cool the base",
            "Churn ice cream to creamy perfection",
            "Fold in crunchy caramelized nut pieces"
        ],
        servingSuggestions: [
            "Top with extra caramel sauce and whole nuts",
            "Pair with warm brownies",
            "Create gourmet sundaes",
            "Serve with espresso for sophisticated dessert"
        ],
        nutritionalHighlights: [
            "Rich in healthy fats from mixed nuts",
            "Protein from almonds and cashews",
            "Omega-3 from walnuts",
            "Antioxidants from nuts"
        ]
    },
    "honeymoon-delight": {
        id: "honeymoon-delight",
        name: "Honeymoon Delight",
        price: "₹750",
        category: "Dry Fruits Based",
        image: "/honeymoon-delight-ice-cream-with-rose-petals-and-n.jpg",
        shortDescription: "Romantic blend of honey, nuts, and rose petals",
        detailedDescription: "A celebration of love in every scoop! This premium creation blends pure honey, mixed nuts, and delicate rose petals with saffron-infused cream. Perfect for special occasions and romantic moments.",
        ingredients: [
            "Pure honey from Kashmir",
            "Saffron strands",
            "Rose petals (edible, dried)",
            "Mixed nuts (pistachios, almonds, cashews)",
            "Fresh dairy cream",
            "Whole milk",
            "Rose water",
            "Cardamom powder"
        ],
        process: [
            "Infuse cream with saffron strands overnight",
            "Blend honey with milk base",
            "Grind dried rose petals with sugar",
            "Chop roasted nuts finely",
            "Combine all ingredients with cream base",
            "Add subtle rose water and cardamom",
            "Pasteurize gently to preserve delicate flavors",
            "Churn and freeze with care"
        ],
        servingSuggestions: [
            "Serve at weddings and celebrations",
            "Garnish with silver leaf (varak) for luxury",
            "Pair with traditional Indian sweets",
            "Serve in decorative bowls for special occasions"
        ],
        nutritionalHighlights: [
            "Honey provides natural enzymes and antioxidants",
            "Saffron has mood-enhancing properties",
            "Nuts provide protein and healthy fats",
            "Rose petals have calming effects"
        ]
    },
    "american-nuts": {
        id: "american-nuts",
        name: "American Nuts",
        price: "₹750",
        category: "Dry Fruits Based",
        image: "/american-nuts-ice-cream-with-chocolate-and-nuts.jpg",
        shortDescription: "Premium American nuts with rich chocolate base",
        detailedDescription: "Inspired by classic American desserts, this indulgent flavor combines premium pecans, walnuts, and chocolate in a rich cream base. The nuts are sourced from the finest American groves and roasted to perfection.",
        ingredients: [
            "Premium pecans from Georgia",
            "California walnuts",
            "Dark chocolate chunks",
            "Fresh dairy cream",
            "Whole milk",
            "Brown sugar",
            "Natural vanilla extract",
            "Butter for roasting"
        ],
        process: [
            "Roast pecans and walnuts with butter until fragrant",
            "Chop roasted nuts into varying sizes for texture",
            "Melt dark chocolate for chocolate base",
            "Blend chocolate with cream and milk",
            "Add brown sugar for depth",
            "Pasteurize the mixture",
            "Churn to incorporate lots of air for lightness",
            "Fold in roasted nuts and chocolate chunks"
        ],
        servingSuggestions: [
            "Serve in waffle bowls",
            "Top with hot fudge and whipped cream",
            "Create ice cream sandwiches",
            "Pair with pecan pie for ultimate indulgence"
        ],
        nutritionalHighlights: [
            "Pecans are rich in antioxidants",
            "Walnuts provide omega-3 fatty acids",
            "Dark chocolate offers flavanols",
            "Good source of vitamin E"
        ]
    },
    "raj-bhog": {
        id: "raj-bhog",
        name: "Raj Bhog",
        price: "₹550",
        category: "Dry Fruits Based",
        image: "/saffron-pistachio-ice-cream-royal-golden.jpg",
        shortDescription: "Royal saffron and pistachio ice cream fit for kings",
        detailedDescription: "Inspired by the royal courts of India, Raj Bhog (Royal Feast) features the finest saffron from Kashmir and green pistachios. The golden hue and rich flavor make this a truly regal experience.",
        ingredients: [
            "Kashmiri saffron strands",
            "Green pistachios from Iran",
            "Fresh dairy cream (water buffalo milk)",
            "Whole milk",
            "Sugar",
            "Cardamom powder",
            "Rose essence",
            "Edible silver leaf (varak)"
        ],
        process: [
            "Soak saffron in warm milk to release color and flavor",
            "Blanch and peel pistachios",
            "Grind half the pistachios into fine paste",
            "Chop remaining pistachios for texture",
            "Blend saffron milk with cream and pistachio paste",
            "Add cardamom and rose essence",
            "Pasteurize carefully",
            "Churn and fold in chopped pistachios"
        ],
        servingSuggestions: [
            "Garnish with silver leaf for royal presentation",
            "Serve in traditional Indian dessert bowls (katori)",
            "Pair with gulab jamun or rasmalai",
            "Perfect for festivals and celebrations"
        ],
        nutritionalHighlights: [
            "Saffron has antioxidant properties",
            "Pistachios are rich in protein and fiber",
            "Contains healthy monounsaturated fats",
            "Good source of vitamin B6"
        ]
    },
    "kaju-kissmis": {
        id: "kaju-kissmis",
        name: "Kaju Kissmis",
        price: "₹700",
        category: "Dry Fruits Based",
        image: "/cashew-raisin-ice-cream-traditional.jpg",
        shortDescription: "Cashew and raisin ice cream with traditional flavors",
        detailedDescription: "A classic Indian favorite combining creamy cashews (Kaju) and sweet raisins (Kishmish). This traditional flavor reminds us of grandmother's recipes and festive celebrations.",
        ingredients: [
            "Premium cashews",
            "Golden raisins (Kishmish)",
            "Black raisins",
            "Fresh dairy cream",
            "Whole milk",
            "Sugar",
            "Cardamom powder",
            "Saffron",
            "Ghee for roasting"
        ],
        process: [
            "Roast cashews in ghee until golden",
            "Soak raisins in warm water to pulp them",
            "Grind half the cashews into smooth paste",
            "Chop remaining cashews coarsely",
            "Prepare saffron-infused cream base",
            "Add cardamom for aromatic flavor",
            "Pasteurize mixture",
            "Churn and fold in cashews and raisins"
        ],
        servingSuggestions: [
            "Serve during festive occasions",
            "Pair with traditional Indian sweets",
            "Top with additional nuts and a drizzle of honey",
            "Enjoy with family gatherings"
        ],
        nutritionalHighlights: [
            "Cashews provide copper and magnesium",
            "Raisins are rich in iron and potassium",
            "Natural fruit sugars from raisins",
            "Good source of antioxidants"
        ]
    },
    "kala-jamun": {
        id: "kala-jamun",
        name: "Kala Jamun",
        price: "₹1250",
        category: "Natural Fruits & Pulp",
        image: "/black-plum-jamun-ice-cream-dark-purple.jpg",
        shortDescription: "Exotic black plum ice cream with natural fruit pulp",
        detailedDescription: "A premium creation featuring the rare and exotic Kala Jamun (Black Plum/Java Plum). This deep purple ice cream captures the unique tangy-sweet flavor of fresh jamun berries, known for their health benefits and distinctive taste.",
        ingredients: [
            "Fresh Kala Jamun berries (seasonal)",
            "Jamun pulp",
            "Fresh dairy cream",
            "Whole milk",
            "Rock salt (black salt) - subtle hint",
            "Sugar",
            "Lemon juice",
            "Natural jamun extract"
        ],
        process: [
            "Select ripe, deep purple jamun berries",
            "Remove seeds and extract pulp",
            "Blend pulp to smooth consistency",
            "Mix with cream and milk base",
            "Add subtle black salt for authentic flavor",
            "Balance sweetness and tartness with precision",
            "Pasteurize while preserving fruit properties",
            "Churn and quick-freeze to maintain vibrant color"
        ],
        servingSuggestions: [
            "Enjoy on hot summer days for cooling effect",
            "Pair with spicy foods as palate cleanser",
            "Serve with a pinch of black salt on top",
            "Create jamun smoothies and shakes"
        ],
        nutritionalHighlights: [
            "Rich in antioxidants and vitamin C",
            "Known to help regulate blood sugar",
            "Contains iron and beneficial plant compounds",
            "Traditional Ayurvedic cooling properties"
        ]
    },
    "seetapal": {
        id: "seetapal",
        name: "Seetapal",
        price: "₹1250",
        category: "Natural Fruits & Pulp",
        image: "/custard-apple-seetapal-ice-cream-creamy-white.jpg",
        shortDescription: "Custard apple ice cream with natural sweetness",
        detailedDescription: "Experience the exotic taste of Seetapal (Custard Apple/Sugar Apple) in creamy ice cream form. This premium flavor captures the naturally sweet, custard-like texture of this beloved tropical fruit, creating a uniquely indulgent experience.",
        ingredients: [
            "Fresh Seetapal pulp (custard apple)",
            "Fresh dairy cream",
            "Whole milk",
            "Minimal sugar (fruit is naturally sweet)",
            "Cardamom powder",
            "Natural vanilla",
            "Lemon juice for balance"
        ],
        process: [
            "Select perfectly ripe custard apples",
            "Carefully extract pulp and remove seeds",
            "Blend pulp to creamy consistency",
            "Mix with cream and milk",
            "Add subtle cardamom for aromatic enhancement",
            "Balance natural sweetness with minimal added sugar",
            "Pasteurize gently to preserve delicate flavor",
            "Churn to achieve extra-creamy texture"
        ],
        servingSuggestions: [
            "Serve immediately after scooping for best texture",
            "Pair with coconut-based desserts",
            "Enjoy as a standalone luxury treat",
            "Garnish with fresh fruit"
        ],
        nutritionalHighlights: [
            "High in dietary fiber",
            "Rich in vitamin C and vitamin B6",
            "Contains magnesium and potassium",
            "Natural fruit sugars provide quick energy"
        ]
    },
    "chikku": {
        id: "chikku",
        name: "Chikku",
        price: "₹1050",
        category: "Natural Fruits & Pulp",
        image: "/sapodilla-chikku-ice-cream-brown-natural.jpg",
        shortDescription: "Sapodilla fruit ice cream with rich natural flavor",
        detailedDescription: "Discover the caramel-like sweetness of Chikku (Sapodilla) in this unique ice cream. This brown-hued delight features the natural malty, sweet flavor of fresh sapodilla fruit, creating a taste experience unlike any other.",
        ingredients: [
            "Fresh Chikku pulp (sapodilla)",
            "Fresh dairy cream",
            "Whole milk",
            "Brown sugar for complementary flavor",
            "Natural vanilla",
            "Cinnamon (hint)",
            "Natural chikku extract"
        ],
        process: [
            "Select fully ripe sapodilla fruits",
            "Peel and remove seeds from chikku",
            "Mash fruit pulp thoroughly",
            "Blend pulp with cream and milk",
            "Add brown sugar to enhance caramel notes",
            "Include hint of cinnamon for warmth",
            "Pasteurize mixture",
            "Churn to smooth, creamy consistency"
        ],
        servingSuggestions: [
            "Enjoy the unique natural caramel flavor",
            "Pair with date-based desserts",
            "Serve with warm spiced cookies",
            "Create exotic fruit combinations"
        ],
        nutritionalHighlights: [
            "Rich in dietary fiber",
            "Contains tannins with antioxidant properties",
            "Good source of vitamins A and C",
            "Natural sugars provide sustained energy"
        ]
    }
}
