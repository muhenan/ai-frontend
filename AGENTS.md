# Repository Guidelines

## Project Structure & Module Organization
- App code lives in `src/` with feature folders:
  - `src/components/` (React components, PascalCase: `TopBar.tsx`)
  - `src/hooks/` (custom hooks, `useSomething.ts`)
  - `src/utils/` (helpers, camelCase: `dateHelpers.ts`)
  - `src/types/` (TypeScript types, lowercase: `notes.ts`)
  - Entry points: `src/main.tsx`, `src/App.tsx`. Static assets in `public/`.

## Build, Test, and Development Commands
- `npm run dev` — Start Vite dev server.
- `npm run build` — Type-check (`tsc -b`) and build with Vite to `dist/`.
- `npm run preview` — Serve the production build locally.
- `npm run lint` — Run ESLint on the project.
- Tests are not configured yet. If adding tests, prefer Vitest + React Testing Library.

## Coding Style & Naming Conventions
- TypeScript strict mode is enabled; fix types, don’t suppress.
- 2-space indentation; include semicolons; use single quotes.
- React: function components with `FC` where helpful; `use*` prefix for hooks.
- Filenames: components PascalCase, hooks camelCase starting with `use`, utils camelCase, types lowercase.
- Linting via ESLint (`eslint.config.js`) with React Hooks and Vite refresh rules.

## Testing Guidelines
- Suggested setup: Vitest + @testing-library/react. Name tests `*.test.ts(x)` and co-locate next to the unit or under `src/__tests__/`.
- Prefer pure functions in `utils/` and test them directly; for components, test user-visible behavior.
- Aim for meaningful coverage on utilities and critical components; snapshot tests sparingly.

## Commit & Pull Request Guidelines
- Commit history favors short, imperative messages (e.g., `calendar and note`). Keep messages concise and scoped.
- For PRs: include a brief summary, screenshots/GIFs for UI changes, testing notes, and link related issues. Ensure `npm run lint` and `npm run build` pass.

## Security & Configuration Tips
- Environment variables must be prefixed with `VITE_` (e.g., `VITE_API_URL`) and loaded via `import.meta.env`.
- Do not commit secrets. Use `.env.local` for machine-specific values and add new env files to `.gitignore` if needed.
- Target Node 18+ for Vite 7 compatibility.
