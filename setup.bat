@echo off
echo 🚀 Setting up Layout Builder project...

echo 📦 Installing backend dependencies...
cd backend
call npm install
cd ..

echo 📦 Installing frontend dependencies...
cd frontend
call npm install
cd ..

echo ✅ Dependencies installed successfully!
echo.
echo 🎯 Next steps:
echo 1. Run: docker-compose up --build
echo 2. Visit: http://localhost:3000
echo 3. You should see 'Hello World' and the current GMT time
echo.
echo 🔧 If you encounter any issues:
echo - Run: docker-compose down -v
echo - Then: docker-compose up --build
pause 