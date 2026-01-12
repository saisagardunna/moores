# Canvas Scrollytelling Animations - Multiple Flavors

## Overview
Added canvas-based scrollytelling animations for **10 flavors** with color-matched backgrounds!

## Flavors with Canvas Animations

### 1. **Vanilla**
- **Sequence**: `vanilla-sequence` (40 frames)
- **Background**: Black `#050505`
- **Text**: White
- **Component**: VanillaScrollAnimation (original)

### 2. **Chocolate** 
- **Sequence**: `chocolate-sequence` (40 frames)
- **Background**: Dark Brown `#3B2516`
- **Text**: White
- **Component**: CanvasScrollAnimation

### 3. **Caramel Nuts**
- **Sequence**: `carmel-nuts-sequence` (40 frames)
- **Background**: Saddle Brown `#8B4513`
- **Text**: White
- **Component**: CanvasScrollAnimation

### 4. **Strawberry**
- **Sequence**: `strawberry-sequence` (40 frames)
- **Background**: Light Pink `#FFB6C1`
- **Text**: Black
- **Component**: CanvasScrollAnimation

### 5. **Mango**
- **Sequence**: `mango-sequence` (40 frames)
- **Background**: Orange `#FFA500`
- **Text**: Black
- **Component**: CanvasScrollAnimation

### 6. **Chikku (Sapodilla)**
- **Sequence**: `chikku-sequence` (40 frames)
- **Background**: Brown `#8B7355`
- **Text**: White
- **Component**: CanvasScrollAnimation

### 7. **Seetapal (Custard Apple)**
- **Sequence**: `seetapal-sequence` (40 frames)
- **Background**: Cream `#E8E4D0`
- **Text**: Black
- **Component**: CanvasScrollAnimation

### 8. **Kala Jamun (Black Plum)**
- **Sequence**: `kala-jamun-sequence` (40 frames)
- **Background**: Dark Purple `#2F1B3C`
- **Text**: White
- **Component**: CanvasScrollAnimation

### 9. **Tutti Frutti**
- **Sequence**: `tutti-frutti-sequence` (40 frames)
- **Background**: Misty Rose `#FFE4E1`
- **Text**: Black
- **Component**: CanvasScrollAnimation

### 10. **Raj Bhog**
- **Sequence**: `raj-bhog-sequence` (40 frames)
- **Background**: Gold `#FFD700`
- **Text**: Black
- **Component**: CanvasScrollAnimation

## Color Strategy

### Dark Backgrounds (White Text)
- Vanilla: Pure black
- Chocolate: Dark chocolate brown
- Caramel Nuts: Rich caramel brown
- Chikku: Natural brown
- Kala Jamun: Deep purple

### Light Backgrounds (Black Text)
- Strawberry: Soft pink
- Mango: Bright orange
- Seetapal: Cream white
- Tutti Frutti: Light pink
- Raj Bhog: Golden yellow

## Components Created

### 1. `CanvasScrollAnimation.tsx`  
Universal component that accepts:
- `flavorData`: All flavor information
- `sequenceFolder`: Name of folder with 40 frames
- `backgroundColor`: HEX color for background
- `textColor`: HEX color for text (optional, defaults to black)

### 2. Updated `page.tsx`
Configuration object for all canvas flavors:
```typescript
const CANVAS_FLAVORS = {
    "vanilla": { folder: "vanilla-sequence", bgColor: "#050505", textColor: "#ffffff" },
    "chocolate": { folder: "chocolate-sequence", bgColor: "#3B2516", textColor: "#ffffff" },
    // ... etc
}
```

## Features

✅ **40-frame animations** for each flavor  
✅ **Color-matched backgrounds** based on flavor  
✅ **Automatic text color** (black or white for contrast)  
✅ **Smooth scroll** (450vh height)  
✅ **White overlay sections** for description, ingredients, CTA  
✅ **Toast notifications** on add to cart  
✅ **Responsive design** (mobile + desktop)  
✅ **Loading states** with color-matched spinners  

## Testing

Visit these URLs to see animations:
- http://localhost:3000/flavors/vanilla
- http://localhost:3000/flavors/chocolate
- http://localhost:3000/flavors/caramel-nuts
- http://localhost:3000/flavors/strawberry
- http://localhost:3000/flavors/mango
- http://localhost:3000/flavors/chikku
- http://localhost:3000/flavors/seetapal
- http://localhost:3000/flavors/kala-jamun
- http://localhost:3000/flavors/tutti-frutti
- http://localhost:3000/flavors/raj-bhog

## File Structure

```
public/
├── vanilla-sequence/      (40 frames)
├── chocolate-sequence/    (40 frames)
├── carmel-nuts-sequence/  (40 frames)
├── strawberry-sequence/   (40 frames)
├── mango-sequence/        (40 frames)
├── chikku-sequence/       (40 frames)
├── seetapal-sequence/     (40 frames)
├── kala-jamun-sequence/   (40 frames)
├── tutti-frutti-sequence/ (40 frames)
└── raj-bhog-sequence/     (40 frames)

components/
├── VanillaScrollAnimation.tsx  (special vanilla component)
├── CanvasScrollAnimation.tsx   (universal canvas component)
└── FlavorScrollAnimation.tsx   (image-based for other flavors)
```

## How It Works

1. User visits `/flavors/{id}`
2. Page checks if flavor ID is in `CANVAS_FLAVORS`
3. If yes → Load CanvasScrollAnimation with color config
4. If no → Load FlavorScrollAnimation (image-based)
5. Canvas renders 40 frames as user scrolls
6. Background stays flavor-specific color
7. White overlays appear for content sections
8. Add to cart shows toast notification
