"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Address } from "@/types/address.types";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

interface AddressProps {
  data: Address[];
  selectedAddress: string | null;
  setSelectedAddress: Dispatch<SetStateAction<string | null>>;
  addressError: string | null;
}

function AddressCard({
  data,
  selectedAddress,
  setSelectedAddress,
  addressError,
}: AddressProps) {
  const router = useRouter();

  return (
    <div className="rounded-xl border bg-card p-4 shadow-sm max-h-[60vh]  flex flex-col">
      <div className="flex justify-between mb-5 ">
        <h2 className="text-xl font-semibold">Shipping Address</h2>
        <Button
          onClick={() => router.push("/account/address/new")}
          variant={"outline"}
        >
          Add a new address
        </Button>
      </div>
      {data?.length === 0 && (
        <div className="flex flex-1 flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
          <h3 className="text-lg font-semibold">No addresses found</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            You haven't added a shipping address yet.
          </p>
        </div>
      )}
      {addressError ? (
        <div className="flex-1 rounded-md border border-destructive/30 bg-destructive/5 p-4">
          <p className="font-medium">Unable to load your addresses.</p>
          <p className="text-sm text-muted-foreground mt-1">
            Please refresh the page or try again later.
          </p>
        </div>
      ) : (
        <RadioGroup
          value={selectedAddress ?? ""}
          onValueChange={setSelectedAddress}
          className="flex-1 overflow-y-auto p-4 space-y-2 min-h-0"
        >
          {data?.map((item) => {
            const isSelected = selectedAddress === item.id;

            return (
              <div
                key={item.id}
                className={`flex gap-4 rounded-lg border p-2 transition-colors ${
                  isSelected
                    ? "border-primary bg-primary/3"
                    : "hover:border-primary/40"
                }`}
              >
                <RadioGroupItem value={item.id} id={item.id} className="mt-1" />

                <label htmlFor={item.id} className="flex-1 cursor-pointer">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold ">{item.address}</p>

                    {item.isDefault && (
                      <Badge
                        variant="secondary"
                        className="bg-green-100 text-green-700 hover:bg-green-100"
                      >
                        Default
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm font-semibold text-muted-foreground">
                    {item.phone}
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {item.city}, {item.state}
                  </p>

                  <p className="text-sm text-muted-foreground">
                    {item.postalCode}
                  </p>

                  <p className="text-sm text-muted-foreground">
                    {item.country}
                  </p>
                </label>
              </div>
            );
          })}
        </RadioGroup>
      )}
    </div>
  );
}

export default AddressCard;
