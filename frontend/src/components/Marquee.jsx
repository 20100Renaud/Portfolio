export default function Marquee({ items, className = "" }) {
  return (
    <section className={`relative overflow-hidden py-3 sm:py-4 ${className}`}>
      <div className="flex w-max animate-marquee will-change-transform gap-4">
        {[...items, ...items].map((item, index) => {
          const Icon = item.icon;

          return (
            <div
              key={`${item.name}-${index}`}
              aria-hidden={index >= items.length}
              className="flex flex-col items-center justify-center text-center shrink-0 w-20 sm:w-28"
            >
              <div className="text-green-600/80 text-2xl sm:text-4xl">
                <Icon />
              </div>

              <span className="text-xs sm:text-sm font-medium">
                {item.name}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
