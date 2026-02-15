import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import logo from "../assets/Logo_512x353.webp";
import AnimatedFlatLogo from "../components/AnimatedFlatLogo";

const NavItem = ({ to, end = false, children, className = "", onClick }) => {
  return (
    <NavLink
        to={to}
        end={end}
        onClick={onClick}
        className={`relative inline-block font-bold transition-colors duration-300 group pb-1 ${className}`}
    >    
        {({ isActive }) => (
            <>
                <span
                    className={`relative z-10 ${
                        isActive ? "text-green-600" : "text-black"
                    }`}
                >
                    {children}
                </span>

                <span
                    className={`absolute left-0 bottom-0 h-0.5 transition-all duration-300 ${
                        isActive
                            ? "w-full bg-green-600"
                            : "w-0 bg-black group-hover:w-full"
                    }`}
                />
            </>
        )}
    </NavLink>
  );
};


export default function Navbar() {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLinkClick = () => setDropdownOpen(false);
  const dropdownLinkClass = "text-lg py-2 px-4";

  return (
    <div className="navbar bg-[#e5f2eb] shadow-lg px-4">
      <div className="navbar-start">
        <button
          className="btn btn-ghost lg:hidden text-black"
          onClick={() => setDropdownOpen(!dropdownOpen)}
        >
          {dropdownOpen ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 transition-transform duration-200"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 transition-transform duration-200"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          )}
        </button>
        
        <Link
          to="/"
          className="group btn btn-ghost hidden lg:flex hover:bg-transparent hover:shadow-none"
        >
              <AnimatedFlatLogo size={70} />
        </Link>

      </div>

      <div className="navbar-center">

        <Link
          to="/"
          onClick={handleLinkClick}
          className="btn btn-ghost lg:hidden hover:bg-transparent hover:shadow-none"
        >
          <img
            src={logo}
            alt="logo"
            className="h-10 w-auto "
          />
        </Link>

        <ul className="hidden lg:flex px-1 gap-6">
          <li>
            <NavItem to="/" end>Home</NavItem>
          </li>
          <li>
            <NavItem to="/about">About</NavItem>
          </li>
          <li>
            <NavItem to="/CGU">CGU</NavItem>
          </li>
        </ul>
      </div>

      <div className="navbar-end">
        <Link
          to="/Login"
          onClick={handleLinkClick}
          className="text-black btn bg-gradient-to-tl from-[#f8fbf7] via-[#e6f2ec] to-[#a5d6a7] hover:shadow-lg"
        >
          Login
        </Link>
      </div>

        {dropdownOpen && (
            <ul className="menu menu-sm absolute top-16 left-4 right-4 bg-base-100 rounded-box shadow p-2 z-20 lg:hidden">
            <li>
                <NavItem to="/" onClick={handleLinkClick} className={dropdownLinkClass}>
                Home
                </NavItem>
            </li>
            <li>
                <NavItem to="/about" onClick={handleLinkClick} className={dropdownLinkClass}>
                About
                </NavItem>
            </li>
            <li>
                <NavItem to="/CGU" onClick={handleLinkClick} className={dropdownLinkClass}>
                CGU
                </NavItem>
            </li>
            </ul>
        )}
    </div>
  );
}
