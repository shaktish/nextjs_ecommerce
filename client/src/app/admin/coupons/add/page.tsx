import { Suspense } from "react";
import CouponForm from "./components/CouponForm";

const AddCouponAdmin = () => {
  return (
    <div className="p-6">
      <Suspense fallback={<div>Loading...</div>}>
        <CouponForm />
      </Suspense>
    </div>
  );
};

export default AddCouponAdmin;
