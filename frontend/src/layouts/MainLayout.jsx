import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Dock from "../components/Dock";
import { Outlet } from "react-router-dom";
import dessin from "../assets/dessin_jardin.png";

export default function MainLayout() {
  return (
    <div
      className="
        relative flex flex-col h-screen w-full bg-[#e3f1e9]"
    >
      <div className="absolute top-0 left-0 w-full h-[600px] sm:h-[900px] bg-gradient-to-br from-[#a5d6a7] via-[#e6f2ec] to-transparent z-0" />
      <img
        src={dessin}
        alt="Dessin de jardin"
        className="
          fixed top-1/2 left-1/2
          h-[550px] sm:h-[900px]
          w-full max-w-[1900px]
          -translate-x-1/2 -translate-y-1/2
          object-left object-cover
          opacity-70
          pointer-events-none
          z-0"
      />
      <div className="relative flex flex-col min-h-screen">
        <Navbar />

        <main className="flex-1 min-h-0 overflow-hidden sm:pt-16 pb-2">
          <Outlet />
        </main>

        <Footer />
        <Dock />
      </div>
    </div>
  );
}
