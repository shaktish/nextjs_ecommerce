"use client";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import Image from "next/image";

import { Label } from "@/components/ui/label";
import {
  inputClass,
  labelClass,
  selectInputClass,
  selectLabelClass,
} from "./utils/className";
import { useProductStore } from "@/store/useProductStore";
import { useRouter } from "next/navigation";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";

const categories = [
  "Fashion",
  "Electronics",
  "Hand Bag",
  "Shoes",
  "Wallet",
  "Sunglass",
  "Cap",
];

const sizesOptionList = ["XS", "S", "M", "L", "XL", "XXL", "3XL"];
const colorsOptionList = [
  {
    name: "Navy",
    class: "bg-[#001f3f]",
  },
  {
    name: "Yellow",
    class: "bg-[#FCD34D]",
  },
  {
    name: "White",
    class: "bg-white border",
  },
  {
    name: "Orange",
    class: "bg-[#FB923C]",
  },
  {
    name: "Green",
    class: "bg-[#22C55E]",
  },
  {
    name: "Pink",
    class: "bg-[#EC4899]",
  },
  {
    name: "Cyan",
    class: "bg-[#06B6D4]",
  },
  {
    name: "Blue",
    class: "bg-[#3B82F6]",
  },
];

const brands = ["Nike", "Adidas", "Puma", "Reebok", "Under Armour"];
const genders = ["Unisex", "Male", "Female"];

interface formState {
  name: string;
  brandName: string;
  description: string;
  category: string;
  gender: string;
  price: number;
  stock: number;
  featured: boolean;
}

const AddProductAdmin = () => {
  const [formState, setFormState] = useState<formState>({
    name: "",
    brandName: "",
    description: "",
    category: "",
    gender: "",
    price: 0,
    stock: 0,
    featured: false,
  });
  const router = useRouter();
  const [colors, setColors] = useState<string[]>([]);
  const [sizes, setSizes] = useState<string[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const { addProduct, isLoading, error } = useProductStore();

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormState({
      ...formState,
      [event.target.name]: event.target.value,
    });
  };

  const onValueChangeHandler = (value: string, name: string) => {
    setFormState({
      ...formState,
      [name]: value,
    });
  };

  const onToggleChange = (value: string, name: string) => {
    if (name === "sizes") {
      setSizes((prevState) => {
        return prevState.includes(value)
          ? prevState.filter((size) => size !== value)
          : [...prevState, value];
      });
    } else if (name === "colors") {
      setColors((prevState) => {
        return prevState.includes(value)
          ? prevState.filter((color) => color !== value)
          : [...prevState, value];
      });
    }
  };

  const onCheckboxHandler = (checked: boolean, name: string) => {
    setFormState({
      ...formState,
      [name]: checked,
    });
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFiles(Array.from(event.target.files));
    }
  };

  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();

    // text fields
    formData.append("name", formState.name);
    formData.append("brand", formState.brandName);
    formData.append("description", formState.description);
    formData.append("category", formState.category);
    formData.append("gender", formState.gender);
    formData.append("price", String(formState.price));
    formData.append("stock", String(formState.stock));
    formData.append("isFeatured", String(formState.featured));

    // arrays
    formData.append("sizes", sizes.join(","));
    formData.append("colors", colors.join(","));

    selectedFiles.forEach((file) => {
      formData.append("images", file);
    });
    const response = await addProduct(formData);
    if (response) {
      router.push("/admin/products/list");
    }
  };

  useEffect(() => {
    const urls = selectedFiles.map((file) => URL.createObjectURL(file));
    setPreviews(urls);

    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [selectedFiles]);

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
          <h1 className="text-1xl font-semibold">Add Product</h1>
        </header>
      </div>
      <form
        action="#"
        method="POST"
        onSubmit={submitHandler}
        className={isLoading ? "pointer-events-none opacity-70" : ""}
      >
        <div className="flex flex-col items-center justify-center border border-dashed border-gray-500/40 rounded-lg py-6 cursor-pointer hover:bg-white/5 transition mb-4">
          <Label>
            <div className="flex flex-col items-center">
              <Upload className="auto h-12 w-12 text-gray-400" />
              <div className="mt-3 text-sm text-gray-300">
                <span>Click to browse</span>
                <input
                  type="file"
                  className="sr-only"
                  multiple
                  onChange={handleFileChange}
                  name="images"
                  accept="image/png, image/jpeg, image/jpg"
                />
              </div>
            </div>
          </Label>
          {previews.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {previews.map((src, index) => (
                <Image
                  src={src}
                  key={src}
                  alt={`preview-${index}`}
                  width={80}
                  height={80}
                  className="w-20 h-20 object-cover rounded-md"
                />
              ))}
            </div>
          )}
        </div>
        <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
          <div>
            <Label htmlFor="name" className={labelClass}>
              Product Name
            </Label>
            <div className="mt-2.5">
              <Input
                id="name"
                name="name"
                type="text"
                className={inputClass}
                placeholder="Name"
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div>
            <Label htmlFor="brandName" className={selectLabelClass}>
              Brand Name
            </Label>

            <Select
              name="brandName"
              onValueChange={(value) =>
                onValueChangeHandler(value, "brandName")
              }
            >
              <SelectTrigger id="brandName" className={selectInputClass}>
                <SelectValue placeholder="Select Brand" />
              </SelectTrigger>

              <SelectContent>
                {brands.map((brand) => (
                  <SelectItem key={brand} value={brand}>
                    {brand}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label
              htmlFor="Description"
              className="block text-sm/6 font-semibold "
            >
              Description
            </Label>
            <div className="mt-2.5">
              <Textarea
                id="description"
                name="description"
                rows={4}
                className={inputClass}
                placeholder="Description"
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div>
            <Label htmlFor="cateogry" className={selectLabelClass}>
              Category
            </Label>
            <Select
              name="category"
              onValueChange={(value) => onValueChangeHandler(value, "category")}
            >
              <SelectTrigger id="category" className={selectInputClass}>
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>

              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="gender" className={selectLabelClass}>
              Gender
            </Label>
            <Select
              name="gender"
              onValueChange={(value) => onValueChangeHandler(value, "gender")}
            >
              <SelectTrigger id="gender" className={selectInputClass}>
                <SelectValue placeholder="Select Gender" />
              </SelectTrigger>

              <SelectContent>
                {genders.map((gender) => (
                  <SelectItem key={gender} value={gender}>
                    {gender}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className={selectLabelClass}>Sizes</Label>
            <div className="mt-1.5 flex flex-wrap gap-2">
              {sizesOptionList.map((sizeItem) => (
                <Button
                  type="button"
                  key={sizeItem}
                  size={"sm"}
                  onClick={() => onToggleChange(sizeItem, "sizes")}
                  className={`border border-2 ${
                    sizes.includes(sizeItem) ? "border-[#FB923C] border-2" : ""
                  }`}
                >
                  {sizeItem}
                </Button>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="colors" className={selectLabelClass}>
              Colors
            </Label>
            <div className="mt-1.5 flex flex-wrap gap-2">
              {colorsOptionList.map((color) => (
                <Button
                  type="button"
                  key={color.name}
                  className={`${
                    color.class
                  } h-8 w-8 rounded-full border border-2 ${
                    colors.includes(color.name)
                      ? "border border-2 border-black"
                      : ""
                  }`}
                  size={"sm"}
                  onClick={() => onToggleChange(color.name, "colors")}
                />
              ))}
            </div>
          </div>
          <div>
            <Label htmlFor="price" className={labelClass}>
              Price
            </Label>
            <div className="mt-2.5">
              <Input
                id="price"
                name="price"
                type="number"
                className={inputClass}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div>
            <Label htmlFor="name" className={labelClass}>
              Product Stock
            </Label>
            <div className="mt-2.5">
              <Input
                id="stock"
                name="stock"
                type="text"
                className={inputClass}
                placeholder="Enter Product Stock"
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div>
            <Label htmlFor="featured" className={`${labelClass} mb-1`}>
              Feature Image
            </Label>
            <div className="mt-2.5 flex">
              <Checkbox
                id="featured"
                name="featured"
                onCheckedChange={(e) => onCheckboxHandler(e, "featured")}
              />
            </div>
          </div>
        </div>
        <div>
          <Button className="mt-4.5 w-full" type="submit" disabled={isLoading}>
            {isLoading && <Spinner />}
            {isLoading ? "Creating..." : "Create Product"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddProductAdmin;
