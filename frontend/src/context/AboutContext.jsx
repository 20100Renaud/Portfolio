import { createContext, useContext, useState } from "react";

const AboutContext = createContext();

export function AboutProvider({ children }) {
  const [aboutOpen, setAboutOpen] = useState(false);

  return (
    <AboutContext.Provider
      value={{
        aboutOpen,
        openAbout: () => setAboutOpen(true),
        closeAbout: () => setAboutOpen(false),
      }}
    >
      {children}
    </AboutContext.Provider>
  );
}

export function useAbout() {
  return useContext(AboutContext);
}
