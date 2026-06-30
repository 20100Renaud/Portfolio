import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import DashboardDepoCard from "../components/DepoCards/DashboardDepoCard";
import PublicDepoCard from "../components/DepoCards/PublicDepoCard";
import MarketLocationFilter from "../components/MarketLocationFilter";
import ValidationCheck from "../components/ValidationCheck";
import useFilterSummary from "../hooks/useFilterSummary";
import CustomSelect from "../components/CustomSelect";
import CustomButton from "../components/CustomButton";
import { getDefaultLifetime } from "../utils/date";
import DeposList from "../components/DeposList";
import FilterBar from "../components/FilterBar";
import useDepos from "../hooks/useDepos";
import Modal from "../components/Modal";
import useAuth from "../hooks/useAuth";
import { apiFetch } from "../api";
import {
  TYPES_DEPOS,
  deposConfig,
  getCategoryOptions,
} from "../config/deposConfig";

export default function DeposPage({ mode }) {
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [date, setDate] = useState(() => new Date().toISOString());
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [description, setDescription] = useState("");
  const [lifetime, setLifetime] = useState("");
  const isDashboard = mode === "dashboard";
  const [title, setTitle] = useState("");
  const { isAuthenticated } = useAuth();
  const [type, setType] = useState("");
  const [cat, setCat] = useState("");
  const config = deposConfig[mode];
  const navigate = useNavigate();
  const { user } = useAuth();

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
    resetCity,
    cityIsSelected,
  } = useDepos(mode);

  const { summary, filtersText } = useFilterSummary({
    mode,
    filterType,
    filterCat,
    filterUser,
    typeOptions,
    categoryOptions,
    usersOptions,
    displayMode,
    activeLocation,
    radius,
    label: config.label,
    resultCount: filtered.length,
  });

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

  // Validation for creating a new depo
  const isFormValid = type && cat && title.trim() && description.trim();

  // Manage allowed type options
  const allowedTypeOptions = useMemo(() => {
    return TYPES_DEPOS.filter((t) => config.allowedTypes.includes(t.value));
  }, [config.allowedTypes]);

  // Reset Category when Type changes
  useEffect(() => {
    setCat("");
  }, [type]);

  // Date formating
  const formatDate = (date) =>
    new Intl.DateTimeFormat("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
    }).format(new Date(date));

  const isLoggedIn = isAuthenticated;

  // Manage ALL/Local in filter
  const openFilters = () => setIsFilterModalOpen(true);

  // Manage page title and sub if admin
  const pageTitle =
    mode === "dashboard" && user?.role === "ADMIN"
      ? "Depos Management"
      : config.title;

  const pageSubtitle =
    mode === "dashboard" && user?.role === "ADMIN"
      ? "Manage all deposits"
      : config.subtitle;

  return (
    <div className="flex flex-col h-full max-w-3xl mx-auto min-h-0 text-center text-green-900 py-8 px-4">
      {/* HEADER */}
      <div className="shrink-0">
        <h1 className="text-3xl sm:text-5xl font-bold">
          <span className="animate-pulse text-4xl">{config.icon}</span>
          {pageTitle}
          <span className="animate-pulse text-4xl">{config.icon}</span>
        </h1>

        <p className="text-sm sm:text-lg">{pageSubtitle}</p>

        <div className="flex justify-center gap-3 m-4">
          {/* Create a depo btn */}
          <CustomButton
            onClick={() => {
              if (!isLoggedIn) {
                navigate("/login");
                return;
              }

              setIsCreateOpen(true);
              setType("");
              setCat("");
              setTitle("");
              setDescription("");
              setDate(new Date().toISOString());
              setLifetime(getDefaultLifetime());
            }}
          >
            {config.createButtonLabel}
          </CustomButton>
        </div>

        {/* FILTER BAR AND MODAL CONFIG */}
        {config.showFilters && (
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
            toggleFilters={openFilters}
            summary={summary}
            filtersText={filtersText}
          />
        )}
      </div>

      {/* DEPOS LIST */}
      <div
        className={
          isDashboard
            ? "flex-col sm:flex-1 min-h-0 px-3 sm:px-6 "
            : "flex-1 min-h-0 m-2 sm:mx-6"
        }
      >
        <DeposList
          layout={isDashboard ? "Dashboard_table" : "No_dashboard_list"}
          deposits={filtered}
        >
          {(depo) => (
            <Link
              to={`/depo/${depo.ID_Depo}`}
              className={
                isDashboard
                  ? "flex-1 w-full"
                  : "flex-1 w-full rounded-2xl bg-white"
              }
            >
              {isDashboard ? (
                <DashboardDepoCard
                  depo={depo}
                  formatDate={formatDate}
                  onEdit={() => openEdit(depo)}
                  onDelete={() => deleteDepo(depo.ID_Depo)}
                />
              ) : (
                <PublicDepoCard depo={depo} formatDate={formatDate} />
              )}
            </Link>
          )}
        </DeposList>
      </div>

      {/* Create a new Deposit modal*/}
      <Modal open={isCreateOpen} onClose={() => setIsCreateOpen(false)}>
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Create a new Deposit</h2>

          <p className="text-sm ">
            Deposits last 1 month by default, you can change it later.
          </p>

          <div className="flex gap-4">
            {/* TYPE */}
            <div className="relative flex-1">
              <CustomSelect
                label="Type"
                value={type}
                onChange={setType}
                options={allowedTypeOptions}
              />

              {type && <ValidationCheck />}
            </div>

            {/* CATEGORY */}
            <div className="relative flex-1">
              <CustomSelect
                label="Category"
                value={cat}
                onChange={setCat}
                options={getCategoryOptions(type)}
                disabled={!type}
                defaultLabel={type ? "Select..." : "Select a type first"}
              />

              {cat && <ValidationCheck />}
            </div>
          </div>

          {/* TITLE */}
          <div>
            <label className="text-xs ">Title</label>
            <div className="relative">
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Title: "
                className="border border-green-300 p-2 w-full rounded-2xl shadow outline-none focus:placeholder-transparent focus:border-green-700 focus:ring-1 focus:ring-green-700"
              />
              {title.trim() && <ValidationCheck />}
            </div>
          </div>

          {/* DESCRIPTION */}
          <div>
            <label className="text-xs ">Description</label>
            <div className="relative">
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your offer/request..."
                className="border border-green-300 p-2 w-full rounded-2xl resize-none h-24 shadow outline-none focus:placeholder-transparent focus:border-green-700 focus:ring-1 focus:ring-green-700"
              />
              {description.trim() && <ValidationCheck />}
            </div>
          </div>

          {/* BUTTONS */}
          <div className="flex justify-end gap-2 pt-2">
            <CustomButton
              variant="big_white"
              onClick={() => setIsCreateOpen(false)}
            >
              Cancel
            </CustomButton>

            <CustomButton
              variant="big_green"
              onClick={handleCreateDepo}
              disabled={!isFormValid}
            >
              Create
            </CustomButton>
          </div>
        </div>
      </Modal>

      {/* Filter modal */}
      {config.showFilters && (
        <Modal
          open={isFilterModalOpen}
          onClose={() => setIsFilterModalOpen(false)}
        >
          <div className="space-y-6 w-full">
            <div className="text-center">
              <h2 className="text-2xl font-bold">Filters</h2>

              <p className="text-sm text-green-700 mt-1 ">{summary}</p>
            </div>

            {/* Type filter */}
            <div className="grid grid-cols-1 gap-2">
              {config.filters.type && (
                <CustomSelect
                  value={filterType}
                  onChange={setFilterType}
                  options={typeOptions}
                  defaultLabel="Type"
                  defaultValue=""
                  showCount
                  showValid={filterType !== ""}
                />
              )}

              {/* Cat filter */}
              {config.filters.category && (
                <CustomSelect
                  value={filterCat}
                  onChange={setFilterCat}
                  options={categoryOptions}
                  defaultLabel="Category"
                  defaultValue=""
                  showCount
                  showValid={filterCat !== ""}
                />
              )}

              {/* User filter */}
              {config.filters.user && (
                <CustomSelect
                  value={filterUser}
                  onChange={setFilterUser}
                  options={usersOptions}
                  defaultLabel="Owner"
                  defaultValue=""
                  showCount
                  showValid={filterUser !== ""}
                />
              )}
            </div>

            {/* City search + Radius bar */}
            {config.filters.radius && (
              <MarketLocationFilter
                displayMode={displayMode}
                setDisplayMode={setDisplayMode}
                radius={radius}
                setRadius={setRadius}
                activeLocation={activeLocation}
                setActiveLocation={setActiveLocation}
                resetCity={resetCity}
                cityIsSelected={cityIsSelected}
              />
            )}

            {/* Buttons*/}
            <div className="flex justify-end gap-3">
              <CustomButton
                variant="big_white"
                onClick={() => {
                  resetFilters();
                }}
              >
                Reset
              </CustomButton>

              <CustomButton
                variant="big_green"
                onClick={() => setIsFilterModalOpen(false)}
              >
                Done
              </CustomButton>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
