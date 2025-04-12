"use client";

import { useState, useEffect, useRef, MouseEvent, ChangeEvent } from "react";
import axios from "axios";
import AnalysisPanel from "./analysis";
import SearchDropdown from "./searchbar";

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
  const [loading, setLoading] = useState<boolean>(false);
  const [aiAnalysis, setAiAnalysis] = useState<string>("");
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Fetch statistics data from server
    const fetchStatisticsData = async () => {
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
        // console.log("Fetched statistics data successfully:", response.data);
        
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
    fetchStatisticsData();

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

  // Fetch data analysis for a specific sector or occupation
  const fetchDataAnalysis = async (type: TabType, code: string, name: string) => {
    setLoading(true);
    try {
      // console.log(`Fetching ${type} data analysis for: ${name} (${code})`);

      // Define the type for salaryTableData with an index signature
      const salaryTableData: { [year: string]: number } = {};
      
      if (type === "sector" && salaryData) {
        // For sectors, create a mapping of year to salary
        salaryData.years.forEach(year => {
          if (salaryData.salaries && 
              salaryData.salaries[year] && 
              salaryData.salaries[year][code] !== undefined) {
            salaryTableData[year] = salaryData.salaries[year][code];
          }
        });
      } else if (type === "occupation" && salaryData && salaryData.occupationSalaries) {
        // For occupations, create a mapping of year to salary
        Object.keys(salaryData.occupationSalaries).forEach(year => {
          if (salaryData.occupationSalaries &&
              salaryData.occupationSalaries[year] &&
              salaryData.occupationSalaries[year][code] !== undefined) {
            salaryTableData[year] = salaryData.occupationSalaries[year][code];
          }
        });
      }
      
      // Prepare the data to send to the server
      const requestData = {
        name: name,
        salaryData: salaryTableData,
      };
      // console.log("Sending data to server:", requestData);
      
      // Make the API request
      const response = await axios.post("http://localhost:8080/api/openai", requestData, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      // console.log(`Response from server:`, response.data);
      
      // Store the OpenAI response
      if (response.data) {
        setAiAnalysis(response.data);
      } else {
        setAiAnalysis("Analüüs pole saadaval.");
      }
      
    } catch (error) {
      console.error(`Error sending salary data:`, error);
      if (axios.isAxiosError(error)) {
        console.error('Axios error details:', {
          response: error.response?.data,
          status: error.response?.status
        });
      }
      setAiAnalysis("Vabandust, analüüsi hankimisel tekkis viga.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    setIsDropdownOpen(true);
    setShowAllOptions(false); // Filter, when typing
    
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
      // Fetch detailed sector data - pass both code and name
      fetchDataAnalysis("sector", option.code, option.name);
    } else {
      setSelectedOccupation(option as Occupation);
      setSelectedSector(null);
      // Fetch detailed occupation data - pass both code and name
      fetchDataAnalysis("occupation", option.code, option.name);
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
    setAiAnalysis(""); // Clear any previous analysis
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
    <div className="min-h-screen flex items-center justify-center p-4" ref={dropdownRef}>
      <div className="flex flex-col items-center w-full max-w-4xl">
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
        
        {/* Search Bar Component with consolidated props */}
        <SearchDropdown
          searchState={{
            query: searchQuery,
            activeTab,
            isOpen: isDropdownOpen,
            showAllOptions,
            options: filteredOptions
          }}
          handlers={{
            onChange: handleSearchChange,
            onFocus: handleFocus,
            onToggle: toggleDropdown,
            onSelect: handleOptionSelect
          }}
        />
        
        {/* Analysis Panel Component */}
        {((activeTab === "sector" && selectedSector) || (activeTab === "occupation" && selectedOccupation)) && (
          <AnalysisPanel
            title={activeTab === "sector" ? selectedSector?.name || "" : selectedOccupation?.name || ""}
            loading={loading}
            aiAnalysis={aiAnalysis}
          />
        )}
      </div>
    </div>
  );
}