import { useEffect, useState, useMemo } from "react";
import { deposConfig } from "../config/deposConfig";
import { isWithinRadius } from "../utils/geo";
import useAuth from "../hooks/useAuth";
import { apiFetch } from "../api";

export default function useDepos(mode) {
  const config = deposConfig[mode];
  const [depos, setDepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, isAuthenticated } = useAuth();
  const [filterType, setFilterType] = useState("");
  const [filterCat, setFilterCat] = useState("");
  const [filterUser, setFilterUser] = useState("");
  const [radius, setRadius] = useState(10);
  const [activeLocation, setActiveLocation] = useState({
    city: "",
    lat: null,
    lng: null,
  });

console.log("useDepos instance", mode);

  useEffect(() => {
    if (!user) return;

    setActiveLocation({
      city: user.City_User,
      lat: user.Latitude_User,
      lng: user.Longitude_User,
    });
  }, [user]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const res = await apiFetch("/depos");
      const data = await res.json();
      setDepos(Array.isArray(data) ? data : []);
      setLoading(false);
    };

    load();
  }, []);

  // Save user data when logged in
  const STORAGE_KEY = `depos_display_mode_${mode}`;

  const [displayMode, setDisplayMode] = useState("all");

  // Auto switch mode
  useEffect(() => {
    if (isAuthenticated && user) {
      setDisplayMode("local");

      setActiveLocation({
        city: user.City_User,
        lat: user.Latitude_User,
        lng: user.Longitude_User,
      });
    } else {
      setDisplayMode("all");

      setActiveLocation({
        city: "",
        lat: null,
        lng: null,
      });
    }
  }, [isAuthenticated, user]);

  // Handle deposit loading and filtering
  const filtered = useMemo(() => {
    return depos.filter((d) => {
      if (!config.allowedTypes.includes(d.Type_Depo)) return false;
      if (filterType && d.Type_Depo !== filterType) return false;
      if (filterCat && d.Cat_Depo !== filterCat) return false;
      if (filterUser && d.User_Depos?.Login_User !== filterUser) return false;
      if (
        mode === "market" &&
        displayMode === "local" &&
        activeLocation?.lat != null &&
        activeLocation?.lng != null
      ) {
        if (!isWithinRadius(activeLocation, d, radius)) {
          return false;
        }
      }
      return true;
    });
  }, [
    depos,
    config,
    filterType,
    filterCat,
    filterUser,
    displayMode,
    activeLocation,
    radius,
    mode,
  ]);

  const typeOptions = Object.entries(
    filtered.reduce((acc, d) => {
      acc[d.Type_Depo] = (acc[d.Type_Depo] || 0) + 1;
      return acc;
    }, {}),
  ).sort();

  const categoryOptions = Object.entries(
    filtered.reduce((acc, d) => {
      if (!d.Cat_Depo) return acc;

      acc[d.Cat_Depo] = (acc[d.Cat_Depo] || 0) + 1;
      return acc;
    }, {}),
  ).sort();

  const usersOptions = Object.entries(
    filtered.reduce((acc, d) => {
      const user = d.User_Depos?.Login_User;

      if (!user) return acc;

      acc[user] = (acc[user] || 0) + 1;
      return acc;
    }, {}),
  ).sort();

  const resetFilters = () => {
    setFilterType("");
    setFilterCat("");
    setFilterUser("");
  };

  useEffect(() => {
    console.log("displayMode changed ->", displayMode);
  }, [displayMode]);
  return {
    depos,
    filtered,
    loading,
    filterType,
    setFilterType,
    filterCat,
    setFilterCat,
    filterUser,
    setFilterUser,
    typeOptions,
    categoryOptions,
    usersOptions,
    displayMode,
    setDisplayMode,
    radius,
    setRadius,
    activeLocation,
    setActiveLocation,
    resetFilters,
  };
}
