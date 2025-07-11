@echo off
echo Starting Sentiment Analysis Servers...
echo.

echo Step 1: Training the ML model...
python train_sentiment_model.py
echo.

echo Step 2: Starting FastAPI server...
echo The FastAPI server will be available at: http://localhost:8000
echo Press Ctrl+C to stop the server
echo.
uvicorn sentiment_api:app --reload --port 8000 