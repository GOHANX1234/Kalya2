# KalyaPlayer Design Guidelines

## Design Approach
**Reference-Based Approach**: Drawing inspiration from modern video platforms like YouTube, Vimeo, and premium video players (Plyr, Video.js) with emphasis on clean, functional design that prioritizes video content.

## Core Design Principles
1. **Content-First**: Video player is the hero element on video pages
2. **Functional Clarity**: Clean, intuitive controls and information hierarchy
3. **Mobile-First**: Optimized for mobile viewing and interaction
4. **Premium Feel**: Polished, professional aesthetics with subtle animations

---

## Color Palette

### Dark Mode (Primary)
- **Background Primary**: 12 8% 8% (Deep charcoal)
- **Background Secondary**: 12 8% 12% (Slightly lighter panels)
- **Surface**: 12 8% 15% (Card/player backgrounds)
- **Accent Primary**: 210 100% 55% (Vibrant blue for CTAs, active states)
- **Accent Hover**: 210 100% 65% (Lighter blue for hover)
- **Text Primary**: 0 0% 98% (Near white)
- **Text Secondary**: 0 0% 70% (Muted text)
- **Border**: 0 0% 20% (Subtle dividers)
- **Success**: 142 70% 50% (Upload status, quality indicators)

### Light Mode Support
- **Background**: 0 0% 98%
- **Surface**: 0 0% 100%
- **Text Primary**: 0 0% 10%
- **Text Secondary**: 0 0% 40%

---

## Typography

**Font Stack**: 
- Primary: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif (via Google Fonts)
- Monospace: 'JetBrains Mono' for video IDs, technical info

**Scale**:
- Hero/Brand (Navbar): text-2xl to text-3xl, font-bold (KalyaPlayer)
- Video Title: text-xl to text-2xl, font-semibold
- Body/Description: text-base, font-normal, leading-relaxed
- UI Labels: text-sm, font-medium
- Metadata/Timestamps: text-xs to text-sm, font-normal

---

## Layout System

**Spacing Primitives**: Use Tailwind units of 2, 4, 6, 8, 12, 16 consistently
- Component padding: p-4 to p-8
- Section spacing: space-y-6 to space-y-8
- Container padding: px-4 md:px-6 lg:px-8

**Container Strategy**:
- Navbar: Full width with max-w-7xl centered content
- Video Player: max-w-5xl centered, aspect-video enforced
- Content Areas: max-w-4xl for readability

**Grid System**: Single column for mobile, maintains focus on video content

---

## Component Library

### Navigation Bar
- Fixed top position with subtle backdrop blur
- Height: h-16
- Logo: "KalyaPlayer" - bold, gradient text (blue to cyan)
- Minimal navigation (Home link, Upload via Telegram CTA)
- Shadow on scroll: shadow-md transition

### Video Player Container
- **Premium Custom Player Design**:
  - Aspect ratio: 16:9 enforced (aspect-video)
  - Rounded corners: rounded-xl
  - Shadow: shadow-2xl for depth
  - Quality Badge: Absolute positioned top-right (360p/480p/720p/1080p)
  - Badge styling: bg-accent text-white px-3 py-1 rounded-full text-sm font-semibold
- **Controls Bar**: 
  - Dark overlay gradient at bottom
  - Play/pause, timeline scrubber, volume, fullscreen icons
  - Custom styled progress bar (accent color)
  - Timestamps with monospace font

### Video Metadata Section
- Positioned below player with space-y-4
- **Title**: Large, bold, high contrast
- **Description**: Multi-line, text-secondary, max-w-prose
- Spacing: pt-6 pb-8

### Owner Welcome Message
- **Position**: Bottom of page, centered
- **Design**: Card-style with gradient border effect
- **Content Structure**:
  - Welcome text: "Welcome to KalyaPlayer" (font-semibold)
  - Telegram link: Styled as button with icon
  - Link: https://t.me/kalyatoofan
- **Color Animation**: Subtle hue rotation on border/accent (CSS animation)
- **Styling**: bg-surface/80 backdrop-blur-sm p-6 rounded-lg border-2
- **Animation**: `animate-pulse` subtle effect on border or `animate-gradient` for color shift

### Call-to-Action Elements
- Primary Button: bg-accent hover:bg-accent-hover px-6 py-3 rounded-lg font-semibold
- Telegram Button: Icon + Text, with Telegram brand blue (#0088cc) option
- All buttons: transition-all duration-200 for smooth interactions

### Quality Indicator Badge
- Position: Absolute top-4 right-4 on player
- Size: px-4 py-2 text-sm font-bold
- Background: Semi-transparent dark with high contrast text
- Border: Optional subtle glow effect matching quality tier

---

## Mobile Responsiveness

**Breakpoint Strategy**:
- Mobile: Base styles (< 768px)
- Tablet: md: prefix (768px+)
- Desktop: lg: prefix (1024px+)

**Mobile Optimizations**:
- Player controls: Larger touch targets (min 44px)
- Navbar: Simplified, icon-only navigation if needed
- Spacing reduced: p-4 instead of p-8
- Text scales down one size on mobile
- Welcome message: Full width on mobile, max-w-md on desktop

---

## Page Structure: /videos/:id

1. **Navbar** (fixed top)
2. **Video Player Section** (main focal point)
   - Player with quality badge
   - Centered, max-w-5xl
   - mt-20 to clear navbar
3. **Metadata Section**
   - Video title
   - Description (whitespace-pre-wrap for formatting)
   - Upload date/quality info row
4. **Owner Welcome Card**
   - Centered, distinctive
   - mb-12 bottom margin
5. **Footer Space** (minimal, just padding)

---

## Animations

**Minimal, Purposeful Motion**:
- Page transitions: None (instant loads)
- Hover states: 200ms transitions on buttons
- Color shifting on welcome message: 3-5s subtle hue rotation
- Player controls: Fade in/out on mouse movement
- Loading states: Simple spinner for video buffering

---

## Images

**No Hero Images**: This is a video platform - the video player IS the hero element.

**Icon Usage**: React Icons library
- Navigation: Home, Upload icons
- Player controls: Play, Pause, Volume, Fullscreen from React Icons (Heroicons or Feather Icons)
- Telegram: Brand icon for links

**Logo Treatment**: Text-based "KalyaPlayer" with gradient effect, no image logo needed.