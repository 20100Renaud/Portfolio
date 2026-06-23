import AnimatedFlatLogo from "../components/AnimatedFlatLogo";
import { AuthContext } from "../context/AuthContext";
import { Link, NavLink } from "react-router-dom";
import { User, LogOut } from "lucide-react";
import { useContext } from "react";

const handleLogout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "/";
};

const NavItem = ({ to, end, children, className = "" }) => {
  return (
    <NavLink
      to={to}
      end={end}
      className={`relative inline-block transition-colors duration-300 group pb-1 ${className}`}
    >
      {({ isActive }) => (
        <span
          className={`relative inline-block ${
            isActive ? "text-white font-bold" : "text-white"
          }`}
        >
          {children}
        </span>
      )}
    </NavLink>
  );
};

export default function Navbar() {
  const { isAuthenticated, username, logout } = useContext(AuthContext);
  return (
    <>
      <section className="bg-green-700 w-full text-center">
        <p className="text-xs text-white/60 h-4 sm:hidden ">
          © 2026 ShareUp — Designed by Lyonx.
        </p>
      </section>

      <section className="navbar bg-green-700 shadow-lg px-4 hidden sm:flex fixed top-0 left-0 right-0 z-50 h-16 text-green-900">
        <div className="navbar-start">
          <Link
            to="/"
            className="group btn btn-ghost  hover:bg-transparent hover:shadow-none"
          >
            <AnimatedFlatLogo size={60} />
          </Link>
        </div>

        <div className="navbar-center">
          <ul className="hidden lg:flex px-1 gap-6">
            <li>
              <NavItem to="/" end>
                Home
              </NavItem>
            </li>
            <li>
              <NavItem to="/market" end>
                Explore
              </NavItem>
            </li>
            <li>
              <NavItem to="/faq" end>
                Request
              </NavItem>
            </li>
          </ul>
        </div>

        <div className="navbar-end gap-4">
          {isAuthenticated ? (
            <>
              <div className="flex items-center gap-2">
                <span className="text-white">{username}</span>

                <div className="dropdown dropdown-end">
                  <div
                    tabIndex={0}
                    role="button"
                    className="btn btn-ghost btn-circle avatar"
                  >
                    <div className="w-8 h-8 pt-1 rounded-full bg-green-500 text-white flex items-center justify-center font-bold leading-none text-sm">
                      {username?.charAt(0).toUpperCase()}
                    </div>
                  </div>

                  <ul
                    tabIndex={0}
                    className="mt-3 z-[1] w-56 rounded-box bg-base-100 shadow-xl border border-base-200 p-6 menu menu-sm dropdown-content gap-4"
                  >
                    {/* User info */}
                    <div className="p-4 flex justify-center border rounded-box bg-green-100 select-none">
                      <span className="text-sm">Signed in as {username}</span>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col items-center gap-2">
                      <li>
                        <Link
                          to="/dashboard"
                          className="border border-green-200 flex flex-col items-center justify-center gap-1 rounded-xl hover:bg-green-100 transition p-4 w-24"
                        >
                          <User size={28} />
                          <span className="text-sm font-medium">Dashboard</span>
                        </Link>
                      </li>

                      <li>
                        <button
                          onClick={logout}
                          className="border border-red-200 flex flex-col items-center justify-center gap-1 rounded-xl hover:bg-red-50 transition p-4 text-red-500 w-24"
                        >
                          <LogOut size={28} />
                          Logout
                        </button>
                      </li>
                    </div>
                  </ul>
                </div>
              </div>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="btn bg-gradient-to-tl from-[#f8fbf7] via-[#e6f2ec] to-[#a5d6a7] hover:shadow-lg hidden sm:flex"
              >
                Login
              </Link>
            </>
          )}
        </div>
      </section>
    </>
  );
}
