import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import { Outlet } from "react-router-dom"
import dessin from "../assets/dessin_jardin.png";


export default function MainLayout() {
  return (
    <div
      // style={{ backgroundImage: `url(${dessin})` }}
      className="
        relative flex flex-col min-h-screen
        overflow-hidden w-full
        bg-gradient-to-tl from-[#f8fbf7] via-[#e6f2ec] to-[#a5d6a7]"
    >
      <img
        src={dessin}
        alt="Dessin de jardin"
        className="
          absolute top-1/2 left-1/2
          h-[900px] sm:h-[900px]
          w-full max-w-[1900px]
          -translate-x-1/2 -translate-y-1/2
          object-left object-cover
          opacity-70
          pointer-events-none
          z-0"
      />
      <div className="relative z-10 flex flex-col min-h-screen pt-16 pb-16">
        <Navbar />
        <main className="flex flex-grow mt-6">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  )
}
