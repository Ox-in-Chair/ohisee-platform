#!/bin/bash

echo "========================================"
echo "OhISee Platform - Initial Setup"
echo "========================================"
echo ""

# Check Node.js installation
echo "Checking Node.js installation..."
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js is not installed. Please install Node.js first."
    echo "Download from: https://nodejs.org/"
    exit 1
fi
echo "Node.js found: $(node --version)"
echo ""

# Create environment files
echo "Creating environment files..."
if [ ! -f ".env" ]; then
    cp .env.example .env
    echo "Created .env file from template"
else
    echo ".env file already exists"
fi

if [ ! -f "frontend/.env.local" ]; then
    cat > frontend/.env.local << EOF
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_APP_NAME=OhISee Platform
NEXT_PUBLIC_TENANT_ID=kangopak
EOF
    echo "Created frontend/.env.local"
else
    echo "frontend/.env.local already exists"
fi
echo ""

# Install dependencies
echo "Installing root dependencies..."
npm install --legacy-peer-deps
echo ""

echo "Installing frontend dependencies..."
cd frontend
npm install --legacy-peer-deps
cd ..
echo ""

echo "Installing backend dependencies..."
cd backend
npm install --legacy-peer-deps
cd ..
echo ""

echo "========================================"
echo "Setup Complete!"
echo "========================================"
echo ""
echo "Next steps:"
echo "1. Configure your .env file with actual values"
echo "2. Run 'npm run dev' to start development servers"
echo "3. Frontend will be at http://localhost:3000"
echo "4. Backend will be at http://localhost:5000"
echo ""