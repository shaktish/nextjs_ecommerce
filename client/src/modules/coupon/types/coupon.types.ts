export type Coupon = {
  id: string;
  code: string;
  discountPercentage: number;
  startDate: Date | undefined;
  endDate: Date | undefined;
  usageLimit: number;
  usageCount: number;
  createdAt: Date;
  updatedAt: Date;
};

export type CouponImmutableFields =
  | "id"
  | "createdAt"
  | "updatedAt"
  | "usageCount";
