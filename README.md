# Astro24Pro

Full‑stack web app for astrological services and an esoteric shop. Built on Next.js + Payload CMS with a modern UI, rich content editing, and a scalable data model for specialists, products, news, and promotions.

## Highlights

- Public marketing pages with dynamic content
- Specialist profiles and reviews
- Shop with products, images, and status moderation
- Rich text content via Lexical editor
- Admin panel powered by Payload CMS

## Tech Stack

- Next.js 15 (App Router)
- React 19
- Payload CMS 3 + @payloadcms/next
- PostgreSQL adapter for Payload
- Tailwind CSS 4
- Framer Motion (UI animations)
- Lexical / TipTap (rich text)
- Playwright + Vitest (testing)

## Requirements

- Node.js `^18.20.2 || >=20.9.0`
- pnpm `^9 || ^10`

## Quick Start

1. Install dependencies:
   - `pnpm install`
2. Create env file:
   - `cp .env.example .env`
3. Start dev server:
   - `pnpm dev`
4. Open `http://localhost:3000`

## Useful Scripts

- `pnpm dev` — start Next.js in dev mode
- `pnpm build` — production build
- `pnpm start` — run production server
- `pnpm lint` — lint checks
- `pnpm generate:types` — generate Payload types
- `pnpm generate:importmap` — generate Payload import map
- `pnpm migrate` — run Payload migrations
- `pnpm test` — run all tests (Vitest + Playwright)

## Project Structure

```
src/
  app/                # Next.js routes (frontend + Payload admin)
  collections/        # Payload collections
  globals/            # Payload globals
  components/         # UI components
  blocks/             # Payload blocks
  migrations/         # Payload migrations
  payload.config.ts   # Payload config
```

## Environment Variables

See `.env.example` for required variables. Typical values include:

- `PAYLOAD_SECRET`
- `DATABASE_URL`
- `NEXT_PUBLIC_SERVER_URL`

## Development Notes

- After editing schemas, run `pnpm generate:types`.
- After adding custom admin components, run `pnpm generate:importmap`.
