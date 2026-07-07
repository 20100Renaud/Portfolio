import { getDepoStats } from "../../utils/depoStats";

export default function PublicDepoCard({ depo, formatDate, isDetail = false }) {
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
        <div className="w-32 h-32 rounded-2xl bg-green-100 flex items-center justify-center overflow-hidden">
          {firstImage ? (
            <img
              src={`http://localhost:5000${firstImage}`}
              alt={depo.Title_Depo}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-4xl">🌱</span>
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
    </div>
  );
}
