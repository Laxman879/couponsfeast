@echo off
echo Starting CouponsFeast Fullstack Application with Cypress...
echo.

echo Starting MongoDB (make sure MongoDB is running)...
echo.

echo Starting Backend Server...
start cmd /k "cd server && npm run dev"
timeout /t 5

echo Starting Frontend Server...
start cmd /k "cd client && npm run dev"
timeout /t 10

echo Opening Cypress...
cd client
npm run cypress:open
