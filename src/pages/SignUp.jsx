import { useState } from "react";
import logo from "../assets/Logo_512x512.webp";

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
    <div className="flex flex-grow items-center justify-center w-full min-h-[calc(100vh-10rem)] my-4">
      <div
        className="relative w-full max-w-md p-8
                   bg-gradient-to-b
                   from-white from-[30%] to-[#a5d6a7]/40
                   rounded-xl shadow-lg flex flex-col items-center"
      >
        <img
          src={logo}
          alt="logo"
          className="h-40 w-auto transition-transform duration-200 hover:scale-110 mb-10"
        />
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Sign Up
        </h2>

        <form onSubmit={handleSubmit} className="w-full space-y-4">
          <div>
            <label className="block text-gray-700 mb-1">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="input input-bordered w-full bg-white"
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

          <div>
            <label className="block text-gray-700 mb-1">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="input input-bordered w-full bg-white"
              placeholder="********"
              required
            />
          </div>

          <button type="submit" className="btn btn-primary w-full mt-2">
            Sign Up
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?
          <a href="/Login" className="text-primary font-medium hover:underline ml-2">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}
