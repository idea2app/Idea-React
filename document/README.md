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
Build and preview the site to use the generated search index.

## Build and deploy

```sh
pnpm --filter @idea-react/document build
pnpm --filter @idea-react/document start
```

Deploy `document/dist/client/` to a static host.
For contributor workflows and deployment configuration, see [AGENTS.md](../AGENTS.md).
