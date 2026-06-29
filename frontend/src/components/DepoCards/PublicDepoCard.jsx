export default function PublicDepoCard({ depo, formatDate, isDetail = false }) {
  return (
    <div className="flex flex-col gap-2 sm:grid sm:grid-cols-[1fr_auto] sm:gap-x-4 p-4">
      {/* Left */}
      <div className="flex flex-col text-left sm:justify-between">
        <span className="font-semibold text-xl truncate">
          {depo.Title_Depo}
        </span>

        <div className="pt-2 my-auto h-full">
          <span
            className={
              isDetail
                ? "text-sm whitespace-pre-wrap"
                : "line-clamp-3 text-sm italic"
            }
          >
            {depo.Text_Depo}
          </span>
        </div>

        <span className="text-xs text-green-900">
          {depo.User_Depos?.Login_User} · {depo.User_Depos?.City_User} ·{" "}
          {formatDate(depo.Date_Depo)}
        </span>
      </div>

      {/* Right */}
      <div className="flex gap-4">
        <div className="w-32 h-32 rounded-2xl bg-green-100 flex items-center justify-center">
          Photo
        </div>

        <div className="flex flex-col justify-center gap-2">
          <span className="text-xs bg-green-100 px-2 py-1 rounded-xl">
            {depo.Type_Depo}
          </span>

          <span className="text-xs bg-green-100 px-2 py-1 rounded-xl">
            {depo.Cat_Depo}
          </span>

          <span className="text-xs">
            💬 {depo.Answers_Depos?.length ?? 0} answers
          </span>
        </div>
      </div>
    </div>
  );
}
