import { Link } from "react-router-dom";
import dessin from "../assets/dessin_jardin.png";

export default function NotFound() {
  return (
    <div className="
      items-center text-center
      relative flex flex-col min-h-screen
      bg-gradient-to-tl from-[#f8fbf7] via-[#e6f2ec] to-[#a5d6a7] w-full
      overflow-hidden
    "
    >
      <img
        src={dessin}
        alt="Dessin de jardin"
        className="
          absolute top-1/2 left-1/2
          h-[600px] sm:h-[900px]
          w-full max-w-[1900px]
          -translate-x-1/2 -translate-y-1/2
          object-left object-cover
          opacity-70
          pointer-events-none
          z-0
      "
      />
      <div className="mt-[15vh] px-6">
        <div className="
          backdrop-blur-md
          bg-white/60
          border border-white/40
          shadow-xl
          rounded-2xl
          p-10
          max-w-xl
          mx-auto
        ">
          <h1 className="text-5xl font-bold mb-4 text-green-900">
            It seems you got lost
          </h1>
          <h1 className="text-5xl my-6">🌿</h1>
          <p className="text-lg text-green-800 mb-6">
            This page wandered off into the garden.
          </p>

          <Link
            to="/"
            className="
        inline-block
        px-6 py-3
        bg-green-700
        text-white
        rounded-full
        hover:bg-green-800
        transition
        shadow-md
      "
          >
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}