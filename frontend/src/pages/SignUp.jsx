import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useAuth } from "../context/useAuth";

export default function SignUp() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [results, setResults] = useState([]);
  const [city_user, setCity] = useState("");
  const [latitude_user, setLatitude] = useState(null);
  const [longitude_user, setLongitude] = useState(null);

  const [errors, setErrors] = useState({
    username: "",
    city_user: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [touched, setTouched] = useState({
    username: false,
    city_user: false,
    email: false,
    password: false,
    confirmPassword: false,
  });

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isValidPassword = (password) => password.length >= 4;
  const isValidUsername = (username) => username.length >= 4;
  const isValidCity_user = (city_user) => city_user.length >= 2;

  const isFormValid =
    isValidUsername(username) &&
    isValidCity_user(city_user) &&
    isValidEmail(email) &&
    isValidPassword(password) &&
    password === confirmPassword;

  const validItem = (
    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-green-600">
      ✔
    </span>
  );

  const handleCityChange = async (value) => {
    setCity(value);

    if (value.length < 2) {
      setResults([]);
      return;
    }

    try {
      const response = await fetch(
        `https://geo.api.gouv.fr/communes?nom=${value}&fields=centre,codesPostaux`,
      );

      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error(error);
    }
  };

  const [toast, setToast] = useState(null);
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid) return;

    try {
      console.log({
        email,
        username,
        city_user,
        latitude_user,
        longitude_user,
      });
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          email,
          password,
          username,
          city_user,
          latitude_user,
          longitude_user,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setToast(
          <div className="flex flex-col p-4">
            <span className="text-green-100">Account created!</span>
            <span className="font-bold text-lg text-white">
              Welcome {username}
            </span>
          </div>,
        );
        console.log("SignUp result:", data);
        await login();
        navigate("/dashboard");
      } else {
        setToast(
          <div className="flex flex-col p-4">
            <span className="text-white">
              {data.message || "Sign up failed"}
            </span>
          </div>,
        );
      }
    } catch (err) {
      console.error("Error signing up:", err);
      setToast(
        <div className="flex flex-col p-4">
          <span className="text-white">Server error, try again later</span>
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
        from-white from-[0%] to-[#a5d6a7]
        rounded-2xl shadow-lg flex flex-col items-center"
      >
        <h2 className="text-2xl font-bold text-center mb-2">
          Create an account
        </h2>

        <form onSubmit={handleSubmit} noValidate className="w-full space-y-4">
          <div className="relative">
            <label className="block">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => {
                const value = e.target.value;
                setUsername(value);
                setErrors((prev) => ({
                  ...prev,
                  username: isValidUsername(value)
                    ? ""
                    : "Username must be at least 4 characters",
                }));
              }}
              onBlur={() => setTouched((prev) => ({ ...prev, username: true }))}
              className={`
              input input-bordered w-full bg-white pl-4
              focus:placeholder-transparent
              focus:outline-none
              ${
                touched.username && errors.username
                  ? "border-red-500 ring-2 ring-red-600"
                  : "focus:ring-2 focus:ring-green-700"
              }
            `}
              placeholder="Username"
              required
            />
            <div className="h-2">
              {touched.username && errors.username && (
                <p className="text-red-500 text-sm">{errors.username}</p>
              )}
            </div>

            {isValidUsername(username) && validItem}
          </div>

          <div className="relative">
            <label className="block">City</label>
            <input
              type="text"
              value={city_user}
              onChange={(e) => handleCityChange(e.target.value)}
              maxLength={50}
              onBlur={() =>
                setTouched((prev) => ({ ...prev, city_user: true }))
              }
              className={`
              input input-bordered w-full bg-white pl-4
              focus:placeholder-transparent
              focus:outline-none
              ${
                touched.city_user && errors.city_user
                  ? "border-red-500 ring-2 ring-red-600"
                  : "focus:ring-2 focus:ring-green-700"
              }
            `}
              placeholder="Your city"
              required
            />
            <div className="h-2">
              {touched.city_user && errors.city_user && (
                <p className="text-red-500 text-sm">{errors.city_user}</p>
              )}
            </div>

            {isValidCity_user(city_user) && validItem}

            {results.length > 0 && (
              <ul className="absolute z-50 w-full mt-1 bg-white border rounded-box shadow-lg max-h-60 overflow-y-auto">
                {results.map((commune) => (
                  <li
                    key={commune.code}
                    className="px-4 py-2 cursor-pointer hover:bg-base-200 flex justify-between"
                    onClick={() => {
                      setCity(commune.nom);

                      if (commune.centre?.coordinates) {
                        setLongitude(commune.centre.coordinates[0]);
                        setLatitude(commune.centre.coordinates[1]);
                      }

                      setResults([]);
                    }}
                  >
                    <span>{commune.nom}</span>

                    {commune.codesPostaux?.length > 0 && (
                      <span className="text-sm text-gray-500">
                        {commune.codesPostaux[0]}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="relative">
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
              onBlur={() => setTouched((prev) => ({ ...prev, email: true }))}
              className={`
              input input-bordered w-full bg-white pl-4
              focus:placeholder-transparent
              focus:outline-none
              ${
                touched.email && errors.email
                  ? "border-red-500 ring-2 ring-red-600"
                  : "focus:ring-2 focus:ring-green-700"
              }
            `}
              placeholder="you@example.com"
              required
            />

            <div className="h-2">
              {touched.email && errors.email && (
                <p className="text-red-500 text-sm">{errors.email}</p>
              )}
            </div>

            {isValidEmail(email) && validItem}
          </div>

          <div className="relative">
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
              onBlur={() => setTouched((prev) => ({ ...prev, password: true }))}
              className={`
              input input-bordered w-full bg-white pl-4
              focus:placeholder-transparent
              focus:outline-none
              ${
                touched.password && errors.password
                  ? "border-red-500 ring-2 ring-red-600"
                  : "focus:ring-2 focus:ring-green-700"
              }
            `}
              placeholder="********"
              required
            />

            <div className="h-2">
              {touched.password && errors.password && (
                <p className="text-red-500 text-sm">{errors.password}</p>
              )}
            </div>

            {isValidPassword(password) && validItem}
          </div>

          <div className="relative">
            <label className="block">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => {
                const value = e.target.value;
                setConfirmPassword(value);

                setErrors((prev) => ({
                  ...prev,
                  confirmPassword:
                    value === password ? "" : "Passwords do not match",
                }));
              }}
              onBlur={() =>
                setTouched((prev) => ({
                  ...prev,
                  confirmPassword: true,
                }))
              }
              className={`
              input input-bordered w-full bg-white pl-4
              focus:placeholder-transparent
              focus:outline-none
              ${
                touched.confirmPassword && errors.confirmPassword
                  ? "border-red-500 ring-2 ring-red-600"
                  : "focus:ring-2 focus:ring-green-700"
              }
                }
            `}
              placeholder="********"
              required
            />

            <div className="h-2">
              {touched.confirmPassword && errors.confirmPassword && (
                <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
              )}
            </div>

            {confirmPassword && confirmPassword === password && validItem}
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
            Sign Up
          </button>
        </form>

        <p className="mt-4 text-center text-sm">
          Already have an account?
          <Link
            to="/Login"
            className="text-primary font-medium hover:underline ml-2 "
          >
            Login
          </Link>
        </p>
      </div>

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
