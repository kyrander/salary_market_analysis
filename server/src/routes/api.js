import { Router } from "express";
// import dotenv from "dotenv";
const router = Router();
// dotenv.config();

import { processData } from "../services/statistics_ee/processData.js";


// STATISTICS: Get field statistics
router.post("/fields/", async (req, res, next) => {

    const response = await processData();

    // send response back to client
    res.status(200).send(response);
});

export default router;