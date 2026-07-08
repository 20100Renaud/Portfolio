
import text from "../assets/ShareUp_512x512.png";
import arrows from "../assets/Arrows_512x512.png";

const AnimatedFlatLogoInfinite = ({ size = 120 }) => {
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
        className={`absolute inset-0 w-full h-full animate-arrows_flat_animation_infinite`}
      />
    </div>
  );
};

export default AnimatedFlatLogoInfinite;
