import CustomButton from "../CustomButton";
import { getDepoStats } from "../../utils/depoStats";

export default function DashboardDepoCard({
  depo,
  formatDate,
  onEdit,
  onDelete,
}) {
  const { photos, answers, answersLabel, photosLabel } = getDepoStats(depo);

  return (
    <div className="w-full">
      {/* On small screen */}
      <div
        className="
          sm:hidden
          flex flex-col
          px-4 p-1
        "
      >
        {/* ROW 1 */}
        <div className="relative flex justify-between mb-1">
          <div className="w-full text-left">
            {/* Title */}
            <span className="font-semibold truncate">{depo.Title_Depo}</span>
            {/* Type and Cat */}
            <div className="flex gap-2 flex-wrap">
              <span className="text-xs">
                {depo.Type_Depo} - {depo.Cat_Depo}
              </span>
            </div>
          </div>

          <div className="absolute right-0 top-0">
            {/* Delete btn */}
            <CustomButton variant="small_red" onClick={() => onDelete?.(depo)}>
              Delete
            </CustomButton>
          </div>
        </div>

        {/* ROW 2: Dates */}
        <div className="text-xs text-green-900 leading-tight">
          <div className="flex justify-between gap-2">
            <span>📅 {formatDate(depo.Date_Depo)}</span>
            <span>⏳ {formatDate(depo.Lifetime_Depo)}</span>
            <span>💬 {answersLabel}</span>
            <span>📷 {photosLabel}</span>
          </div>
        </div>
      </div>

      {/* >sm screen*/}
      <div className="hidden sm:flex px-4 p-1 justify-between">
        {/* COL 1 */}
        <div className="flex flex-col gap-1 w-64">
          {/* Title */}
          <span className="font-semibold truncate text-left">
            {depo.Title_Depo}
          </span>
          <div className="flex gap-2 flex-wrap">
            <span className="text-xs">
              {depo.Type_Depo} - {depo.Cat_Depo}
            </span>
          </div>
        </div>

        <div className="flex flex-1 gap-12 justify-between items-center">
          {/* COL 2: Dates */}
          <div className="text-xs text-green-900 leading-tight">
            <div>📅 {formatDate(depo.Date_Depo)}</div>
            <div>⏳ {formatDate(depo.Lifetime_Depo)}</div>
          </div>
          {/* COL 3 */}
          <div className="flex flex-col text-sm text-green-700 whitespace-nowrap">
            <span className="text-xs">💬 {answersLabel}</span>
            <span className="text-xs">📷 {photosLabel}</span>
          </div>
          {/* COL 4: Btns */}
          <div className="flex ">
            <div className="flex gap-2">
              <CustomButton
                variant="small_white"
                onClick={() => onEdit?.(depo)}
              >
                Edit
              </CustomButton>
              <CustomButton
                variant="small_red"
                onClick={() => onDelete?.(depo)}
              >
                Delete
              </CustomButton>
            </div>
          </div>
        </div>
      </div>

      <div className="border-b border-green-300 mx-4"></div>
    </div>
  );
}
