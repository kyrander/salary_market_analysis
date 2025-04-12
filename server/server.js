import express from "express";
import cors from "cors";
// route
import apiRoutes from "./src/routes/api.js";

const app = express();
const port = 8080;

// Enable CORS to allow frontend requests
app.use(cors());

// Middleware for parsing JSON
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Tervitused serverist!');
});

// API: add API route localhost:port/api
app.use("/api", apiRoutes);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});