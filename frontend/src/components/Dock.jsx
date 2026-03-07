import { NavLink } from "react-router-dom";
import { Home, Store, LogIn, MessageSquareText} from "lucide-react";


export default function Dock() {

  return (

    <footer className="fixed bottom-0 left-0 right-0 z-40 bg-base-200">
      <div className="dock h-16 sm:hidden border-t border-green-700 border-opacity-70">

        <NavLink to="/" end className={({ isActive }) => `flex flex-col items-center justify-center h-full  ${isActive ? " border-b-2 border-green-600" : ""}`}>
          <Home size={20} strokeWidth={1.5} />
          <span className="dock-label">Home</span>
        </NavLink>

        <NavLink to="/market" className={({ isActive }) => `flex flex-col items-center justify-center h-full ${isActive ? "border-b-2 border-green-600" : ""}`}>
          <Store size={20} strokeWidth={1.5} />
          <span className="dock-label">Market</span>
        </NavLink>

        <NavLink to="/faq" className={({ isActive }) => `flex flex-col items-center justify-center h-full ${isActive ? "border-b-2 border-green-600" : ""}`}>
          <MessageSquareText size={20} strokeWidth={1.5} />
          <span className="dock-label">FAQ</span>
        </NavLink>

        <NavLink to="/login" className={({ isActive }) => `flex flex-col items-center justify-center h-full ${isActive ? "border-b-2 border-green-600" : ""}`}>
          <LogIn size={20} strokeWidth={1.5} />
          <span className="dock-label">Login</span>
        </NavLink>
      </div>
    </footer >
  )
}
