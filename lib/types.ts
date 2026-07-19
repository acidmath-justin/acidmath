export type ProductVariant = {
  id: string;
  title: string; // e.g. "Medium / Black"
  price: number;
  currencyCode: string;
  available: boolean;
  size?: string;
  color?: string;
};

export type Product = {
  id: string;
  handle: string;
  title: string;
  description: string;
  batchCode: string; // flavor text, styled like a blotter batch stamp, e.g. "AM-014"
  category: "hoodie" | "tee" | "long-sleeve" | "jacket" | "accessory";
  images: string[];
  textureUrl: string; // the blotter-grid graphic applied to the garment mesh
  price: number;
  compareAtPrice?: number;
  currencyCode: string;
  variants: ProductVariant[];
  // Where this garment lives in the 3D showroom
  showroomSlot?: {
    fixture: "rack" | "mannequin" | "shelf";
    fixtureId: string;
    position: [number, number, number];
  };
};

export type CartLine = {
  variantId: string;
  productId: string;
  title: string;
  variantTitle: string;
  price: number;
  quantity: number;
  image: string;
};

export type BodyProfile = {
  heightCm: number;
  weightKg: number;
  bodyType: "slim" | "athletic" | "curvy" | "plus";
  skinTone: string; // hex color, chosen from a fixed swatch — see BodyForm.tsx
};
