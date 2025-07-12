from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import os

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

if os.path.exists(model_path) and os.path.exists(vectorizer_path):
    # Load model and vectorizer
    try:
        clf = joblib.load(model_path)
        vectorizer = joblib.load(vectorizer_path)
        model_loaded = True
        print("✅ Model and vectorizer loaded successfully!")
    except Exception as e:
        model_loaded = False
        print(f"❌ Error loading model: {str(e)}")
else:
    model_loaded = False
    print(f"❌ Model files not found at:")
    print(f"   Model: {model_path} - Exists: {os.path.exists(model_path)}")
    print(f"   Vectorizer: {vectorizer_path} - Exists: {os.path.exists(vectorizer_path)}")
    print("Please ensure model files are included in deployment.")

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
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port) 