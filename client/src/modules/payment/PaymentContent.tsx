"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import loadRazorpay from "@/lib/razorpay";
import { createPayment } from "@/modules/payment/api/createPayment";
import { getOrderById } from "@/modules/payment/api/getOrderById";
import { verifyPayment } from "@/modules/payment/api/verifyPayment";
import { useCartStore } from "@/store/useCartStore";
import { RazorpaySuccessResponse } from "@/types/razorpayTypes";
import { ArrowLeft, CreditCard, ShieldCheck } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

function PaymentContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [pageLoading, setPageLoading] = useState(true);

  const [loading, setLoading] = useState(false);
  const orderId = searchParams.get("orderId");
  const [total, setTotal] = useState<number | null>(null);

  const handlePayment = async () => {
    setLoading(true);
    try {
      const res = await createPayment(orderId!);
      const options = {
        key: res.key,
        amount: res.amount,
        currency: res.currency,
        order_id: res.razorpayOrderId,
        handler: async function (response: RazorpaySuccessResponse) {
          try {
            setLoading(true);
            await verifyPayment({
              razorpay_signature: response.razorpay_signature,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpayOrderId: response.razorpay_order_id,
            });
            setLoading(false);

            toast.success("Order placed successfully!");
            useCartStore.getState().clearCart();
            router.replace("/account/orders");
          } catch (e) {
            setLoading(false);
            if (e instanceof Error) {
              toast.error(e.message);
            } else {
              toast.error("Something went wrong");
            }
          }
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (!orderId) {
      toast.error("Order not found");
      return;
    }

    const init = async () => {
      const loaded = await loadRazorpay();
      if (!loaded) {
        toast.error("Failed to load Razorpay");
        return;
      }
    };
    const getOrderIdData = async () => {
      try {
        setPageLoading(true);
        const res = await getOrderById(orderId);
        setTotal(res.total);
      } catch (e) {
        toast.error("Failed to get order details");
      } finally {
        setPageLoading(false);
      }
    };

    init();
    getOrderIdData();
  }, [orderId]);
  return (
    <div className="container mx-auto max-w-3xl py-10">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">Complete Your Payment</CardTitle>

          <p className="text-muted-foreground mt-2">
            Your order is almost ready. Complete the payment securely using
            Razorpay.
          </p>
        </CardHeader>

        <CardContent className="space-y-8">
          {/* Amount */}
          <div className="rounded-lg border p-6">
            <p className="text-muted-foreground text-sm">Amount to Pay</p>

            <h2 className="mt-2 text-4xl font-bold">
              {pageLoading ? "Loading..." : `₹${total}`}
            </h2>
          </div>

          {/* Payment Partner */}
          <div className="rounded-lg border p-6">
            <div className="flex items-center gap-3">
              <CreditCard className="h-6 w-6" />

              <div>
                <h3 className="font-semibold">Razorpay Secure Checkout</h3>

                <p className="text-muted-foreground text-sm mt-1">
                  Pay using UPI, Debit Card, Credit Card, Net Banking or Wallet.
                </p>
              </div>
            </div>
          </div>

          {/* Security */}
          <div className="flex gap-3 rounded-lg bg-green-50 p-4">
            <ShieldCheck className="h-6 w-6 text-green-600" />

            <div>
              <p className="font-medium">100% Secure Payment</p>

              <p className="text-muted-foreground text-sm">
                You will be redirected to Razorpay to complete your payment
                securely.
              </p>
            </div>
          </div>

          {/* Pay Button */}
          <Button
            className="h-12 w-full text-lg"
            disabled={loading || total === null}
            onClick={handlePayment}
          >
            {loading ? "Preparing Payment..." : `Pay ₹${total}`}
          </Button>

          {/* Back */}
          <Button
            variant="ghost"
            className="w-full"
            onClick={() => router.push("/checkout")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Checkout
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default PaymentContent;
