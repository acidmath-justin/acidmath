export const dynamic = "force-dynamic";
import { VirtualMirror } from "@/components/mirror/VirtualMirror";
import { getProducts } from "@/lib/shopify";

export const metadata = {
  title: "Virtual Mirror — Acidmath",
  description: "Preview Acidmath garments on a 3D avatar scaled to your body, or try them on over photo or webcam.",
};

export default async function MirrorPage() {
  const products = await getProducts();
  return <VirtualMirror products={products} />;
}
