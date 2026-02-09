import { useState } from "react";
import { Link } from "react-router-dom"
import logo from "../assets/Logo.webp"

export default function Navbar() {
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const handleLinkClick = () => {
    setDropdownOpen(false);
    };

    const dropdownLinkClass =
    "text-lg py-2 px-4";

    return (
        <div className="navbar bg-base-100 shadow-sm px-4">
            <div className="navbar-start">
                <button
                    className="btn btn-ghost lg:hidden"
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


                <a 
                    href="/"
                    className="
                        btn btn-ghost hidden lg:flex
                        hover:bg-transparent 
                        hover:shadow-none
                    ">
                    <img
                        src={logo}
                        alt="logo"
                        className="h-10 w-auto transition-transform duration-200 hover:scale-110"
                    />
                </a>
            </div>

                <div className="navbar-center">

                    <a 
                        href="/"
                        onClick={handleLinkClick} 
                        className="
                            btn btn-ghost lg:hidden 
                            hover:bg-transparent
                            hover:shadow-none
                        "
                    >
                        <img
                            src={logo}
                            alt="logo"
                            className="h-10 w-auto transition-transform duration-200 hover:scale-110"
                        />
                    </a>

                    <ul className="menu menu-horizontal hidden lg:flex px-1">
                    <li>
                        <Link to="/">Home</Link>
                    </li>
                    <li>
                        <Link to="/about">About</Link>
                    </li>
                    <li>
                        <Link to="/projects">CGU</Link>
                    </li>
                    </ul>
                </div>

                <div className="navbar-end">
                    <Link to="/Login" onClick={handleLinkClick} className="btn bg-gradient-to-tl from-[#f8fbf7] via-[#e6f2ec] to-[#a5d6a7]">
                    Login
                    </Link>
                </div>
                {dropdownOpen && (
                    <ul className="menu menu-sm absolute top-16 left-4 right-4 bg-base-100 rounded-box shadow p-2 z-20 lg:hidden">
                        <li>
                            <Link to="/" onClick={handleLinkClick} className={dropdownLinkClass}>Home</Link>
                        </li>
                        <li>
                            <Link to="/about" onClick={handleLinkClick} className={dropdownLinkClass}>About</Link>
                        </li>
                        <li>
                            <Link to="/projects" onClick={handleLinkClick} className={dropdownLinkClass}>Projects</Link>
                        </li>
                    </ul>
                )}
        </div>
    );
}
