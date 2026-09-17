import { getDepoStats } from "../../utils/depoStats";
import { useState } from "react";
import ImageGalleryModal from "../ImageGalleryModal";
import { ZoomIn, MessageCircleMore, Camera, Flag } from "lucide-react";

export default function PublicDepoCard({
  depo,
  formatDate,
  isDetail = false,
  enableGallery = false,
}) {
  const [galleryOpen, setGalleryOpen] = useState(false);
  const { answersLabel, photosLabel } = getDepoStats(depo);
  const firstImage = depo.Images_Depos?.[0]?.URL_Image;

  const typeStyle =
    {
      OFFER: "bg-green-600/90",
      REQUEST: "bg-blue-600/90",
      QUESTION: "bg-amber-500/90",
    }[depo.Type_Depo] ?? "bg-gray-600/90";

  return (
    <div className="flex flex-col gap-2 sm:grid sm:grid-cols-[1fr_auto] sm:gap-x-4 py-4 pl-4 overflow-hidden">
      {/* BANNER */}
      <div
        className={`
          absolute -left-10 top-4 py-2 w-36 rotate-[-45deg] text-white text-xs font-bold py1 shadow flex justify-center items-center leading-none shadow-lg
          ${typeStyle}
        `}
      >
        {depo.Type_Depo}
      </div>

      {/* LEFT */}
      <div className="flex flex-col text-left sm:justify-between">
        {/* Distance */}
        {depo.isOwner ? (
          <div className=" relative flex flex-col text-xs text-green-700 font-medium text-center">
            <div className="absolute translate-x-4 -translate-y-2 text-2xl">
              🌱
            </div>
            <div>Your deposit</div>
          </div>
        ) : (
          depo.distanceKm != null && (
            <span className="flex items-center justify-center gap-1 text-xs text-green-600">
              <Flag size={14} className="text-red-500" />
              {Math.round(depo.distanceKm)} km
            </span>
          )
        )}

        {/* Name - City - Date */}
        <span className="text-xs text-green-700 text-green-900 italic text-center">
          {depo.User_Depos?.Login_User} · {depo.User_Depos?.City_User} ·{" "}
          {formatDate(depo.Date_Depo)}
        </span>

        {/* Title */}
        <span className="font-semibold text-xl text-center">
          {depo.Title_Depo}
        </span>

        <hr className="border-t border-green-300/50" />

        {/* Description */}
        <div className="pt-2 my-auto h-full">
          <span
            className={
              isDetail
                ? "text-sm whitespace-pre-wrap"
                : "line-clamp-3 text-sm whitespace-pre-wrap"
            }
          >
            {depo.Text_Depo}
          </span>
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex w-full gap-4">
        {/* Photos */}
        <div
          className={`
            relative w-32 h-32 rounded-2xl overflow-hidden bg-green-100 flex items-center justify-center
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

        {/* Badges */}
        <div className="flex flex-col h-full gap-1 ml-auto w-28">
          {/* Category */}
          <span className="text-xs bg-green-100 px-2 py-1 rounded-xl">
            {depo.Cat_Depo}
          </span>

          {/* Answer count */}
          <span className="flex flex-col items-center border border-green-100 rounded-lg py-1 bg-green-50 px-1 text-sm">
            <MessageCircleMore
              size={16}
              strokeWidth={1.75}
              className="text-green-900"
            />
            {answersLabel}
          </span>

          <span className="flex flex-col items-center border border-green-100 rounded-lg py-1 bg-green-50 px-1 text-sm">
            <Camera size={16} strokeWidth={1.75} className="text-green-900" />
            {photosLabel}
          </span>
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
