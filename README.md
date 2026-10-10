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
| `fonts/` | Selv-hostede skrifttyper (Anton, Archivo, JetBrains Mono – SIL Open Font License). Ingen kald til Google Fonts = ingen GDPR-problemer |

## Før go-live – TODO
- [ ] Når I får en Discord: skift "Kontakt os"-knapperne (mailto-links) i alle `.html`-filer ud med invitationslinket, og tilføj Discord i privatlivspolitikken
- [ ] Tjek at `kontakt@erdugamer.dk` findes
- [ ] Udfyld navn/adresse/CVR i `privatlivspolitik.html` og `vilkaar.html` (søg efter `TODO`)
- [ ] Opdatér `lastmod` i `sitemap.xml` når sider ændres
- [ ] Tilføj evt. et `og:image` (1200×630 PNG) til deling på sociale medier

## Cookies
Samtykke gemmes i `localStorage` under `edg-cookie-consent`. Når I tilføjer statistik/marketing,
så indlæs scriptet i `onConsent()` i `script.js` (eller lyt på `edg:consent`-eventet),
og tilføj cookien i tabellen i privatlivspolitikken.
