from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import os
import sys

# Print startup information
print("🚀 Starting Tweet Sentiment Analyzer API...")
print(f"📁 Current working directory: {os.getcwd()}")
print(f"📁 Directory contents: {os.listdir('.')}")

app = FastAPI(title="Tweet Sentiment Analyzer API", version="1.0.0")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Check if model files exist
model_path = 'ml_model/sentiment_model.joblib'
vectorizer_path = 'ml_model/vectorizer.joblib'

print(f"🔍 Checking for model files...")
print(f"   Model path: {model_path}")
print(f"   Vectorizer path: {vectorizer_path}")

if os.path.exists(model_path) and os.path.exists(vectorizer_path):
    # Load model and vectorizer
    try:
        print("📦 Loading model and vectorizer...")
        clf = joblib.load(model_path)
        vectorizer = joblib.load(vectorizer_path)
        model_loaded = True
        print("✅ Model and vectorizer loaded successfully!")
    except Exception as e:
        model_loaded = False
        print(f"❌ Error loading model: {str(e)}")
        print(f"❌ Error type: {type(e)}")
else:
    model_loaded = False
    print(f"❌ Model files not found!")
    print(f"   Model exists: {os.path.exists(model_path)}")
    print(f"   Vectorizer exists: {os.path.exists(vectorizer_path)}")
    
    # Check if ml_model directory exists
    if os.path.exists('ml_model'):
        print(f"📁 ml_model directory contents: {os.listdir('ml_model')}")
    else:
        print("📁 ml_model directory does not exist!")

class TweetRequest(BaseModel):
    text: str

@app.post("/predict")
def predict_sentiment(req: TweetRequest):
    if not model_loaded:
        return {
            "sentiment": "error",
            "confidence": 0.0,
            "message": "Model not loaded. Please train the model first."
        }
    
    try:
        X = vectorizer.transform([req.text])
        pred = clf.predict(X)[0]
        proba = max(clf.predict_proba(X)[0])
        return {
            "sentiment": pred,
            "confidence": round(float(proba), 3)
        }
    except Exception as e:
        return {
            "sentiment": "error",
            "confidence": 0.0,
            "message": f"Prediction error: {str(e)}"
        }

@app.get("/")
def root():
    return {
        "message": "Sentiment API is running!",
        "model_loaded": model_loaded,
        "endpoints": {
            "predict": "POST /predict - Analyze tweet sentiment",
            "health": "GET /health - Health check",
            "docs": "GET /docs - API documentation"
        }
    }

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "model_loaded": model_loaded,
        "timestamp": "2024-01-01T00:00:00Z"
    }

if __name__ == "__main__":
    import uvicorn
    
    # Get port from environment variable
    port = int(os.getenv("PORT", 8000))
    print(f"🌐 Starting server on port {port}")
    print(f"🔧 Environment variables: PORT={os.getenv('PORT', '8000')}")
    
    try:
        uvicorn.run(app, host="0.0.0.0", port=port, log_level="info")
    except Exception as e:
        print(f"❌ Failed to start server: {str(e)}")
        sys.exit(1) 