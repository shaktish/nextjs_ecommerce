import { Suspense } from "react";
import PaymentContent from "../../modules/payment/PaymentContent";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PaymentContent />
    </Suspense>
  );
}
