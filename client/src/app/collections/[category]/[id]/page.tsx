import { Metadata } from "next";
import { buildProductMetaData } from "./lib/seo";
import { getProductLookup } from "@/modules/collections/api/getProductLookup";
import Details from "@/modules/collections/components/ProductDetails";
import getProductById from "@/modules/collections/api/getProductById";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const product = await getProductById(id);
  return buildProductMetaData(product);
}

async function ProductDetails({ params }: PageProps) {
  const { id } = await params;
  const [productLookup, product] = await Promise.all([
    getProductLookup(),
    getProductById(id),
  ]);

  return (
    <div className="min-h-screen bg-background">
      <Details product={product} productLookup={productLookup} />
    </div>
  );
}

export default ProductDetails;
