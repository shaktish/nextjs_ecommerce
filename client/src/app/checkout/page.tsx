import getAddress from "@/modules/account/api/getAddress";
import CheckoutContent from "@/modules/checkout/CheckoutContent";

async function Checkout() {
  let addresses = null;
  let error = null;

  try {
    addresses = await getAddress();
  } catch (e) {
    error = e instanceof Error ? e.message : "Unable to fetch address";
  }

  return <CheckoutContent addressList={addresses?.data} addressError={error} />;
}

export default Checkout;
