# TinyTask Monorepo

TinyTask is a modular, high-performance web platform for small, focused tools (micro-apps). Each tool is managed separately as its own package, but they all share a common style system, layout patterns, brand design, and utilities.

The platform is deployed at [tinytask.tech](https://tinytask.tech).

## Repository Structure

```text
tinytask/
  README.md                 # Root documentation
  package.json              # Root package defining npm workspaces
  .gitignore                # Root gitignore rules
  .env.example              # Sample environment variables

  apps/
    web/                    # Main Next.js web application (Routing, layouts, collections, main landing pages)

  tools/                    # Modular tools folder containing self-contained packages
    qr-generator/           # QR code builder
    excel-scrubber/         # Excel cleaning utility
    invoice-swift/          # Invoice generator
    ...                     # (All 15 tool workspaces)

  packages/                 # Reusable shared workspaces
    brand/                  # Common CSS tokens for color, typography, spacing & logo assets
    ui/                     # Primitives (button, input, select, card, slider)
    utils/                  # Helper utilities (cn, formatDate, slugify, validation)

  docs/                     # Reference guides & developer documentations
    app-template.md         # Guide: Adding a new tool to TinyTask
    development-checklist.md# Guide: Process for developing and deploying work
    branding.md             # Guide: Branding standards and HSL color guidelines
    product-ideas.md        # Backlog: Future ideas and specifications
```

## Getting Started

### Prerequisites

Ensure you have **Node.js (v18+)** and **npm (v9+)** installed.

### Installation

Install all dependencies and link workspaces from the repository root:

```bash
npm install
```

### Local Development

To run the Next.js development server:

```bash
npm run dev
```

This runs the dev server in the `apps/web` workspace, making all tools accessible under their relative URL slug paths (e.g., `/tools/qr-generator`).

### Production Build

To verify compilation and build the entire monorepo:

```bash
npm run build
```

---

## Shared Brand & UI System

TinyTask uses a centralized styling system:
1. Brand values (colors, fonts, radius) are defined in [`packages/brand/`](./packages/brand).
2. Primitives are stored in [`packages/ui/`](./packages/ui) and use Tailwind v4 `@theme` tokens.
3. Common utilities (e.g. `cn` merging classnames) are exposed via [`packages/utils/`](./packages/utils).
