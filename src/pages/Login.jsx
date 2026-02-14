import { useState } from "react";
import AnimatedFlatLogoInfinite from "../components/AnimatedFlatLogo_infinite";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Email: ${email}\nPassword: ${password}`);
  };

  return (

    <div className=" flex flex-grow items-center justify-center w-full">
        <div className="
                relative w-full max-w-md p-8
                bg-gradient-to-b
                from-white from-[30%] to-[#a5d6a7]
                rounded-xl shadow-lg flex flex-col items-center
            ">
            <div className="
                transition-transform duration-200
                hover:scale-110 mb-10
            ">
              <AnimatedFlatLogoInfinite size={120} />
            </div>

            <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
            Login
            </h2>

            <form onSubmit={handleSubmit} className="w-full space-y-4">
            <div>
                <label className="block text-gray-700 mb-1">Email</label>
                <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input input-bordered w-full bg-white"
                placeholder="you@example.com"
                required
                />
            </div>

            <div>
                <label className="block text-gray-700 mb-1">Password</label>
                <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input input-bordered w-full bg-white"
                placeholder="********"
                required
                />
            </div>

            <button
                type="submit"
                className="btn btn-primary w-full mt-2"
            >
                Sign In
            </button>
            </form>

            <p className="mt-4 text-center text-sm text-gray-600">
            Don’t have an account?{"    "}
            <a href="/SignUp" className="text-primary font-medium hover:underline ml-2">
                Sign up
            </a>
            </p>
        </div>
    </div>
  );
}
