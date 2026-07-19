# Acidmath — Blotter to Body

A dream e-commerce build for a premium psychedelic apparel brand: a walkable
3D showroom, a pose-tracking virtual mirror, and a Shopify-backed storefront,
all wrapped around one signature idea — **the perforated blotter tab** — used
as the literal interaction model for sizing, dividers, and badges everywhere.

Live structure: Hero → Virtual Showroom (3D) → Collections → Manifesto →
Gallery, with a persistent cart drawer and a dedicated Mirror (try-on) route.

---

## 1. Quick start

```bash
npm install
cp .env.example .env.local   # then fill in Shopify creds — see below
npm run dev
```

Open http://localhost:3000. **The site runs immediately with zero
configuration** — `lib/shopify.ts` falls back to the mock catalog in
`lib/mockData.ts` (placeholder art via placehold.co) whenever Shopify env
vars aren't set, so you can develop and demo the whole experience — 3D
showroom, Mirror, cart drawer — before a Shopify store even exists.

Requires Node 18.17+.

---

## 2. Connecting Shopify

1. In Shopify Admin → **Settings → Apps and sales channels → Develop apps**,
   create an app and enable the **Storefront API**. Under its API scopes,
   the default read-only Storefront permissions are enough for browsing and
   cart creation.
2. Copy the Storefront API access token.
3. Fill in `.env.local`:

   ```
   NEXT_PUBLIC_SHOPIFY_DOMAIN=your-store.myshopify.com
   NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN=shpat_xxx...
   SHOPIFY_STOREFRONT_API_VERSION=2024-10
   ```

4. Run `npm run verify:shopify` — a standalone script (`scripts/verify-shopify.mjs`)
   that checks the connection and lists what it finds, without needing the
   dev server running. Fix any errors it reports before moving on.
5. Restart the dev server. `getProducts()` and `createCheckout()` in
   `lib/shopify.ts` now talk to your real store; "Add to Bag" creates a
   Shopify Cart and the drawer's **Checkout** button redirects to Shopify's
   hosted, PCI-compliant checkout (`cart.checkoutUrl`) — no card data ever
   touches this app.

### Mapping your catalog onto the site's fields

Most of a product's fields come straight from Shopify with no setup:
title, description, images, price, variants (size/color options), and
availability all just work. Three things need a little extra setup in
Shopify Admin to come through correctly:

**Category** (which garment shape it gets in the showroom/Mirror) — set the
built-in **Product type** field (Product → Organization panel) to something
containing "hoodie", "jacket", "long sleeve"/"sleeve", or "accessory"/"hat"/
"beanie"/"bag". Anything else (including blank) falls back to "tee". See
`mapProductType()` in `lib/shopify.ts` if you want to adjust the keywords.

**Batch code, showroom fixture, and showroom position** — these are custom
metafields (Settings → **Custom data** → Products → Add definition):

| Metafield key | Namespace | Type | Example value |
|---|---|---|---|
| `batch_code` | `custom` | Single line text | `AM-014` |
| `showroom_fixture` | `custom` | Single line text | `mannequin` (or `rack` / `shelf`) |
| `showroom_position` | `custom` | Single line text | `-2.4,0,-3` |

**Important:** for each definition, turn on its **Storefront API** access
toggle (in the definition's settings) — metafields are private by default,
and the query will silently return `null` instead of erroring if you skip
this. None of these three are required — a product with no metafields set
still displays everywhere except the 3D showroom's racks/mannequins.

### Showing a curated collection instead of the whole catalog

By default the site pulls every product in your store. To scope it to one
Shopify Collection instead (e.g. a "Current Drop" collection), set:

```
NEXT_PUBLIC_SHOPIFY_COLLECTION_HANDLE=current-drop
```

`getProducts()` in `lib/shopify.ts` automatically switches to a
collection-scoped query when this is set.

### Product pages

Every product now has a real page at `/collections/[handle]` (see
`app/collections/[handle]/page.tsx`) — statically generated at build time
via `generateStaticParams`, with per-product metadata and Product/Offer
JSON-LD for search and social previews. Clicking a product card navigates
there; the small "Quick view" button in the corner (or clicking a garment
in the 3D showroom) still opens the fast in-place modal instead.

---

## 3. Project structure

```
app/
  page.tsx                     Homepage (hero + teaser sections)
  shop/page.tsx                 Virtual Showroom (3D)
  mirror/page.tsx                Virtual Mirror (avatar + AR try-on)
  collections/page.tsx           Filterable product grid
  collections/[handle]/page.tsx  Individual product page (SEO + JSON-LD)
  about/page.tsx                 Manifesto
  gallery/page.tsx               Campaign gallery + Spotify embed
  api/checkout/route.ts          Shopify cart → checkout URL

components/
  hero/          Fractal shader background + landing hero
  showroom/      3D scene: environment, rack, mannequin, shelf,
                 sacred-geometry light rig, particles, WASD controls,
                 product modal, mobile fallback
  mirror/        Body-profile form, 3D avatar, webcam/photo pose-AR overlay
  collections/   Product grid, card, and the full product detail page
  about/         Manifesto copy + scroll reveals
  gallery/       Masonry gallery + lightbox
  layout/        Navbar, footer, cart drawer
  ui/            Button, section heading, and the BlotterTab signature element

lib/       Shopify Storefront client, shared types, mock catalog
store/     Zustand stores (cart, showroom UI state)
hooks/     Device-capability detection, WASD key state
scripts/   verify-shopify.mjs — standalone Storefront API connection check
```

---

## 4. Design system

- **Palette** — `void #05050A`, `paper #F4F1E8`, `magenta #FF2E9A`,
  `violet #7B2FF7`, `acidgreen #39FF6A`, `amber #FFB627` (see
  `tailwind.config.ts`).
- **Type** — Unbounded (display, used sparingly for headlines), Space
  Grotesk (body/UI), Space Mono (batch codes, prices, HUD text — a nod to
  pharmaceutical/lab labeling).
- **Signature element** — the perforated **blotter tab**
  (`components/ui/BlotterTab.tsx`). It's the size selector, the cart badge,
  and the section divider throughout — literally reusing the product's own
  material (a perforated blotter sheet) as the UI's core motif, rather than
  a generic neon accent.

---

## 5. The 3D Showroom (`/shop`)

Built with React Three Fiber + drei, fully procedural — **no external `.glb`
downloads required**, so the demo works without any 3D asset pipeline:

- `garmentShapes.ts` builds a stylized tee/hoodie/jacket silhouette via
  `THREE.ExtrudeGeometry`, UV-remapped so product textures map cleanly.
- `Mannequin.tsx` / `AvatarViewer.tsx` use drei's `<Decal>` to project the
  garment texture onto a capsule-based humanoid.
- `SacredGeometry.tsx` is a rotating nested icosahedron/octahedron wireframe
  that doubles as the scene's main colour-cycling point light.
- `PlayerControls.tsx` implements **WASD walk + click-drag look** manually
  (no pointer-lock requirement, so it behaves inside an embedded page and on
  trackpads/touch) with position clamped to the store bounds.
- `Bloom` + `ChromaticAberration` (`@react-three/postprocessing`) make every
  emissive surface — garments, the sacred-geometry rig, the particle field —
  actually glow. This is doing most of the "trippy" visual work.

**Mobile / low-power fallback:** `hooks/useDeviceCapability.ts` checks
WebGL support, `prefers-reduced-motion`, core count and device memory. On a
match, `Showroom.tsx` renders `MobileShowcase.tsx` instead — a swipeable
product carousel — rather than trying to run a full 3D scene on a
constrained device.

### Upgrading the showroom
Swap the procedural garment shapes for real assets by:
1. Photographing/scanning garments (photogrammetry or a service like
   Kiri Engine) into `.glb` models, `useGLTF()`-loading them in place of
   `createGarmentGeometry()`.
2. Or, simpler: keep the flat silhouette but swap `product.textureUrl` for
   real product photography cut out with a transparent background.

---

## 6. The Virtual Mirror (`/mirror`)

Three switchable modes, per garment, driven by one shared body profile
(height, weight, body shape, skin tone — `BodyForm.tsx`):

**3D Avatar** (`AvatarViewer.tsx`) — a parametric humanoid scaled by
`lib/avatarProportions.ts`: height maps to a uniform vertical scale, weight
(as BMI) and body shape (slim/athletic/curvy/plus) map to a chest-width
factor *and* a separate hip-width factor, so "curvy" widens the hips
relative to the chest instead of just scaling the whole body up. Skin tone
is a fixed 6-swatch scale applied directly to the body materials. The
garment itself is a dedicated mesh (`createDrapedGarmentGeometry` in
`components/showroom/garmentShapes.ts`) — a dense grid wrapped around a
vertical cylinder with a tapered hem→chest→shoulder width profile and a
small per-vertex droop, rendered with shadow-casting lights — rather than a
flat decal, so it reads as *worn* instead of printed onto the body. It's a
geometric approximation, not cloth physics; see "Upgrading the Mirror"
below for where to take it further.

**AR Mode** (`ARFittingView.tsx`) — real WebXR: checks
`navigator.xr.isSessionSupported("immersive-ar")`, and if available, uses
three.js's `ARButton` + the WebXR **hit-test** API to let you tap a spot on
your real floor and drop a life-size hologram of the avatar wearing the
garment into your room, built from the same proportions/garment code as the
3D Avatar tab (`buildWearerGroup.ts` — a vanilla-three.js port of
`AvatarMesh`, since a WebXR session is managed as a raw `THREE.Scene`
outside React Three Fiber's `<Canvas>`). **Device support is real but
narrow**: this works on AR-capable Android phones in Chrome; iOS Safari and
desktop browsers don't support `immersive-ar` today, so on those devices
this tab shows a clear message and a button straight into Camera Overlay
mode instead — the "or device camera overlay" fallback from the brief. The
whole view is wrapped in an `ErrorBoundary` (`components/ui/ErrorBoundary.tsx`)
since WebXR's browser support surface changes often enough that defensive
isolation is worth the extra file.

**Real Mirror** (`PoseOverlayAR.tsx`) — the webcam/photo overlay from the
previous build: TensorFlow.js MoveNet finds shoulder/hip keypoints
client-side and transforms the garment image onto your photo or live video.
Nothing is uploaded.

This is solid MVP-grade try-on, not a photorealistic cloth simulation.
Known limitations, by design, to keep it fast and dependency-light:
- The draped garment mesh and the webcam overlay both use rigid
  transforms/profiles rather than true cloth simulation or per-pose warping.
- Sleeves don't bend with the arm in either mode; only torso/hip proportions
  and shoulder-to-hip keypoints drive shape and placement.
- AR Mode places a stylized avatar wearing the garment, not a live overlay
  on *your* body in AR — combining WebXR with real-time body tracking is a
  meaningfully larger project (see below).

### Upgrading the Mirror
- Swap the flat garment image for a **transparent-background PNG cutout**
  per product (real deployments should not use the placeholder textures) —
  this improves both the draped mesh's texture and the webcam overlay.
- For sleeve-aware warping in Real Mirror, add `left_elbow` / `right_elbow`
  / `left_wrist` / `right_wrist` keypoints and mesh-warp the sleeve regions
  independently.
- For true cloth behavior on the 3D Avatar / AR Mode garment mesh, replace
  the geometric wrap in `createDrapedGarmentGeometry` with a physics-backed
  cloth solver (e.g. a lightweight mass-spring implementation, or a physics
  engine's cloth constraints) driven by the same avatar joints.
- For photoreal results, integrate a hosted virtual try-on model (several
  vendors offer a diffusion-based garment-transfer API) behind an
  `app/api/checkout/route.ts`-style API route, keeping the key server-side.
- iOS AR support: Apple doesn't support WebXR, but you can add a
  parallel **AR Quick Look** path (a `<a rel="ar">` link to a `.usdz` model)
  for a native iOS "view in your space" experience alongside `ARFittingView`.

---

## 7. Cart & checkout

`store/cartStore.ts` (Zustand + localStorage persistence) is the single
source of truth, read by the navbar badge, the drawer, and every "Add to
Bag" button (showroom garments, mannequins, shelf items, product cards, the
Mirror). Checkout posts cart lines to `app/api/checkout/route.ts`, which
calls Shopify's `cartCreate` mutation and redirects to the returned
`checkoutUrl`. In demo mode (no Shopify configured) it redirects to
`/checkout-demo` — wire that up to a real store before launch.

---

## 8. Performance & accessibility notes

- Heavy scenes (`Showroom`, `AvatarViewer`, hero shader) are
  `next/dynamic`-imported with `ssr: false` and only mounted after
  `useDeviceCapability` resolves, avoiding a hydration flash of a canvas
  that's about to be swapped for the mobile fallback.
- `prefers-reduced-motion` is respected globally (`app/globals.css`) and
  explicitly gates the hero shader and 3D showroom.
- All interactive controls (`Button`, `BlotterTab`, nav links) have visible
  focus rings (`focus-visible:outline`).
- Product/garment hover labels use drei's `<Html occlude>` so they don't
  float through walls or other meshes.

---

## 9. Deployment (Vercel)

Vercel is the reference target below since it's built by the same team as
Next.js and needs zero config for this project, but any host that runs a
standard Next.js server (Netlify, Railway, a plain Node box via
`next start`) works too — nothing here is Vercel-specific in the code.

1. Push this repo to GitHub (or GitLab/Bitbucket), then **Import Project**
   in Vercel and point it at the repo. Framework preset: Next.js
   (auto-detected) — no custom build command needed.
2. Add every variable from `.env.example` in **Project Settings →
   Environment Variables**. Scope them per environment:
   - **Production**: your real Shopify domain/token, real
     `NEXT_PUBLIC_SITE_URL` (your live domain).
   - **Preview** (PR/branch deploys): fine to reuse the same real Shopify
     token, or point at a Shopify development store — your call. Leave
     `NEXT_PUBLIC_SITE_URL` unset here; Vercel auto-injects
     `VERCEL_URL` per preview deploy, which `robots.ts`/`sitemap.ts` don't
     currently read (see note below if you want preview deploys excluded
     from search indexing, which you generally do).
3. Deploy. First build will run `npm run build`, generating the homepage,
   showroom, mirror, collections, every product page
   (`generateStaticParams` in `app/collections/[handle]/page.tsx`), plus
   `robots.txt` and `sitemap.xml`.
4. **Add a custom domain** in Project Settings → Domains once you're
   pointing this at `acidmath.com` for real — Vercel handles the TLS
   certificate automatically.
5. **`.github/workflows/ci.yml`** runs lint + build on every push/PR against
   the mock catalog (no real credentials needed in CI) — connect it in
   GitHub's Actions tab if you want build failures caught before they reach
   Vercel's own build step.
6. If you add real garment photography on a CDN other than Shopify's, add
   its hostname to `images.remotePatterns` in `next.config.mjs` — and once
   real photography exists, delete the `placehold.co` entry there (it's
   flagged demo-only).
7. WebXR (AR Mode) and `getUserMedia` (Real Mirror) both require a secure
   context — Vercel's default HTTPS covers this; only relevant if you test
   from a plain `http://` LAN address on a phone, where both will silently
   refuse to start.
8. `next.config.mjs` sets a `Permissions-Policy` header explicitly allowing
   camera and WebXR for this origin — if you later add a CSP or a reverse
   proxy in front of this, make sure it doesn't override that, or those two
   Mirror modes will silently stop working.

**Preview deploys and search indexing**: `app/robots.ts` currently allows
all crawling on every deploy, including previews. If you don't want
Vercel's preview URLs (`*.vercel.app`) picked up by Google, gate it on
`process.env.VERCEL_ENV`:

```ts
const isProd = process.env.VERCEL_ENV === "production";
return { rules: { userAgent: "*", allow: isProd ? "/" : undefined, disallow: isProd ? ["/api/"] : ["/"] }, sitemap: ... };
```

**Smoke test after every deploy**: homepage loads, `/shop` renders the 3D
scene, `/mirror` loads all three tabs, add-to-cart → checkout redirects
correctly, and `/sitemap.xml` + `/robots.txt` resolve.

---

## 10. Pre-launch checklist

- [ ] Real product photography + blotter-grid artwork (replace every
      `placehold.co` URL in `lib/mockData.ts`, `MusicGallery.tsx`)
- [ ] Real Shopify Storefront token, `npm run verify:shopify` passing, and
      product type / metafields set per §2 for at least one live collection
- [ ] Transparent-PNG garment cutouts for the draped avatar mesh and the
      Real Mirror's AR overlay
- [ ] Test AR Mode on an actual AR-capable Android device — WebXR can't be
      exercised in a desktop browser or simulator with full fidelity
- [ ] Decide whether to add an iOS AR Quick Look (`.usdz`) path alongside
      `ARFittingView`, since WebXR has no iOS Safari support
- [ ] Swap the Spotify playlist ID in `.env` for the brand's real playlist
- [ ] Wire the newsletter form in `HomeSections.tsx` to a real ESP
      (Klaviyo, etc. — currently just flips a local "submitted" state)
- [ ] Replace procedural garment silhouettes with scanned/modeled `.glb`s
      once photography/3D assets exist (optional, see §5)
- [ ] Custom domain connected in Vercel, `NEXT_PUBLIC_SITE_URL` set to it
- [ ] `.github/workflows/ci.yml` connected in GitHub Actions
- [ ] Decide whether preview deploys should be excluded from indexing
      (see §9's `robots.ts` note) before this is public
- [ ] Legal pages — privacy policy, terms, shipping/returns — not built yet
