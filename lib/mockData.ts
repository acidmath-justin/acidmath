import { Product } from "./types";

// Product names, artist credits, and pricing below are pulled from the real
// acidmath.com catalog (ACIDMATH COLLECTIVE) as of July 2026 — this is your
// actual store's lineup, not invented demo items. Descriptions are original
// copy written for this redesign (not copied from the live site), and art/
// photography is placeholder (placehold.co) until real product photography
// is wired in — see README "Assets" section. Swap this file for a live
// Shopify connection (lib/shopify.ts) whenever you're ready; this is the
// fallback the app runs on until then.
const ph = (label: string, bg: string, fg = "F4F1E8") =>
  `https://placehold.co/1024x1024/${bg}/${fg}?text=${encodeURIComponent(label)}`;

export const MOCK_PRODUCTS: Product[] = [
  {
    id: "prod_001",
    handle: "psy-hand-zipper-hoodie",
    title: "Psy Hand Zipper Hoodie",
    description:
      "AI-enhanced psychedelic artwork wrapped full-panel across a premium polyester-blend zip-up. Heat-dye printed so it won't crack, peel, or fade wash after wash.",
    batchCode: "AM-014",
    category: "hoodie",
    images: [ph("PSY HAND", "1a0a2e"), ph("BACK PRINT", "0a0a14")],
    textureUrl: ph("PSY HAND", "7B2FF7"),
    price: 150,
    compareAtPrice: 168,
    currencyCode: "USD",
    variants: [
      { id: "var_001_s", title: "Small / Black", price: 150, currencyCode: "USD", available: true, size: "S", color: "Black" },
      { id: "var_001_m", title: "Medium / Black", price: 150, currencyCode: "USD", available: true, size: "M", color: "Black" },
      { id: "var_001_l", title: "Large / Black", price: 150, currencyCode: "USD", available: true, size: "L", color: "Black" },
      { id: "var_001_xl", title: "XL / Black", price: 150, currencyCode: "USD", available: false, size: "XL", color: "Black" },
    ],
    showroomSlot: { fixture: "mannequin", fixtureId: "mannequin-1", position: [-2.4, 0, -3] },
  },
  {
    id: "prod_002",
    handle: "overclocked-cortex-tee",
    title: "Overclocked Cortex Tee",
    description:
      "SalviaDroid's circuitry-meets-third-eye linework, printed dead-center on a soft, true-to-size unisex tee. Colors hold through the wash.",
    batchCode: "AM-002",
    category: "tee",
    images: [ph("OVERCLOCKED CORTEX", "0a0a14")],
    textureUrl: ph("CORTEX", "FF2E9A"),
    price: 45.99,
    currencyCode: "USD",
    variants: [
      { id: "var_002_s", title: "Small / Bone", price: 45.99, currencyCode: "USD", available: true, size: "S", color: "Bone" },
      { id: "var_002_m", title: "Medium / Bone", price: 45.99, currencyCode: "USD", available: true, size: "M", color: "Bone" },
      { id: "var_002_l", title: "Large / Bone", price: 45.99, currencyCode: "USD", available: true, size: "L", color: "Bone" },
    ],
    showroomSlot: { fixture: "rack", fixtureId: "rack-1", position: [-1, 1.2, -1] },
  },
  {
    id: "prod_003",
    handle: "third-eye-tank-top",
    title: "Third Eye Tank Top",
    description:
      "Built for the studio floor as much as the festival field — vibrant sacred-geometry print on a true-to-size racerback that doesn't fade under sweat or wash.",
    batchCode: "AM-004",
    category: "tee",
    images: [ph("THIRD EYE", "111120")],
    textureUrl: ph("THIRD EYE", "39FF6A", "05050A"),
    price: 70,
    currencyCode: "USD",
    variants: [
      { id: "var_003_m", title: "Medium / Black", price: 70, currencyCode: "USD", available: true, size: "M", color: "Black" },
      { id: "var_003_l", title: "Large / Black", price: 70, currencyCode: "USD", available: true, size: "L", color: "Black" },
    ],
    showroomSlot: { fixture: "rack", fixtureId: "rack-1", position: [0, 1.2, -1] },
  },
  {
    id: "prod_004",
    handle: "acid-drop-winter-hooded-jacket",
    title: "Acid Drop Winter Hooded Jacket",
    description:
      "Psychedelic Pour House's cold-weather flagship — a heavyweight hooded shell built to actually hold up through winter, printed edge to edge.",
    batchCode: "AM-021",
    category: "jacket",
    images: [ph("ACID DROP", "05050A")],
    textureUrl: ph("ACID DROP", "FFB627", "05050A"),
    price: 178,
    currencyCode: "USD",
    variants: [
      { id: "var_004_m", title: "Medium / Black", price: 178, currencyCode: "USD", available: true, size: "M", color: "Black" },
      { id: "var_004_l", title: "Large / Black", price: 178, currencyCode: "USD", available: false, size: "L", color: "Black" },
    ],
    showroomSlot: { fixture: "mannequin", fixtureId: "mannequin-2", position: [2.4, 0, -3] },
  },
  {
    id: "prod_005",
    handle: "40-nights-40-days-rug",
    title: "40 Nights 40 Days Rug",
    description:
      "ARTFOOL's wall-and-floor piece, sized for a dorm room or a living room centerpiece either way. Soft underfoot, loud on a wall.",
    batchCode: "AM-009",
    category: "accessory",
    images: [ph("40 NIGHTS 40 DAYS", "0a0a14")],
    textureUrl: ph("RUG", "7B2FF7"),
    price: 100,
    currencyCode: "USD",
    variants: [
      { id: "var_005_s", title: `Youth 60"x45"`, price: 100, currencyCode: "USD", available: true, size: "Youth" },
      { id: "var_005_a", title: `Adult 80"x60"`, price: 130, currencyCode: "USD", available: true, size: "Adult" },
    ],
    showroomSlot: { fixture: "shelf", fixtureId: "shelf-1", position: [1.6, 1.5, -0.4] },
  },
  {
    id: "prod_006",
    handle: "psychedelic-hex-zip-up-hoodie",
    title: "Psychedelic Hex Zip-Up Hoodie",
    description:
      "PatternNerd's hex-tiled fractal, full-wrap on a microfleece-lined zip hoodie. Nylon zip, high-def print that won't peel or crack.",
    batchCode: "AM-017",
    category: "hoodie",
    images: [ph("PSYCHEDELIC HEX", "1a0a2e")],
    textureUrl: ph("HEX", "FF2E9A"),
    price: 120,
    currencyCode: "USD",
    variants: [
      { id: "var_006_s", title: "Small / Black", price: 120, currencyCode: "USD", available: true, size: "S", color: "Black" },
      { id: "var_006_m", title: "Medium / Black", price: 120, currencyCode: "USD", available: true, size: "M", color: "Black" },
    ],
    showroomSlot: { fixture: "rack", fixtureId: "rack-2", position: [-1, 1.2, 1] },
  },
  {
    id: "prod_007",
    handle: "im-feelin-it-zipper-hoodie",
    title: "I'm Feelin' It Zipper Hoodie",
    description:
      "Acidmath AI's original generative artwork, custom cut-and-sewn per order onto a soft, wrinkle-resistant zip hoodie built for daily rotation.",
    batchCode: "AM-011",
    category: "hoodie",
    images: [ph("IM FEELIN IT", "111120")],
    textureUrl: ph("FEELIN IT", "39FF6A", "05050A"),
    price: 150,
    currencyCode: "USD",
    variants: [
      { id: "var_007_m", title: "Medium / Black", price: 150, currencyCode: "USD", available: true, size: "M", color: "Black" },
      { id: "var_007_l", title: "Large / Black", price: 150, currencyCode: "USD", available: true, size: "L", color: "Black" },
    ],
    showroomSlot: { fixture: "rack", fixtureId: "rack-2", position: [0, 1.2, 1] },
  },
];

export function getProductByHandle(handle: string) {
  return MOCK_PRODUCTS.find((p) => p.handle === handle);
}
