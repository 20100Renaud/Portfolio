import { FaLeaf, FaAppleAlt, FaCarrot, FaEgg, FaSeedling, FaTree, FaPoop } from "react-icons/fa";
import {
  GiStrawberry,
  GiBeet,
  GiTomato,
  GiPumpkin,
  GiMushroom,
  GiHerbsBundle,
  GiHoneyJar,
  GiPlantSeed,
  GiBasket,
} from "react-icons/gi";
import { MdCompost } from "react-icons/md";
import Animated_logo from "../components/Animated_logo";

const shareItems = [
  { name: "Leaves", icon: FaLeaf },
  { name: "Branches", icon: FaTree },
  { name: "Apple", icon: FaAppleAlt },
  { name: "Carrot", icon: FaCarrot },
  { name: "Tomato", icon: GiTomato },
  { name: "Eggs", icon: FaEgg },
  { name: "Plants", icon: FaSeedling },
  { name: "Compost", icon: MdCompost },
  { name: "Manure", icon: FaPoop },
  { name: "Strawberries", icon: GiStrawberry },
  { name: "Beets", icon: GiBeet },
  { name: "Pumpkin", icon: GiPumpkin },
  { name: "Mushrooms", icon: GiMushroom },
  { name: "Herbs", icon: GiHerbsBundle },
  { name: "Honey", icon: GiHoneyJar },
  { name: "Seeds", icon: GiPlantSeed },
  { name: "Basket", icon: GiBasket },
];

export default function Home() {
  return (
    <div className="
      relative flex flex-col items-center text-center
      text-green-900 overflow-hidden"
    >
      <div className="mb-5 relative border-y-2 border-green-600/50 w-full">
        <div className="marquee">
          <div
            className="marquee-track"
            style={{ ['--marquee-duration']: '40s' }}
          >
            {shareItems.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.name}
                  className="flex flex-col items-center text-center w-16 sm:w-24 p-2 sm:p-4"
                >
                  <div className="text-green-600 text-2xl sm:text-4xl">
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
                  className="flex flex-col items-center text-center w-16 sm:w-24 p-2 sm:p-4"
                >
                  <div className="text-green-600 text-2xl sm:text-4xl">
                    <Icon />
                  </div>
                  <span className="text-xs sm:text-sm font-medium">{item.name}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="relative z-10 px-6 w-full">
        <div className="
          backdrop-blur-xs bg-white/60
          border border-white/40
          shadow-xl rounded-2xl
          p-8 sm:p-12 sm:pb-6 max-w-2xl mx-auto mb-10"
        >
          <h1 className="text-3xl sm:text-5xl font-bold mb-4">
            Share what others want <span className="animate-pulse">🌿</span>
          </h1>
          <p className="text-sm sm:text-lg text-green-800">
            Let your friends know that you have something to give.
          </p>

          <div className="mt-4 z-20">
            <Animated_logo size={120} />
          </div>
          <div className="flex flex-col sm:flex-row justify-around italic sm:font-semibold">
            <p className="basis-1/3">Share locally</p>
            <p className="basis-1/3">Grow community</p>
            <p className="basis-1/3">Reduce waste</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-10 justify-center pb-20">
          <div className="backdrop-blur-sm bg-white/60 border border-white/40 shadow-xl rounded-2xl p-8 max-w-md">
            <h2 className="text-2xl font-bold mb-6">Welcome nature lovers</h2>
            <p className="text-green-800 leading-relaxed">
              From our gardens come many treasures: leaves, fruits,
              vegetables, eggs, plants…
              <br /><br />
              When you have extras or needs,
              this app makes sharing simple and local.
              Giving nearby is a beautiful way to reduce waste.
            </p>
          </div>

          <div className="backdrop-blur-sm bg-white/60 border border-white/40 shadow-xl rounded-2xl p-8 max-w-md">
            <h2 className="text-2xl font-bold mb-6">Concept</h2>
            <p className="text-green-800 leading-relaxed">
              This app is free. No ads. No tracking.
              Only your email is required to connect with others.
              <br /><br />
              Our goal is a simple, intuitive interface
              that anyone can use.
              A growing community around sharing and sustainability.
            </p>
          </div>

          <div className="backdrop-blur-sm bg-white/60 border border-white/40 shadow-xl rounded-2xl p-8 max-w-md">
            <h2 className="text-2xl font-bold mb-6">What inspired it?</h2>
            <p className="text-green-800 leading-relaxed">
              Gardeners often say:
              <p className="italic">“Tell me what you have.” or</p>
              <p className="italic">“Tell me what you need.”</p>
              <br />
              <p>So we built a way to connect people around that idea.
                Simple, local and Friendly.
              </p>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}