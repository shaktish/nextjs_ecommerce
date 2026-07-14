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
}

function AddressCard({
  data,
  selectedAddress,
  setSelectedAddress,
}: AddressProps) {
  const router = useRouter();

  return (
    <div className="rounded-xl border bg-card p-4 shadow-sm">
      <div className="flex justify-between mb-5 ">
        <h2 className="text-xl font-semibold">Shipping Address</h2>
        <Button
          onClick={() => router.push("/account/address/new")}
          variant={"outline"}
        >
          Add a new address
        </Button>
      </div>
      <RadioGroup
        value={selectedAddress ?? ""}
        onValueChange={setSelectedAddress}
        className="space-y-1"
      >
        {data.map((item) => {
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

                <p className="text-sm text-muted-foreground">{item.country}</p>
              </label>
            </div>
          );
        })}
      </RadioGroup>
    </div>
  );
}

export default AddressCard;
