import axios from "axios";
// import dotenv from "dotenv";
// dotenv.config();

// Statistics Estonia API calls
const API_BASE_URL = 'https://andmed.stat.ee/api/v1';

// Get all statistics
export async function getFields() {
    console.log("sending a request to Statistics Estonia API");

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
                "TOTAL"
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
            url: `${API_BASE_URL}/et/stat/PA103`,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            data: queryData,
            method: "GET",
        });

        console.log("getFields: ", response.data);

        return response.data;
    } catch (error) {
        // return error?.response?.statusText;
        console.error(`API Error: ${error.message}`);
    
        const customError = new Error(
          error.response?.statusText || 'Failed to fetch data from Statistics Estonia API'
        );
        
        customError.statusCode = error.response?.status || 500;
        throw customError;
    }
}