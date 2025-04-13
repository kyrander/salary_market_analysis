import express from "express";
import cors from "cors";
import readline from "readline";
// route
import apiRoutes from "./src/routes/api.js";

const app = express();
const port = 8080;

// Global variable to store API key
global.OPENAI_API_KEY = "";

// Function to prompt for API key
async function promptForApiKey() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve) => {
    rl.question('Please enter your OpenAI API key: ', (apiKey) => {
      global.OPENAI_API_KEY = apiKey;
      rl.close();
      resolve();
    });
  });
}

// Enable CORS to allow frontend requests
app.use(cors());

// Middleware for parsing JSON
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Tervitused serverist!');
});

// API: add API route localhost:port/api
app.use("/api", apiRoutes);

// Start server after getting the API key
async function startServer() {
  console.log("Starting server...");
  await promptForApiKey();
  
  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
    // Show last 4 characters of API key for verification
    const maskedKey = global.OPENAI_API_KEY ? 
      '********' + global.OPENAI_API_KEY.slice(-4) : 
      'Not set';
    console.log(`Using OpenAI API key: ${maskedKey}`);
  });
}

startServer();