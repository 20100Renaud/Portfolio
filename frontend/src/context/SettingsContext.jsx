import { createContext, useContext, useState } from "react";

const SettingsContext = createContext();

export function SettingsProvider({ children }) {
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <SettingsContext.Provider
      value={{
        settingsOpen,
        openSettings: () => setSettingsOpen(true),
        closeSettings: () => setSettingsOpen(false),
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  return useContext(SettingsContext);
}
