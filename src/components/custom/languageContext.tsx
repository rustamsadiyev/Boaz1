import React, { createContext, useContext, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

const LanguageContext = createContext<{
  name: string;
  setName: React.Dispatch<React.SetStateAction<string>>;
} | null>(null);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { i18n } = useTranslation();
  const [name, setName] = useState("name_fa"); // Default language

//   useEffect(() => {
//     i18n.changeLanguage(name);
//   }, [name, i18n]);

  return (
    <LanguageContext.Provider value={{ name, setName }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
};