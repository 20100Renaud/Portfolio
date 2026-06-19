import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Modal from "../components/Modal";
import { apiFetch } from "../api";
import { getDefaultLifetime } from "../utils/date";
import { isWithinRadius } from "../utils/geo";
import FilterBar from "../components/FilterBar";

export default function Market() {
  const [depos, setDepos] = useState([]);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [type, setType] = useState("");
  const [cat, setCat] = useState("Undefined");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [lifetime, setLifetime] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString());
  const [filterType, setFilterType] = useState("");
  const [filterCat, setFilterCat] = useState("");
  const [radius, setRadius] = useState(10);
  const [user, setUser] = useState(null);
  const [locationMode, setLocationMode] = useState("home");
  const [displayMode, setDisplayMode] = useState("local");
  const isLoggedIn = !!user?.userId;
  const [activeLocation, setActiveLocation] = useState({
    city: "",
    lat: null,
    lng: null,
  });

  // Load all the Depos
  const loadDepos = async () => {
    const response = await apiFetch("/depos");
    const data = await response.json();

    setDepos(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    loadDepos();
  }, []);

  // Create a new Depo
  const handleCreateDepo = async () => {
    await apiFetch("/depos", {
      method: "POST",
      body: JSON.stringify({
        type,
        cat,
        title,
        description,
        date,
        lifetime,
      }),
    });

    setIsCreateOpen(false);
    setType("");
    setCat("");
    setTitle("");
    setDescription("");
    setLifetime("");

    await loadDepos();
  };

  // Date formating
  const formatDate = (date) =>
    new Intl.DateTimeFormat("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
    }).format(new Date(date));

  // Coordinates to use
  const coordsToUse =
    locationMode === "home" && user
      ? {
          lat: user.Latitude_User,
          lng: user.Longitude_User,
        }
      : {
          lat: activeLocation.lat,
          lng: activeLocation.lng,
        };


  // Filter logic
  const filteredDepos = depos.filter((d) => {
    if (filterType && d.Type_Depo !== filterType) return false;
    if (filterCat && d.Cat_Depo !== filterCat) return false;
    if (displayMode === "all") return true;
    if (!coordsToUse?.lat || !coordsToUse?.lng) return true;

    return isWithinRadius(coordsToUse, d, radius);
  });

  // Fetch user on load
  useEffect(() => {
    const loadUser = async () => {
      const res = await apiFetch("/auth/me");
      if (!res.ok) return;

      const data = await res.json();

      setUser(data);
      setActiveLocation({
        city: data.City_User,
        lat: data.Latitude_User,
        lng: data.Longitude_User,
      });
      setLocationMode("home");
      setDisplayMode("local");
    };

    loadUser();
  }, []);

  // Display categories only used
  const categories = [
    ...new Set(depos.map((d) => d.Cat_Depo).filter(Boolean)),
  ].sort();

  return (
    <div className="relative text-center text-green-900 overflow-hidden justify-center my-10 mx-auto px-4">
      <h1 className="text-3xl sm:text-5xl font-bold">Welcome to the market</h1>
      <p className="text-sm sm:text-lg text-green-800">
        Here we can share what we have or need.
      </p>

      <button
        onClick={() => {
          setIsCreateOpen(true);
          setType("OFFER");
          setCat("Undefined");
          setTitle("");
          setDescription("");
          setDate(new Date().toISOString());
          setLifetime(getDefaultLifetime());
        }}
        className="bg-green-600 text-white px-4 py-2 rounded my-4"
      >
        Create a deposit
      </button>

      <FilterBar
        filterType={filterType}
        setFilterType={setFilterType}
        filterCat={filterCat}
        setFilterCat={setFilterCat}
        radius={radius}
        setRadius={setRadius}
        categories={categories}
        isLoggedIn={isLoggedIn}
        locationMode={locationMode}
        setLocationMode={setLocationMode}
        displayMode={displayMode}
        setDisplayMode={setDisplayMode}
        activeLocation={activeLocation}
        setActiveLocation={setActiveLocation}
        user={user}
      />

      {filteredDepos.map((depo) => {
        return (
          <Link key={depo.ID_Depo} to={`/depo/${depo.ID_Depo}`}>
            <div className="flex justify-between max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-4 hover:shadow-xl transition-all duration-300 m-4 border border-green-100">
              <div className="flex flex-col text-left">
                <p className="text-green-700 flex items-center gap-2">
                  <span className="text-green-900">
                    {depo.User_Depos?.Login_User}
                    {" - "}
                  </span>
                  <span className="text-green-900">
                    {depo.User_Depos?.City_User}
                    {" - "}
                  </span>
                  <span className="text-xs text-green-700">
                    {formatDate(depo.Date_Depo)}
                  </span>
                </p>
                <h3 className="text-xl font-semibold text-green-900">
                  {depo.Title_Depo}
                </h3>
              </div>

              <div className="flex flex-col gap-2">
                <span className="text-sm bg-green-100 px-2 py-1 rounded">
                  {depo.Type_Depo}
                </span>
                <span className="text-sm bg-green-100 px-2 py-1 rounded">
                  {depo.Cat_Depo}
                </span>
              </div>
            </div>
          </Link>
        );
      })}

      <Modal open={isCreateOpen} onClose={() => setIsCreateOpen(false)}>
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-green-900">
            Create a new Deposit
          </h2>

          <p className="text-sm text-gray-500">
            Deposits last 1 month by default, you can change it later.
          </p>

          <div className="flex">
            {/* TYPE */}
            <div>
              <label className="text-xs text-gray-600">Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full border p-2 rounded"
              >
                <option value="OFFER">Offer</option>
                <option value="REQUEST">Request</option>
              </select>
            </div>

            {/* CATEGORY */}
            <div>
              <label className="text-xs text-gray-600">Category</label>
              <select
                value={cat}
                onChange={(e) => setCat(e.target.value)}
                className="w-full border p-2 rounded"
              >
                <option value="Undefined">Undefined</option>
                <option value="Vegetables">Vegetables</option>
                <option value="Plants">Plants</option>
                <option value="Organic matter">Organic matter</option>
                <option value="Tools">Tools</option>
                <option value="Services">Services</option>
              </select>
            </div>
          </div>

          {/* TITLE */}
          <div>
            <label className="text-xs text-gray-600">Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Fresh tomatoes available"
              className="border p-2 w-full rounded"
            />
          </div>

          {/* DESCRIPTION */}
          <div>
            <label className="text-xs text-gray-600">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your offer/request..."
              className="border p-2 w-full rounded resize-none h-24"
            />
          </div>

          {/* BUTTONS */}
          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={() => setIsCreateOpen(false)}
              className="px-4 py-2 text-gray-600"
            >
              Cancel
            </button>

            <button
              onClick={handleCreateDepo}
              disabled={!title || !description}
              className="bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50"
            >
              Create
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
