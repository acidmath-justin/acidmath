import { MOCK_PRODUCTS } from "./mockData";
import { Product } from "./types";

const DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN;
const TOKEN = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN;
const API_VERSION = process.env.SHOPIFY_STOREFRONT_API_VERSION || "2024-10";
// Optional: scope the storefront to one curated collection (e.g. "current-drop")
// instead of the whole catalog. Leave unset to fetch all products.
const COLLECTION_HANDLE = process.env.NEXT_PUBLIC_SHOPIFY_COLLECTION_HANDLE;

const isConfigured = Boolean(DOMAIN && TOKEN && TOKEN !== "your-storefront-api-token");
const endpoint = `https://${DOMAIN}/api/${API_VERSION}/graphql.json`;

async function shopifyFetch<T>(query: string, variables: Record<string, unknown> = {}): Promise<T> {
  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": TOKEN as string,
    },
    body: JSON.stringify({ query, variables }),
    next: { revalidate: 60 },
  });

  if (!res.ok) throw new Error(`Shopify Storefront API error: ${res.status}`);
  const json = await res.json();
  if (json.errors) throw new Error(json.errors.map((e: { message: string }) => e.message).join(", "));
  return json.data as T;
}

// Shared product fields. `batchCode` / `showroomFixture` / `showroomPosition`
// are custom metafields (namespace "custom") — see README §2 for how to
// define them in Shopify Admin. Each metafield definition must have its
// "Storefront API" access toggle turned on, or these queries silently
// return null and the app falls back to sensible defaults.
const PRODUCT_FIELDS = /* GraphQL */ `
  id
  handle
  title
  description
  productType
  images(first: 4) { edges { node { url } } }
  priceRange { minVariantPrice { amount currencyCode } }
  compareAtPriceRange { minVariantPrice { amount } }
  variants(first: 20) {
    edges {
      node {
        id
        title
        availableForSale
        price { amount currencyCode }
        selectedOptions { name value }
      }
    }
  }
  batchCode: metafield(namespace: "custom", key: "batch_code") { value }
  showroomFixture: metafield(namespace: "custom", key: "showroom_fixture") { value }
  showroomPosition: metafield(namespace: "custom", key: "showroom_position") { value }
`;

const PRODUCTS_QUERY = /* GraphQL */ `
  query Products($first: Int!) {
    products(first: $first) {
      edges { node { ${PRODUCT_FIELDS} } }
    }
  }
`;

const COLLECTION_PRODUCTS_QUERY = /* GraphQL */ `
  query CollectionProducts($handle: String!, $first: Int!) {
    collectionByHandle(handle: $handle) {
      products(first: $first) {
        edges { node { ${PRODUCT_FIELDS} } }
      }
    }
  }
`;

// Shopify's built-in "Product type" field, mapped to our fixed category
// union. Set this in the product's Organization panel in Shopify Admin —
// no metafield needed. Falls back to "tee" for anything unrecognized.
function mapProductType(productType: string | null | undefined): Product["category"] {
  const t = (productType ?? "").toLowerCase();
  if (t.includes("hoodie") || t.includes("sweatshirt") || t.includes("crewneck")) return "hoodie";
  if (t.includes("jacket") || t.includes("varsity") || t.includes("coat")) return "jacket";
  if (t.includes("long") || t.includes("sleeve")) return "long-sleeve";
  if (t.includes("access") || t.includes("hat") || t.includes("beanie") || t.includes("bag")) return "accessory";
  return "tee";
}

function parsePosition(value: string | null | undefined): [number, number, number] | null {
  if (!value) return null;
  const parts = value.split(",").map((n) => parseFloat(n.trim()));
  if (parts.length === 3 && parts.every((n) => !Number.isNaN(n))) {
    return [parts[0], parts[1], parts[2]];
  }
  return null;
}

// Normalizes Shopify's nested edges/node shape into the flat `Product` type
// used everywhere else in the app (components never talk to raw Shopify JSON).
function normalizeShopifyProduct(node: any): Product {
  const opt = (selectedOptions: { name: string; value: string }[], name: string) =>
    selectedOptions.find((o) => o.name.toLowerCase() === name)?.value;

  const fixture = node.showroomFixture?.value as "rack" | "mannequin" | "shelf" | undefined;

  return {
    id: node.id,
    handle: node.handle,
    title: node.title,
    description: node.description,
    batchCode: node.batchCode?.value || `AM-${node.id.slice(-3).toUpperCase()}`,
    category: mapProductType(node.productType),
    images: node.images.edges.map((e: any) => e.node.url),
    textureUrl: node.images.edges[0]?.node.url ?? "",
    price: parseFloat(node.priceRange.minVariantPrice.amount),
    compareAtPrice: node.compareAtPriceRange?.minVariantPrice?.amount
      ? parseFloat(node.compareAtPriceRange.minVariantPrice.amount)
      : undefined,
    currencyCode: node.priceRange.minVariantPrice.currencyCode,
    variants: node.variants.edges.map((e: any) => ({
      id: e.node.id,
      title: e.node.title,
      price: parseFloat(e.node.price.amount),
      currencyCode: e.node.price.currencyCode,
      available: e.node.availableForSale,
      size: opt(e.node.selectedOptions, "size"),
      color: opt(e.node.selectedOptions, "color"),
    })),
    showroomSlot: fixture
      ? {
          fixture,
          fixtureId: `${fixture}-${node.handle}`,
          position: parsePosition(node.showroomPosition?.value) ?? [0, fixture === "mannequin" ? 0 : 1.2, -1],
        }
      : undefined,
  };
}

export async function getProducts(first = 24): Promise<Product[]> {
  if (!isConfigured) return MOCK_PRODUCTS;
  try {
    if (COLLECTION_HANDLE) {
      const data = await shopifyFetch<{
        collectionByHandle: { products: { edges: { node: any }[] } } | null;
      }>(COLLECTION_PRODUCTS_QUERY, { handle: COLLECTION_HANDLE, first });
      if (!data.collectionByHandle) {
        console.error(`Shopify collection "${COLLECTION_HANDLE}" not found — falling back to mock catalog`);
        return MOCK_PRODUCTS;
      }
      return data.collectionByHandle.products.edges.map((e) => normalizeShopifyProduct(e.node));
    }
    const data = await shopifyFetch<{ products: { edges: { node: any }[] } }>(PRODUCTS_QUERY, { first });
    return data.products.edges.map((e) => normalizeShopifyProduct(e.node));
  } catch (err) {
    console.error("Falling back to mock catalog —", err);
    return MOCK_PRODUCTS;
  }
}

export async function getProductByHandle(handle: string): Promise<Product | undefined> {
  const products = await getProducts();
  return products.find((p) => p.handle === handle);
}

const CART_CREATE_MUTATION = /* GraphQL */ `
  mutation CartCreate($lines: [CartLineInput!]!) {
    cartCreate(input: { lines: $lines }) {
      cart {
        id
        checkoutUrl
      }
      userErrors { message }
    }
  }
`;

/**
 * Creates a Shopify Cart and returns the hosted checkout URL to redirect to.
 * Falls back to a stub URL in demo mode (no Shopify store connected yet).
 */
export async function createCheckout(lines: { variantId: string; quantity: number }[]): Promise<string> {
  if (!isConfigured) {
    return "/checkout-demo";
  }
  const data = await shopifyFetch<{ cartCreate: { cart: { checkoutUrl: string }; userErrors: { message: string }[] } }>(
    CART_CREATE_MUTATION,
    { lines: lines.map((l) => ({ merchandiseId: l.variantId, quantity: l.quantity })) }
  );
  if (data.cartCreate.userErrors.length) {
    throw new Error(data.cartCreate.userErrors.map((e) => e.message).join(", "));
  }
  return data.cartCreate.cart.checkoutUrl;
}

export const shopifyConfigured = isConfigured;
