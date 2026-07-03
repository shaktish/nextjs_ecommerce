"use client";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { addressSchema } from "@/schemas/addressSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox";
import FormInput from "@/components/form/FormInput";
import FormTextArea from "@/components/form/FormTextArea";
import addAddress from "@/modules/account/api/addAddress";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import updateAddress from "../api/updateAddress";

type AddressFormData = z.infer<typeof addressSchema>;

interface AddressFormProps {
  mode: "add" | "edit";
  formData?: AddressFormData;
  id?: string;
}

function AddressForm({ mode, formData, id }: AddressFormProps) {
  const router = useRouter();
  const form = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      country: formData?.country || "",
      state: formData?.state || "",
      city: formData?.city || "",
      postalCode: formData?.postalCode || "",
      address: formData?.address || "",
      isDefault: formData?.isDefault || false,
    },
  });

  const {
    formState: { isSubmitting },
  } = form;

  const cancelHandler = () => {
    router.push("/account/address");
  };

  const onSubmit = async (data: AddressFormData) => {
    try {
      if (mode === "edit" && id) {
        await updateAddress(id, data);
        toast.success("Address updated successfully");
      } else {
        await addAddress(data);
        toast.success("Address added successfully");
      }

      router.push("/account/address");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Something went wrong");
      }
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 max-w-xl"
      >
        <FormInput control={form.control} label="Country" name="country" />
        <FormInput control={form.control} label="State" name="state" />
        <FormInput control={form.control} label="City" name="city" />
        <FormInput
          control={form.control}
          label="Postal Code"
          name="postalCode"
        />
        <FormTextArea control={form.control} label="Address" name="address" />
        <FormField
          control={form.control}
          name="isDefault"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormLabel className="font-normal">
                Set as default address
              </FormLabel>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end space-x-3">
          {mode === "edit" && (
            <Button
              type="button"
              variant={"outline"}
              disabled={isSubmitting}
              onClick={() => cancelHandler()}
            >
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Address"}
          </Button>
        </div>
      </form>
    </Form>
  );
}

export default AddressForm;
