import { HOME_BANNER } from "@/constant/invalidateCacheConstant";
import { revalidateTag } from "next/cache";

export async function POST(req: Request) {
  console.log("revalidate banner fn called");
  const secret = req.headers.get("x-revalidate-secret");

  if (secret !== process.env.REVALIDATE_SECRET) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }
  revalidateTag(HOME_BANNER, "max");
  return Response.json({
    success: true,
  });
}
