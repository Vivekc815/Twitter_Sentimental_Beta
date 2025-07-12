#!/bin/bash

# Railway startup script for sentiment analyzer API

echo "🚀 Starting Tweet Sentiment Analyzer API..."

# Check if model files exist
if [ ! -f "ml_model/sentiment_model.joblib" ]; then
    echo "❌ Error: sentiment_model.joblib not found!"
    echo "📁 Current directory contents:"
    ls -la
    echo "📁 ml_model directory contents:"
    ls -la ml_model/ || echo "ml_model directory not found"
    exit 1
fi

if [ ! -f "ml_model/vectorizer.joblib" ]; then
    echo "❌ Error: vectorizer.joblib not found!"
    exit 1
fi

echo "✅ Model files found!"
echo "🔧 Starting uvicorn server..."

# Start the FastAPI server
uvicorn sentiment_api:app --host 0.0.0.0 --port $PORT 