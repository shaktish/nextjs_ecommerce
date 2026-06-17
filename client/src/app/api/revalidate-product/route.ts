import { revalidateTag } from "next/cache";

export async function POST(req: Request) {
  console.log("revalidate fn called");
  const secret = req.headers.get("x-revalidate-secret");

  if (secret !== process.env.REVALIDATE_SECRET) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }

  const data = await req.json();
  const { productSlug } = data;
  revalidateTag("products", "max");
  revalidateTag(`product-${productSlug}`, "max");
  console.log("validated");
  return Response.json({
    success: true,
  });
}
