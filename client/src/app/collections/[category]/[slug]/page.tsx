import { Metadata } from "next";
import { buildProductMetaData } from "./lib/seo";
import { getProductLookup } from "@/modules/collections/api/getProductLookup";
import Details from "@/modules/collections/components/ProductDetails";
import getProductBySlug from "@/modules/collections/api/getProductBySlug";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  return buildProductMetaData(product);
}

async function ProductDetails({ params }: PageProps) {
  const { slug } = await params;
  const [productLookup, product] = await Promise.all([
    getProductLookup(),
    getProductBySlug(slug),
  ]);

  return (
    <div className="min-h-screen bg-background">
      <Details product={product} productLookup={productLookup} />
    </div>
  );
}

export default ProductDetails;
