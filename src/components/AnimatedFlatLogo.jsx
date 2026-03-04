
import text from "../assets/ShareUp_512x512.webp";
import arrows from "../assets/Arrows_512x512.webp";

const AnimatedFlatLogo = ({ size = 120 }) => {
  return (
    <div
      className="relative mx-auto"
      style={{ width: `${size}px`, height: `${size}px` }}
    >
      <img
        src={text}
        alt="ShareUp"
        className="absolute inset-0 w-full h-full"
      />

      <img
        src={arrows}
        alt="Arrows"
        className="absolute inset-0 w-full h-full group-hover:animate-arrows_flat_animation group-focus:animate-arrows_flat_animation"
      />
    </div>
  );
};

export default AnimatedFlatLogo;
