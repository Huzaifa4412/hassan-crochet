# Repository Guidelines

## Project Structure & Module Organization

This is a Next.js 16 App Router e-commerce site with Sanity CMS. Application routes live in `src/app`, including product, category, blog, search, API, sitemap, robots, and Sanity Studio routes. Shared React components are in `src/components`; UI primitives are under `src/components/ui`, homepage sections under `src/components/home`, and layout pieces under `src/components/layout`. Sanity schemas, queries, and client helpers live in `src/sanity`. Utility code is in `src/lib`, types in `src/types`, static media in `public`, and support docs in `docs`.

## Build, Test, and Development Commands

- `npm run dev`: start the local Next.js development server.
- `npm run build`: create a production build and run framework-level checks.
- `npm run start`: serve the production build locally.
- `npm run lint`: run ESLint with Next.js core web vitals and TypeScript rules.
- `npx sanity@latest schema deploy`: deploy Sanity schema changes when CMS models change.

The lockfiles include both `package-lock.json` and `bun.lock`; use the package manager already used for the change you are making and avoid unrelated lockfile churn.

## Coding Style & Naming Conventions

Use TypeScript for new app code and keep `strict` compatibility. Prefer the `@/*` path alias for imports from `src`. Components use PascalCase filenames such as `ProductCard.tsx`; route files follow App Router conventions such as `page.tsx`, `layout.tsx`, `loading.tsx`, and `route.ts`. Use two-space indentation, double quotes to match existing config files, and ESLint for style enforcement.

## Testing Guidelines

There is currently no dedicated `test` script or test framework configured. Before submitting changes, run `npm run lint` and `npm run build`. For UI changes, manually verify affected routes in the browser, especially product customization, search, Sanity-backed pages, and responsive layouts. If you add tests later, place them near the code they cover and add an npm script so contributors can run them consistently.

## Commit & Pull Request Guidelines

Recent commits use short imperative or descriptive subjects, for example `Redesign global footer` and `Enhance Facebook Pixel tracking and optimize event handling`. Keep commits focused on one logical change. Pull requests should include a concise summary, verification steps, linked issue or task when applicable, screenshots for visual changes, and notes about environment variables or Sanity schema deployments.

## Security & Configuration Tips

Keep `.env.local` and other `.env*` files out of version control. Required Sanity values include `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, and `NEXT_PUBLIC_SANITY_API_VERSION`. Do not hardcode analytics, Pixel, or CMS secrets in client components.
