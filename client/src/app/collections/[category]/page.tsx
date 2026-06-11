import { Suspense } from "react";
import CategoryListing from "./CategoryListing";

const ListingPage = () => {
  return (
    <div className="p-6">
      <Suspense fallback={<div>Loading...</div>}>
        <CategoryListing />
      </Suspense>
    </div>
  );
};

export default ListingPage;
