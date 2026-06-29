export default function DashboardDepoCard({ depo, formatDate }) {
  const answerCount = depo.Answers_Depos?.length ?? 0;

  return (
    <div
      className="
        grid gap-3
        grid-cols-1
        sm:grid-cols-[220px_auto_auto_auto]
        sm:items-center
        w-full
      "
    >
      {/* Title */}
      <div>
        <span className="font-semibold truncate">{depo.Title_Depo}</span>
      </div>

      {/* Type/Cat */}
      <div className="flex gap-2 sm:flex-col">
        <span className="text-xs bg-green-100 px-2 py-1 rounded-xl">
          {depo.Type_Depo}
        </span>

        <span className="text-xs bg-green-100 px-2 py-1 rounded-xl">
          {depo.Cat_Depo}
        </span>
      </div>

      {/* Dates */}
      <div className="text-xs text-green-900">
        <div>{formatDate(depo.Date_Depo)}</div>
        <div>{formatDate(depo.Lifetime_Depo)}</div>
      </div>
      <div className="text-sm text-green-700">💬 {answerCount}</div>

      {/* Buttons */}
      <div className="flex gap-2 justify-end">
        <button className="text-xs text-blue-600 border border-blue-300 px-4 py-2 rounded-2xl">
          Edit
        </button>

        <button className="text-xs text-red-600 border border-red-300 px-4 py-2 rounded-2xl">
          Delete
        </button>
      </div>
    </div>
  );
}
