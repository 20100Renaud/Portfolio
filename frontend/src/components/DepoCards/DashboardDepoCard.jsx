import CustomButton from "../CustomButton";
import { getDepoStats } from "../../utils/depoStats";
import {
  getLifetimeMonths,
  changeLifetimeMonths,
  lifetimeMonthsToDate,
  getLifetimeTextFromDate,
  isLifetimeUrgent,
} from "../../utils/date";
import {
  MessageCircleMore,
  Camera,
  CalendarDays,
  ClockFading,
} from "lucide-react";

export default function DashboardDepoCard({
  depo,
  formatDate,
  onEdit,
  onDelete,
}) {
  const { photos, answers, answersLabel, photosLabel } = getDepoStats(depo);

  return (
    <div className="w-full">
      {/*   <ConfirmModal */}
      {/*      open={isDeleteOpen}
        title="Delete deposit"
        message={`Are you sure you want to delete "${deleteTarget?.Title_Depo}"?`}
        confirmLabel="Delete"
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDeleteDepo}
      /> */}

      {/* ON SMALL SCREEN */}
      <div
        className="
          sm:hidden
          flex flex-col
          px-4 pb-6 pt-2 text-xs gap-4
        "
      >
        {/* ROW 1 */}
        <div className="relative flex justify-between mb-1">
          <div className="w-full text-left">
            {/* Title */}
            <span className="font-semibold truncate">{depo.Title_Depo}</span>
            {/* Type and Cat */}
            <div className="flex gap-2 flex-wrap">
              <span className="">
                {depo.Type_Depo} - {depo.Cat_Depo}
              </span>
            </div>
          </div>

          {/* btns */}
          <div className="absolute flex right-0 top-0 gap-4">
            <CustomButton
              variant="small_white"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onEdit?.(depo);
              }}
            >
              Edit
            </CustomButton>

            <CustomButton
              variant="small_red"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onDelete?.(depo);
              }}
            >
              Delete
            </CustomButton>
          </div>
        </div>

        {/* ROW 2: Dates */}
        <div className="text-green-700 leading-tight">
          <div className="flex justify-between gap-2">
            <span className="flex flex-col items-center border border-green-100 rounded-lg py-1 bg-green-50 px-1">
              <CalendarDays
                size={16}
                strokeWidth={1.75}
                className="text-green-900"
              />
              {formatDate(depo.Date_Depo)}
            </span>
            <span className="flex flex-col items-center border border-green-100 rounded-lg py-1 bg-green-50 px-1">
              <ClockFading
                size={16}
                strokeWidth={2}
                className={` ${
                  isLifetimeUrgent(depo.Lifetime_Depo)
                    ? "text-red-500"
                    : "text-green-700"
                }`}
              />
              {getLifetimeTextFromDate(depo.Lifetime_Depo)}
            </span>
            <span className="flex flex-col items-center border border-green-100 rounded-lg py-1 bg-green-50 px-1">
              <MessageCircleMore
                size={16}
                strokeWidth={1.75}
                className="text-green-900"
              />
              {answersLabel}
            </span>
            <span className="flex flex-col items-center border border-green-100 rounded-lg py-1 bg-green-50 px-1">
              <Camera size={16} strokeWidth={1.75} className="text-green-900" />
              {photosLabel}
            </span>
          </div>
        </div>
      </div>

      {/* >SM SCREEN*/}
      <div className="hidden sm:flex px-4 p-1 justify-between text-sm">
        {/* COL 1 */}
        <div className="flex flex-col gap-1 min-w-0 w-64">
          {/* Title */}
          <span className="font-semibold truncate text-left">
            {depo.Title_Depo}
          </span>
          <div className="flex gap-2 flex-wrap">
            <span className="">
              {depo.Type_Depo} - {depo.Cat_Depo}
            </span>
          </div>
        </div>

        <div className="flex flex-1 justify-between items-center">
          {/* COL 2: Dates */}
          <div className="text-green-700 whitespace-nowrap text-left">
            <div className="flex items-center gap-1">
              <CalendarDays
                size={16}
                strokeWidth={1.75}
                className="text-green-900"
              />
              {formatDate(depo.Date_Depo)}
            </div>
            <div
              className={`flex items-center gap-1 ${
                isLifetimeUrgent(depo.Lifetime_Depo)
                  ? "text-red-500"
                  : "text-green-700"
              }`}
            >
              <ClockFading
                size={16}
                strokeWidth={2}
                className="text-green-900"
              />
              {getLifetimeTextFromDate(depo.Lifetime_Depo)}
            </div>
          </div>

          {/* COL 3 */}
          <div className="flex flex-col text-green-700 text-left w-24">
            <span className="flex items-center gap-1">
              <MessageCircleMore
                size={16}
                strokeWidth={1.75}
                className="text-green-900"
              />
              {answersLabel}
            </span>

            <span className="flex items-center gap-1">
              <Camera size={16} strokeWidth={1.75} className="text-green-900" />
              {photosLabel}
            </span>
          </div>

          {/* COL 4: Btns */}
          <div className="flex gap-2">
            <CustomButton
              variant="small_white"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onEdit?.(depo);
              }}
            >
              Edit
            </CustomButton>

            <CustomButton
              variant="small_red"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onDelete?.(depo);
              }}
            >
              Delete
            </CustomButton>
          </div>
        </div>
      </div>

      <div className="border-b border-green-300 mx-4"></div>
    </div>
  );
}
