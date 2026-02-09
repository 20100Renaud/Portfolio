import fleche from '../assets/Fleches.webp';


export default function About() {
  return (
     <div className="flex flex-col flex-grow items-center text-center w-full">
        <h1 className="text-3xl font-bold">
            What did inspire this project ?
        </h1>

        <div className="mt-14">
        </div>

        <div className="relative min-h-[300px] flex items-center justify-center">
            <img
            src={fleche}
            alt="Fleches"
            className="absolute w-[80px] animate-arrowEnter will-change-transform"
            />
            <div className="relative z-10">
                <h2 className="mb-3 leading-relaxed">
                    My garden friends did.
                    <br />
                    We often talk about what we can give up.
                    <br />
                    And each time, it's the same answer for both sides:
                    <br />
                    "Just tell what you've got and I'll tell you what I need."
                    <br />
                    "Just tell me what you need, I'll let you know when it is ready."
                </h2>

                <h1 className="text-3xl my-5">
                    <span className="font-bold">Share</span>UP
                </h1>

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
