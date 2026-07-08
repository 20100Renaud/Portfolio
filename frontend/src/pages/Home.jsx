import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaQuestion } from "react-icons/fa";
import { GiBasket, GiNotebook } from "react-icons/gi";
import Animated_logo from "../components/Animated_logo";
import AnimatedFlatLogoInfinite from "../components/AnimatedFlatLogo_infinite";
import { shareItems } from "../constants/shareItems";
import { useScrollScale } from "../hooks/useInView";
import Modal from "../components/Modal";
import dessin from "../assets/dessin_jardin.png";
import Marquee from "../components/Marquee";
import CustomButton from "../components/CustomButton";

export default function Home() {
  const basketRef = useRef(null);
  const notebookRef = useRef(null);
  const questionRef = useRef(null);
  const basketScale = useScrollScale(basketRef);
  const notebookScale = useScrollScale(notebookRef);
  const questionScale = useScrollScale(questionRef);
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div
      className="
      relative flex flex-col
      items-center text-center
      text-green-900 overflow-hidden"
    >
      <Marquee
        items={shareItems}
        className="border-y-2 border-green-600/80 backdrop-blur-xs bg-white/60 shadow-md m-4"
      />

      <section className="relative z-10 px-4 w-full">
        <div
          className="
          backdrop-blur-xs bg-white/60
          border border-white/40
          shadow-xl rounded-2xl
          p-8 sm:p-12 sm:pb-6 max-w-xl mx-auto mb-10"
        >
          <h1 className="text-3xl sm:text-5xl font-bold mb-4">
            Share what others want <span className="animate-pulse">🌿</span>
          </h1>
          <p className="text-sm sm:text-lg text-green-800">
            Let your friends know that you have something to give.
          </p>

          <div className=" z-20">
            <Animated_logo size={120} />
          </div>
          <div
            onClick={() => setIsTeamModalOpen(true)}
            className="
              flex flex-col sm:flex-row justify-around
              italic font-semibold px-6 py-1
              bg-green-700 text-white
              rounded-full
              shadow-md
              cursor-pointer
              transition
              hover:bg-green-800
              hover:scale-[1.02]
              active:scale-100
            "
          >
            <p className="basis-1/3">Share locally</p>
            <p className="basis-1/3">Grow community</p>
            <p className="basis-1/3">Reduce waste</p>
          </div>
        </div>

        <aside className="flex flex-wrap gap-10 justify-center pb-20">
          <div className="backdrop-blur-xs bg-white/90 border border-white/40 shadow-xl rounded-2xl p-8 max-w-md">
            <h2 className="text-2xl font-bold mb-6">Welcome nature lovers</h2>
            <p className="text-green-800 leading-relaxed">
              From our gardens come many treasures like leaves, fruits,
              vegetables, eggs, plants…
            </p>
            <div ref={basketRef} className="flex justify-center my-2">
              <GiBasket
                size={32}
                style={{ transform: `scale(${basketScale})` }}
              />
            </div>
            <p>
              When you have extras or needs, this app makes sharing simple and
              local. Giving nearby is a beautiful way to reduce waste.
            </p>
          </div>

          <div className="backdrop-blur-xs bg-white/90 border border-white/40 shadow-xl rounded-2xl p-8 max-w-md">
            <h2 className="text-2xl font-bold mb-6">Concept</h2>
            <p className="text-green-800 leading-relaxed">
              This app is free. No ads. No tracking. Only your email is required
              to connect with others.
            </p>
            <div ref={notebookRef} className="flex justify-center my-2">
              <GiNotebook
                size={32}
                style={{ transform: `scale(${notebookScale})` }}
              />
            </div>
            <p>
              Our goal is a simple, intuitive interface that anyone can use. A
              growing community around sharing and sustainability.
            </p>
          </div>

          <div className="backdrop-blur-xs bg-white/90 border border-white/40 shadow-xl rounded-2xl p-8 max-w-md">
            <h2 className="text-2xl font-bold mb-6">What inspired it?</h2>
            <div className="text-green-800 leading-relaxed">
              <p>Gardeners often say:</p>
              <p className="italic">“Tell me what you have.” or</p>
              <p className="italic">“Tell me what you need.”</p>
              <div ref={questionRef} className="flex justify-center my-2">
                <FaQuestion
                  size={32}
                  style={{ transform: `scale(${questionScale})` }}
                />
              </div>
              <p>
                So we built a way to connect people around that idea. Please
                help us improve it here in the{" "}
                <CustomButton onClick={() => navigate("/faq")} variant="small_green" className="">
                  FAQ
                </CustomButton>
                .
              </p>
            </div>
          </div>
        </aside>
      </section>

      {/* About Modal */}
      <Modal
        open={isTeamModalOpen}
        onClose={() => {
          setIsTeamModalOpen(false);
          window.location.reload();
        }}
      >
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

            <div className="relative flex justify-center items-center h-36 mt-8 -mx-10">
              <Marquee
                items={shareItems}
                className="border-y-2 border-green-600/80 backdrop-blur-xs bg-white/60 shadow-md m-4"
              />

              <div className="absolute flex items-center justify-center z-10 pointer-events-none backdrop-blur rounded-full">
                <AnimatedFlatLogoInfinite size={160} />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] border-2 rounded-2xl p-4 bg-white/50">
              {/* Frontend */}
              <div className="flex flex-col items-center">
                <img
                  src="/images/Vincent.png"
                  alt="Frontend developer"
                  className="w-40 h-40 rounded-full object-cover ring-1 ring-green-100 shadow-2xl"
                />
                <h3 className="mt-4 text-xl font-semibold text-green-900">
                  Vincent
                </h3>
                <h3 className="mt-4 text-xl font-semibold text-green-900">
                  FRONTEND
                </h3>

                <p className="text-sm text-green-700">
                  Designing and building the user interface.
                </p>
              </div>

              {/* Team Name */}
              <div className="">
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

              {/* Backend */}
              <div className="flex flex-col items-center">
                <img
                  src="/images/Enzo.png"
                  alt="Backend developer"
                  className="w-40 h-40 rounded-full object-cover ring-1 ring-green-100 shadow-2xl"
                />
                <h3 className="mt-4 text-xl font-semibold text-green-900">
                  Enzo
                </h3>
                <h3 className="mt-4 text-xl font-semibold text-green-900">
                  BACKEND
                </h3>

                <p className="text-sm text-green-700">
                  Building the API, database and application logic.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
