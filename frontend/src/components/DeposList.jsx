export default function DeposList({ deposits = [], children, layout }) {
  const containerClass =
    layout === "Dashboard_table"
      ? "w-full divide-y divide-green-200 border rounded-2xl bg-white"
      : "flex flex-col gap-3";

  const itemClass =
    layout === "Dashboard_table"
      ? "flex items-center justify-between px-3 py-2 hover:bg-green-50 bg-white mx-2"
      : "bg-white rounded-2xl border border-green-100 shadow px-4 hover:bg-green-50 transition w-full";

  if (!deposits.length) {
    return (
      <div className="text-center text-green-700 py-10">
        You don’t own any deposits yet.
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
