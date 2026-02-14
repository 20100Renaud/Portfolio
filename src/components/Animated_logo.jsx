import React from "react";
import text from "../assets/ShareUp_512x512.webp";
import arrows from "../assets/Arrows_512x512.webp";

const LogoWithArrows = ({ size = 120 }) => {
  return (
    <div 
        className="relative mx-auto"
        style={{width: `${size}px`, height: `${size}px` }}
    >
      <img
        src={text}
        alt="ShareUp"
        className="
            absolute inset-0 w-full h-full
            animate-text_animation_xs
            sm:animate-text_animation_sm
        "
      />

      <img
        src={arrows}
        alt="Arrows"
        className="
            absolute inset-0 w-full h-full
            animate-arrows_animation_xs
            sm:animate-arrows_animation_sm
        "
      />
    </div>
  );
};

export default LogoWithArrows;
