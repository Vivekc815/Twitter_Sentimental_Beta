@echo off
echo 🚀 Deploying Tweet Sentiment Analyzer...

REM Check if Docker is installed
docker --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker is not installed. Please install Docker first.
    pause
    exit /b 1
)

REM Check if Docker Compose is installed
docker-compose --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker Compose is not installed. Please install Docker Compose first.
    pause
    exit /b 1
)

echo 📦 Building and starting services...
docker-compose up --build -d

echo ⏳ Waiting for services to start...
timeout /t 10 /nobreak >nul

echo 🔍 Checking service health...
curl -f http://localhost:8000/health >nul 2>&1
if errorlevel 1 (
    echo ❌ API server is not responding
) else (
    echo ✅ API server is running at http://localhost:8000
)

curl -f http://localhost:3000 >nul 2>&1
if errorlevel 1 (
    echo ❌ Frontend is not responding
) else (
    echo ✅ Frontend is running at http://localhost:3000
)

echo.
echo 🎉 Deployment completed!
echo 📱 Frontend: http://localhost:3000
echo 🔧 API: http://localhost:8000
echo 📚 API Docs: http://localhost:8000/docs
echo.
echo To stop the services: docker-compose down
echo To view logs: docker-compose logs -f
pause 