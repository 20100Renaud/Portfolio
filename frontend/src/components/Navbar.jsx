import { Link, NavLink, useNavigate } from "react-router-dom";
import { User, LogOut } from "lucide-react";
import AnimatedFlatLogo from "../components/AnimatedFlatLogo";
import UserMenu from "../components/UserMenu";
import { useAuth } from "../context/useAuth";
import CustomButton from "../components/CustomButton";


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
            isActive ? "text-white font-bold underline" : "text-white"
          }`}
        >
          {children}
        </span>
      )}
    </NavLink>
  );
};

export default function Navbar() {
  const { isAuthenticated, username, logout } = useAuth();
  const navigate = useNavigate();

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
                Forum
              </NavItem>
            </li>
          </ul>
        </div>

        <div className="navbar-end gap-4">
          {isAuthenticated ? (
            <UserMenu username={username} onLogout={() => navigate("/login")} />
          ) : (
            <CustomButton onClick={() => navigate("/login")}>
              Login
            </CustomButton>
          )}
        </div>
      </section>
    </>
  );
}
