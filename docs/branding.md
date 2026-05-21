# TinyTask Branding Standards

TinyTask values premium design, micro-interactions, clean layouts, and harmonized colors. This guide documents our design system.

---

## 1. Color Palette

TinyTask uses curated HSL color palettes tailored for light and dark modes. Avoid hardcoding hex or generic CSS colors.

### Primary Color
- **Brand Purple**: `hsl(262.1 83.3% 57.8%)` (Dark Mode: `hsl(263.4 70% 50.4%)`)
- Primary button background, active borders, key highlights.

### Semantic Accents
- **Success (Green)**: `emerald` or `green` (e.g. for Excel data loaders)
- **Warning (Orange)**: `orange` or `amber` (e.g. for Sign generator cautions)
- **Info (Blue/Cyan)**: `cyan` or `sky` (e.g. for Pixel pruners or Brochure fold previews)

---

## 2. Typography

We use **Outfit** and **Inter** as our primary sans-serif fonts to feel modern, sleek, and premium.

- **Primary Heading**: Font family `Outfit` with font weights `font-bold` or `font-extrabold`.
- **Body & Controls**: Font family `Inter` with font weights `font-normal` or `font-medium`.

### Typography scale
- Sub-headings: `text-lg` or `text-xl`
- Headings: `text-2xl` or `text-3xl`
- Hero sections: `text-4xl` to `text-6xl`

---

## 3. Spacing & Shape Guidelines

- **Radius**: We use `0.75rem` (`12px`) as our base rounded corner radius (`rounded-xl` in Tailwind) for cards, dialogs, and large modules. Smaller elements like buttons use `0.375rem` to `0.5rem` (`rounded-md`).
- **Layout Margins**:
  - Container padding: `px-4 sm:px-6 lg:px-8`
  - Vertical page spacing: `py-8` or `py-12`

---

## 4. Logo Usage
- **Horizontal Logo**: Used in the primary header. Text should be rendered in `font-bold text-xl tracking-tight`.
- **Favicon**: Standard circular or geometric shape in violet purple.
