import { useState } from "react";
import { User, LogOut, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

export default function UserMenu({ username, onLogout }) {
  const [open, setOpen] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    onLogout?.();
  };

  const handleDashboard = () => {
  setOpen(false);

  setTimeout(() => {
    navigate("/dashboard");
  }, 250);
};

  return (
    <div className="flex items-center bg-white/10 backdrop-blur-md rounded-full">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 rounded-full px-2 py-1"
      >
        <div className="w-9 h-9 rounded-full bg-green-500 text-white flex items-center justify-center font-bold">
          {username?.charAt(0).toUpperCase()}
        </div>

        <span className="font-medium leading-none text-white">{username}</span>
      </button>

      <ChevronRight size={18} className="text-white/70" />

      <div
        className={`flex items-center overflow-hidden transition-all duration-300 ${
          open ? "max-w-56 opacity-100 mr-3" : "max-w-0 opacity-0 mr-0"
        }`}
      >
        <button
          onClick={handleDashboard}
          className="flex items-center gap-2 px-3 py-1 hover:bg-white/10 rounded-md text-white whitespace-nowrap"
        >
          <User size={18} />
          Dashboard
        </button>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-3 py-1 hover:bg-white/10 text-white rounded-md whitespace-nowrap"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </div>
  );
}
