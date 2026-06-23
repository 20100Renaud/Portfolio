import { useEffect, useRef } from "react";

export default function useCollapseOnScroll(ref, isOpen, collapse) {
  const ignoreNextScroll = useRef(false);

useEffect(() => {
  console.log("mounted");

  return () => {
    console.log("unmounted");
  };
}, []);

  useEffect(() => {
    if (isOpen) {
      ignoreNextScroll.current = true;
    }
  }, [isOpen]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let lastScrollTop = el.scrollTop;

    const handleScroll = () => {
      if (ignoreScrollRef.current) {
        ignoreScrollRef.current = false;
        return;
      }

      if (filtersOpen) {
        setFiltersOpen(false);
      }
    };

    el.addEventListener("scroll", handleScroll);

    return () => {
      el.removeEventListener("scroll", handleScroll);
    };
  }, [ref, isOpen, collapse]);
}
