"use client";
import { Label } from "@/components/ui/label";
import { Upload } from "lucide-react";
import React, { useEffect, useState } from "react";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import SortableImage from "@/components/admin/SortableImage";
import { Button } from "@/components/ui/button";
import { useFeatureBannerStore } from "@/store/useFeatureBannerStore";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";

const Settings = () => {
  const {
    createFeatureBanner,
    getAllFeatureBanners,
    updateFeatureBanner,
    isLoading,
  } = useFeatureBannerStore();
  const [editMode, setEditMode] = useState<boolean>(false);
  const [deletedBannerIds, setDeletedBannerIds] = useState<string[]>([]);
  const [images, setImages] = useState<
    {
      id: string;
      file?: File;
      preview: string;
      isNew: boolean;
      publicId?: string;
    }[]
  >([]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;

    const files = Array.from(event.target.files);

    const newItems = files.map((file) => ({
      id: file.name,
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
  const handleDragEnd = (event: any) => {
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

  useEffect(() => {
    const loadBanners = async () => {
      const data = await getAllFeatureBanners();
      if (data && data.length > 0) {
        setEditMode(true);
        setImages(
          data.map((item) => ({
            id: item.id,
            url: item.url,
            publicId: item.publicId,
            preview: item.url,
            isNew: false,
          }))
        );
      }
    };

    loadBanners();
  }, []);
  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();

    let response;
    if (editMode) {
      images
        .filter((item) => item.isNew)
        .forEach((item) => formData.append("images", item.file!));
      const bannerSortOrder = images.map((item, i) => {
        return {
          id: item.id,
          sortOrder: i + 1,
        };
      });
      formData.append("bannerOrder", JSON.stringify(bannerSortOrder));
      if (deletedBannerIds.length > 0) {
        formData.append("deletedImageIds", JSON.stringify(deletedBannerIds));
      }
      response = await updateFeatureBanner(formData);
    } else {
      images.forEach((item) => formData.append("images", item.file!));
      response = await createFeatureBanner(formData);
    }

    if (response?.data && response?.data.length > 0) {
      toast.success(response?.message);
      setImages(
        response.data.map((item) => ({
          id: item.id,
          preview: item.url,
          publicId: item.publicId,
          isNew: false,
        }))
      );
    }
  };

  const submitButtonLoading = editMode ? "Updating..." : "Submitting...";

  const submitButton = "Submit";

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
          className={isLoading ? "pointer-events-none opacity-70" : ""}
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
                      <SortableImage
                        key={item.id}
                        id={item.id}
                        preview={item.preview}
                        onRemove={() => removeImageHandler(item)}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            )}
          </div>
          <Button type="submit">
            {isLoading && <Spinner />}
            {isLoading ? submitButtonLoading : submitButton}{" "}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Settings;
