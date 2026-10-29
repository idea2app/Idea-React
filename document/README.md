# Idea React website

The Idea React homepage and documentation workspace, built with ViNext and Vite.
It exports static files and needs no Node.js server or Cloudflare Worker.

## Get started

From the repository root:

```sh
pnpm install
pnpm --filter @idea-react/document dev
```

The [homepage](app/page.mdx) uses MDX to keep the page composition shallow.
MDX is also suitable for non-documentation pages when it simplifies the markup.
Reusable library components live in [source/](../source/); website-only components
live in [component/](component/).

Styles use Bootstrap 6 from unpkg.com, with Bootstrap utilities first and CSS
Modules for site-specific appearance. Tailwind CSS is not used.

## Build and deploy

```sh
pnpm --filter @idea-react/document test
pnpm --filter @idea-react/document build
pnpm --filter @idea-react/document start
```

Deploy only `dist/client/` to a static host. Set `basePath` in
[next.config.ts](next.config.ts) before building for a subdirectory.
The repository's root build and release workflow still publish the legacy
TypeDoc and preview site; this workspace is built and deployed separately.
