# Idea React website

The Idea React documentation website, built with ViNext and Vite to adapt the upstream website.
It exports static files and needs no Node.js server or Cloudflare Worker.

## Get started

From the repository root:

```sh
pnpm install
pnpm --filter @idea-react/document dev
```

The site includes MDX documentation and examples, Bootstrap styling, theme switching, and local page search.
MDX and TSX pages can directly import page-local CSS/LESS, including CSS Modules.
Development and production search use the same MDX/TSX source indexer and load `rss.xml`.
The development server generates it on request; the build writes it to the static output.
The RSS feed includes every page's title, link, and full plain-text content for search and subscription.
Search ranks title matches before body-only matches.
The same page data also generates `sitemap.xml` and `robots.txt`.
Documentation headings link to the corresponding Bootstrap page. Library extensions
and guides without an upstream equivalent link to Bootstrap's installation guide.

## Build and deploy

```sh
pnpm --filter @idea-react/document build
pnpm --filter @idea-react/document start
```

`document/.env` sets `SITE_URL=https://idea-react.pages.dev/` for the deployed site.
Override it with an environment variable or `document/.env.local` when deploying elsewhere.
RSS and Sitemap use absolute URLs; development feeds use the local request origin. Search results link to the page path relative to the current origin, so preview deployments never jump to production.
For subdirectory hosting, configure `basePath` in `document/next.config.ts`.
Pages that fail static export are excluded from both the search index and Sitemap.
Deploy `document/dist/client/` to a static host.
For subdirectory hosting, also reference the generated Sitemap from the host-root `robots.txt`;
crawlers only discover robots rules at the origin root.
For contributor workflows and deployment configuration, see [AGENTS.md][1].

[1]: ../AGENTS.md
