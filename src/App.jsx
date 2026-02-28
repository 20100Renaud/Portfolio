import { BrowserRouter, Routes, Route } from "react-router-dom"
import MainLayout from "./layouts/MainLayout"
import Home from "./pages/Home"
import About from "./pages/About"
import Concept from "./pages/Concept"
import Login from "./pages/Login"
import SignUp from "./pages/SignUp"
import NotFound from "./pages/NotFound"

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<MainLayout />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/concept" element={<Concept />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<SignUp />} />
                </Route>
                <Route path="*" element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    )
}
