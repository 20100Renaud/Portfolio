import { useState, useEffect, useRef } from "react";
import { Trash2 } from "lucide-react"
import Modal from "./Modal";
import CustomButton from "./CustomButton";

export default function ImageManagerModal({ open, onClose, depo, onSaved }) {
  const [titles, setTitles] = useState({});
  const [images, setImages] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const fileInputRef = useRef(null);

  // Initialize image modal
  useEffect(() => {
    if (!open) return;

    setImages(depo.Images_Depos ?? []);
    setTitles({});
    setSelectedFiles([]);
  }, [open, depo.Images_Depos]);

  // Save every changes in the image modal
  const saveImageModal = async () => {
    try {
      for (const image of images) {
        await fetch(`http://localhost:5000/api/images/${image.ID_Image}`, {
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

      if (onSaved) {
        await onSaved();
      }

      onClose();
    } catch (err) {
      console.error("Save titles failed:", err);
    }
  };

  // Delete image
  const deleteImage = async (imageId) => {
    try {

      const response = await fetch(
        `http://localhost:5000/api/images/${imageId}`,
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

  // Upload image
  const uploadImages = async () => {
    try {
      if (!selectedFiles.length) {
        return;
      }

      const formData = new FormData();

      selectedFiles.forEach((file) => {
        formData.append("images", file);
      });

      const response = await fetch(
        `http://localhost:5000/api/images/${depo.ID_Depo}`,
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

      console.log("[UPLOAD RESPONSE]", data);
      console.log("[LOCAL IMAGES]", images);

      setImages((prev) => {
        const updated = [...prev, ...data.images];

        console.log("[LOCAL IMAGES]", updated);

        return updated;
      });

      console.log(images);

      setSelectedFiles([]);

    } catch (err) {
      console.error("Upload failed:", err);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <h2 className="text-xl font-bold mb-6">Gallery</h2>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {images.length ? (
          images.map((image) => (
            <div
              key={image.ID_Image}
              className="relative border border-green-300 bg-white/50 rounded-xl p-2"
            >
              <CustomButton
                variant="icon"
                onClick={() => deleteImage(image.ID_Image)}
                className="absolute top-2 right-2 h-8 w-8 rounded-full p-0 flex items-center justify-center z-10"
              >
                <Trash2 size={12} />
              </CustomButton>

              <img
                src={`http://localhost:5000${image.URL_Image}`}
                alt={image.Text_Image ?? ""}
                className="w-full aspect-square object-cover rounded-lg"
              />

              <input
                value={image.Text_Image ?? ""}
                onChange={(e) => {
                  const value = e.target.value;

                  setImages((prev) =>
                    prev.map((img) =>
                      img.ID_Image === image.ID_Image
                        ? { ...img, Text_Image: value }
                        : img,
                    ),
                  );
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
            </div>
          ))
        ) : (
          <div className="border border-green-300 rounded-xl p-4">
            <p>No images yet.</p>
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={(e) =>
          setSelectedFiles((prev) => [...prev, ...Array.from(e.target.files)])
        }
      />

      <div className="flex w-full justify-center gap-8 my-4">
        
        <CustomButton
          variant="big_white"
          onClick={() => fileInputRef.current.click()}
        >
          + Add images
        </CustomButton>

        <CustomButton variant="big_green" onClick={saveImageModal}>
          Close
        </CustomButton>

      </div>

      {/* Show selected files */}
      {selectedFiles.length > 0 && (
        <div className="mt-3">
          <p className="underline">Selected:</p>

          <div className="text-left">
            {selectedFiles.map((file) => {
              const maxLength = 30;
              const name = file.name;
              let displayName;
              if (name.length > maxLength) {
                const firstPart = name.slice(0, 15);
                const lastPart = name.slice(-15);
                displayName = `- ${firstPart} [...] ${lastPart}`;
              } else {
                displayName = `- ${name}`;
              }
              return <div key={file.name}>{displayName}</div>;
            })}
          </div>

          <CustomButton
            variant="big_green"
            onClick={uploadImages}
            className="mt-2"
          >
            Confim Upload
          </CustomButton>
        </div>
      )}
    </Modal>
  );
}
