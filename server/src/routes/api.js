import { Router } from "express";
// import dotenv from "dotenv";
const router = Router();
// dotenv.config();

import { fetchAppendedData } from "../services/statistics_ee/statistics.js";


// STATISTICS: Get field statistics
// router.post("/fields/", getFields);
router.post("/fields/", async (req, res, next) => {

    const response = await fetchAppendedData();

    // send response back to client
    res.status(200).send(response);
});

export default router;