import { Suspense } from "react";
import AddProductForm from "./AddProduct";

function AddProductAdmin() {
  return (
    <Suspense fallback="loading...">
      <AddProductForm />
    </Suspense>
  );
}

export default AddProductAdmin;
