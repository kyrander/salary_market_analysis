"use client";

import { useState, useEffect, useRef, MouseEvent, ChangeEvent } from "react";
import axios from "axios";

// Define interfaces for the data structure
interface Sector {
  code: string;
  name: string;
}

interface Occupation {
  code: string;
  name: string;
}

interface SalaryData {
  years: string[];
  sectors: Sector[];
  occupations?: Occupation[];
  salaries: {
    [year: string]: {
      [sectorCode: string]: number;
    };
  };
  occupationSalaries?: {
    [year: string]: {
      [occupationCode: string]: number;
    };
  };
}

type TabType = "sector" | "occupation";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [selectedSector, setSelectedSector] = useState<Sector | null>(null);
  const [selectedOccupation, setSelectedOccupation] = useState<Occupation | null>(null);
  const [salaryData, setSalaryData] = useState<SalaryData | null>(null);
  const [showAllOptions, setShowAllOptions] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<TabType>("sector");
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Send initial data to server using axios and update data 
    const sendInitialData = async () => {
      try {
        const response = await axios.post("http://localhost:8080/api/fields", {
          timestamp: new Date(),
          clientInfo: {
            userAgent: navigator.userAgent,
            language: navigator.language,
            screenWidth: window.innerWidth,
            screenHeight: window.innerHeight
          }
        });
        
        console.log("Initial data sent successfully:", response.data);
        
        // Structure the data according to the nested format provided by the server
        setSalaryData({
          years: response.data.sector?.years || response.data.occupation?.years || [],
          sectors: response.data.sector?.sectors || [],
          occupations: response.data.occupation?.occupations || [],
          salaries: response.data.sector?.salaries || {},
          occupationSalaries: response.data.occupation?.salaries || {}
        });
      } catch (error) {
        console.error("Error sending initial data:", error);
      }
    };
  
    // Execute when component mounts
    sendInitialData();

    // Close dropdown when clicking outside
    const handleClickOutside = (event: MouseEvent | any) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
        setShowAllOptions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside as EventListener);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside as EventListener);
    };
  }, []);

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    setIsDropdownOpen(true);
    setShowAllOptions(false); // When typing, we want to filter
    
    // Clear selected option when search changes
    if (query === '') {
      if (activeTab === "sector") {
        setSelectedSector(null);
      } else {
        setSelectedOccupation(null);
      }
    }
  };

  const handleFocus = () => {
    setIsDropdownOpen(true);
  };

  const handleOptionSelect = (option: Sector | Occupation) => {
    setSearchQuery(option.name);
    
    if (activeTab === "sector") {
      setSelectedSector(option as Sector);
      setSelectedOccupation(null);
    } else {
      setSelectedOccupation(option as Occupation);
      setSelectedSector(null);
    }
    
    setIsDropdownOpen(false);
    setShowAllOptions(false); // Reset flag after selection
  };

  const toggleDropdown = () => {
    // When toggling the dropdown, temporarily bypass the filter
    if (!isDropdownOpen) {
      // Create a temporary state to show all options
      setShowAllOptions(true);
    } else {
      // Reset when closing
      setShowAllOptions(false);
    }
    setIsDropdownOpen(!isDropdownOpen);
  };

  const switchTab = (tab: TabType) => {
    setActiveTab(tab);
    setSearchQuery('');
    setSelectedSector(null);
    setSelectedOccupation(null);
    setIsDropdownOpen(false);
    setShowAllOptions(false);
  };

  // Filter options based on search query or show all if showAllOptions is true
  const filteredOptions = showAllOptions 
    ? (activeTab === "sector" ? (salaryData?.sectors || []) : (salaryData?.occupations || []))
    : (activeTab === "sector" 
        ? ((salaryData?.sectors || []).filter(sector => 
            sector.name.toLowerCase().includes(searchQuery.toLowerCase())
          ))
        : ((salaryData?.occupations || []).filter(occupation => 
            occupation.name.toLowerCase().includes(searchQuery.toLowerCase())
          )));

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="flex flex-col items-center w-full max-w-md">
        {/* App Header with Name */}
        <h1 className="text-3xl font-bold mb-6">Palgaturu Analüüs Eestis</h1>
        
        {/* Tabs */}
        <div className="w-full flex justify-center mb-4 border-b border-gray-300">
          <div className="flex">
            <button 
              className={`py-2 px-4 text-center ${activeTab === "sector" 
                ? "border-b-2 border-blue-500 text-blue-500 font-medium" 
                : "text-gray-600 hover:text-gray-800"}`}
              onClick={() => switchTab("sector")}
            >
              Valdkonna järgi
            </button>
            <button 
              className={`py-2 px-4 text-center ${activeTab === "occupation" 
                ? "border-b-2 border-blue-500 text-blue-500 font-medium" 
                : "text-gray-600 hover:text-gray-800"}`}
              onClick={() => switchTab("occupation")}
            >
              Ametinimetuse järgi
            </button>
          </div>
        </div>
        
        {/* Search Bar with Dropdown */}
        <div className="w-full relative mb-4" ref={dropdownRef}>
          <div className="relative flex">
            <input
              type="text"
              placeholder={activeTab === "sector" ? "Sisesta valdkond..." : "Sisesta ametinimetus..."}
              value={searchQuery}
              onChange={handleSearchChange}
              onFocus={handleFocus}
              className="w-full p-2 border border-gray-300 rounded-md rounded-r-none focus:outline-none"
            />
            <button 
              onClick={toggleDropdown}
              className="bg-gray-100 border border-gray-300 border-l-0 rounded-r-md px-3 flex items-center"
            >
              <span className={`transform transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}>
                ▼
              </span>
            </button>
          </div>
          
          {/* Available Years Info */}
          {<div className="text-center mt-4">
            Saadaval aastad: {activeTab === "sector" ? "2020 - 2024" : "2010, 2014, 2018, 2022"}
          </div>}
          
          {/* Dropdown Results */}
          {isDropdownOpen && salaryData && (
            <div className="absolute w-full mt-1 bg-white border border-gray-300 rounded-md shadow-md z-10 max-h-60 overflow-y-auto">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option) => (
                  <div 
                    key={option.code} 
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleOptionSelect(option)}
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
        </div>
        
        {/* Display Salary Data for Selected Option */}
        {((activeTab === "sector" && selectedSector) || (activeTab === "occupation" && selectedOccupation)) && salaryData && (
          <div className="w-full mt-6 p-4 border border-gray-300 rounded-md">
            <h2 className="text-xl font-semibold mb-3">
              {activeTab === "sector" ? selectedSector?.name : selectedOccupation?.name}
            </h2>
            
            {/* Salary Data Table */}
            {activeTab === "sector" && selectedSector ? (
              <div>
                <h3 className="text-lg mb-2">Keskmine brutokuupalk (EUR)</h3>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="border border-gray-300 px-4 py-2">Aasta</th>
                        <th className="border border-gray-300 px-4 py-2">Palk (EUR)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {salaryData.years.map((year) => (
                        <tr key={year} className={salaryData.years.indexOf(year) % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          <td className="border border-gray-300 px-4 py-2">{year}</td>
                          <td className="border border-gray-300 px-4 py-2">
                            {salaryData.salaries && salaryData.salaries[year] ? 
                              salaryData.salaries[year][selectedSector.code] || 'N/A' 
                              : 'N/A'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : activeTab === "occupation" && selectedOccupation ? (
              <div>
                <h3 className="text-lg mb-2">Keskmine brutokuupalk (EUR)</h3>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="border border-gray-300 px-4 py-2">Aasta</th>
                        <th className="border border-gray-300 px-4 py-2">Palk (EUR)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(salaryData.occupationSalaries ? Object.keys(salaryData.occupationSalaries) : []).map((year) => (
                        <tr key={year} className={Object.keys(salaryData.occupationSalaries || {}).indexOf(year) % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          <td className="border border-gray-300 px-4 py-2">{year}</td>
                          <td className="border border-gray-300 px-4 py-2">
                            {salaryData.occupationSalaries && 
                             salaryData.occupationSalaries[year] && 
                             salaryData.occupationSalaries[year][selectedOccupation.code] !== undefined && 
                             salaryData.occupationSalaries[year][selectedOccupation.code] !== null
                              ? salaryData.occupationSalaries[year][selectedOccupation.code]
                              : 'Andmed puuduvad'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="text-center p-4 text-gray-500">
                Andmed pole praegu saadaval
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}