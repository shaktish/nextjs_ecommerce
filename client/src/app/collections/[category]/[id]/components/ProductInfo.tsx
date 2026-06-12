import { formatPrice } from "@/utils/number";

interface ProductInfo {
  name: string;
  description: string;
}
function ProductInfo({ name, description }: ProductInfo) {
  return (
    <>
      <h1 className="text-3xl font-bold mb-4">{name}</h1>
      <p className="text-lg text-gray-700 mb-6">{description}</p>
    </>
  );
}

export default ProductInfo;
