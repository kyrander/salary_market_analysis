import { Router } from "express";
const router = Router();

import { processData } from "../services/statistics_ee/processData.js";
import { aiRequest } from "../services/open_ai/request.js";


// STATISTICS: Get field statistics
router.post("/fields/", async (req, res, next) => {

    const response = await processData();

    // send response back to client
    res.status(200).send(response);
});

// OPEN AI: Get detailed AI analysis
router.post("/openai/", async (req, res, next) => {
    // console.log("Request body:", req.body);

    try {
        // Extract data from the request body
        const { name, salaryData } = req.body;
        // console.log(`Received data for: ${name}`);
        // console.log("Salary data received:", salaryData);

        const response = await aiRequest(name, JSON.stringify(salaryData));

        // send response back to client
        res.status(200).send(response);
    } catch (error) {
        console.error("Error processing OpenAI request:", error);
        res.status(500).json({ 
            error: "Failed to process request", 
            message: error.message 
        });
    }
});

export default router;