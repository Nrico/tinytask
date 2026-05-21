# Adding a New TinyTask Tool

TinyTask is designed to be highly modular. To add a new tool, follow this step-by-step guide to keep the codebase clean, organized, and easy to maintain.

---

## Step 1: Create the Tool Folder

Create a folder in `tools/` with your tool's URL-friendly slug name:

```bash
mkdir -p tools/your-tool-slug/src/components
mkdir -p tools/your-tool-slug/src/lib
```

## Step 2: Add Configuration Files

Every tool requires a `package.json`, a `config.json`, and a `README.md`.

### 1. `package.json`

Create `tools/your-tool-slug/package.json` and declare it as a private workspace package:

```json
{
  "name": "@tinytask/tool-your-tool-slug",
  "version": "0.1.0",
  "private": true,
  "main": "src/page.tsx",
  "dependencies": {
    "@tinytask/ui": "*",
    "@tinytask/brand": "*",
    "@tinytask/utils": "*"
  }
}
```

### 2. `config.json`

Create `tools/your-tool-slug/config.json` defining metadata fields:

```json
{
  "name": "Your Tool Name",
  "slug": "your-tool-slug",
  "description": "Short, catchy description of what your tool does.",
  "category": "utilities",
  "status": "active",
  "sharedTheme": "light"
}
```

- **`category`**: Can be `utilities`, `documents`, or `data`.
- **`status`**: Can be `active`, `beta`, or `coming-soon`.
- **`sharedTheme`**: Can be `light` or `dark`.

### 3. `README.md`

Create a brief `README.md` summarizing the tool's features:

```markdown
# Your Tool Name

Short description...

## Features
- Feature A
- Feature B
```

---

## Step 3: Implement your Tool Page

Create your entry point at `tools/your-tool-slug/src/page.tsx`:

```tsx
"use client"

import React from "react"
import { Button } from "@tinytask/ui/buttons/button"
import { Card, CardContent } from "@tinytask/ui/cards/card"

export default function YourToolPage() {
  return (
    <div className="container py-8 mx-auto">
      <h1 className="text-2xl font-bold mb-4">Your Tool Name</h1>
      <Card>
        <CardContent className="p-6">
          <p className="mb-4">Welcome to your new tool!</p>
          <Button>Click Me</Button>
        </CardContent>
      </Card>
    </div>
  )
}
```

> [!IMPORTANT]
> **Component Primitives**: Always import primitives (like `Button`, `Card`, `Input`) from the `@tinytask/ui` package rather than creating local styling variants, to preserve a unified brand aesthetic.

---

## Step 4: Register your Tool

To integrate your tool into the Next.js web application routing:

1. Open `apps/web/next.config.ts` and add your package name to `transpilePackages`:
   ```typescript
   transpilePackages: [
     // ...
     "@tinytask/tool-your-tool-slug"
   ]
   ```

2. Open `apps/web/src/app/tools/[slug]/page.tsx` and register your tool slug in the static import mapper:
   ```typescript
   const tools: Record<string, any> = {
     // ...
     "your-tool-slug": dynamic(() => import("@tinytask/tool-your-tool-slug")),
   };
   ```

3. Add your tool slug to `generateStaticParams()` in the same file to enable build-time static site optimization:
   ```typescript
   export async function generateStaticParams() {
     return [
       // ...
       { slug: "your-tool-slug" }
     ];
   }
   ```

4. Run `npm install` from the root directory to link your new workspace:
   ```bash
   npm install
   ```

5. Start the server and test it:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000/tools/your-tool-slug` in your browser.
