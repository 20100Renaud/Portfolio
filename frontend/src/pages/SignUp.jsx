import { useState } from "react";
import { Link } from "react-router-dom";

export default function SignUp() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    alert(`Username: ${username}\nEmail: ${email}\nPassword: ${password}`);
  };

  return (
    <div className="flex flex-grow items-center justify-center w-full px-6">
      <div
        className="
          relative w-full max-w-md p-8
          bg-gradient-to-b
          from-white from-[0%] to-[#a5d6a7]
          rounded-xl shadow-lg flex flex-col items-center"
      >
        {/* <div className="transition-transform duration-200 mb-10">
          <AnimatedFlatLogoInfinite size={120} />
        </div> */}

        <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
          Create an account
        </h2>

        <form onSubmit={handleSubmit} className="w-full space-y-4">
          <div>
            <label className="block text-gray-700 mb-1">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="
                input input-bordered w-full bg-white pl-4 
                focus:placeholder-transparent
                focus:outline-none
                focus:ring-2 focus:ring-green-700"
              placeholder="Your username"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="
                input input-bordered w-full bg-white pl-4 
                focus:placeholder-transparent
                focus:outline-none
                focus:ring-2 focus:ring-green-700"
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
              className="
              input input-bordered w-full bg-white pl-4 
                focus:placeholder-transparent
                focus:outline-none
                focus:ring-2 focus:ring-green-700"
              placeholder="********"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="
                input input-bordered w-full bg-white pl-4 
                focus:placeholder-transparent
                focus:outline-none
                focus:ring-2 focus:ring-green-700"
              placeholder="********"
              required
            />
          </div>

          <button type="submit" className="px-6 py-3 w-full
              bg-green-700 text-white
              rounded-full
              hover:bg-green-800
              transition
              shadow-md">
            Sign Up
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?
          <Link
            to="/Login"
            className="text-primary font-medium hover:underline ml-2 "
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
