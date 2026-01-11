# 🎬 Video Effects Layout Map

## Visual Structure

```
┌─────────────────────────────────────────────────────────────┐
│                        HERO SECTION                          │
│  ┌────────┬─────────────────────────────────┬────────┐     │
│  │        │                                 │        │     │
│  │ SIDE   │    ICE CREAM VIDEO BACKGROUND   │ SIDE   │     │
│  │ FOG    │    (opacity: 40%)               │ FOG    │     │
│  │ LEFT   │    + Gradient Overlay           │ RIGHT  │     │
│  │        │                                 │(mirror)│     │
│  │ 25%    │         MOORES                  │ 25%    │     │
│  │ width  │    Premium Ice Cream            │ width  │     │
│  │        │                                 │        │     │
│  │opacity │    [Explore Flavors] [Contact]  │opacity │     │
│  │ 60%    │                                 │ 60%    │     │
│  │        │           ↓                     │        │     │
│  └────────┴─────────────────────────────────┴────────┘     │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                   ICE CREAM CATALOG                          │
│                                                              │
│         Our Ice Cream Collection                            │
│                                                              │
│  [4 Liter Packs] [Dry Fruits] [Natural Fruits]             │
│                                                              │
│  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐                   │
│  │ ICE  │  │ ICE  │  │ ICE  │  │ ICE  │                   │
│  │CREAM │  │CREAM │  │CREAM │  │CREAM │                   │
│  │CARD  │  │CARD  │  │CARD  │  │CARD  │                   │
│  └──────┘  └──────┘  └──────┘  └──────┘                   │
│                                                              │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                    CONTACT SECTION                           │
│                                                              │
│              Place Your Order                               │
│         [Order Form with Location]                          │
│                                                              │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                        FOOTER                                │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                                                     │   │
│  │  MOORES        Contact Info      Business Hours    │   │
│  │  Premium ice   6309312041        Mon-Sun           │   │
│  │  cream...      moores1807@...    10AM-10PM         │   │
│  │                                                     │   │
│  │  ═══════════════════════════════════════════════   │   │
│  │  © 2024 Moores Ice Cream. All rights reserved.     │   │
│  │                                                     │   │
│  └─────────────────────────────────────────────────────┘   │
│  ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒  │
│  ▒▒▒ LOWER FOG VIDEO (opacity: 30%, height: 192px) ▒▒▒  │
│  ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒  │
└─────────────────────────────────────────────────────────────┘
```

## Video Placement Summary

### 🎥 Hero Section (Top of Page)
- **Main Background**: `ice cream.mp4` - Full screen, 40% opacity
- **Left Side**: `sidefog.mp4` - 25% width, 60% opacity
- **Right Side**: `sidefog.mp4` (mirrored) - 25% width, 60% opacity
- **Effect**: Immersive, premium ice cream showcase

### 🌫️ Footer (Bottom of Page)
- **Bottom Fog**: `lowerfog.mp4` - Full width, 192px height, 30% opacity
- **Position**: Absolute at footer bottom
- **Effect**: Mystical, atmospheric closure

## Responsive Behavior

### Desktop (≥768px)
```
┌──────────────────────────────────────┐
│ [FOG] [ICE CREAM VIDEO] [FOG]       │  ← All videos visible
│                                      │
│         MOORES                       │
│    Premium Ice Cream                 │
└──────────────────────────────────────┘
```

### Mobile (<768px)
```
┌──────────────────────────────────────┐
│    [ICE CREAM VIDEO ONLY]           │  ← Side fog hidden
│                                      │
│         MOORES                       │
│    Premium Ice Cream                 │
└──────────────────────────────────────┘
```

## Z-Index Layering

```
Hero Section:
┌─────────────────────────┐
│ Content (z-10)          │  ← Text, buttons (highest)
├─────────────────────────┤
│ Side Fog (z-1)          │  ← Fog effects (middle)
├─────────────────────────┤
│ Ice Cream Video (z-0)   │  ← Background video (lowest)
└─────────────────────────┘

Footer:
┌─────────────────────────┐
│ Content (z-10)          │  ← Text, links (highest)
├─────────────────────────┤
│ Lower Fog (z-0)         │  ← Fog effect (lowest)
└─────────────────────────┘
```

## Color Overlays

### Hero Section
- **Gradient**: `from-orange-50/80 to-amber-50/80`
- **Purpose**: Ensures text readability over video
- **Effect**: Warm, inviting ice cream theme

### Footer
- **Background**: `bg-primary` (solid color)
- **Fog Overlay**: Transparent video at 30% opacity
- **Effect**: Subtle atmospheric enhancement

## Performance Notes

### Video Loading
1. Videos load asynchronously
2. Page content accessible immediately
3. Fallback gradients if videos fail

### Bandwidth Optimization
- Mobile: Side fog hidden (saves ~7MB)
- Desktop: Full experience (~16MB total)
- All videos: Auto-loop, no re-download

### Browser Compatibility
- ✅ All modern browsers supported
- ✅ Mobile-optimized with `playsInline`
- ✅ Autoplay works (videos are muted)

---

**Total Video Assets**: 3 files, ~16.4 MB
**Visual Impact**: ⭐⭐⭐⭐⭐ Premium, Immersive
**Performance**: ⭐⭐⭐⭐ Optimized for web
