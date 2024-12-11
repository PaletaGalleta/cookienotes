#!/bin/bash

# Exit on error
set -e

# Set paths for backend and frontend
BACKEND_DIR="./backend"
FRONTEND_DIR="./frontend"

# Check if Node.js is installed
if ! command -v node &>/dev/null; then
    echo "Node.js is not installed. Please install Node.js (v18.17 or higher)."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &>/dev/null; then
    echo "npm is not installed. Please install npm (v9 or higher)."
    exit 1
fi

# Set up the backend
echo "Setting up the backend..."
cd "$BACKEND_DIR"
npm install

# Run database migrations for backend
echo "Running database migrations..."
npm run migration:run

# Start the backend server in the background
echo "Starting the backend server..."
npm run start:dev & 
BACKEND_PID=$!

# Set up the frontend
echo "Setting up the frontend..."
cd "$FRONTEND_DIR"
npm install

# Start the frontend server in the background
echo "Starting the frontend server..."
npm run dev & 
FRONTEND_PID=$!

# Wait for servers to start
echo "Servers are starting..."
sleep 5

# Display success message
echo "The application is now running!"
echo "Frontend: http://localhost:5173"
echo "Backend: http://localhost:3000"

# Function to stop servers on script termination
function cleanup() {
    echo "Stopping servers..."
    kill $BACKEND_PID
    kill $FRONTEND_PID
    exit
}

# Trap script termination signals
trap cleanup SIGINT SIGTERM

# Keep the script running
wait