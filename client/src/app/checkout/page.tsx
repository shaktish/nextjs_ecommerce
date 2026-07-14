import getAddress from "@/modules/account/api/getAddress";
import CheckoutContent from "@/modules/checkout/CheckoutContent";

async function Checkout() {
  const address = await getAddress();

  return <CheckoutContent data={address.data} />;
}

export default Checkout;
