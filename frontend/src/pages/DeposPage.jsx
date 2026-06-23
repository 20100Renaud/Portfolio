import { deposConfig } from "../config/deposConfig";
import DeposList from "../components/DeposList";
import FilterBar from "../components/FilterBar";
import useDepos from "../hooks/useDepos";
import { Link } from "react-router-dom";


export default function DeposPage({ mode }) {
  const config = deposConfig[mode];
  const {
    filtered,
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
console.log("DeposPage render");

  const label = config.label;
console.log("DeposPage displayMode =", displayMode);
  return (
    <div className="text-center text-green-900 my-10 mx-auto px-4">
      <h1 className="text-3xl sm:text-5xl font-bold">
        <span className="animate-pulse text-4xl">{config.icon}</span>
        {config.title}
        <span className="animate-pulse text-4xl">{config.icon}</span>
      </h1>

      <p className="text-sm sm:text-lg text-green-800">{config.subtitle}</p>

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
      />


      <DeposList
        deposits={filtered}
        renderItem={(depo) => (
          <Link key={depo.ID_Depo} to={`/depo/${depo.ID_Depo}`}>
            <div className="flex justify-between max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-4 m-4 border border-green-100">
              <div className="text-left">
                <h3>{depo.Title_Depo}</h3>
                <p>{depo.User_Depos?.Login_User}</p>
              </div>
              <span>{depo.Type_Depo}</span>
            </div>
          </Link>
        )}
      />
    </div>
  );
}
