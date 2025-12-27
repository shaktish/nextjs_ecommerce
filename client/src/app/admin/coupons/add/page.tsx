"use client";
import React, { useEffect, useState } from "react";
import { inputClass, labelClass } from "../../products/add/utils/className";
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
import { useCouponStore } from "@/store/useCouponStore";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";

interface formState {
  code: string;
  discountPercentage: number | "";
  usageLimit: number | "";
  startDate: Date | undefined;
  endDate: Date | undefined;
}

const AddCouponAdmin = () => {
  const searchParams = useSearchParams();
  const editedCouponId = searchParams.get("id");
  const isEditMode = !!editedCouponId;
  const isLoading = false;
  const router = useRouter();

  const [openStartDate, setOpenStartDate] = React.useState(false);
  const [openEndDate, setOpenEndDate] = React.useState(false);
  const { createCoupon, updateCoupon, getCoupon, error } = useCouponStore();

  const [formState, setFormState] = useState<formState>({
    code: "",
    discountPercentage: "",
    usageLimit: "",
    startDate: undefined,
    endDate: undefined,
  });

  useEffect(() => {
    const fetchData = async () => {
      if (isEditMode && editedCouponId) {
        const data = await getCoupon(editedCouponId);
        if (data) {
          setFormState({
            code: data.code,
            discountPercentage: data.discountPercentage,
            usageLimit: data.usageLimit,
            startDate: new Date(data.startDate!),
            endDate: new Date(data.endDate!),
          });
        }
      }
    };

    fetchData();
  }, [editedCouponId]);

  const submitButtonLoading = isEditMode
    ? "Updating Coupon..."
    : "Creating Coupon...";
  const submitButton = isEditMode ? "Update Coupon" : "Create Coupon";

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormState({
      ...formState,
      [event.target.name]: event.target.value,
    });
  };

  const handleDateChange = (inpuKey: string, value: Date | undefined) => {
    setFormState({
      ...formState,
      [inpuKey]: value,
    });
    if (inpuKey === "startDate") setOpenStartDate(false);
    if (inpuKey === "endDate") setOpenEndDate(false);
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

    let response = null;

    if (isEditMode) {
      response = await updateCoupon(editedCouponId!, data);
    } else {
      response = await createCoupon(data);
    }

    if (response) {
      toast.success(
        `Coupon ${isEditMode ? "Updated" : "Created"} successfully`
      );
      router.push("/admin/coupons/list");
    }
  };

  useEffect(() => {
    if (error) {
      const details = Array.isArray(error.details) ? error.details : [];

      const message =
        details.length > 0
          ? details.map((item, idx) => <div key={idx}>{item}</div>)
          : error.message || "Something went wrong";

      toast.error(message);
    }
  }, [error]);

  return (
    <div className="p-6">
      <div className="flex flex-col gap-6">
        <header className="flex items-center justify-center mb-2 text-center">
          <h1 className="text-1xl font-semibold">
            {isEditMode ? "Edit" : "Add"} Coupon
          </h1>
        </header>
      </div>
      <form
        action="#"
        method="POST"
        onSubmit={submitHandler}
        className={isLoading ? "pointer-events-none opacity-70" : ""}
      >
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
          <Button className="mt-4.5 w-full" type="submit" disabled={isLoading}>
            {isLoading && <Spinner />}
            {isLoading ? submitButtonLoading : submitButton}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddCouponAdmin;
