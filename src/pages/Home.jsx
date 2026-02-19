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
    { name: "Carott", icon: FaCarrot },
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
    <div className="flex flex-col flex-grow items-center text-center w-full relative">
        <h1 className="text-2xl sm:text-3xl font-bold">
            Share what others want !
        </h1>
        <h2 className="text-xs sm:text-xl">
            Let your friends know that you have something to give up.
        </h2>

                <div className="mt-5 relative border-y-2 border-green-600/50 w-full">
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

                            {/* duplicate for seamless loop */}
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

        <div className="sm:flex flex-col items-center text-xs sm:text-xl py-6 relative hidden "
            style={{
                textShadow:
                    "2px 2px 6px rgba(0,0,0,0.5), 0 0 40px rgba(0,255,0,0.9)"
                }}
        >
        
            <h2 className="leading-relaxed">
                Hello,
                <br />
                Welcome nature lovers.
                <br />
                From our gardens come many treasures:
                <br />
                leaves, branches, fruits, vegetables, eggs, plants ...
                <br />
                If you have extras, this app is a great and responsive way to:
            </h2>

            <div className="-my-4">
                <Animated_logo size={120} />
            </div>

            <h2 className="leading-relaxed">
                Give locally to reduce waste and grow stronger communities.
                <br />
                With ShareUp app you can create a post to let others know
                <br />
                what, when and how many you have to share.
                <br />
                It’s an easy way to connect with
                <br />
                people around us.
            </h2>
        </div>

        <div className="m-3 p-3  rounded-3xl bg-white/50 sm:hidden"
            style={{
                textShadow:
                    "2px 2px 6px rgba(0,0,0,0.5)"
                }}
        >
            <h2 className="leading-relaxed">
                Hello nature lovers.
                <br />
                From our gardens come many treasures:
                leaves, branches, fruits, vegetables, eggs, plants ...
                If you have extras, this app is a great and responsive way to:
            </h2>

            <div className="-my-4">
                <Animated_logo size={120} />
            </div>

            <h2 className="leading-relaxed">
                With this app you can let people know
                what, when and how many you have to share or need.
                It’s an easy way to connect around us.
                Give locally is a way to reduce waste and grow stronger communities.
            </h2>
        </div>
    </div>
  )
}
