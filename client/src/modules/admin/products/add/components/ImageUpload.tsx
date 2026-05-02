import Image from "next/image";
import { Label } from "@/components/ui/label";
import { Trash2, Upload } from "lucide-react";
import { FieldErrors } from "react-hook-form";
import { ProductFormType } from "@/schemas/productSchema";
interface ImageUploadProps {
  handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  errors: FieldErrors<ProductFormType>;
  imagePreviews: string[];
  removeImage: (index: number) => void;
  existingImagePreviews: string[];
  removeExistingImage: (index: number) => void;
}
function ImageUpload({
  handleFileChange,
  errors,
  imagePreviews,
  removeImage,
  existingImagePreviews,
  removeExistingImage,
}: ImageUploadProps) {
  return (
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
          {errors.images && (
            <p className="text-red-500 text-sm">{errors.images.message}</p>
          )}
        </div>
      </Label>
      {imagePreviews.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {imagePreviews.map((src, index) => (
            <div className="relative inline-block" key={index + "preview"}>
              <Image
                src={src}
                key={src}
                alt={`preview-${index}`}
                width={80}
                height={80}
                className="w-20 h-20 object-cover rounded-md"
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute -top-2 -right-2 bg-white text-rose-700 text-xs 
                     rounded-full h-5 w-5 flex items-center justify-center shadow-md cursor-pointer"
              >
                <Trash2 size={12} />
              </button>
            </div>
          ))}
        </div>
      )}
      <div className="mb-4">
        {existingImagePreviews.length > 0 && (
          <>
            <span className="font-medium">Existing Images</span>
            <div className="mt-4 flex flex-wrap gap-2">
              {existingImagePreviews.map((src, index) => (
                <div className="relative inline-block" key={index + "preview"}>
                  <Image
                    src={src}
                    key={src}
                    alt={`preview-${index}`}
                    width={80}
                    height={80}
                    className="w-20 h-20 object-cover rounded-md"
                  />
                  <button
                    type="button"
                    onClick={() => removeExistingImage(index)}
                    className="absolute -top-2 -right-2 bg-white text-rose-700 text-xs 
               rounded-full h-5 w-5 flex items-center justify-center shadow-md cursor-pointer"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default ImageUpload;
