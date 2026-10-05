# Kostya’s contact card

Minimal React + TypeScript page with self-hosted Manrope typography, Bootstrap brand SVGs, Lucide interface icons, a QR dialog, and an iPhone-compatible vCard.

## Docker

```sh
docker compose up --build -d
```

Open http://localhost:8080. The production container serves the built app through Nginx. For the public domain, point `socials.krvvko.me` to your server and route HTTPS through your reverse proxy to port 8080.

```sh
docker compose down
```

## Development

```sh
npm ci
npm run dev
```

```sh
npm run build
npm test
```

The QR always points to `https://socials.krvvko.me`. The contact button opens `public/kostya-krauchanka.vcf`; iOS shows a contact preview and lets the user save it. Browsers cannot silently insert a contact. Discord copies the username and phone opens the dialer.

Tests use installed Chrome and the Docker server on port 8080. Set `TEST_BROWSER_CHANNEL` to `msedge` to use Edge, or `TEST_BASE_URL` to test another server.

## Assets

- Profile photo: original repository `img.png`, copied into `public/profile.png`.
- Social logos: downloaded from [Bootstrap Icons](https://icons.getbootstrap.com/), MIT licensed. Sources and license in `public/icons/`.
- UI icons: [Lucide](https://lucide.dev/), ISC licensed, bundled locally.
- Typeface: [Manrope](https://fonts.google.com/specimen/Manrope), SIL Open Font License, self-hosted through Fontsource.

The background animation respects reduced-motion preferences. Mobile and desktop layouts fit one screen at normal text sizes; accessibility zoom and very small viewports may need additional space.
