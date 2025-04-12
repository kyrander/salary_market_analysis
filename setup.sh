#!/bin/bash

# Exit on error
set -e

echo "Setting up your Salary Market Analysis application..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Node.js is not installed. Please install Node.js first."
    echo "Visit https://nodejs.org to download and install Node.js."
    exit 1
fi

# Check Node.js version (recommended 18+)
NODE_VERSION=$(node -v | cut -d 'v' -f 2 | cut -d '.' -f 1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "Warning: Your Node.js version is below 18. Some features might not work correctly."
    echo "Consider upgrading to Node.js 18 or later."
fi

# Navigate to server directory and install dependencies
echo "Installing server dependencies..."
cd server
npm install

# Navigate back to the root directory
cd ..

# Navigate to client directory and install dependencies
echo "Installing client dependencies..."
cd client
npm install

# Navigate back to the root directory
cd ..

echo "Setup completed successfully!"
echo ""
echo "To start the application:"
echo "  1. Start the server:   cd server && npm run dev"
echo "  2. Start the client: cd client && npm run dev"
echo ""
echo "Make sure to add the openAI API key according to readme file."
echo ""
echo "Server will run on: http://localhost:3000 (default)"
echo "Client will run on: http://localhost:8080 (default)"