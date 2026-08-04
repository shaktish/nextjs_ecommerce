import { revalidateTag } from "next/cache";

export async function POST(req: Request) {
  const secret = req.headers.get("x-revalidate-secret");

  if (secret !== process.env.REVALIDATE_SECRET) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }

  const data = await req.json();
  const { productSlug } = data;

  if (typeof productSlug !== "string" || !productSlug.trim()) {
    return Response.json(
      { message: "productSlug is required" },
      { status: 400 },
    );
  }
  revalidateTag("products", "max");
  revalidateTag(`product-${productSlug}`, "max");
  return Response.json({
    success: true,
  });
}
