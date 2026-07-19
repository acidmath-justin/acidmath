import { NextRequest, NextResponse } from "next/server";
import { createCheckout } from "@/lib/shopify";

export async function POST(req: NextRequest) {
  try {
    const { lines } = (await req.json()) as {
      lines: { variantId: string; quantity: number }[];
    };

    if (!lines?.length) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    const checkoutUrl = await createCheckout(lines);
    return NextResponse.json({ checkoutUrl });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Could not start checkout" }, { status: 500 });
  }
}
