# Salary Market Analysis Application

## Prerequisites
- Node.js (v18 or higher recommended)
- npm (usually comes with Node.js)

### Installing Node.js and npm

#### Windows or macOS
1. Visit the [Node.js download page](https://nodejs.org/en/download/)
2. Download the Windows Installer (.msi for Windows and .pkg for macOS) for the LTS version
3. Run the installer and follow the installation wizard
4. Verify installation by opening Command Prompt and typing:
   ```
   node -v
   npm -v
   ```

#### Linux (Ubuntu/Debian)
```bash
# Using apt
sudo apt update
sudo apt install nodejs npm

# Verify installation
node -v
npm -v
```

## Installation

### Option 1: Using the Setup Script (Recommended)
```bash
git clone [https://github.com/kyrander/salary_market_analysis](https://github.com/kyrander/salary_market_analysis)
cd salary-market-analysis
chmod +x setup.sh
./setup.sh
```

The setup script will automatically install all dependencies for both server and frontend.

### Option 2: Manual Installation

#### Step 1: Clone the Repository
```bash
git clone [https://github.com/kyrander/salary_market_analysis](https://github.com/kyrander/salary_market_analysis)
cd salary-market-analysis
```

#### Step 2: Install Server Dependencies
```bash
cd server
npm install
```

#### Step 3: Install Frontend Dependencies
```bash
cd ../frontend
npm install
```

## Running the Application

### Server
```bash
cd server
npm run dev
```

The server will run on [http://localhost:8080](http://localhost:8080) (or the port specified in your configuration).

### Frontend
```bash
cd frontend
npm run dev
```

The frontend will run on [http://localhost:3000](http://localhost:3000).

## Environment Variables
Make sure to set up the following environment variable:

- For the server, add given openAI API key to file:
  ```
  server\src\services\open_ai\request.js

  row 5: const apiKey = ""
  ```

## Troubleshooting
- If the setup script fails, try the manual installation steps.
- Ensure all dependencies are properly installed by running `npm install` in both directories.
- Check Node.js version with `node -v` and make sure it's v18 or higher.
- If the setup script doesn't have execution permissions, run `chmod +x setup.sh` before executing it.

## Author
Created by Kerly Kallas - Email: kerlykallas02@gmail.com - LinkedIn: linkedin.com/in/kerly-k