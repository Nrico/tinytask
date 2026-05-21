# TinyTask Development & Deployment Checklist

Use this checklist to ensure all code changes, new tools, and bug fixes align with project standards before publishing.

---

## 1. Local Development Setup
- [ ] Run `npm install` at the root directory to verify that workspaces link correctly.
- [ ] Run `npm run dev` to start the local Next.js development server.
- [ ] Verify that hot-reloading works when changing code in both `tools/*` and `packages/*`.

## 2. Shared Brand & UI Compliance
- [ ] Ensure no local custom colors are used inside the tool's styles; colors must leverage CSS variables from `@tinytask/brand`.
- [ ] Ensure all form fields, buttons, and cards import components from `@tinytask/ui` to guarantee uniform styling.
- [ ] Check accessibility: ensure inputs have labels, contrast levels are high, and interactive items are keyboard-navigable.

## 3. Testing Changes
- [ ] **Functional Test**: Try all user interactions in the tool (e.g. file upload, button clicks, downloads).
- [ ] **Cross-Browser Check**: Test the tool in at least Chrome and Safari.
- [ ] **Responsiveness Check**: Verify UI layout scales gracefully on mobile screen sizes (e.g. via Chrome Developer Tools device simulation).
- [ ] **Performance Check**: Ensure heavy files or operations (like parsing huge Excel files) are handled gracefully with proper loading states.

## 4. Code Quality & Formatting
- [ ] Run `npm run lint` at root to verify that ESLint checks pass.
- [ ] Ensure all `console.log` statements and debug breakpoints are removed.
- [ ] Verify TypeScript types: check that there are no implicit `any` types or unresolved modules.

## 5. Deployment Checklist (Vercel)
Next.js monorepos work natively on Vercel with zero config. When setting up a new project on Vercel:

- [ ] **Root Directory**: Ensure the root directory of the Vercel project is set to the repository root (not `apps/web`), so Vercel can run `npm install` at the root and resolve workspace modules.
- [ ] **Build Command**: Set the build command to `npm run build` or let Vercel detect the Next.js workspace building commands.
- [ ] **Install Command**: Set the install command to `npm install` (default).
- [ ] **Preview Deployments**: Push your feature branch to GitHub to trigger a Vercel preview deployment. Validate the preview link before merging to the main branch.
