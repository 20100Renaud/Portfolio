import { Link, NavLink } from "react-router-dom";
import AnimatedFlatLogo from "../components/AnimatedFlatLogo";

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

        <div className="navbar-end">
          <Link
            to="/Login"
            className="text-black btn bg-gradient-to-tl from-[#f8fbf7] via-[#e6f2ec] to-[#a5d6a7] hover:shadow-lg hidden sm:flex"
          >
            Login
          </Link>

          <button
            onClick={handleLogout}
            className="text-sm font-bold text-black btn bg-gradient-to-tl from-[#f8fbf7] via-[#e6f2ec] to-[#a5d6a7] hover:shadow-lg hidden sm:flex mx-6 px-4"
          >
            Logout
          </button>
        </div>
      </section>
    </>
  );
}
