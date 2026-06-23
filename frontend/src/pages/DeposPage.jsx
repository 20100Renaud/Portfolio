import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import SearchableSelect from "../components/SearchableSelect";
import { CATEGORIES } from "../constants/categories";
import { deposConfig } from "../config/deposConfig";
import { getDefaultLifetime } from "../utils/date";
import DeposList from "../components/DeposList";
import FilterBar from "../components/FilterBar";
import useDepos from "../hooks/useDepos";
import useAuth from "../hooks/useAuth";
import Modal from "../components/Modal";
import { apiFetch } from "../api";

export default function DeposPage({ mode }) {
  const [showUndefinedWarning, setShowUndefinedWarning] = useState(false);
  const [date, setDate] = useState(() => new Date().toISOString());
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [description, setDescription] = useState("");
  const [lifetime, setLifetime] = useState("");
  const [cat, setCat] = useState("Undefined");
  const [title, setTitle] = useState("");
  const { isAuthenticated } = useAuth();
  const ignoreScrollRef = useRef(false);
  const [type, setType] = useState("");
  const config = deposConfig[mode];
  const navigate = useNavigate();
  const listRef = useRef(null);

  const {
    filtered,
    refreshDepos,
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
  } = useDepos(mode);

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

    await refreshDepos();
  };

  // Toast on create depo if type = Undefined
  const handleCreateClick = () => {
    if (!cat || cat === "Undefined") {
      setShowUndefinedWarning(true);
      return;
    }

    handleCreateDepo();
  };

  // Date formating
  const formatDate = (date) =>
    new Intl.DateTimeFormat("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
    }).format(new Date(date));

  const isLoggedIn = isAuthenticated;

const toggleFilters = () => {
  setFiltersOpen((prev) => {
    const next = !prev;
    if (next) ignoreScrollRef.current = true;
    return next;
  });
};

const handleScroll = (e) => {
  if (ignoreScrollRef.current) {
    ignoreScrollRef.current = false;
    return;
  }

  if (filtersOpen) {
    setFiltersOpen(false);
  }
};


  return (
    <div className="flex flex-col h-full max-w-3xl mx-auto min-h-0 text-center text-green-900 py-8 px-4">
      {/* HEADER */}
      <div className="shrink-0">
        <h1 className="text-3xl sm:text-5xl font-bold">
          <span className="animate-pulse text-4xl">{config.icon}</span>
          {config.title}
          <span className="animate-pulse text-4xl">{config.icon}</span>
        </h1>

        <p className="text-sm sm:text-lg text-green-800">{config.subtitle}</p>
        <button
          onClick={() => {
            if (!isLoggedIn) {
              navigate("/login");
              return;
            }

            setIsCreateOpen(true);
            setType("OFFER");
            setCat("");
            setTitle("");
            setDescription("");
            setDate(new Date().toISOString());
            setLifetime(getDefaultLifetime());
          }}
          className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-2xl mb-4"
        >
          Buried a deposit
        </button>

        <FilterBar
          mode={mode}
          config={config}
          filterType={filterType}
          setFilterType={setFilterType}
          filterCat={filterCat}
          setFilterCat={setFilterCat}
          filterUser={filterUser}
          setFilterUser={setFilterUser}
          typeOptions={typeOptions}
          categoryOptions={categoryOptions}
          usersOptions={usersOptions}
          resultCount={filtered.length}
          resetFilters={resetFilters}
          displayMode={displayMode}
          setDisplayMode={setDisplayMode}
          radius={radius}
          setRadius={setRadius}
          activeLocation={activeLocation}
          setActiveLocation={setActiveLocation}
          filtersOpen={filtersOpen}
          setFiltersOpen={setFiltersOpen}
          toggleFilters={toggleFilters}
        />
      </div>

      {/* DEPOS LIST */}
      <div className="flex-1 min-h-0 overflow-y-auto">
        <div

          onScroll={handleScroll}
        >
          <DeposList
            deposits={filtered}
            renderItem={(depo) => (
              <Link key={depo.ID_Depo} to={`/depo/${depo.ID_Depo}`}>
                <div className="flex justify-between bg-white rounded-2xl shadow-lg p-4 hover:shadow-xl hover:bg-green-100 transition-all duration-300 mt-4 border border-green-100">
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
                    <span className="text-sm bg-green-100 px-2 py-1 rounded-2xl">
                      {depo.Type_Depo}
                    </span>
                    <span className="text-sm bg-green-100 px-2 py-1 rounded-2xl">
                      {depo.Cat_Depo}
                    </span>
                  </div>
                </div>
              </Link>
            )}
          />
        </div>
      </div>

      {/* Create a new Deposit */}
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
                className="w-full border p-2 rounded-2xl"
              >
                <option value="OFFER">Offer</option>
                <option value="REQUEST">Request</option>
              </select>
            </div>

            {/* CATEGORY */}
            <SearchableSelect
              label="Category"
              value={cat}
              onChange={setCat}
              options={CATEGORIES}
              defaultLabel="Undefined"
            />
          </div>

          {/* TITLE */}
          <div>
            <label className="text-xs text-gray-600">Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Fresh tomatoes available"
              className="border p-2 w-full rounded-2xl"
            />
          </div>

          {/* DESCRIPTION */}
          <div>
            <label className="text-xs text-gray-600">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your offer/request..."
              className="border p-2 w-full rounded-2xl resize-none h-24"
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
              onClick={handleCreateClick}
              disabled={!title || !description}
              className="bg-green-600 text-white px-4 py-2 rounded-2xl disabled:opacity-50"
            >
              Create
            </button>
          </div>
        </div>
      </Modal>

      {/* Warning: Toast on create depo if type = Undefined */}
      <Modal
        open={showUndefinedWarning}
        onClose={() => setShowUndefinedWarning(false)}
      >
        <h3 className="text-lg font-bold mb-2">Category not selected</h3>

        <p className="mb-4">
          Please choose a category before creating your deposit.
        </p>

        <SearchableSelect
          label="Category"
          value={cat}
          onChange={setCat}
          options={CATEGORIES}
          defaultLabel="Undefined"
        />

        <div className="flex justify-end gap-2 mt-6">
          <button
            onClick={() => setShowUndefinedWarning(false)}
            className="px-4 py-2"
          >
            Cancel
          </button>

          <button
            disabled={!cat || cat === "Undefined"}
            onClick={async () => {
              setShowUndefinedWarning(false);
              await handleCreateDepo();
            }}
            className="bg-green-600 text-white px-4 py-2 rounded-2xl disabled:opacity-50"
          >
            Create
          </button>
        </div>
      </Modal>
    </div>
  );
}
