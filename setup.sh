#!/bin/bash

# Setup Script for Corporate Intranet Platform

echo "========================================"
echo "Corporate Intranet Platform Setup"
echo "========================================"
echo ""

# Check Node.js
echo "Checking Node.js installation..."
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js is not installed. Please install Node.js 18+ from https://nodejs.org"
    exit 1
fi
echo "✓ Node.js version: $(node --version)"

# Check npm
echo "Checking npm installation..."
if ! command -v npm &> /dev/null; then
    echo "ERROR: npm is not installed."
    exit 1
fi
echo "✓ npm version: $(npm --version)"
echo ""

# Backend Setup
echo "========================================"
echo "Setting up Backend..."
echo "========================================"
cd backend

echo "Installing backend dependencies..."
npm install
if [ $? -ne 0 ]; then
    echo "ERROR: Backend dependency installation failed."
    exit 1
fi
echo "✓ Backend dependencies installed"

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "Creating .env file from .env.example..."
    cp .env.example .env
    echo "✓ .env file created"
    echo ""
    echo "⚠ IMPORTANT: Please edit backend/.env and configure:"
    echo "  - MONGODB_URI (your MongoDB Atlas connection string)"
    echo "  - JWT_SECRET (a secure random string)"
    echo "  - CLOUDINARY credentials (if using file uploads)"
    echo ""
else
    echo "✓ .env file already exists"
fi

cd ..

# Frontend Setup
echo ""
echo "========================================"
echo "Setting up Frontend..."
echo "========================================"
cd frontend

echo "Installing frontend dependencies..."
npm install
if [ $? -ne 0 ]; then
    echo "ERROR: Frontend dependency installation failed."
    exit 1
fi
echo "✓ Frontend dependencies installed"

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "Creating .env.local file from .env.local.example..."
    cp .env.local.example .env.local
    echo "✓ .env.local file created"
else
    echo "✓ .env.local file already exists"
fi

cd ..

echo ""
echo "========================================"
echo "Setup Complete!"
echo "========================================"
echo ""
echo "Next Steps:"
echo "1. Configure MongoDB Atlas connection in backend/.env"
echo "2. Set JWT_SECRET in backend/.env (use a secure random string)"
echo "3. (Optional) Configure Cloudinary in backend/.env for file uploads"
echo ""
echo "To start the servers:"
echo "  Terminal 1: cd backend && npm run dev"
echo "  Terminal 2: cd frontend && npm run dev"
echo ""
echo "Access the application:"
echo "  Frontend: http://localhost:3000"
echo "  Backend API: http://localhost:5000"
echo "  Health Check: http://localhost:5000/health"
echo ""
