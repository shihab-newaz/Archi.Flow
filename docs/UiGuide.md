# UI/UX Design Guidelines

**Project:** ArchFirm Manager  
**Theme:** "Structural Innovation" (Professional, Asymmetric, Raw)  
**Core Stack:** Shadcn/UI + Tailwind CSS + Framer Motion

---

## 🚫 The Anti-Slop Directive (Strict Rules)

- **NO Generic Fonts:** Inter, Roboto, and San Francisco are forbidden
- **NO "SaaS Gradients":** Do not use blurred purple/pink blobs
- **NO "Floaty" Shadows:** Avoid the generic "spread shadow". Use crisp, hard shadows or outline borders
- **NO Plain White:** Backgrounds must have texture or tone. `bg-white` is banned for the main canvas; use `bg-zinc-50` or defined "Concrete" tones

---

## 1. Typography System (The "Blueprints")

**Contrast:** Technical Monospace vs. Structural Display

### Headers (Display)

- **Font:** Clash Display (Cabinet Grotesk as fallback)
- **Characteristics:** High stroke contrast, futuristic but structural
- **Usage:** Page titles, Hero numbers, Dashboard KPI labels
- **Class:** `font-display font-semibold tracking-tight`

### UI & Navigation (Sans)

- **Font:** Space Grotesk
- **Characteristics:** Geometric, slightly quirky, highly readable
- **Usage:** Sidebar links, Button text, Form labels
- **Class:** `font-sans`

### Data & Financials (Mono)

- **Font:** JetBrains Mono or IBM Plex Mono
- **Characteristics:** Fixed width, slashed zeros, technical feel
- **Usage:** Invoice amounts, Date strings, IDs, Tabular data
- **Class:** `font-mono tracking-tighter text-xs uppercase`

---

## 2. Color Palette ("Concrete & CAD")

### Base (Backgrounds)

- **Canvas:** `hsl(var(--background))` → `#F4F4F5` (Zinc-100) - The "Paper" layer
- **Surface:** `hsl(var(--card))` → `#FFFFFF` (White) - Only for active cards/inputs
- **Texture:** Overlay a 2% opacity "noise" grain on the body using module.css or Tailwind plugin

### Foreground (Text)

- **Primary:** `hsl(var(--foreground))` → `#18181B` (Zinc-900)
- **Muted:** `hsl(var(--muted-foreground))` → `#71717A` (Zinc-500)

### Accents (The "Pop")

- **Brand Primary:** `#FF4F00` (International Orange). Used for primary actions (Save, Create)
- **Indicator Success:** `#00D26A` (Emerald Green)
- **Indicator Alert:** `#FF0033` (Drafting Red)

---

## 3. Component Styling (Shadcn Customization)

We use Shadcn/UI as the base. We override the default "Soft" look with a "Structural" look.

### Buttons (`components/ui/button.tsx`)

- **Shape:** Sharp corners or micro-radius (`rounded-[2px]`). No pills
- **Border:** Explicit borders. `border border-zinc-900`
- **Shadow:** Hard shadow on hover. `hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all`
- **Typography:** Uppercase, tracking-wide, `text-xs`

### Cards (`components/ui/card.tsx`)

- **Border:** Thin, crisp borders (`border-zinc-200`)
- **Shadow:** No blur. Flat for static containers. Hard shadow for interactive ones
- **Padding:** Spacious (`p-6` or `p-8`)

### Inputs (`components/ui/input.tsx`)

- **Style:** "Architectural" line style
- **Default:** `bg-transparent border-b-2 border-zinc-200 rounded-none px-0 focus:border-black focus:ring-0`
- **Alternative:** Solid rectangles with thick borders (`border-2 border-zinc-900`)

### Dialogs/Modals (`components/ui/dialog.tsx`)

- **Overlay:** `bg-white/80 backdrop-blur-sm` (Frosted glass)
- **Content:** Sharp corners, heavy border (`border-2 border-black`)

---

## 4. Layout & Grid ("The Asymmetric Grid")

**Philosophy:** "Visible Structure." Use borders to separate grid areas like a CAD workspace.

- **Sidebar:** Fixed left, `border-r border-zinc-200`, `bg-zinc-50`
- **Header:** `border-b border-zinc-200`, `h-16`
- **Spacing:** Use rhythm. Multiples of `1rem` (16px)
- **Whitespace:** Be generous. Architecture needs room to breathe

---

## 5. Motion & Micro-interactions

- **Hover:** Immediate feedback. "Snappy" (`duration-100 ease-out`)
- **Page Load:** Staggered fade-in + slide-up for table rows
- **Tabs:** LayoutGroup (Framer Motion) - A solid black block sliding behind the active tab text

---

## 6. Implementation Notes

### Tailwind Config (`tailwind.config.ts`)

```typescript
{
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-space-grotesk)'],
        display: ['var(--font-clash-display)'],
        mono: ['var(--font-jetbrains-mono)'],
      },
      borderRadius: {
        lg: "2px",
        md: "2px",
        sm: "1px",
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#18181B", // Zinc-900
          foreground: "#FFFFFF",
        },
        // ... mapped to Shadcn CSS variables
      }
    }
  }
}
```
