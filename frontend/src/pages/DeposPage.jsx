import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useMemo, useRef } from "react";
import DashboardDepoCard from "../components/DepoCards/DashboardDepoCard";
import PublicDepoCard from "../components/DepoCards/PublicDepoCard";
import MarketLocationFilter from "../components/MarketLocationFilter";
import ValidationCheck from "../components/ValidationCheck";
import useFilterSummary from "../hooks/useFilterSummary";
import CustomSelect from "../components/CustomSelect";
import CustomButton from "../components/CustomButton";
import ConfirmModal from "../components/ConfirmModal";
import { getDefaultLifetime } from "../utils/date";
import DeposList from "../components/DeposList";
import FilterBar from "../components/FilterBar";
import { useLocation } from "react-router-dom";
import useDepos from "../hooks/useDepos";
import Modal from "../components/Modal";
import useAuth from "../hooks/useAuth";
import { apiFetch } from "../api";
import {
  TYPES_DEPOS,
  deposConfig,
  getCategoryOptions,
} from "../config/deposConfig";
import {
  VALIDATION,
  validateMax,
  validateMin,
  isValidLength,
} from "../config/deposValidation";

export default function DeposPage({ mode }) {
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleteOpen, setDeleteOpen] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [description, setDescription] = useState("");
  const [lifetime, setLifetime] = useState("");
  const [files, setFiles] = useState([]);
  const isDashboard = mode === "dashboard";
  const [title, setTitle] = useState("");
  const { isAuthenticated } = useAuth();
  const [type, setType] = useState("");
  const [cat, setCat] = useState("");
  const config = deposConfig[mode];
  const location = useLocation();
  const navigate = useNavigate();
  const fileInputRef = useRef();
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

  // Remember scroll before changing page
  useEffect(() => {
    const handleScroll = () => {
      sessionStorage.setItem(`scroll-${mode}`, window.scrollY.toString());
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [mode]);

  // Restore the scroll on going back to the previous page
  useEffect(() => {
  const saved = sessionStorage.getItem(`scroll-${mode}`);

  if (!saved) return;

  requestAnimationFrame(() => {
    window.scrollTo({
      top: Number(saved),
      behavior: "instant",
    });

    sessionStorage.removeItem(`scroll-${mode}`);
  });
}, [mode]);

  // Store Images
  const [date, setDate] = useState(() =>
    new Date().toISOString().split("T")[0]
  );

  // Create a new Depo
  const handleCreateDepo = async () => {
  const formData = new FormData();

  formData.append("type", type);
  formData.append("cat", cat);
  formData.append("title", title);
  formData.append("description", description);
  formData.append("date", date);
  formData.append("lifetime", lifetime);

  files.forEach((file) => {
    formData.append("images", file);
  });

  const response = await apiFetch("/depos", {
    method: "POST",
    body: formData,
  });

    if (!response.ok) {
      if (response.status === 400) {
        const data = await response.json();

        setErrors({
          title: data.errors?.title?.[0] ?? "",
          description: data.errors?.description?.[0] ?? "",
        });

        return;
      }

      throw new Error("Failed to create deposit");
    }

    setIsCreateOpen(false);
    setType("");
    setCat("");
    setTitle("");
    setDescription("");
    setLifetime("");
    setFiles([]);
    if (fileInputRef.current) {
  fileInputRef.current.value = "";
}
    setDate(new Date().toISOString());
    setErrors({ title: "", description: "" });

    await refreshDepos();
  };

  // Validation for creating a new depo
  const isFormValid =
    type &&
    cat &&
    isValidLength(title, VALIDATION.depo.title) &&
    isValidLength(description, VALIDATION.depo.description);

  // Delete a depo
  const handleDeleteDepo = async () => {
    if (!deleteTarget) return;

    await apiFetch(`/depos/${deleteTarget.ID_Depo}`, {
      method: "DELETE",
    });

    setDeleteOpen(false);
    setDeleteTarget(null);

    await refreshDepos?.();
  };

  const openDelete = (depo) => {
  setDeleteTarget(depo);
  setDeleteOpen(true);
};

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

  // Define error on typing
  const [errors, setErrors] = useState({
    title: "",
    description: "",
  });

  // Define error out of focus
  const [touched, setTouched] = useState({
    title: false,
    description: false,
  });

  // Navigate to Edit modal from dashboard
  const openEdit = (depo) => {
  navigate(`/depo_details/${depo.ID_Depo}?edit=true`);

};
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
              if (fileInputRef.current) {
                fileInputRef.current.value = "";
}
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
        className={"cursor-pointer",
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
            <div
              onClick={() => navigate(`/depo_details/${depo.ID_Depo}`)}
              className={
                isDashboard
                  ? "flex-1 w-full cursor-pointer"
                  : "flex-1 w-full rounded-2xl cursor-pointer"
              }
            >
              {isDashboard ? (
                <DashboardDepoCard
                  depo={depo}
                  formatDate={formatDate}
                  onEdit={() => navigate(`/depo_details/${depo.ID_Depo}?edit=true`)}
                  onDelete={() => openDelete(depo)}
                />
              ) : (
                <PublicDepoCard
                  depo={depo}
                  formatDate={formatDate}
                  onEdit={() => openEdit(depo)}
                  onDelete={() => openDelete(depo)}
                />
              )}
            </div>
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
          <div className="relative">
            <label className="text-xs ">Title</label>
            <input
              value={title}
              onChange={(e) => {
                const value = e.target.value;
                setTitle(value);

                setErrors((prev) => ({
                  ...prev,
                  title: validateMax(value, VALIDATION.depo.title),
                }));
              }}
              onBlur={() => {
                setTouched((prev) => ({ ...prev, title: true }));

                setErrors((prev) => ({
                  ...prev,
                  title: validateMin(title, VALIDATION.depo.title),
                }));
              }}
              placeholder="Title (25 chars max)"
              className={`border p-2 w-full rounded-2xl shadow outline-none transition
                ${
                  errors.title
                    ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                    : "border-green-300 focus:border-green-700 focus:ring-1 focus:ring-green-700"
                }
              `}
            />

            {!errors.title && isValidLength(title, VALIDATION.depo.title) && (
              <ValidationCheck />
            )}

            {errors.title && (
              <p className="absolute text-xs text-red-600 mt-1 ml-3">
                {errors.title}
              </p>
            )}
          </div>

          {/* DESCRIPTION */}
          <div>
            <label className="text-xs ">Description</label>
            <div className="relative">
              <textarea
                value={description}
                onChange={(e) => {
                  const value = e.target.value;
                  setDescription(value);

                  setErrors((prev) => ({
                    ...prev,
                    description: validateMax(
                      value,
                      VALIDATION.depo.description,
                    ),
                  }));
                }}
                onBlur={() => {
                  setTouched((prev) => ({ ...prev, description: true }));

                  setErrors((prev) => ({
                    ...prev,
                    description: validateMin(
                      description,
                      VALIDATION.depo.description,
                    ),
                  }));
                }}
                placeholder="Description (255 chars max)"
                className={`border p-2 w-full rounded-2xl resize-none h-32 shadow outline-none transition
                  ${
                    errors.description
                      ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                      : "border-green-300 focus:border-green-700 focus:ring-1 focus:ring-green-700"
                  }
                `}
              />
              {!errors.description &&
                isValidLength(description, VALIDATION.depo.description) && (
                  <ValidationCheck />
                )}
              {touched.description && errors.description && (
                <p className="absolute text-xs text-red-600 ml-3">
                  {errors.description}
                </p>
              )}
            </div>
          </div>

          {/* Image */}
          <div className="flex flex-col">
            <div className="space-y-1">
              <label className="text-xs text-green-900">Images</label>

              <label className="block w-full cursor-pointer">
                <div
                  className="border border-green-300 rounded-2xl p-3 bg-white shadow
                    hover:border-green-700 hover:ring-1 hover:ring-green-700
                    transition text-sm text-green-900 text-center"
                >
                  📎 Click to upload files
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => setFiles([...e.target.files])}
                  className="hidden"
                />
              </label>

              {files?.length > 0 && (
                <p className="text-xs text-green-700">
                  {files.length} file{files.length > 1 ? "s" : ""} selected
                </p>
              )}
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


{/* Delete modal */}
      <ConfirmModal
      open={isDeleteOpen}
      title="Delete deposit"
      message={`Are you sure you want to delete "${deleteTarget?.Title_Depo}"?`}
      confirmLabel="Delete"
      onClose={() => setDeleteOpen(false)}
      onConfirm={handleDeleteDepo}
    />
    </div>
  );
}
