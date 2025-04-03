"use client";

import { useState, useEffect, useRef, MouseEvent, ChangeEvent } from "react";
import axios from "axios";

export default function Home() {
  const [message, setMessage] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const [filteredResults, setFilteredResults] = useState<string[]>([]);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Fetch message from server using fetch API
    const fetchMessage = async () => {
      try {
        const response = await fetch("http://localhost:8080/");
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.text();
        setMessage(data);
      } catch (error) {
        console.error("Error fetching message:", error);
        setMessage("Failed to load message");
      }
    };
    
    // Send initial data to server using axios and update searchResults with tegevusala options
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
        
        // Extract and set tegevusala valueTexts from the response
        if (response.data && 
            response.data.pa101.variables && 
            response.data.pa101.variables.length > 1 && 
            response.data.pa101.variables[1].code === "Tegevusala" &&
            response.data.pa101.variables[1].valueTexts) {
          
          // Update searchResults with tegevusala options
          setSearchResults(response.data.pa101.variables[1].valueTexts.slice(1)); // Removing first 'select all' option
        }
      } catch (error) {
        console.error("Error sending initial data:", error);
      }
    };
  
    // Execute both functions when component mounts
    fetchMessage();
    sendInitialData();

    // Close dropdown when clicking outside
    const handleClickOutside = (event: MouseEvent | any) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside as EventListener);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside as EventListener);
    };
  }, []);

  // Filter results based on search query
  useEffect(() => {
    if (searchQuery) {
      const filtered = searchResults.filter(item => 
        item.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredResults(filtered);
    } else {
      setFilteredResults(searchResults);
    }
  }, [searchQuery, searchResults]);

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    setIsDropdownOpen(true);
  };

  const handleFocus = () => {
    setIsDropdownOpen(true);
  };

  const handleOptionSelect = (option: string) => {
    setSearchQuery(option);
    setIsDropdownOpen(false);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="flex flex-col items-center w-full max-w-md">
        {/* App Header with Name */}
        <h1 className="text-3xl font-bold mb-6">Palgaturu Analüüs Eestis</h1>
        
        {/* Search Bar with Dropdown */}
        <div className="w-full relative mb-4" ref={dropdownRef}>
          <div className="relative flex">
            <input
              type="text"
              placeholder="Vali tegevusala..."
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
          
          {/* Dropdown Results */}
          {isDropdownOpen && (
            <div className="absolute w-full mt-1 bg-white border border-gray-300 rounded-md shadow-md z-10 max-h-60 overflow-y-auto">
              {filteredResults.length > 0 ? (
                filteredResults.map((result, index) => (
                  <div 
                    key={index} 
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleOptionSelect(result)}
                  >
                    {result}
                  </div>
                ))
              ) : (
                <div className="p-2 text-gray-500">Tulemusi ei leitud</div>
              )}
            </div>
          )}
        </div>
        
        {/* Server Message */}
        {message && <div className="text-center mt-4">{message}</div>}
      </div>
    </div>
  );
}