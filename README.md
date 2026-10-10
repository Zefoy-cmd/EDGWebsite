# ErDuGamer (erdugamer.dk)

Statisk frontend til Cloudflare Pages – ingen build-step.

**Cloudflare Pages-indstillinger:** Framework preset `None`, build command tom, output directory `/`.

## Filer
| Fil | Formål |
|---|---|
| `index.html` | Forside med CTA above the fold, events, FAQ |
| `privatlivspolitik.html` | Privatlivspolitik + cookieoversigt (`/privatlivspolitik`) |
| `vilkaar.html` | Vilkår (`/vilkaar`) |
| `404.html` | Custom 404 – Cloudflare Pages bruger den automatisk |
| `events.json` | Indholdet i "Kommende events" (redigér her) |
| `robots.txt`, `sitemap.xml` | SEO |
| `_headers` | Sikkerheds-headers til Cloudflare Pages |
| `script.js` | Menu, sticky mobil-CTA, loading states, cookiebanner |

## Cookies
Samtykke gemmes i `localStorage` under `edg-cookie-consent`. Når I tilføjer statistik/marketing,
så indlæs scriptet i `onConsent()` i `script.js` (eller lyt på `edg:consent`-eventet),
og tilføj cookien i tabellen i privatlivspolitikken.
