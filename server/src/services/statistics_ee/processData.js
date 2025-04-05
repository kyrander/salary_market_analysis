import { getStatisticsData } from "../statistics_ee/fetchStatistics.js";
import { PA001_QUERY, PA101_QUERY, PA633_QUERY } from "../statistics_ee/queries.js";

// Return only the minimal data needed
export async function processData() {
    try {
        // Sector data
        const pa101Data = await getStatisticsData('PA101', PA101_QUERY);
        const pa001Data = await getStatisticsData('PA001', PA001_QUERY);
        // Occupation data
        const pa633Data = await getStatisticsData('PA633', PA633_QUERY);
        
        const result = {
            sector: {
                years: [],
                sectors: [],
                salaries: {}
            },
            occupation: {
                years: [],
                occupations: [],
                salaries: {}
            }
        };
        
        // PROCESS SECTOR DATA (PA101 and PA001)
        // Extract sector data
        if (pa101Data.dimension && pa101Data.dimension.Tegevusala) {
            // Get sector codes
            const sectorCodes = pa101Data.dimension.Tegevusala.category.index;
            // Get sector labels
            const sectorLabels = pa101Data.dimension.Tegevusala.category.label;
            
            // Map sector codes to their labels
            result.sector.sectors = Object.keys(sectorCodes).map(code => ({
                code,
                name: sectorLabels[code]
            }));
        }
        
        // Extract years from PA101
        if (pa101Data.dimension && pa101Data.dimension.Vaatlusperiood) {
            const yearCodes = pa101Data.dimension.Vaatlusperiood.category.index;
            const yearLabels = pa101Data.dimension.Vaatlusperiood.category.label;
            
            const pa101Years = Object.keys(yearCodes).map(code => yearLabels[code]);
            result.sector.years = [...pa101Years, "2020"]; // Add 2020 from PA001
            
            // Remove duplicates if any
            result.sector.years = [...new Set(result.sector.years)].sort();
        }
        
        // Initialize salaries object by year for sectors
        result.sector.years.forEach(year => {
            result.sector.salaries[year] = {};
        });
        
        // Extract PA101 salaries data (for all years except 2020)
        if (pa101Data.value && pa101Data.dimension) {
            const dimensions = pa101Data.dimension;
            
            if (dimensions.Tegevusala && dimensions.Vaatlusperiood) {
                const sectorIndices = dimensions.Tegevusala.category.index;
                const yearIndices = dimensions.Vaatlusperiood.category.index;
                const yearLabels = dimensions.Vaatlusperiood.category.label;
                
                // For each sector and year, find the corresponding salary value
                Object.keys(sectorIndices).forEach(sectorCode => {
                    const sectorIndex = sectorIndices[sectorCode];
                    
                    Object.keys(yearIndices).forEach(yearCode => {
                        const yearIndex = yearIndices[yearCode];
                        const year = yearLabels[yearCode];
                        
                        // Calculate the array index based on dimensions
                        const valueIndex = sectorIndex * Object.keys(yearIndices).length + yearIndex;
                        
                        // Store the salary value for this sector and year
                        if (pa101Data.value[valueIndex] !== undefined) {
                            if (!result.sector.salaries[year]) {
                                result.sector.salaries[year] = {};
                            }
                            result.sector.salaries[year][sectorCode] = pa101Data.value[valueIndex];
                        }
                    });
                });
            }
        }
        
        // Extract PA001 salaries data (for 2020 only)
        if (pa001Data.value && pa001Data.dimension) {
            const dimensions = pa001Data.dimension;
            
            if (dimensions.Tegevusala) {
                const sectorIndices = dimensions.Tegevusala.category.index;
                
                // For each sector, find the corresponding salary value for 2020
                Object.keys(sectorIndices).forEach(sectorCode => {
                    const sectorIndex = sectorIndices[sectorCode];
                    
                    // Look at 2020 data only
                    if (pa001Data.value[sectorIndex] !== undefined) {
                        if (!result.sector.salaries["2020"]) {
                            result.sector.salaries["2020"] = {};
                        }
                        result.sector.salaries["2020"][sectorCode] = pa001Data.value[sectorIndex];
                    }
                });
            }
        }
        
        // PROCESS OCCUPATION DATA (PA633)
        // Extract occupation data using 'Ametiala' as the key
        if (pa633Data.dimension && pa633Data.dimension.Ametiala) {
            // Get occupation codes
            const occupationCodes = pa633Data.dimension.Ametiala.category.index;
            // Get occupation labels
            const occupationLabels = pa633Data.dimension.Ametiala.category.label;
            
            // Map occupation codes to their labels
            result.occupation.occupations = Object.keys(occupationCodes).map(code => ({
                code,
                name: occupationLabels[code]
            }));
        }
        
        // Extract years from PA633
        if (pa633Data.dimension && pa633Data.dimension.Vaatlusperiood) {
            const yearCodes = pa633Data.dimension.Vaatlusperiood.category.index;
            const yearLabels = pa633Data.dimension.Vaatlusperiood.category.label;
            
            result.occupation.years = Object.keys(yearCodes).map(code => yearLabels[code]);
            
            // Remove duplicates if any
            result.occupation.years = [...new Set(result.occupation.years)].sort();
        }
        
        // Initialize salaries object by year for occupations
        result.occupation.years.forEach(year => {
            result.occupation.salaries[year] = {};
        });
        
        // Extract PA633 salaries data - this requires understanding the array structure
        if (pa633Data.value && pa633Data.dimension) {
            const dimensions = pa633Data.dimension;
            
            // If dimension order isn't directly available, we need to determine the structure
            if (dimensions.Ametiala && dimensions.Vaatlusperiood) {
                // Get the required indices
                const occupationIndices = dimensions.Ametiala.category.index;
                const yearIndices = dimensions.Vaatlusperiood.category.index;
                const yearLabels = dimensions.Vaatlusperiood.category.label;
                
                // Consider Näitaja for proper indexing
                const hasNaitaja = !!dimensions.Näitaja;
                
                // Get the size of each dimension for index calculation
                const naitajaSize = hasNaitaja ? Object.keys(dimensions.Näitaja.category.index).length : 1;
                const yearSize = Object.keys(yearIndices).length;
                const occupationSize = Object.keys(occupationIndices).length;
                
                // Find the value at specific indices to confirm the structure
                if (naitajaSize === 1) {
                    const naitajaIndex = 0; // GR_H is at index 0
                    
                    // For each occupation and year, find the corresponding salary value
                    let validValues = 0;
                    
                    Object.keys(occupationIndices).forEach(occupationCode => {
                        const occupationIndex = occupationIndices[occupationCode];
                        
                        Object.keys(yearIndices).forEach(yearCode => {
                            const yearIndex = yearIndices[yearCode];
                            const year = yearLabels[yearCode];
                            
                            // Calculate the array index based on the dimension structure
                            let valueIndex;
                            
                            valueIndex = naitajaIndex * (occupationSize * yearSize) + 
                                        occupationIndex * yearSize + 
                                        yearIndex;
                            
                            // Store the salary value for this occupation and year
                            // Convert hourly wage to monthly by multiplying by 160
                            if (pa633Data.value[valueIndex] !== undefined) {
                                // Only process values that are not null, undefined, or zero
                                const hourlyWage = pa633Data.value[valueIndex];
                                
                                if (hourlyWage !== null && hourlyWage !== undefined && hourlyWage !== 0) {
                                    validValues++;
                                    if (!result.occupation.salaries[year]) {
                                        result.occupation.salaries[year] = {};
                                    }
                                    
                                    // Convert hourly wage to monthly wage (multiply by 160) and round to integer
                                    const monthlyWage = Math.round(hourlyWage * 160);
                                    
                                    result.occupation.salaries[year][occupationCode] = monthlyWage;
                                }
                            }
                        });
                    });
                }
            } else {
                console.error("PA633 is missing required dimensions for salary data extraction");
            }
        } else {
            console.error("PA633 is missing value array or dimension property");
        }

        console.log("Sector and occupation data extracted successfully");
        return result;
    } catch (error) {
        console.error("Failed to fetch data:", error);
        throw error;
    }
}