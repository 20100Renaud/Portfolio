import { Link, NavLink } from "react-router-dom";
import AnimatedFlatLogo from "../components/AnimatedFlatLogo";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

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
          className={`relative inline-block ${isActive
            ? "text-white font-bold"
            : "text-white"
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

      <section className="navbar bg-green-700 shadow-lg px-4 hidden sm:flex fixed top-0 left-0 right-0 z-50 h-16">
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
              <NavItem to="/" end>Home</NavItem>
            </li>
            <li>
              <NavItem to="/market" end>Market</NavItem>
            </li>
            <li>
              <NavItem to="/faq" end>Faq</NavItem>
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
                    <div className="w-8 rounded-full bg-green-500 text-white flex items-center justify-center font-bold">
                      {username?.charAt(0).toUpperCase()}
                    </div>
                  </div>

                  <ul
                    tabIndex={0}
                    className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52"
                  >
                    <li className="px-2 py-1 text-gray-500 text-sm">
                      Signed in as <br />
                      <span className="font-semibold text-black">
                        {username}
                      </span>
                    </li>

                    <div className="divider my-1"></div>

                    <li>
                      <button onClick={logout}>Logout</button>
                    </li>
                  </ul>
                </div>
              </div>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-black btn bg-gradient-to-tl from-[#f8fbf7] via-[#e6f2ec] to-[#a5d6a7] hover:shadow-lg hidden sm:flex"
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
