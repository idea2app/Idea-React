# Idea React website

The Idea React documentation website, built with ViNext and Vite to adapt the upstream website.
It exports static files and needs no Node.js server or Cloudflare Worker.

## Get started

From the repository root:

```sh
pnpm install
pnpm --filter @idea-react/document dev
```

The site supports MDX and uses Bootstrap 6 styles from unpkg.com.

## Build and deploy

```sh
pnpm --filter @idea-react/document test
pnpm --filter @idea-react/document build
pnpm --filter @idea-react/document start
```

Deploy only `dist/client/` to a static host. Set `basePath` in
[next.config.ts][1] before building for a subdirectory.
The repository's root build and release workflow still publish the legacy
TypeDoc and preview site; this workspace is built and deployed separately.

[1]: next.config.ts
