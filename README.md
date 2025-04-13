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

### Option 1: Using the Setup Script

#### For Linux/macOS:
```bash
git clone https://github.com/kyrander/salary_market_analysis
cd salary_market_analysis
chmod +x setup.sh
./setup.sh
```

#### For Windows (PowerShell):
```powershell
git clone https://github.com/kyrander/salary_market_analysis
cd salary_market_analysis
# Run the PowerShell script (you may need to adjust execution policy)
powershell -ExecutionPolicy Bypass -File setup.ps1
```

The setup script will automatically install all dependencies for both server and client.

### Option 2: Manual Installation

#### Step 1: Clone the Repository
```bash
git clone https://github.com/kyrander/salary_market_analysis
cd salary_market_analysis
```

#### Step 2: Install Server Dependencies
```bash
cd server
npm install
```

#### Step 3: Install Client Dependencies
```bash
cd ../client
npm install
```

## Running the Application

### Server
```bash
cd server
npm run dev
```

**Important:** When starting the server, you'll be prompted to enter your OpenAI API key in the terminal. Simply paste or type your API key and press Enter.

The server will run on [http://localhost:8080](http://localhost:8080).

### Client
```bash
cd client
npm run dev
```

The client will run on [http://localhost:3000](http://localhost:3000).

## APIs Used
This application integrates with the following external APIs:

### Statistics Estonia Database API
- Used for retrieving statistical data for salary market analysis
- Documentation: [Link to Statistics Estonia Database API documentation](https://andmed.stat.ee/abi/api-juhend.pdf)

### OpenAI API
- Used for generating insights from Statistics Estonia salary data
- Documentation: [Link to OpenAI API documentation](https://platform.openai.com/docs/api-reference/introduction)
- Requires an API key to be configured in the application

## Troubleshooting
- If the setup script fails, try the manual installation steps.
- Ensure all dependencies are properly installed by running `npm install` in both directories.
- Check Node.js version with `node -v` and make sure it's v18 or higher.

## Author
Created by Kerly Kallas - Email: kerlykallas02@gmail.com - LinkedIn: linkedin.com/in/kerly-k