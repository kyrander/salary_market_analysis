"use client";

import React from "react";

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

    return (
        <div className="w-full relative mb-4">
            <div className="relative flex">
                <input
                    type="text"
                    placeholder={activeTab === "sector" ? "Sisesta valdkond..." : "Sisesta ametinimetus..."}
                    value={query}
                    onChange={onChange}
                    onFocus={onFocus}
                    className="w-full p-2 border border-gray-300 rounded-md rounded-r-none focus:outline-none"
                />
                <button 
                    onClick={onToggle}
                    className="bg-gray-100 border border-gray-300 border-l-0 rounded-r-md px-3 flex items-center"
                    >
                    <span className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`}>
                        ▼
                    </span>
                </button>
            </div>
        
            {/* Dropdown Results */}
            {isOpen && (
                <div className="absolute w-full mt-1 bg-white border border-gray-300 rounded-md shadow-md z-10 max-h-60 overflow-y-auto">
                    {options.length > 0 ? (
                        options.map((option) => (
                        <div 
                            key={option.code} 
                            className="p-2 hover:bg-gray-100 cursor-pointer"
                            onClick={() => onSelect(option)}
                        >
                            {option.name}
                        </div>
                        ))
                    ) : (
                        <div className="p-2 text-gray-500">
                            {activeTab === "occupation" ? "Ametinimetuse andmed pole saadaval" : "Tulemusi ei leitud"}
                        </div>
                    )}
                </div>
            )}

            {/* Available Years Info */}
            <div className="text-center mt-2 text-sm text-gray-600">
                Saadaval aastad: {activeTab === "sector" ? "2020 - 2024" : "2010, 2014, 2018, 2022"}
            </div>
        </div>
    );
};

export default SearchDropdown;