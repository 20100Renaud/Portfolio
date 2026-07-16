import { useState, useEffect } from "react";
import Modal from "./Modal";
import CustomButton from "./CustomButton";

export default function ImageGalleryModal({
  open,
  onClose,
  images = [],
  initialIndex = 0,
}) {
  const [current, setCurrent] = useState(initialIndex);

  // Initialize the gallery
  useEffect(() => {
    if (open) {
      setCurrent(initialIndex);
    }
  }, [open, initialIndex]);

  if (!images.length) {
    return null;
  }

  // Manage navigation
  const image = images[current];

  const previous = () => {
    setCurrent((i) => (i === 0 ? images.length - 1 : i - 1));
  };

  const next = () => {
    setCurrent((i) => (i === images.length - 1 ? 0 : i + 1));
  };

  return (
    <Modal open={open} onClose={onClose}>
      <div className="">
        <div className="relative flex flex-col items-center justify-center h-[45vh] mb-6">
          {/* Images */}
          <img
            src={`http://localhost:5000${image.URL_Image}`}
            alt={image.Text_Image ?? ""}
            className="max-w-full max-h-full object-contain rounded-xl"
          />
        </div>

        {/* Title */}
        <div className="relative">
          <div className="absolute flex justify-center w-full -translate-y-4">{image.Text_Image || ""}</div>
          {/* btns previous/next */}
          <div>
            {images.length > 1 && (
              <>
                <button
                  onClick={previous}
                  className="
                      absolute
                      left-3
                      top-1/2
                      bg-black/40
                      text-white
                      rounded-full
                      w-10
                      h-10
                      hover:bg-black/70
                      transition
                    "
                >
                  ‹
                </button>
                <button
                  onClick={next}
                  className="
                      absolute
                      right-3
                      top-1/2

                      bg-black/40
                      text-white
                      rounded-full
                      w-10
                      h-10
                      hover:bg-black/70
                      transition
                    "
                >
                  ›
                </button>
              </>
            )}
          </div>
        </div>

        <div className="flex justify-center items-end gap-3">
          {/* Thumbnails */}
          <div className="grid grid-cols-2 sm:flex justify-center gap-3 py-2">
            {images.map((img, index) => (
              <button
                key={img.ID_Image}
                onClick={() => setCurrent(index)}
                className={`rounded-lg overflow-hidden border-4 p-1
                  ${
                    index === current
                      ? "border-green-700"
                      : "border-transparent"
                  }
                  `}
              >
                <img
                  src={`http://localhost:5000${img.URL_Image}`}
                  alt=""
                  className="w-16 h-16 object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-center">
          <CustomButton variant="big_white" onClick={onClose}>
            Close
          </CustomButton>
        </div>
      </div>
    </Modal>
  );
}
