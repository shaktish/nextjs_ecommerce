"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ChevronDownIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Spinner } from "@/components/ui/spinner";
import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  inputClass,
  labelClass,
} from "@/modules/admin/products/add/utils/className";
import { toast } from "sonner";
import addCoupon from "@/modules/coupon/api/addCoupon";
import updateCoupon from "@/modules/coupon/api/updateCoupon";
import getCoupon from "@/modules/coupon/api/getCoupon";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Coupon,
  CouponImmutableFields,
} from "@/modules/coupon/types/coupon.types";

interface FormState {
  code: string;
  discountPercentage: number | "";
  usageLimit: number | "";
  startDate: Date | undefined;
  endDate: Date | undefined;
}

type ApiError = {
  message: string;
  details?: string[];
  success: boolean;
};

function CouponForm() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const searchParams = useSearchParams();
  const editedCouponId = searchParams.get("id");
  const isEditMode = !!editedCouponId;

  const [openStartDate, setOpenStartDate] = useState(false);
  const [openEndDate, setOpenEndDate] = useState(false);

  const { data: coupon, isLoading } = useQuery({
    queryKey: ["coupon", editedCouponId],
    queryFn: () => getCoupon(editedCouponId!),
    enabled: !!editedCouponId,
  });

  const couponMutation = useMutation({
    mutationFn: (data: Omit<Coupon, CouponImmutableFields>) =>
      isEditMode ? updateCoupon(editedCouponId, data) : addCoupon(data),

    onSuccess: () => {
      toast.success(
        `Coupon ${isEditMode ? "Updated" : "Created"} successfully`,
      );

      queryClient.invalidateQueries({
        queryKey: ["coupon-list"],
      });

      router.push("/admin/coupons/list");
    },

    onError: (error: ApiError) => {
      const details = Array.isArray(error.details) ? error.details : [];

      const message =
        details.length > 0
          ? details.map((item) => <div key={item}>{item}</div>)
          : error.message || "Something went wrong";

      toast.error(message);
    },
  });

  const [formState, setFormState] = useState<FormState>({
    code: "",
    discountPercentage: "",
    usageLimit: "",
    startDate: undefined,
    endDate: undefined,
  });

  useEffect(() => {
    const fetchData = async () => {
      if (isEditMode && editedCouponId) {
        if (coupon) {
          setFormState({
            code: coupon.code,
            discountPercentage: coupon.discountPercentage,
            usageLimit: coupon.usageLimit,
            startDate: new Date(coupon.startDate!),
            endDate: new Date(coupon.endDate!),
          });
        }
      }
    };

    fetchData();
  }, [coupon]);

  const submitButtonLoading = isEditMode
    ? "Updating Coupon..."
    : "Creating Coupon...";
  const submitButton = isEditMode ? "Update Coupon" : "Create Coupon";

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormState({
      ...formState,
      [event.target.name]: event.target.value,
    });
  };

  const handleDateChange = (inputKey: string, value: Date | undefined) => {
    setFormState({
      ...formState,
      [inputKey]: value,
    });
    if (inputKey === "startDate") setOpenStartDate(false);
    if (inputKey === "endDate") setOpenEndDate(false);
  };

  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = {
      code: formState.code,
      discountPercentage: Number(formState.discountPercentage),
      usageLimit: Number(formState.usageLimit),
      startDate: formState.startDate,
      endDate: formState.endDate,
    };

    await couponMutation.mutateAsync(data);
  };
  return (
    <form
      action="#"
      method="POST"
      onSubmit={submitHandler}
      className={isLoading ? "pointer-events-none opacity-70" : ""}
    >
      <div className="flex flex-col gap-6">
        <header className="mb-4">
          <h1 className="text-1xl font-semibold">
            {isEditMode ? "Edit" : "Add"} Coupon
          </h1>
        </header>
      </div>
      {isLoading && <Spinner className="mx-auto h-8 w-8" scale={2} />}
      {!isLoading && (
        <>
          <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
            <div>
              <Label htmlFor="code" className={labelClass}>
                Code
              </Label>
              <div className="mt-2.5">
                <Input
                  id="code"
                  name="code"
                  type="text"
                  className={inputClass}
                  placeholder="Coupon Code"
                  onChange={handleInputChange}
                  value={formState.code}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="discountPercentage" className={labelClass}>
                Discount Percentage
              </Label>
              <div className="mt-2.5">
                <Input
                  id="discountPercentage"
                  name="discountPercentage"
                  type="text"
                  className={inputClass}
                  placeholder="0.00"
                  onChange={handleInputChange}
                  value={formState.discountPercentage}
                />
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <Label htmlFor="date" className="px-1">
                Start Date
              </Label>
              <Popover open={openStartDate} onOpenChange={setOpenStartDate}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    id="date"
                    className="w-48 justify-between font-normal"
                  >
                    {formState.startDate
                      ? formState.startDate.toLocaleDateString()
                      : "Select Start date"}
                    <ChevronDownIcon />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-auto overflow-hidden p-0"
                  align="start"
                >
                  <Calendar
                    mode="single"
                    selected={formState.startDate}
                    captionLayout="dropdown"
                    onSelect={(date) => handleDateChange("startDate", date)}
                    disabled={{ before: new Date() }}
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="flex flex-col gap-3">
              <Label htmlFor="date" className="px-1">
                End Date
              </Label>
              <Popover open={openEndDate} onOpenChange={setOpenEndDate}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    id="date"
                    className="w-48 justify-between font-normal"
                  >
                    {formState.endDate
                      ? formState.endDate.toLocaleDateString()
                      : "Select End date"}
                    <ChevronDownIcon />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-auto overflow-hidden p-0"
                  align="start"
                >
                  <Calendar
                    mode="single"
                    selected={formState.endDate}
                    captionLayout="dropdown"
                    onSelect={(date) => handleDateChange("endDate", date)}
                    disabled={{ before: new Date() }}
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div>
              <Label htmlFor="usageLimit" className={labelClass}>
                Usage Limit
              </Label>
              <div className="mt-2.5">
                <Input
                  id="usageLimit"
                  name="usageLimit"
                  type="text"
                  className={inputClass}
                  placeholder="Usage Limit"
                  onChange={handleInputChange}
                  value={formState.usageLimit}
                />
              </div>
            </div>
          </div>
          <div>
            <Button
              className="mt-4.5 w-full"
              type="submit"
              disabled={isLoading}
            >
              {isLoading && <Spinner />}
              {isLoading ? submitButtonLoading : submitButton}
            </Button>
          </div>
        </>
      )}
    </form>
  );
}

export default CouponForm;
