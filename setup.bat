@echo off
echo ========================================
echo OhISee Platform - Initial Setup
echo ========================================
echo.

echo Checking Node.js installation...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed. Please install Node.js first.
    echo Download from: https://nodejs.org/
    pause
    exit /b 1
)
echo Node.js found: 
node --version
echo.

echo Creating environment files...
if not exist ".env" (
    copy ".env.example" ".env" >nul 2>&1
    echo Created .env file from template
) else (
    echo .env file already exists
)

if not exist "frontend\.env.local" (
    echo NEXT_PUBLIC_API_URL=http://localhost:5000/api > frontend\.env.local
    echo NEXT_PUBLIC_APP_NAME=OhISee Platform >> frontend\.env.local
    echo NEXT_PUBLIC_TENANT_ID=kangopak >> frontend\.env.local
    echo Created frontend\.env.local
) else (
    echo frontend\.env.local already exists
)
echo.

echo Installing root dependencies...
call npm install --legacy-peer-deps
echo.

echo Installing frontend dependencies...
cd frontend
call npm install --legacy-peer-deps
cd ..
echo.

echo Installing backend dependencies...
cd backend
call npm install --legacy-peer-deps
cd ..
echo.

echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo Next steps:
echo 1. Configure your .env file with actual values
echo 2. Run 'npm run dev' to start development servers
echo 3. Frontend will be at http://localhost:3000
echo 4. Backend will be at http://localhost:5000
echo.
pause