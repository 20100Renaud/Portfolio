import { useRef, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaQuestion } from "react-icons/fa";
import { GiBasket, GiNotebook } from "react-icons/gi";
import Animated_logo from "../components/Animated_logo";
import { shareItems } from "../constants/shareItems";
import { useScrollScale } from "../hooks/useInView";
import Marquee from "../components/Marquee";
import CustomButton from "../components/CustomButton";
import { useAbout } from "../context/AboutContext";

export default function Home() {
  const basketRef = useRef(null);
  const notebookRef = useRef(null);
  const questionRef = useRef(null);
  const basketScale = useScrollScale(basketRef);
  const notebookScale = useScrollScale(notebookRef);
  const questionScale = useScrollScale(questionRef);
  const navigate = useNavigate();
  const [logoKey, setLogoKey] = useState(0);
  const { openAbout, aboutOpen } = useAbout();

  // Animate the logo on about modal close
  useEffect(() => {
    if (!aboutOpen) {
      setLogoKey((k) => k + 1);
    }
  }, [aboutOpen]);

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
            One person’s waste can be another person’s treasure.
          </p>

          <div className="z-20 mb-1">
            <Animated_logo key={logoKey} size={120} />
          </div>
          <div
            onClick={openAbout}
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
                <CustomButton
                  onClick={() => navigate("/faq")}
                  variant="small_green"
                  className=""
                >
                  FAQ
                </CustomButton>
                .
              </p>
            </div>
          </div>
        </aside>
      </section>
    </div>
  );
}
