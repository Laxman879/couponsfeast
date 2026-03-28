@echo off
echo Running CouponsFeast E2E Tests...
echo.

echo Starting Backend Server...
start /B cmd /c "cd server && npm run dev > nul 2>&1"
timeout /t 5

echo Starting Frontend Server...
start /B cmd /c "cd client && npm run dev > nul 2>&1"
timeout /t 10

echo Running Cypress Tests...
cd client
npm run cypress:run

echo.
echo Tests completed!
taskkill /F /IM node.exe > nul 2>&1
