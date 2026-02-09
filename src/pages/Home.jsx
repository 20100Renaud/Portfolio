import { FaLeaf, FaAppleAlt, FaCarrot, FaEgg, FaSeedling, FaEllipsisH, FaTree } from "react-icons/fa";
import fleche from '../assets/Fleches.webp';

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
    <div className="flex flex-col flex-grow items-center text-center w-full">
        <h1 className="text-3xl font-bold">
            Share what others want !
        </h1>
        <h1 className="text-xl">
            Let your friends know that you have something to give up.
        </h1>
        <div className="mb-16 mt-6 flex flex-wrap gap-6 justify-center lg:justify-start">
            {shareItems.map((item) => {
                const Icon = item.icon;
                return (
                <div
                    key={item.name}
                    className="flex flex-col items-center text-center w-24 p-4
                                border-t-4 border-l-4 border-b-2 border-r-2
                                border border-green-500/60 rounded-3xl shadow-lg hover:shadow-xl
                                bg-green-200 hover:bg-green-300 transition-colors duration-200"
                >
                    <div className="text-green-600 text-4xl">
                    <Icon />
                    </div>
                    <span className="text-sm font-medium">{item.name}</span>
                </div>
                );
            })}
        </div>

        <div className="mt-14">
        </div>

        <div className="relative min-h-[300px] flex items-center justify-center">
            <img
            src={fleche}
            alt="Fleches"
            className="absolute w-[80px] animate-arrowEnter will-change-transform"
            />
            <div className="relative z-10">
                <h2 className="my-3 leading-relaxed">
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

                <h1 className="text-3xl my-5">
                    <span className="font-bold">Share</span>UP
                </h1>

                <h2 className="my-3 leading-relaxed">
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
    </div>
  )
}
