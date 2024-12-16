import React, { useEffect } from "react";
import { useLanguage } from "./languageContext";
import { useTranslation } from "react-i18next";

const LanguageSwitcher = () => {
  const { name, setName } = useLanguage(); // Access context for the current language
  const { i18n } = useTranslation(); // Access i18next's API

  useEffect(() => {
    i18n.changeLanguage(name); // Change the language in i18next when 'name' changes
  }, [name, i18n]);

  const handleChangeLanguage = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedLanguage = event.target.value;
    setName(selectedLanguage);
  };

  return (
    <select
      value={name}
      onChange={handleChangeLanguage}
      className="border border-gray-300 rounded-md py-1 text-gray-700 bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
    >
      <option value="name_uz">Uzb</option>
      <option value="name_fa">دری</option>
    </select>
  );
};

export default LanguageSwitcher;