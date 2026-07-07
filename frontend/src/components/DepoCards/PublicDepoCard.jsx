import { getDepoStats } from "../../utils/depoStats";
import { useState } from "react";
import ImageGalleryModal from "../ImageGalleryModal";
import { ZoomIn } from "lucide-react"


export default function PublicDepoCard({
  depo,
  formatDate,
  isDetail = false,
  enableGallery = false,
}) {
  const [galleryOpen, setGalleryOpen] = useState(false);
  const { photos, answers, answersLabel, photosLabel } = getDepoStats(depo);
  const firstImage = depo.Images_Depos?.[0]?.URL_Image;

  return (
    <div className="flex flex-col gap-2 sm:grid sm:grid-cols-[1fr_auto] sm:gap-x-4 p-4">
      {/* LEFT */}
      <div className="flex flex-col text-left sm:justify-between">
        {/* Name - City - Date */}
        <span className="text-xs text-green-700 text-green-900 italic">
          {depo.User_Depos?.Login_User} · {depo.User_Depos?.City_User} ·{" "}
          {formatDate(depo.Date_Depo)}
        </span>

        {/* Title */}
        <span className="font-semibold text-xl">{depo.Title_Depo}</span>

        {/* Description */}
        <div className="pt-2 my-auto h-full">
          <span
            className={
              isDetail
                ? "text-sm whitespace-pre-wrap"
                : "line-clamp-4 text-sm whitespace-pre-wrap"
            }
          >
            {depo.Text_Depo}
          </span>
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex gap-4">
        {/* Photos */}
        <div
          className={`
    relative
    w-32 h-32
    rounded-2xl
    overflow-hidden
    bg-green-100
    flex items-center justify-center
    ${enableGallery ? "cursor-pointer group" : ""}
  `}
          onClick={() => enableGallery && firstImage && setGalleryOpen(true)}
        >
          {firstImage ? (
            <img
              src={`http://localhost:5000${firstImage}`}
              alt={depo.Title_Depo}
              className={`
        w-full
        h-full
        object-cover
        ${enableGallery ? "transition-transform duration-300 group-hover:scale-105" : ""}
      `}
            />
          ) : (
            <span className="text-4xl">🌱</span>
          )}

          {enableGallery && (
            <div
              className="
        absolute inset-0
        bg-black/30
        opacity-0
        group-hover:opacity-100
        transition
        flex items-center justify-center
      "
            >
              <ZoomIn size={36} className="text-white/80" />
            </div>
          )}
        </div>

        {/* Type */}
        <div className="flex flex-col justify-center gap-2">
          <span className="text-xs bg-green-100 px-2 py-1 rounded-xl min-w-24">
            {depo.Type_Depo}
          </span>

          {/* Category */}
          <span className="text-xs bg-green-100 px-2 py-1 rounded-xl">
            {depo.Cat_Depo}
          </span>

          {/* Answer count */}
          <span className="text-xs">💬 {answersLabel} </span>
          <span className="text-xs">📷 {photosLabel} </span>
        </div>
      </div>
      <ImageGalleryModal
        open={galleryOpen}
        onClose={() => setGalleryOpen(false)}
        images={depo.Images_Depos}
        initialIndex={0}
      />
    </div>
  );
}
