# Idea React website

The Idea React documentation website, built with ViNext and Vite to adapt the upstream website.
It exports static files and needs no Node.js server or Cloudflare Worker.

## Get started

From the repository root:

```sh
pnpm install
pnpm --filter @idea-react/document dev
```

The site provides:

- MDX documentation and examples, Bootstrap styling, theme switching, and local search.
- Page-local CSS/LESS imports, including CSS Modules, in MDX and TSX.
- Mermaid fences compiled to inline SVG with `beautiful-mermaid`:
    - No headless browser, client renderer, or hydration.
    - CSS variables adapt diagrams to the site theme; narrow layouts scroll horizontally.
    - Single-line `accTitle` and `accDescr` set accessible names and descriptions.
    - The renderer supports a Mermaid syntax subset; invalid diagrams fail compilation.
- Search backed by the same MDX/TSX source indexer in development and production:
    - Development generates `rss.xml` on request; builds export it as a static file.
    - RSS contains each page's title, link, and full plain-text content.
    - Search ranks title matches before body-only matches.
    - The same page data generates `sitemap.xml` and `robots.txt`.
- Documentation headings linked to their Bootstrap pages. Extensions and guides without an upstream equivalent link to Bootstrap's installation guide.

## Build and deploy

```sh
pnpm --filter @idea-react/document build
pnpm --filter @idea-react/document start
```

- Set the deployment origin with `SITE_URL` in `document/.env`. Override it with an environment variable or `document/.env.local` for other deployments.
- RSS and Sitemap use absolute URLs. Development feeds use the request origin, and search results stay on the current origin, including preview deployments.
- For subdirectory hosting, configure `basePath` in `document/next.config.ts`.
- Pages that fail static export are excluded from the search index and Sitemap.
- Deploy `document/dist/client/` to a static host.
- For subdirectory hosting, reference the generated Sitemap from the host-root `robots.txt`; crawlers only discover robots rules at the origin root.
- See [AGENTS.md][1] for contributor workflows and deployment configuration.

[1]: ../AGENTS.md
