import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import { Outlet } from "react-router-dom"

export default function MainLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-tl from-[#f8fbf7] via-[#e6f2ec] to-[#a5d6a7]">
        <Navbar />
            <main className="flex flex flex-grow m-[5%]">
                <Outlet />
            </main>
        <Footer />
    </div>
  )
}
