import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import AnimatedFlatLogoInfinite from "../components/AnimatedFlatLogo_infinite";
import { useAuth } from "../context/useAuth";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const [touched, setTouched] = useState({
    email: false,
    password: false,
  });

  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const isValidPassword = (password) => {
    return password.length >= 4;
  };
  const isFormValid = isValidEmail(email) && isValidPassword(password);

  const [toast, setToast] = useState(null);
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("[LOGIN] submit triggered");
    console.log("[LOGIN] email:", email);
    console.log("[LOGIN] password length:", password.length);

    if (!isFormValid) {
      console.log("[LOGIN] form invalid, abort");
      return;
    }

    try {
      console.log("[LOGIN] sending request...");

      const response = await fetch("/api/auth/connect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      console.log("[LOGIN] response received");
      console.log("[LOGIN] status:", response.status);

      const data = await response.json();
      console.log("[LOGIN] response JSON:", data);

      if (response.ok) {
        console.log("[LOGIN] success → navigating dashboard");
        setToast(
          <div className="flex flex-col p-4">
            <span className="font-bold text-lg text-white">
              Login successful!
            </span>
          </div>,
        );
        console.log("[LOGIN] result:", data);
        await login();
        navigate("/dashboard");
      } else {
        console.log("[LOGIN] error response:", data);
        setToast(
          <div className="flex flex-col p-4">
            <span className="font-bold text-lg text-white">
              {data.error || "Login failed"}
            </span>
          </div>,
        );
      }
    } catch (err) {
      console.log("[LOGIN] FETCH ERROR:", err);
      console.error("Error logging in:", err);
      setToast(
        <div className="flex flex-col p-4">
          <span className="font-bold text-lg text-white">
            Server error, try again later
          </span>
        </div>,
      );
      console.error(err);
    }
  };

  return (
    <div className="mt-6 flex flex-grow items-center justify-center w-full px-6 text-green-900">
      <div
        className="
        relative w-full max-w-md p-8
        bg-gradient-to-b
        from-white from-[30%] to-[#a5d6a7]
        rounded-xl shadow-lg flex flex-col items-center"
      >
        <div className="transition-transform duration-200 mb-8">
          <AnimatedFlatLogoInfinite size={120} />
        </div>

        <h2 className="text-2xl font-bold text-center mb-8">Login</h2>

        <form onSubmit={handleSubmit} noValidate className="w-full space-y-4">
          <div>
            <label className="block">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                const value = e.target.value.toLowerCase();
                setEmail(value);
                setErrors((prev) => ({
                  ...prev,
                  email: isValidEmail(value) ? "" : "Invalid email address",
                }));
              }}
              onBlur={() => {
                setTouched((prev) => ({ ...prev, email: true }));
              }}
              className={`
                input input-bordered w-full bg-white pl-4
                focus:placeholder-transparent
                focus:outline-none
                focus:ring-2 focus:ring-green-700
                ${touched.email && errors.email ? "border-red-500" : ""}
                `}
              placeholder="you@example.com"
              required
            />
            <div className="h-2">
              {touched.email && errors.email && (
                <p className="text-red-500 text-sm">{errors.email}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                const value = e.target.value;
                setPassword(value);
                setErrors((prev) => ({
                  ...prev,
                  password: isValidPassword(value)
                    ? ""
                    : "Password must be at least 4 characters",
                }));
              }}
              onBlur={() => {
                setTouched((prev) => ({ ...prev, password: true }));
              }}
              className={`
                input input-bordered w-full bg-white pl-4
                focus:placeholder-transparent
                focus:outline-none
                focus:ring-2 focus:ring-green-700
                ${touched.password && errors.password ? "border-red-500" : ""}
              `}
              placeholder="********"
              required
            />
            <div className="h-2">
              {touched.password && errors.password && (
                <p className="text-red-500 text-sm">{errors.password}</p>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={!isFormValid}
            className={`
              px-6 py-3 w-full rounded-full
              transition
              shadow-md
              ${
                isFormValid
                  ? "bg-green-700 text-white hover:bg-green-800"
                  : "bg-gray-400 text-gray-200 cursor-not-allowed"
              }
            `}
          >
            Sign In
          </button>
        </form>

        <p className="mt-4 text-center text-sm">
          Don’t have an account yet?{"    "}
          <Link
            to="/signup"
            className="text-primary font-medium hover:underline ml-2"
          >
            Sign up
          </Link>
        </p>
      </div>

      {toast && (
        <div
          className="
            fixed items-center justify-center text-center
            bg-green-600
            rounded-lg shadow-lg
            animate-fade-in
          "
        >
          {toast}
        </div>
      )}
    </div>
  );
}
