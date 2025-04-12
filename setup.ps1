# PowerShell Setup Script for Salary Market Analysis Application

# Exit on error
$ErrorActionPreference = "Stop"

Write-Host "Setting up your Salary Market Analysis application..."

# Check if Node.js is installed
try {
    $nodeVersion = node -v
    Write-Host "Node.js is installed: $nodeVersion"
} catch {
    Write-Host "Node.js is not installed. Please install Node.js first."
    Write-Host "Visit https://nodejs.org to download and install Node.js."
    exit 1
}

# Check Node.js version
$versionNumber = $nodeVersion -replace 'v', '' -split '\.' | Select-Object -First 1
if ([int]$versionNumber -lt 18) {
    Write-Host "Warning: Your Node.js version is below 18. Some features might not work correctly."
    Write-Host "Consider upgrading to Node.js 18 or later."
}

# Navigate to server directory and install dependencies
Write-Host "Installing server dependencies..."
Set-Location -Path "server"
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "Failed to install server dependencies."
    exit 1
}

# Navigate back to the root directory
Set-Location -Path ".."

# Navigate to client directory and install dependencies
Write-Host "Installing client dependencies..."
Set-Location -Path "client"
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "Failed to install client dependencies."
    exit 1
}

# Navigate back to the root directory
Set-Location -Path ".."

Write-Host "Setup completed successfully!"
Write-Host ""
Write-Host "To start the application:"
Write-Host "  1. Start the server:   cd server && npm run dev"
Write-Host "  2. Start the client: cd client && npm run dev"
Write-Host ""
Write-Host "Make sure to add the openAI API key according to readme file."
Write-Host ""
Write-Host "Server will run on: http://localhost:3000 (default)"
Write-Host "Client will run on: http://localhost:8080 (default)"