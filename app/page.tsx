export const dynamic = "force-dynamic";
import { Hero } from "@/components/hero/Hero";
import { HomeSections } from "@/components/home/HomeSections";
import { getProducts } from "@/lib/shopify";

export default async function HomePage() {
  const products = await getProducts();
  return (
    <>
      <Hero />
      <HomeSections products={products} />
    </>
  );
}
