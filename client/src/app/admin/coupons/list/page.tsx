"use client";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useCouponStore } from "@/store/useCouponStore";
import { Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

const CouponListAdmin = () => {
  const { getAllCoupon, coupons, removeCoupon } = useCouponStore();
  const router = useRouter();
  useEffect(() => {
    const fetchData = async () => {
      await getAllCoupon();
    };
    fetchData();
  }, []);

  const addNewCoupon = () => {
    router.push("/admin/coupons/add");
  };

  const getFormattedDate = (value: Date | undefined) => {
    const locale = navigator?.language || "en-IN";
    if (!value) {
      return null;
    }
    return new Intl.DateTimeFormat(locale, {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(value));
  };

  const editCouponHandler = (id: string) => {
    router.push(`/admin/coupons/add?id=${id}`);
  };

  const deleteCouponHandler = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this coupon?")) {
      const response = await removeCoupon(id);
      if (response) {
        toast.success("Coupon deleted successfully");
        await getAllCoupon();
      }
    }
  };
  return (
    <div>
      <div className="p-6">
        <div className="flex flex-col gap-6">
          <header className="flex items-center justify-between">
            <h1>All Coupons</h1>
            <Button onClick={addNewCoupon}>Add New Coupon</Button>
          </header>
          <div className="rounded-lg border bg-card">
            <div className="overflow-x-auto ">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Code</TableHead>
                    <TableHead>Discount Percentage</TableHead>
                    <TableHead>Start Date</TableHead>
                    <TableHead>End Date</TableHead>
                    <TableHead>Usage Limit</TableHead>
                    <TableHead>Usage Count</TableHead>
                    <TableHead>Created at</TableHead>
                    <TableHead>Yodated at</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {coupons &&
                    coupons.map((coupon) => (
                      <TableRow key={coupon.id}>
                        <TableCell>{coupon.code}</TableCell>
                        <TableCell>{coupon.discountPercentage}</TableCell>
                        <TableCell>
                          {getFormattedDate(coupon.startDate)}
                        </TableCell>
                        <TableCell>
                          {getFormattedDate(coupon.endDate)}
                        </TableCell>
                        <TableCell>{coupon.usageLimit}</TableCell>
                        <TableCell>{coupon.usageCount}</TableCell>
                        <TableCell>
                          {getFormattedDate(coupon.createdAt)}
                        </TableCell>
                        <TableCell>
                          {getFormattedDate(coupon.updatedAt)}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant={"ghost"}
                              size={"icon"}
                              onClick={() => {
                                editCouponHandler(coupon.id);
                              }}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant={"ghost"}
                              size={"icon"}
                              onClick={() => deleteCouponHandler(coupon.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CouponListAdmin;
