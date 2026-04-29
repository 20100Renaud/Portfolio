import { useRef } from "react";
import { Link } from "react-router-dom";
import { FaQuestion } from "react-icons/fa";
import { GiBasket, GiNotebook, } from "react-icons/gi";
import Animated_logo from "../components/Animated_logo";
import { shareItems } from "../constants/shareItems";
import { useScrollScale } from "../hooks/useInView";


export default function Home() {
  const basketRef = useRef(null);
  const notebookRef = useRef(null);
  const questionRef = useRef(null);

  const basketScale = useScrollScale(basketRef);
  const notebookScale = useScrollScale(notebookRef);
  const questionScale = useScrollScale(questionRef);
  return (
    <div className="
      relative flex flex-col
      items-center text-center
      text-green-900 overflow-hidden"
    >

      <section className="relative border-y-2 border-green-600/80 backdrop-blur-xs bg-white/60 w-full m-4  shadow-md overflow-hidden py-3 sm:py-4">
        <div className="flex w-max animate-marquee will-change-transform gap-4">

          {shareItems.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.name}
                className="flex flex-col items-center justify-center text-center shrink-0 w-20 sm:w-28"
              >
                <div className="text-green-600/80 text-2xl sm:text-4xl">
                  <Icon />
                </div>
                <span className="text-xs sm:text-sm font-medium">{item.name}</span>
              </div>
            );
          })}

          {shareItems.map((item, i) => {
            const Icon = item.icon;
            return (
              <div
                key={"dup-" + item.name + i}
                aria-hidden
                className="flex flex-col items-center justify-center text-center shrink-0 w-20 sm:w-28"
              >
                <div className="text-green-600 text-2xl sm:text-4xl">
                  <Icon />
                </div>
                <span className="text-xs sm:text-sm font-medium">{item.name}</span>
              </div>
            );
          })}
        </div>
      </section>

      <section className="relative z-10 px-4 w-full">
        <div className="
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
          <div className="
            flex flex-col sm:flex-row justify-around
            italic font-semibold px-6 py-1
            bg-green-700 text-white
            rounded-full
            shadow-md"
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
								style={{ transform: `scale(${basketScale})` }} />
						</div>
						<p>
              When you have extras or needs,
              this app makes sharing simple and local.
              Giving nearby is a beautiful way to reduce waste.
            </p>
          </div>

          <div className="backdrop-blur-xs bg-white/90 border border-white/40 shadow-xl rounded-2xl p-8 max-w-md">
            <h2 className="text-2xl font-bold mb-6">Concept</h2>
            <p className="text-green-800 leading-relaxed">
              This app is free. No ads. No tracking.
              Only your email is required to connect with others.
						</p>
						<div ref={notebookRef} className="flex justify-center my-2">
							<GiNotebook
								size={32}
								style={{ transform: `scale(${notebookScale})` }} />
						</div>
						<p>
              Our goal is a simple, intuitive interface
              that anyone can use.
              A growing community around sharing and sustainability.
            </p>
          </div>

          <div className="backdrop-blur-xs bg-white/90 border border-white/40 shadow-xl rounded-2xl p-8 max-w-md">
            <h2 className="text-2xl font-bold mb-6">What inspired it?</h2>
            <div className="text-green-800 leading-relaxed">
              <p>
                Gardeners often say:
              </p>
              <p className="italic">“Tell me what you have.” or</p>
              <p className="italic">“Tell me what you need.”</p>
              <div ref={questionRef} className="flex justify-center my-2">
                <FaQuestion
                  size={32}
                  style={{ transform: `scale(${questionScale})` }} />
              </div>
              <p>
                So we built a way to connect people around that idea.
                Please help us improve it here in the <Link to="/faq" className="underline text-blue-500">FAQ</Link>.
              </p>
            </div>
          </div>

        </aside>
      </section>
    </div>
  );
}
