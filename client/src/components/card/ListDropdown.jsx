import React, { useState, useRef, useEffect } from "react";
import { FiChevronDown, FiCheck } from "react-icons/fi";

const CountryDropdown = ({ countries, onSelect }) => {
  const defaultSelection = countries?.find((c) => c.code === "GLOBAL") ||
    countries?.[0] || { code: "GLOBAL", name: "Global" };

  const [isOpen, setIsOpen] = useState(false);
  const [selectedCountryName, setSelectedCountryName] = useState(
    defaultSelection.name
  );
  const [selectedCountryCode, setSelectedCountryCode] = useState(
    defaultSelection.code
  );
  const dropdownRef = useRef(null);

  const handleSelection = (country) => {
    setSelectedCountryName(country.name);
    setSelectedCountryCode(country.code);
    setIsOpen(false);

    if (onSelect) {
      onSelect(country);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-2 px-4 py-2 bg-[#212121] hover:bg-[#303030] 
                   rounded-full border border-gray-700 cursor-pointer transition-colors 
                   focus:outline-none focus:ring-2 focus:ring-indigo-500"
        aria-expanded={isOpen}
      >
        <span className="text-sm font-medium text-gray-200">
          {selectedCountryName}
        </span>
        <FiChevronDown
          className={`text-gray-400 transition-transform ${
            isOpen ? "rotate-180" : "rotate-0"
          }`}
        />
      </button>

      {isOpen && (
        <div
          className="absolute z-10 mt-2 w-48 rounded-md shadow-lg bg-[#212121] ring-1 ring-black ring-opacity-5 
                     focus:outline-none transform translate-y-2 origin-top-right transition-all duration-150 ease-out"
        >
          <div
            className="py-1"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="options-menu"
          >
            {countries?.map((country) => (
              <div
                key={country.code}
                onClick={() => handleSelection(country)}
                className="flex justify-between items-center px-4 py-2 text-sm text-gray-300 hover:bg-[#303030] 
                           cursor-pointer transition-colors"
                role="menuitem"
              >
                {country.name}
                {selectedCountryCode === country.code && (
                  <FiCheck className="text-green-400" />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CountryDropdown;
