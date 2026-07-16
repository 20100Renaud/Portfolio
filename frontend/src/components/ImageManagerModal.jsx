import { useState, useEffect, useRef } from "react";
import { Trash2, Plus } from "lucide-react";
import { apiFetch } from "../api";
import Modal from "./Modal";
import CustomButton from "./CustomButton";


export default function ImageManagerModal({
  open,
  onClose,
  mode = "edit",
  depo,
  images,
  setImages,
  onSaved,
}) {
  const [imageLimitMessage, setImageLimitMessage] = useState("");
  const fileInputRef = useRef(null);
  const isCreateMode = mode === "create";
  const displayedImages = images;

  // Initialize image modal
  useEffect(() => {
    if (!open) return;

    if (!isCreateMode) {
      setImages(depo.Images_Depos ?? []);
    }
  }, [open]);

  // Manage upload images max message
  useEffect(() => {
    if (!imageLimitMessage) return;

    const timer = setTimeout(() => {
      setImageLimitMessage("");
    }, 3500);

    return () => clearTimeout(timer);
  }, [imageLimitMessage]);

  // Save changes in the image modal
  const handleSaveGallery = async () => {
    if (isCreateMode) {
      onClose();
      return;
    }
    try {
      for (const image of images) {
        await apiFetch(`/images/${image.ID_Image}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            title: image.Text_Image,
          }),
        });
      }

      await onSaved?.();
      onClose();
    } catch (err) {
      console.error("Save titles failed:", err);
    }
  };

  // Delete image
  const deleteImage = async (imageId) => {
    try {
      const response = await apiFetch(
        `/images/${imageId}`,
        {
          method: "DELETE",
          credentials: "include",
        },
      );

      if (!response.ok) {
        throw new Error("Delete failed");
      }

      setImages((prev) => prev.filter((image) => image.ID_Image !== imageId));
    } catch (err) {
      console.error(err);
    }
  };

  // Delete logic
  const handleDelete = async (image, index) => {
    if (isCreateMode) {
      setImages((prev) => prev.filter((_, i) => i !== index));
      return;
    }

    await deleteImage(image.ID_Image);
  };

  // Images config
  const MAX_IMAGES = 4;
  const imageSlots = Array.from(
    { length: MAX_IMAGES },
    (_, index) => displayedImages[index] ?? null,
  );

  // Upload images
  const handleImageSelection = async (e) => {
    const files = Array.from(e.target.files);

    if (!files.length) return;

    const remainingSlots = MAX_IMAGES - images.length;
    if (files.length > remainingSlots) {
      setImageLimitMessage("Maximum number of images is 4.");
    } else {
      setImageLimitMessage("");
    }

    const filesToUpload = files.slice(0, remainingSlots);
    if (!filesToUpload.length) {
      return;
    }

    try {
      const formData = new FormData();

      filesToUpload.forEach((file) => {
        formData.append("images", file);
      });

      const response = await apiFetch(
        `/images/${depo.ID_Depo}`,
        {
          method: "POST",
          credentials: "include",
          body: formData,
        },
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Upload failed");
      }

      const data = await response.json();

      setImages((prev) => [...prev, ...data.images]);

      if (files.length > remainingSlots) {
        setImageLimitMessage("Maximum number of images is 4.");
      }

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (err) {
      console.error("Upload failed:", err);
    }
  };

  // Manage local selection images
  const handleLocalSelection = (e) => {
    const files = Array.from(e.target.files);

    const remainingSlots = MAX_IMAGES - images.length;

    const selected = files.slice(0, remainingSlots);

    const newImages = selected.map((file) => ({
      file,
      url: URL.createObjectURL(file),
      title: "",
    }));

    setImages((prev) => [...prev, ...newImages]);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    if (files.length > remainingSlots) {
      setImageLimitMessage("Maximum number of images is 4.");
    } else {
      setImageLimitMessage("");
    }
  };

  return (
    <Modal open={open} onClose={onClose} className="sm:max-w-sm">
      <h2 className="text-xl font-bold mb-6">Gallery</h2>

      <div className="h-[420px] sm:h-[450px] overflow-y-auto">
        <div className="grid grid-cols-2 gap-4">
          {imageSlots.map((image, index) => (
            <div
              key={
                image
                  ? isCreateMode
                    ? image.url
                    : image.ID_Image
                  : `empty-${index}`
              }
              className="
                relative
                rounded-xl
                border
                border-green-300
                bg-white/50
                p-2
              "
            >
              {image ? (
                <>
                  <CustomButton
                    variant="icon"
                    onClick={() => handleDelete(image, index)}
                    className="
                      absolute top-2 right-2
                      h-6 w-6
                      p-0
                      flex items-center justify-center
                      z-10
                      bg-white/70
                      hover:bg-white
                    "
                  >
                    <Trash2 size={12} />
                  </CustomButton>

                  <img
                    src={
                      isCreateMode
                        ? image.url
                        : `http://localhost:5000${image.URL_Image}`
                    }
                    alt={isCreateMode ? image.title : (image.Text_Image ?? "")}
                    className="
                        w-full
                        aspect-square
                        object-cover
                        rounded-lg
                      "
                  />

                  <input
                    value={
                      isCreateMode
                        ? (image.title ?? "")
                        : (image.Text_Image ?? "")
                    }
                    onChange={(e) => {
                      const value = e.target.value;

                      if (isCreateMode) {
                        setImages((prev) =>
                          prev.map((img, i) =>
                            i === index ? { ...img, title: value } : img,
                          ),
                        );
                      } else {
                        setImages((prev) =>
                          prev.map((img) =>
                            img.ID_Image === image.ID_Image
                              ? { ...img, Text_Image: value }
                              : img,
                          ),
                        );
                      }
                    }}
                    placeholder="Title"
                    className="
                      mt-2
                      w-full
                      rounded-xl
                      border
                      border-green-300
                      bg-white
                      px-3
                      py-2
                      text-sm
                      focus:outline-none
                      focus:border-green-700
                      focus:ring-1
                      focus:ring-green-700
              "
                  />
                </>
              ) : (
                <button
                  onClick={() => fileInputRef.current.click()}
                  className="
                    w-full
                    aspect-square
                    rounded-lg
                    border-2
                    border-dashed
                    border-green-300
                    bg-green-50
                    flex
                    items-center
                    justify-center
                    text-4xl
                    text-green-600
                    hover:bg-green-100
                    hover:border-green-700
                    transition
                    mb-12
                  "
                >
                  <Plus size={30} strokeWidth={1.5} />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Hidden image selection */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={isCreateMode ? handleLocalSelection : handleImageSelection}
      />

      {/* Limite max message */}
      <div className="relative">
        {imageLimitMessage && (
          <p className="absolute w-full text-center text-sm text-red-600 -translate-y-4">
            {imageLimitMessage}
          </p>
        )}
      </div>

      <div className="flex w-full justify-center my-4">
        <CustomButton variant="big_green" onClick={handleSaveGallery}>
          Save
        </CustomButton>
      </div>
    </Modal>
  );
}
