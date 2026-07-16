export default function DeposList({ deposits = [], children, layout }) {
  const containerClass =
    layout === "Dashboard:table"
      ? "w-full divide-green-200 border border-green-200 bg-white rounded-b-2xl"
      : "flex flex-col gap-3";

  const itemClass =
    layout === "Dashboard:table"
      ? "flex items-center justify-between hover:bg-green-50 bg-white rounded-2xl"
      : "relative bg-white rounded-2xl border border-green-100 shadow px-4 hover:bg-green-50 transition w-full overflow-hidden";

  if (!deposits.length) {
    return (
      <div className="text-center text-green-700 py-10">
      </div>
    );
  }
  return (
    <div className={containerClass}>
      {deposits.map((depo) => (
        <div key={depo.ID_Depo} className={itemClass}>
          {children(depo)}
        </div>
      ))}
    </div>
  );
}
