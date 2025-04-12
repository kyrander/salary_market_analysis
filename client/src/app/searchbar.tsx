"use client";

import React, { useEffect, useState } from "react";

interface Option {
    code: string;
    name: string;
}

type TabType = "sector" | "occupation";

// Create a consolidated props interface
interface SearchDropdownProps {
    // State props grouped in a single object
    searchState: {
        query: string;
        activeTab: TabType;
        isOpen: boolean;
        showAllOptions: boolean;
        options: Option[];
    };
    // Handlers grouped in a single object
    handlers: {
        onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
        onFocus: () => void;
        onToggle: () => void;
        onSelect: (option: Option) => void;
    };
}

const SearchDropdown: React.FC<SearchDropdownProps> = ({
    searchState,
    handlers
}) => {
    const { query, activeTab, isOpen, showAllOptions, options } = searchState;
    const { onChange, onFocus, onToggle, onSelect } = handlers;
    const [isDarkMode, setIsDarkMode] = useState(false);

    // Check for dark mode preference
    useEffect(() => {
        // Initial check
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            setIsDarkMode(true);
        }

        // Listen for changes
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = (e: MediaQueryListEvent) => {
            setIsDarkMode(e.matches);
        };

        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, []);

    // Dynamic class names based on theme
    const inputClasses = `w-full p-2 border rounded-md rounded-r-none focus:outline-none ${
        isDarkMode 
            ? 'bg-gray-800 border-gray-600 text-gray-200 placeholder-gray-400' 
            : 'bg-white border-gray-300 text-gray-800'
    }`;

    const buttonClasses = `border border-l-0 rounded-r-md px-3 flex items-center ${
        isDarkMode 
            ? 'bg-gray-700 border-gray-600 text-gray-200' 
            : 'bg-gray-100 border-gray-300 text-gray-800'
    }`;

    const dropdownClasses = `absolute w-full mt-1 border rounded-md shadow-md z-10 max-h-60 overflow-y-auto ${
        isDarkMode 
            ? 'bg-gray-800 border-gray-600' 
            : 'bg-white border-gray-300'
    }`;

    const optionClasses = (isHover: boolean) => `p-2 cursor-pointer ${
        isDarkMode 
            ? isHover ? 'hover:bg-gray-700' : '' 
            : isHover ? 'hover:bg-gray-100' : ''
    }`;

    const textClasses = `text-center mt-2 text-sm ${
        isDarkMode ? 'text-gray-400' : 'text-gray-600'
    }`;

    const noResultsClasses = `p-2 ${
        isDarkMode ? 'text-gray-400' : 'text-gray-500'
    }`;

    return (
        <div className="w-full relative mb-4">
            <div className="relative flex">
                <input
                    type="text"
                    placeholder={activeTab === "sector" ? "Sisesta valdkond..." : "Sisesta ametinimetus..."}
                    value={query}
                    onChange={onChange}
                    onFocus={onFocus}
                    className={inputClasses}
                />
                <button 
                    onClick={onToggle}
                    className={buttonClasses}
                    >
                    <span className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`}>
                        ▼
                    </span>
                </button>
            </div>
        
            {/* Dropdown Results */}
            {isOpen && (
                <div className={dropdownClasses}>
                    {options.length > 0 ? (
                        options.map((option) => (
                        <div 
                            key={option.code} 
                            className={optionClasses(true)}
                            onClick={() => onSelect(option)}
                        >
                            {option.name}
                        </div>
                        ))
                    ) : (
                        <div className={noResultsClasses}>
                            {activeTab === "occupation" ? "Ametinimetuse andmed pole saadaval" : "Tulemusi ei leitud"}
                        </div>
                    )}
                </div>
            )}

            {/* Available Years Info */}
            <div className={textClasses}>
                Saadaval aastad: {activeTab === "sector" ? "2020 - 2024" : "2010, 2014, 2018, 2022"}
            </div>
        </div>
    );
};

export default SearchDropdown;