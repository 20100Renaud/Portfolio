import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import Faq from "./pages/Faq";
import Market from "./pages/Market";
import DepoDetail from "./pages/DepoDetails";
import ProtectedRoute from "./components/ProtectedRoute";
import AboutModal from "./components/Modals/AboutModal"
import { useAbout } from "./context/AboutContext";
import SettingsModal from "./components/Modals/SettingsModal";
import { useSettings } from "./context/SettingsContext";

function AppContent() {
  const { aboutOpen, closeAbout } = useAbout();
  const { settingsOpen, closeSettings } = useSettings();

  return (
    <>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/market" element={<Market />} />
          <Route path="/faq" element={<Faq />} />
          <Route
            path="/depo_details/:id"
            element={
              <ProtectedRoute>
                <DepoDetail />
              </ProtectedRoute>
            }
          />
        </Route>

        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<NotFound />} />
      </Routes>

      <AboutModal open={aboutOpen} onClose={closeAbout} />
      <SettingsModal open={settingsOpen} onClose={closeSettings} />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
