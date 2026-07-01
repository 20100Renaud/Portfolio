import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import AnimatedFlatLogoInfinite from "../components/AnimatedFlatLogo_infinite";
import CustomButton from "../components/CustomButton";
import InputField from "../components/InputField";
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
      const timer = setTimeout(() => setToast(null), 2000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/auth/connect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("[LOGIN] success → navigating dashboard");
        setToast(
          <div className="flex flex-col p-4">
            <span className="font-bold text-lg text-white">
              Login successful!
            </span>
          </div>,
        );
        await login();
        navigate("/dashboard");
      } else {
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
        rounded-2xl shadow-lg flex flex-col items-center"
      >
        <div className="transition-transform duration-200 mb-8">
          <AnimatedFlatLogoInfinite size={120} />
        </div>

        <h2 className="text-2xl font-bold text-center mb-8">Enter you field</h2>

        <form onSubmit={handleSubmit} noValidate className="w-full space-y-4">
          {/* Email field*/}
          <InputField
            label="Email"
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
            onBlur={() =>
              setTouched((prev) => ({
                ...prev,
                email: true,
              }))
            }
            placeholder="you@example.com"
            error={errors.email}
            touched={touched.email}
            required
          />

          {/* Password field*/}
          <InputField
            label="Password"
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
            onBlur={() =>
              setTouched((prev) => ({
                ...prev,
                password: true,
              }))
            }
            placeholder="********"
            error={errors.password}
            touched={touched.password}
            required
          />

          {/* SignIn Btn */}
          <CustomButton
            type="submit"
            disabled={!isFormValid}
            className="flex justify-center w-full"
          >
            Login
          </CustomButton>
        </form>

        {/* SignUp page link Btn */}

        <div className="mt-4 flex items-center justify-center gap-2 text-sm">
          <span>Don’t have an account yet?</span>

          <Link
            to="/SignUp"
            className="
              text-sm
              px-2 py-1
              rounded-full
              border border-green-300
              text-green-700
              bg-green-50
              hover:bg-green-100
              transition
              flex items-center
              active:scale-95
              active:opacity-80
            "
          >
            Sign up
          </Link>
        </div>
      </div>

      {/* Toast message (error or confirm) */}
      {toast && (
        <div
          className="
            fixed items-center justify-center text-center
            bg-green-600
            rounded-2xl shadow-lg
            animate-fade-in
          "
        >
          {toast}
        </div>
      )}
    </div>
  );
}
