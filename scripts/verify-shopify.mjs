#!/usr/bin/env node
// Quick standalone check that your Shopify Storefront API credentials are
// wired up correctly — run with `npm run verify:shopify`. Reads from
// .env.local (or .env) directly so you don't need the dev server running.

import { readFileSync, existsSync } from "node:fs";

function loadEnvFile(path) {
  if (!existsSync(path)) return {};
  const env = {};
  for (const rawLine of readFileSync(path, "utf8").split("\n")) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const eq = line.indexOf("=");
    if (eq === -1) continue;
    const key = line.slice(0, eq).trim();
    let value = line.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    env[key] = value;
  }
  return env;
}

const fileEnv = { ...loadEnvFile(".env"), ...loadEnvFile(".env.local") };
const domain = process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN || fileEnv.NEXT_PUBLIC_SHOPIFY_DOMAIN;
const token =
  process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN || fileEnv.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN;
const apiVersion =
  process.env.SHOPIFY_STOREFRONT_API_VERSION || fileEnv.SHOPIFY_STOREFRONT_API_VERSION || "2024-10";
const collectionHandle =
  process.env.NEXT_PUBLIC_SHOPIFY_COLLECTION_HANDLE || fileEnv.NEXT_PUBLIC_SHOPIFY_COLLECTION_HANDLE;

if (!domain || !token || token === "your-storefront-api-token") {
  console.error(
    "Missing or placeholder NEXT_PUBLIC_SHOPIFY_DOMAIN / NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN.\n" +
      "Copy .env.example to .env.local and fill in real values first."
  );
  process.exit(1);
}

const endpoint = `https://${domain}/api/${apiVersion}/graphql.json`;
console.log(`Checking ${domain} (Storefront API ${apiVersion})...`);

const query = collectionHandle
  ? `query { shop { name } collectionByHandle(handle: "${collectionHandle}") { title products(first: 5) { edges { node { title handle } } } } }`
  : `query { shop { name } products(first: 5) { edges { node { title handle } } } }`;

try {
  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": token,
    },
    body: JSON.stringify({ query }),
  });

  const json = await res.json();

  if (!res.ok || json.errors) {
    console.error("Connection failed:");
    console.error(json.errors ? json.errors.map((e) => e.message).join("\n") : `HTTP ${res.status}`);
    process.exit(1);
  }

  console.log(`Connected to "${json.data.shop.name}"`);

  if (collectionHandle) {
    const collection = json.data.collectionByHandle;
    if (!collection) {
      console.log(
        `No collection found with handle "${collectionHandle}" — check the handle in Shopify Admin > Collections.`
      );
      process.exit(1);
    }
    logProducts(collection.products.edges, `collection "${collection.title}"`);
  } else {
    logProducts(json.data.products.edges, "the store");
  }
} catch (err) {
  console.error("Request failed:", err.message);
  process.exit(1);
}

function logProducts(edges, sourceLabel) {
  if (edges.length === 0) {
    console.log(
      `No products found in ${sourceLabel}. Check that products are published to your ` +
        `Storefront API / Headless sales channel in Shopify Admin > Sales channels.`
    );
    return;
  }
  console.log(`Found ${edges.length} product(s) in ${sourceLabel}:`);
  edges.forEach((e) => console.log(`  - ${e.node.title} (${e.node.handle})`));
}
