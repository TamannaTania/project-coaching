@echo off
echo Starting ProjectCoaching API for Mobile Testing...
echo Mobile IP Address bound: http://0.0.0.0:5169
echo Make sure your phone and PC are on the same Wi-Fi!
cd ProjectCoachingAPI
dotnet run --urls "http://0.0.0.0:5169"
pause
