# Idea React documentation

An MDX documentation site built with vinext and Vite, exported as plain static
assets. Hosting requires neither Cloudflare Workers nor a Node.js server.

## Scripts

Run these commands from `document/`, or use
`pnpm --filter @idea-react/document <script>` from the repository root.

- Install workspace dependencies with `pnpm install` from the repository root.
- `pnpm test` checks the TypeScript configuration and source files.
- `pnpm run dev` starts the development server.
- `pnpm run build` exports the site to `dist/client/`.
- `pnpm run start` previews the exported site after building.

For example, from the repository root:

```sh
pnpm --filter @idea-react/document test
pnpm --filter @idea-react/document build
pnpm --filter @idea-react/document start
```

The `test` script runs `tsc --noEmit`; it does not validate MDX content or exported
HTML. Check the build output and preview when changing documentation pages.

## Authoring

The home page is [app/page.mdx](app/page.mdx). Create `app/<route>/page.mdx` for a new documentation page. Both Markdown and
embedded JSX are supported, including imported React components. vinext
automatically loads the installed `@mdx-js/rollup` plugin; `@next/mdx` is not needed.
The root [app/layout.tsx](app/layout.tsx) provides shared metadata and imports
[global CSS](app/globals.css), including Tailwind CSS.

## Static hosting

[next.config.ts](next.config.ts) enables `output: "export"` and `trailingSlash: true`, producing
directory-style HTML and matching static RSC `.txt` payloads for navigation.
Upload **only `dist/client/`** to your static host and configure its 404 page to
use `404.html`. Other build directories are build-time artifacts, not a server
that needs to be deployed.

The default configuration serves at the domain root. For hosting under a
subdirectory, set `basePath` in [next.config.ts](next.config.ts) before building.
For the repository's GitHub Pages project URL, that value is `/Idea-React`.

This workspace is not yet included in the repository's root build or deployment
workflow. The root `pack-docs` script still generates TypeDoc into `docs/`, and
the [release workflow](../.github/workflows/main.yml) deploys that directory,
including the legacy preview site. Building this workspace does not replace
those published files.

Dynamic routes must enumerate their paths with `generateStaticParams()`.
Request-time APIs, cookies, Server Actions, ISR, and on-demand image optimization
are not available in a pure static export. Images are configured as unoptimized.
vinext currently skips App Router route handlers during export, so generate
static data files at build time instead of adding API routes.
