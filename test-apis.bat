@echo off
echo ========================================
echo CouponsFeast API Tester
echo ========================================
echo.
echo Opening API Test Dashboard...
echo.
start "" "server\api-tester.html"
echo.
echo Dashboard opened in your browser!
echo.
echo Also available:
echo - API Status: http://localhost:5000/api/test
echo - Test Stores: http://localhost:5000/api/stores
echo - Test Coupons: http://localhost:5000/api/coupons
echo.
echo Make sure server is running: cd server ^&^& npm run dev
echo.
pause
