import Modal from "../Modal";
import Marquee from "../Marquee";
import AnimatedFlatLogoInfinite from "../AnimatedFlatLogo_infinite";
import Animated_logo from "../Animated_logo";
import dessin from "../../assets/dessin_jardin.png";
import { shareItems } from "../../constants/shareItems";

export default function AboutModal({ open, onClose }) {
  return (
    <Modal open={open} onClose={onClose}>
      <div className="relative">
        <img
          src={dessin}
          alt="Dessin de jardin"
          className="
            absolute
            inset-0
            w-full
            -my-6
            opacity-70
            pointer-events-none
            z-0"
        />
        <div className="relative z-10 text-center">
          <div className="flex justify-center">
            <div
              className="inline-flex flex-col text-center
                  p-2
                  rounded-full
                  text-green-700
                  bg-green-100
                  ring-1 ring-green-400 shadow-2xl"
            >
              🌿<div>Application built</div>
              <div>for people around us</div>
              <div>about sharing locally</div>
              <div>garden goods.</div>🌿
            </div>
          </div>

          <div className="relative flex justify-center items-center h-36 mt-4 -mx-10">
            <Marquee
              items={shareItems}
              className="border-y-2 border-green-600/80 backdrop-blur-xs bg-white/60 shadow-md m-4"
            />

            <div className="absolute flex items-center justify-center z-10 pointer-events-none backdrop-blur rounded-full">
              <AnimatedFlatLogoInfinite size={160} />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 border-2 rounded-2xl px-4 pt-6 pb-1 bg-white/50 gap-4">
            {/* Frontend */}
            <div className="flex flex-col items-center mt-4 sm:mt-0 border sm:border-none  border-green-500 rounded-2xl p-4 sm:p-0">
              <img
                src="/images/Vincent.png"
                alt="Frontend developer"
                className="w-40 h-40 rounded-full object-cover ring-1 ring-green-100 shadow-2xl"
              />
              <h3 className="mt-2 text-xl font-semibold text-green-900">
                Vincent
              </h3>
              <h3 className="mt-2 text-xl font-semibold text-green-900">
                FRONTEND
              </h3>

              <p className="text-sm text-green-700">
                Designing and building the user interface.
              </p>

              {/* Icons links */}
              <div className="flex gap-2 mt-2 sm:mb-0 border border-green-300 px-3 py-1 rounded-xl bg-green-50">
                <img
                  width="20"
                  height="30"
                  src="/icons/Brave_32x32.png"
                  alt="Brv"
                />
                <img
                  width="20"
                  height="30"
                  src="/icons/Linkedin_32x32.png"
                  alt="Lkn"
                />
                <img
                  width="20"
                  height="30"
                  src="/icons/Github_32x32.png"
                  alt="Ghb"
                />
                <img
                  width="20"
                  height="30"
                  src="/icons/Discord_32x32.png"
                  alt="Dis"
                />
                <img
                  width="20"
                  height="30"
                  src="/icons/Ecosia_32x32.png"
                  alt="Eco"
                />
              </div>
            </div>

            {/* Backend */}
            <div className="flex flex-col items-center border sm:border-none  border-green-500 rounded-2xl p-4 sm:p-0">
              <img
                src="/images/Enzo.png"
                alt="Backend developer"
                className="w-40 h-40 rounded-full object-cover ring-1 ring-green-100 shadow-2xl"
              />
              <h3 className="mt-2 text-xl font-semibold text-green-900">
                Enzo
              </h3>

              <h3 className="mt-2 text-xl font-semibold text-green-900">
                BACKEND
              </h3>

              <p className="text-sm text-green-700">
                Building the API, database and application logic.
              </p>

              {/* Icons links */}
              <div className="flex gap-2 mt-2 border border-green-300 px-3 py-1 rounded-xl bg-green-50">
                <img
                  width="20"
                  height="30"
                  src="/icons/Brave_32x32.png"
                  alt="Brv"
                />
                <img
                  width="20"
                  height="30"
                  src="/icons/Linkedin_32x32.png"
                  alt="Lkn"
                />
                <img
                  width="20"
                  height="30"
                  src="/icons/Github_32x32.png"
                  alt="Ghb"
                />
                <img
                  width="20"
                  height="30"
                  src="/icons/Discord_32x32.png"
                  alt="Dis"
                />
                <img
                  width="20"
                  height="30"
                  src="/icons/Ecosia_32x32.png"
                  alt="Eco"
                />
              </div>
            </div>
            {/* Team Name */}
            <div className="absolute flex w-full justify-center -ml-4 -mt-4">
              <button
                onClick={() => {
                  setIsTeamModalOpen(false);
                  window.location.reload();
                }}
                className="text-lg font-bold text-green-900"
              >
                -Lyonx Team-
              </button>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
