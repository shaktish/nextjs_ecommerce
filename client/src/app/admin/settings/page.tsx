"use client";
import { Label } from "@/components/ui/label";
import { Upload } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import SortableImage from "@/components/admin/SortableImage";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import { FeatureBannerFormatted } from "@/types/featureBanner.types";
import { formatBannerData } from "@/modules/admin/settings/utils";
import { getFeaturedBannerClient } from "@/modules/home/api/client/getFeaturedBannerClient";
import addBanner from "@/modules/home/api/addBanner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { DragEndEvent } from "@dnd-kit/core";

const Settings = () => {
  const initialized = useRef(false);
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["feature-banner-admin"],
    queryFn: getFeaturedBannerClient,
    select: (response) => {
      return response.data.map((item) => formatBannerData(item));
    },
    staleTime: 60 * 60 * 1000, // 1 hour
  });
  const mutation = useMutation({
    mutationFn: addBanner,
    onSuccess: (response) => {
      const updatedData = response.data.map(formatBannerData);

      queryClient.setQueryData<FeatureBannerFormatted[]>(
        ["feature-banner-admin"],
        updatedData,
      );

      setImages(updatedData);
      setDeletedBannerIds([]);

      toast.success(response.message);
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
  const [deletedBannerIds, setDeletedBannerIds] = useState<string[]>([]);
  const [images, setImages] = useState<FeatureBannerFormatted[]>([]);

  useEffect(() => {
    if (!initialized.current && data) {
      setImages(data);
      initialized.current = true;
    }
  }, [data]);

  const normalizeFileName = (fileName: string): string => {
    return fileName.trim().replace(/\s+/g, "_").toLowerCase();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;

    const files = Array.from(event.target.files);

    const newItems = files.map((file) => ({
      id: normalizeFileName(file.name),
      file,
      preview: URL.createObjectURL(file),
      isNew: true,
    }));

    setImages((prev) => [...prev, ...newItems]);
  };
  const removeImageHandler = (item: {
    publicId?: string;
    id: string;
    isNew: boolean;
  }) => {
    // only existing images should be added to deleted list
    if (!item.isNew && item.publicId) {
      setDeletedBannerIds((prev) => [...prev, item?.publicId!]);
    }
    setImages((prev) => prev.filter((img) => img.id !== item.id));
  };
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    if (active.id !== over.id) {
      setImages((prev) => {
        const oldIndex = prev.findIndex((i) => i.id === active.id);
        const newIndex = prev.findIndex((i) => i.id === over.id);
        return arrayMove(prev, oldIndex, newIndex);
      });
    }
  };

  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();

    // * Validation
    const missingUrIds = images
      .filter((item) => !item.redirectUrl?.trim())
      .map((item) => item.id);
    if (missingUrIds.length > 0) {
      const updatedImages = images.map((item) => {
        if (missingUrIds.includes(item.id)) {
          return {
            ...item,
            hasError: true,
          };
        } else {
          return item;
        }
      });
      setImages(updatedImages);
      toast.error("All banners must have a redirect URL");
      return;
    }

    const formData = new FormData();
    // * Prepare images with sort order
    const imagesWithSortOrder = images.map((item, i) => {
      return {
        ...item,
        sortOrder: i + 1,
      };
    });

    const existingBannersChanged = imagesWithSortOrder
      .filter(
        (item) =>
          !item.isNew &&
          (item.isOriginalRedirectUrl !== item.redirectUrl ||
            item.sortOrder !== item.isOriginalSortOrder),
      )
      .map((item) => {
        return {
          id: item.id,
          redirectUrl: item.redirectUrl,
          sortOrder: item.sortOrder,
        };
      });

    if (existingBannersChanged.length > 0) {
      formData.append(
        "existingBannersRedirectUrlChange",
        JSON.stringify(existingBannersChanged),
      );
    }

    const bannerData = imagesWithSortOrder
      .map((item) => {
        return {
          id: item.id,
          sortOrder: item.sortOrder,
          redirectUrl: item.redirectUrl,
          isNew: item.isNew,
        };
      })
      .filter((item) => item.isNew);

    formData.append("bannerData", JSON.stringify(bannerData));
    images
      .filter((item) => item.isNew)
      .forEach((item) => formData.append("images", item.file!));

    if (deletedBannerIds.length > 0) {
      formData.append("deletedImageIds", JSON.stringify(deletedBannerIds));
    }
    await mutation.mutateAsync(formData);
  };

  const inputChangeHandler = (
    e: React.ChangeEvent<HTMLInputElement>,
    id: string,
  ) => {
    setImages((prev) =>
      prev.map((img) =>
        img.id === id
          ? { ...img, redirectUrl: e.target.value, hasError: false }
          : img,
      ),
    );
  };

  if (isLoading) {
    return (
      <div className="flex h-full min-h-[400px] items-center justify-center">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  return (
    <div>
      <div className="p-6">
        <div className="flex flex-col gap-6">
          <header className="flex items-center justify-between">
            <h1>Settings</h1>
          </header>
        </div>

        <form
          action="#"
          method="POST"
          onSubmit={submitHandler}
          className={mutation.isPending ? "pointer-events-none opacity-70" : ""}
        >
          <div className="flex flex-col items-center justify-center border border-dashed border-gray-500/40 rounded-lg py-6 cursor-pointer hover:bg-white/5 transition mb-4 mt-2">
            <Label>
              <div className="flex flex-col items-center">
                <Upload className="auto h-12 w-12 text-gray-400" />
                <div className="mt-3 text-sm text-gray-300">
                  <span>Click to upload Feature Images</span>
                  <input
                    key={images.length}
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
            {images.length > 0 && (
              <DndContext
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={images.map((img) => img.id)}
                  strategy={rectSortingStrategy}
                >
                  <div className="mt-4 flex flex-wrap gap-2">
                    {images.map((item) => (
                      <div key={item.id} className="flex flex-col gap-2">
                        <SortableImage
                          key={item.id}
                          id={item.id}
                          preview={item.preview}
                          onRemove={() => removeImageHandler(item)}
                        />
                        <span>
                          <input
                            value={item.redirectUrl || ""}
                            type="text"
                            placeholder="Enter Redirect URL"
                            className={`border rounded px-2 py-1 sm ${item.hasError ? "border-red-500 focus:ring-red-500" : "border-gray-300"}`}
                            onChange={(e) => {
                              inputChangeHandler(e, item.id);
                            }}
                          />
                        </span>
                      </div>
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            )}
          </div>
          <Button type="submit" disabled={mutation.isPending}>
            {mutation.isPending && <Spinner />}
            {mutation.isPending ? "Loading..." : "Submit"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Settings;
