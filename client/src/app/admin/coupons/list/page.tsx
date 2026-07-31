"use client";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import getAllCoupon from "@/modules/coupon/api/getAllCoupon";
import deleteCoupon from "@/modules/coupon/api/removeCoupon";
import { getFormattedDate } from "@/utils/date";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const CouponListAdmin = () => {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteCoupon(id),
    onSuccess: (response) => {
      toast.success(response.message ?? "Coupon Created Successfully");
      queryClient.invalidateQueries({
        queryKey: ["coupon-list"],
      });
    },
    onError: (error) => {
      toast.error(
        error.message ??
          "Unable to delete the coupon, please try after some time",
      );
    },
  });
  const router = useRouter();
  const { data: coupons, isLoading } = useQuery({
    queryKey: ["coupon-list"],
    queryFn: getAllCoupon,
  });

  const addNewCoupon = () => {
    router.push("/admin/coupons/add");
  };

  const editCouponHandler = (id: string) => {
    router.push(`/admin/coupons/add?id=${id}`);
  };

  const deleteCouponHandler = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this coupon?")) {
      await deleteMutation.mutateAsync(id);
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
          {isLoading && <Spinner className="mx-auto h-8 w-8" scale={2} />}
          {!isLoading && (
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
                      <TableHead>Updated at</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {coupons &&
                      coupons?.map((coupon) => (
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
          )}
        </div>
      </div>
    </div>
  );
};

export default CouponListAdmin;
