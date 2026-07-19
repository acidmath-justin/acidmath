import { CollectionsGrid } from "@/components/collections/CollectionsGrid";
import { getProducts } from "@/lib/shopify";

export const metadata = {
  title: "Collections — Acidmath",
  description: "Shop the current Acidmath drop — hoodies, tees, long sleeves, jackets and accessories.",
};

export default async function CollectionsPage() {
  const products = await getProducts();
  return <CollectionsGrid products={products} />;
}
