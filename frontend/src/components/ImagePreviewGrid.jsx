import { Trash2 } from "lucide-react";
import CustomButton from "./CustomButton";

export default function ImagePreviewGrid({
  images,
  onDelete,
  getKey,
  getSrc,
  showDelete = true,
  showAddButton = false,
  addButtonAction,
}) {


  return (
    <div className="flex flex-wrap gap-2">
      <div className="flex items-center gap-3">
        {showAddButton && (
          <button
            onClick={addButtonAction}
            className="
              h-20 w-20 shrink-0
              rounded-xl border border-green-300
              bg-white p-1 transition
              hover:border-green-700
            "
          >
            <div
              className="
                flex h-full w-full items-center justify-center
                rounded-lg border-2 border-dashed border-green-300
                bg-green-50 text-green-700
                transition hover:border-green-700 hover:bg-green-100
              "
            >
              Gallery
            </div>
          </button>
        )}

        {images.length === 0 && (
          <p className="text-sm text-green-700 italic">No images yet</p>
        )}
      </div>

      {images.map((image, index) => (
        <div
          key={getKey(image, index)}
          className="
            relative
            w-20 h-20
            shrink-0
            overflow-hidden
            rounded-xl
            border border-green-300
          "
        >
          <img
            src={getSrc(image)}
            alt=""
            className="h-full w-full object-cover"
          />
        </div>
      ))}
    </div>
  );
}
