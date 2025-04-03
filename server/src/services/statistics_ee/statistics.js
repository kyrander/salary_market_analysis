import axios from "axios";
// import dotenv from "dotenv";
// dotenv.config();

// Statistics Estonia API calls
const API_BASE_URL = 'https://andmed.stat.ee/api/v1';

// Fetch data from PA001 table (existing function)
export async function getPA001Data() {
    console.log("Fetching PA001 data from Statistics Estonia API");

    const queryData = {
        "query": [
            {
                "code": "Näitaja",
                "selection": {
                    "filter": "item",
                    "values": [
                        "D11_EMPL"
                    ]
                }
            },
            {
                "code": "Tegevusala",
                "selection": {
                    "filter": "item",
                    "values": [
                        "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", 
                        "K", "L", "M", "N", "O", "P", "Q", "R", "S"
                    ]
                }
            },
            {
                "code": "Vaatlusperiood",
                "selection": {
                    "filter": "item",
                    "values": [
                        "2020"
                    ]
                }
            }
        ],
        "response": {
            "format": "json-stat2"
        }
    };

    try {
        const response = await axios({
            url: `${API_BASE_URL}/et/stat/PA001`,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            data: queryData,
            method: "GET",
        });

        console.log("PA001 data fetched successfully");
        return response.data;
    } catch (error) {
        console.error(`API Error in PA001: ${error.message}`);
    
        const customError = new Error(
          error.response?.statusText || 'Failed to fetch data from Statistics Estonia API (PA001)'
        );
        
        customError.statusCode = error.response?.status || 500;
        throw customError;
    }
}

// New function to fetch data from PA101 table
export async function getPA101Data() {
    console.log("Fetching PA101 data from Statistics Estonia API");

    const queryData = {
        "query": [
          {
            "code": "Näitaja",
            "selection": {
              "filter": "item",
              "values": [
                "GR_W_AVG"
              ]
            }
          },
          {
            "code": "Tegevusala",
            "selection": {
              "filter": "item",
              "values": [
                "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", 
                "K", "L", "M", "N", "O", "P", "Q", "R", "S"
              ]
            }
          }
        ],
        "response": {
            "format": "json-stat2"
        }
    };

    try {
        const response = await axios({
            url: `${API_BASE_URL}/et/stat/PA101`,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            data: queryData,
            method: "GET",
        });

        console.log("PA101 data fetched successfully");
        return response.data;
    } catch (error) {
        console.error(`API Error in PA101: ${error.message}`);
    
        const customError = new Error(
          error.response?.statusText || 'Failed to fetch data from Statistics Estonia API (PA101)'
        );
        
        customError.statusCode = error.response?.status || 500;
        throw customError;
    }
}

// Function to simply append PA001 data to PA101 data
export async function getAppendedData() {
    try {
        // Fetch data from both tables
        const pa101Data = await getPA101Data();
        const pa001Data = await getPA001Data();

        console.log("PA101 data: ", pa101Data);
        
        // Extract years from PA101
        let years = [];
        if (pa101Data.variables) {
            const periodVariable = pa101Data.variables.find(v => v.code === "Vaatlusperiood");
            if (periodVariable && periodVariable.valueTexts) {
                years = [...periodVariable.valueTexts];
            }
        }
        console.log("Years from PA101: ", years);

        // Extract years from PA001
        if (pa001Data.variables) {
            const periodVariable = pa001Data.variables.find(v => v.code === "Vaatlusperiood");
            if (periodVariable && periodVariable.valueTexts) {
                let pa001Year = periodVariable.valueTexts.filter(year => year === "2020");
                console.log("Years from PA001: ", pa001Year);
                
                years = [...years, ...pa001Year];
            }
        }
        
        // Remove duplicates and sort
        const sortedYears = [...new Set(years)].sort();
        
        
        // Return a simple object with both datasets and the extracted years
        return {
            pa101: pa101Data,
            pa001: pa001Data,
            years: sortedYears
        };
    } catch (error) {
        console.error(`Error appending data: ${error.message}`);
        throw error;
    }
}

// Example usage
export async function fetchAppendedData() {
    try {
        const data = await getAppendedData();
        console.log("Data fetched successfully");
        return data;
    } catch (error) {
        console.error("Failed to fetch data:", error);
        throw error;
    }
}