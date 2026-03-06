// hooks/useInView.js
import { useState, useEffect } from "react";

export function useScrollScale(ref, stayRange = 0.2, maxScale = 1.75) {
  const [scale, setScale] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current) return;

      const rect = ref.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      const elementCenter = rect.top + rect.height / 2;
      const distanceFromCenter = Math.abs(windowHeight / 2 - elementCenter);
      const maxDistance = windowHeight / 2;
      const stayDistance = maxDistance * stayRange;

      let newScale = 0;

      if (distanceFromCenter <= stayDistance) {
        // inside safe zone -> max scale
        newScale = maxScale;
      } else {
        // outside safe zone -> scale down linearly toward 0
        const normalizedDistance = (distanceFromCenter - stayDistance) / (maxDistance - stayDistance);
        newScale = Math.max(0, maxScale * (1 - normalizedDistance));
      }

      setScale(newScale);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // initial call
    return () => window.removeEventListener("scroll", handleScroll);
  }, [ref, stayRange, maxScale]);

  return scale;
}