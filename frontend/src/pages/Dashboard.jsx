import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

export default function Dashboard() {
  const navigate = useNavigate();
  const { username, logout, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    const fetchProtectedData = async () => {
      try {
        const res = await fetch("/api/auth/protected-data", {
          credentials: "include",
        });

        if (!res.ok) {
          navigate("/login");
        }

        const data = await res.json();
        console.log(data);
      } catch (err) {
        console.error(err);
        navigate("/login");
      }
    };

    fetchProtectedData();
  }, [isAuthenticated, navigate]);

  return (
    <div className="relative text-center text-green-900 overflow-hidden justify-center my-10 mx-auto">
      <h1 className="text-3xl sm:text-5xl font-bold">Welcome {username.username} </h1>
      <p className="text-sm sm:text-lg text-green-800">
        Here we can find our field.
        <button
          onClick={() => {
            logout();
            navigate("/login");
          }}
          className="mt-6 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
        >
          Logout
        </button>
      </p>
    </div>
  );
}