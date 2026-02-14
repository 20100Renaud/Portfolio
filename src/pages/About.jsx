import Animated_logo from "../components/Animated_logo";

export default function About() {
  return (
     <div className="flex flex-col flex-grow items-center text-center w-full relative">
        <h1 className="text-2xl sm:text-3xl font-bold">
            What did inspire this project ?
        </h1>

        <div className="mt-20">
        </div>

        <div className="min-h-[300px] flex items-center justify-center"
            style={{
                textShadow:
                    "2px 2px 6px rgba(0,0,0,0.5), 0 0 40px rgba(50,255,255,0.9)"
                }}
        >
            <div className="flex flex-col items-center text-sm sm:text-xl">
            
                <h2 className="leading-relaxed">
                    My gardener friends did it.
                    <br />
                    We often talk about what we can give up.
                    <br />
                    And each time, it's the same answer for both sides:
                    <br />
                    "Just tell what you've got and I'll tell you what I need."
                    <br />
                    "Just tell me what you need, I'll let you know when it is ready."
                </h2>

                <div className="-my-4">
                    <Animated_logo size={120} />
                </div>

                <h2 className="my2 leading-relaxed">
                    So we thought of a way to connect people around this idea.
                    <br />
                    This web application was created to make sharing easier.
                    <br />
                    We tested it with friends to see how it works best.
                    <br />
                    We'll present it for our final examination.
                    <br />
                    We hope you'll enjoy using it.
                </h2>
            </div>
        </div>
    </div>
    )
}
