import { Showroom } from "@/components/showroom/Showroom";
import { getProducts } from "@/lib/shopify";

export const metadata = {
  title: "Virtual Showroom — Acidmath",
  description: "Walk the Acidmath showroom in 3D. WASD to move, drag to look, click any garment.",
};

export default async function ShopPage() {
  const products = await getProducts();
  return <Showroom products={products} />;
}
