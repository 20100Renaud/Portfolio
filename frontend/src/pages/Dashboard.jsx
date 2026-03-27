import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

export default function Dashboard() {
  const navigate = useNavigate();
  const { username, logout, token } = useAuth();

  useEffect(() => {
    const fetchProtectedData = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const res = await fetch("/api/auth/protected-data", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (!res.ok) {
          navigate("/login");
          return;
        }

        const data = await res.json();
        console.log(data);

      } catch (err) {
        console.error(err);
        navigate("/login");
      }
    };

    fetchProtectedData();
  }, [navigate, token]);

  return (
    <div className="relative text-center text-green-900 overflow-hidden justify-center my-10 mx-auto">
      <h1 className="text-3xl sm:text-5xl font-bold">Welcome {username} </h1>
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