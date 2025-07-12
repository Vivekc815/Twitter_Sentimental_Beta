#!/bin/bash

echo "🚀 Starting Tweet Sentiment Analyzer API..."

# Print environment info
echo "📁 Current directory: $(pwd)"
echo "📁 Directory contents:"
ls -la

echo "📁 ml_model directory contents:"
if [ -d "ml_model" ]; then
    ls -la ml_model/
else
    echo "ml_model directory not found!"
fi

echo "🔧 Environment variables:"
echo "PORT=$PORT"

# Start the Python server
echo "🌐 Starting server..."
python sentiment_api.py 