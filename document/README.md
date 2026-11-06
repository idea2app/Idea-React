# Idea React website

The Idea React documentation website, built with ViNext and Vite to adapt the upstream website.
It exports static files and needs no Node.js server or Cloudflare Worker.

## Get started

From the repository root:

```sh
pnpm install
pnpm --filter @idea-react/document dev
```

The site includes MDX pages, Bootstrap styling, theme switching, and local page search.
Development and production search use the same MDX source indexer and load `search-index.json`.
The development server generates it on request; the build writes it to the static output.
Search ranks title matches before body-only matches.

## Build and deploy

```sh
pnpm --filter @idea-react/document build
pnpm --filter @idea-react/document start
```

Deploy `document/dist/client/` to a static host.
For contributor workflows and deployment configuration, see [AGENTS.md](../AGENTS.md).
