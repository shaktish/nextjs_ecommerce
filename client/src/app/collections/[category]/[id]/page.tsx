import { getProduct, getProductLookup } from "./api/productDetailApi";
import Details from "./components/ProductDetails";
import { Metadata } from "next";
import { buildProductMetaData } from "./lib/seo";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const product = await getProduct(id);
  return buildProductMetaData(product);
}

async function ProductDetails({ params }: PageProps) {
  const { id } = await params;
  const [productLookup, product] = await Promise.all([
    getProductLookup(),
    getProduct(id),
  ]);

  return (
    <div className="min-h-screen bg-background">
      <Details product={product} productLookup={productLookup} />
    </div>
  );
}

export default ProductDetails;
