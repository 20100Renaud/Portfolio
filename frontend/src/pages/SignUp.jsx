import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import CustomButton from "../components/CustomButton";
import CitySelect from "../components/CitySelect";
import InputField from "../components/InputField";
import { useAuth } from "../context/useAuth";

export default function SignUp() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [city_user, setCity] = useState("");
  const [latitude_user, setLatitude] = useState(null);
  const [longitude_user, setLongitude] = useState(null);
  const [cityTouched, setCityTouched] = useState(false);

  // Show validation
  const citySelected = latitude_user != null && longitude_user != null;

  // Show warning
  const showCityWarning =
    cityTouched && city_user.trim() !== "" && !citySelected;

  // Initialize error
  const [errors, setErrors] = useState({
    username: "",
    city_user: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // Validation for the form
  const [touched, setTouched] = useState({
    username: false,
    city_user: false,
    email: false,
    password: false,
    confirmPassword: false,
  });

  // Validation criteria
  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isValidPassword = (password) => password.length >= 4;
  const isValidUsername = (username) => username.length >= 4;
  const isValidCity_user = () =>
    city_user.length >= 2 && latitude_user !== null && longitude_user !== null;

  // Disable the create btn until:
  const isFormValid =
    isValidUsername(username) &&
    isValidCity_user() &&
    isValidEmail(email) &&
    isValidPassword(password) &&
    password === confirmPassword;

  // Loading toast
  const [toast, setToast] = useState(null);
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Check if the form is correct before creating
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid) return;

    try {
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
          {/* UserName field */}
          <InputField
            label="Username"
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
            onBlur={() =>
              setTouched((prev) => ({
                ...prev,
                username: true,
              }))
            }
            placeholder="Username"
            error={errors.username}
            touched={touched.username}
            showValid={isValidUsername(username)}
            required
          />

          {/* City field */}
          <div className="relative">
            <CitySelect
              label="City"
              value={city_user}
              showValid={citySelected}
              isValid={citySelected}
              showWarning={showCityWarning}
              onChange={(city) => {
                setCity(city);
                setLatitude(null);
                setLongitude(null);
              }}
              onSelect={({ city, lat, lng }) => {
                setCity(city);
                setLatitude(lat);
                setLongitude(lng);
              }}
            />
          </div>

          {/* Email field */}
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
            showValid={isValidEmail(email)}
            required
          />

          {/* Password field */}
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
            showValid={isValidPassword(password)}
            required
          />

          {/* Check password field */}
          <InputField
            label="Confirm Password"
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
            placeholder="********"
            error={errors.confirmPassword}
            touched={touched.confirmPassword}
            showValid={confirmPassword && confirmPassword === password}
            required
          />

          {/* SignUp Btn */}
          <CustomButton
            type="submit"
            disabled={!isFormValid}
            className="flex justify-center w-full"
          >
            Sign Up
          </CustomButton>
        </form>

        {/* Login page link Btn */}
        <div className="mt-4 flex items-center justify-center gap-2 text-sm">
          <span>Already have an account?</span>

          <Link
            to="/Login"
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
            Login
          </Link>
        </div>
      </div>

      {/* <div className="flex justify-around w-full"> */}

      {/* <RotateCcw className="w-3 h-3" /> */}

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
