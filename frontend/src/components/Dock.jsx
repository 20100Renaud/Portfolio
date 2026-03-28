import { NavLink } from "react-router-dom";
import { Home, Store, LogIn, LayoutDashboard, MessageSquareText } from "lucide-react";
import { useAuth } from "../context/useAuth";


const dockLinkBase = "flex flex-col items-center justify-center h-full relative overflow-hidden transition-all duration-300 ease-in-out";

const itemActive = "border-t-2 border-t-green-600 border-x border-x-green-600/60 rounded-b-none rounded-t-xl bg-[#e3f1e9] transform translate-y-1";
const itemInactive = "border-x border-green-600/40 border-t rounded-b-sm bg-gradient-to-b from-[#a5d6a7] to-[#e3f1e9] transform translate-y-3";

export default function Dock() {
  const { isAuthenticated } = useAuth();


  const dockLinks = [
    { to: "/", label: "Home", icon: Home, end: true },
    { to: "/market", label: "Market", icon: Store },
    { to: "/faq", label: "FAQ", icon: MessageSquareText },
  ];
  return (
    <footer className="h-16 fixed bottom-0 left-0 right-0 z-50 sm:hidden">
      <div className="absolute inset-0 bg-[#e1efe7] z-0 mt-6 mx-4" />

      <div className="relative dock flex items-center justify-around z-10 bg-transparent">
        {dockLinks.map(({ to, label, icon, end }) => {
          const Icon = icon;
          return (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `${dockLinkBase} ${isActive ? itemActive : itemInactive}`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon size={20} strokeWidth={isActive ? 1.5 : 1} />
                  <span className={`dock-label ${isActive ? "font-bold" : ""}`}>{label}</span>
                </>
              )}
            </NavLink>
          );
        })}
        {isAuthenticated
          ? (
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `${dockLinkBase} ${isActive ? itemActive : itemInactive}`}>
              {({ isActive }) => (
                <>
                  <LayoutDashboard size={20} strokeWidth={isActive ? 1.5 : 1} />
                  <span className={`dock-label ${isActive ? "font-bold" : ""}`}>
                    Dashboard
                  </span>
                </>
              )}
            </NavLink>
          ) : (
            <NavLink
              to="/login"
              className={({ isActive }) =>
                `${dockLinkBase} ${isActive ? itemActive : itemInactive}`}>
              {({ isActive }) => (
                <>
                  <LogIn size={20} strokeWidth={isActive ? 1.5 : 1} />
                  <span className={`dock-label ${isActive ? "font-bold" : ""}`}>
                    Login
                  </span>
                </>
              )}
            </NavLink>
          )}
      </div>

    </footer>
  );
}
