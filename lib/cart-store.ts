// Cart and Wishlist Store - Cart uses sessionStorage (clears on browser close), Wishlist uses localStorage
export interface CartItem {
    id: string
    name: string
    price: string
    quantity: number
    image: string
}

export interface WishlistItem {
    id: string
    name: string
    price: string
    image: string
}

// Cart Functions
export const getCart = (): CartItem[] => {
    if (typeof window === 'undefined') return []
    const cart = sessionStorage.getItem('moores_cart')
    return cart ? JSON.parse(cart) : []
}

export const saveCart = (cart: CartItem[]) => {
    if (typeof window === 'undefined') return
    sessionStorage.setItem('moores_cart', JSON.stringify(cart))
    // Dispatch event for instant UI updates
    window.dispatchEvent(new Event('cartUpdated'))
    window.dispatchEvent(new StorageEvent('storage', {
        key: 'moores_cart',
        newValue: JSON.stringify(cart)
    }))
}

export const addToCart = (item: Omit<CartItem, 'quantity'>, quantity: number = 1) => {
    const cart = getCart()
    const existingItem = cart.find(i => i.id === item.id)

    if (existingItem) {
        existingItem.quantity += quantity
    } else {
        cart.push({ ...item, quantity })
    }

    saveCart(cart)
    return cart
}

export const removeFromCart = (itemId: string) => {
    const cart = getCart().filter(item => item.id !== itemId)
    saveCart(cart)
    return cart
}

export const updateCartQuantity = (itemId: string, quantity: number) => {
    const cart = getCart()
    const item = cart.find(i => i.id === itemId)

    if (item) {
        if (quantity <= 0) {
            return removeFromCart(itemId)
        }
        item.quantity = quantity
        saveCart(cart)
    }

    return cart
}

export const clearCart = () => {
    if (typeof window === 'undefined') return
    sessionStorage.removeItem('moores_cart')
    // Dispatch event for instant UI updates
    window.dispatchEvent(new Event('cartUpdated'))
    window.dispatchEvent(new StorageEvent('storage', {
        key: 'moores_cart',
        newValue: null // Indicate removal
    }))
}

export const getCartTotal = (): number => {
    const cart = getCart()
    return cart.reduce((total, item) => {
        const price = parseFloat(item.price.replace('₹', ''))
        return total + (price * item.quantity)
    }, 0)
}

export const getCartCount = (): number => {
    const cart = getCart()
    return cart.reduce((count, item) => count + item.quantity, 0)
}

// Wishlist Functions
export const getWishlist = (): WishlistItem[] => {
    if (typeof window === 'undefined') return []
    const wishlist = localStorage.getItem('moores_wishlist')
    return wishlist ? JSON.parse(wishlist) : []
}

export const saveWishlist = (wishlist: WishlistItem[]) => {
    if (typeof window === 'undefined') return
    localStorage.setItem('moores_wishlist', JSON.stringify(wishlist))
    // Dispatch event for instant UI updates
    window.dispatchEvent(new Event('cartUpdated'))
    window.dispatchEvent(new StorageEvent('storage', {
        key: 'moores_wishlist',
        newValue: JSON.stringify(wishlist)
    }))
}

export const addToWishlist = (item: WishlistItem) => {
    const wishlist = getWishlist()
    const exists = wishlist.find(i => i.id === item.id)

    if (!exists) {
        wishlist.push(item)
        saveWishlist(wishlist)
    }

    return wishlist
}

export const removeFromWishlist = (itemId: string) => {
    const wishlist = getWishlist().filter(item => item.id !== itemId)
    saveWishlist(wishlist)
    return wishlist
}

export const isInWishlist = (itemId: string): boolean => {
    const wishlist = getWishlist()
    return wishlist.some(item => item.id === itemId)
}

export const clearWishlist = () => {
    if (typeof window === 'undefined') return
    localStorage.removeItem('moores_wishlist')
    // Dispatch event for instant UI updates
    window.dispatchEvent(new Event('cartUpdated'))
    window.dispatchEvent(new StorageEvent('storage', {
        key: 'moores_wishlist',
        newValue: null
    }))
}
