import { FaLeaf, FaAppleAlt, FaCarrot, FaEgg, FaSeedling, FaEllipsisH, FaTree } from "react-icons/fa";
import Animated_logo from "../components/Animated_logo";


const shareItems = [
    { name: "Leaves", icon: FaLeaf },
    { name: "Branches", icon: FaTree },
    { name: "Fruits", icon: FaAppleAlt },
    { name: "Vegetables", icon: FaCarrot },
    { name: "Eggs", icon: FaEgg },
    { name: "Plants", icon: FaSeedling },
    { name: "More", icon: FaEllipsisH },
];

export default function Home() {
  return (
    <div className="flex flex-col flex-grow items-center text-center w-full relative">
        <h1 className="text-2xl sm:text-3xl font-bold">
            Share what others want !
        </h1>
        <h2 className="text-sm sm:text-xl">
            Let your friends know that you have something to give up.
        </h2>

        <div className="mt-5 flex flex-wrap gap-6 justify-center lg:justify-start relative">
            {shareItems.map((item) => {
                const Icon = item.icon;
                return (
                <div
                    key={item.name}
                    className="flex flex-col items-center text-center w-24 p-4
                                border-t-4 border-l-4 border-b-2 border-r-2
                                border border-green-500/60 rounded-3xl shadow-lg 
                                bg-green-200 transition-colors duration-200"

                >
                    <div className="text-green-600 text-4xl">
                    <Icon />
                    </div>
                    <span className="text-sm font-medium">{item.name}</span>
                </div>
                );
            })}
        </div>
        
        <div className="flex flex-col items-center text-sm sm:text-xl p-6 relative"
            style={{
                textShadow:
                    "2px 2px 6px rgba(0,0,0,0.5), 0 0 40px rgba(50,255,255,0.9)"
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
    </div>
  )
}
