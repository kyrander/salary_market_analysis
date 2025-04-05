import axios from "axios";

// Statistics Estonia API calls
const API_BASE_URL = 'https://andmed.stat.ee/api/v1';

export async function getStatisticsData(tableName, query) {
    try {
        const response = await axios({
            url: `${API_BASE_URL}/et/stat/${tableName}`,
            headers: {
                'Content-Type': 'application/json',
            },
            data: {
                query: query,
                response: {
                    format: "json-stat2"
                }
            },
            method: "POST",
        });

        console.log(`${tableName} data fetched successfully`);
        return response.data;
    } catch (error) {
        console.error(`API Error in ${tableName}: ${error.message}`);
    
        const customError = new Error(
          error.response?.statusText || `Failed to fetch data from Statistics Estonia API (${tableName})`
        );
        
        customError.statusCode = error.response?.status || 500;
        throw customError;
    }
}