export default function DeposList({ deposits = [], children, layout }) {
  const containerClass =
    layout === "Dashboard_table"
      ? "w-full divide-green-200 border bg-white"
      : "flex flex-col gap-3";

  const itemClass =
    layout === "Dashboard_table"
      ? "flex items-center justify-between hover:bg-green-50 bg-white rounded-2xl"
      : "bg-white rounded-2xl border border-green-100 shadow px-4 hover:bg-green-50 transition w-full";

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
