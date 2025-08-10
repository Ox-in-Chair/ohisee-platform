@echo off
echo ========================================
echo Pushing OhISee Platform to GitHub
echo ========================================
echo.

echo Please enter your GitHub username:
set /p USERNAME=

echo.
echo Adding remote repository...
git remote add origin https://github.com/%USERNAME%/ohisee-platform.git

echo.
echo Pushing code to GitHub...
git branch -M main
git push -u origin main

echo.
echo ========================================
echo Successfully pushed to GitHub!
echo ========================================
echo.
echo Your repository is now at:
echo https://github.com/%USERNAME%/ohisee-platform
echo.
echo Next steps:
echo 1. Go to https://vercel.com to deploy frontend
echo 2. Go to https://render.com to deploy backend
echo.
pause