# 🚀 Deployment Guide - Tweet Sentiment Analyzer

## 📋 **Overview**

This application consists of:
- **Frontend**: Next.js web application (Port 3000)
- **Backend**: FastAPI ML server (Port 8000)
- **ML Model**: Trained sentiment classifier

## 🐳 **Docker Deployment (Recommended)**

### **Prerequisites**
- Docker Desktop installed
- Docker Compose installed

### **Quick Deploy**
```bash
# Windows
deploy.bat

# Linux/Mac
chmod +x deploy.sh
./deploy.sh
```

### **Manual Docker Deploy**
```bash
# Build and start all services
docker-compose up --build -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## ☁️ **Cloud Deployment Options**

### **1. Heroku**
```bash
# Install Heroku CLI
# Create Procfile
echo "web: uvicorn sentiment_api:app --host 0.0.0.0 --port \$PORT" > Procfile

# Deploy
heroku create your-app-name
git push heroku main
```

### **2. Railway**
```bash
# Install Railway CLI
npm install -g @railway/cli

# Deploy
railway login
railway init
railway up
```

### **3. Vercel (Frontend Only)**
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy frontend
vercel

# Set environment variable for API URL
vercel env add NEXT_PUBLIC_API_URL
```

### **4. AWS/GCP/Azure**
Use the provided Dockerfiles with:
- **ECS/Fargate** (AWS)
- **Cloud Run** (GCP)
- **Container Instances** (Azure)

## 🔧 **Environment Variables**

### **Frontend (.env.local)**
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### **Backend (sentiment_api.py)**
```python
# Add to sentiment_api.py
import os
API_HOST = os.getenv("API_HOST", "0.0.0.0")
API_PORT = int(os.getenv("API_PORT", "8000"))
```

## 📊 **Production Considerations**

### **1. Model Optimization**
```python
# Add to train_sentiment_model.py
import pickle

# Save optimized model
with open('ml_model/optimized_model.pkl', 'wb') as f:
    pickle.dump(clf, f)
```

### **2. CORS Configuration**
```python
# Update sentiment_api.py for production
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://yourdomain.com"],
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)
```

### **3. Rate Limiting**
```python
# Add to sentiment_api.py
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

@app.post("/predict")
@limiter.limit("10/minute")
def predict_sentiment(request: Request, req: TweetRequest):
    # ... existing code
```

### **4. Monitoring**
```python
# Add health checks and metrics
@app.get("/metrics")
def get_metrics():
    return {
        "requests_total": 1000,
        "predictions_accuracy": 0.92,
        "model_version": "1.0.0"
    }
```

## 🔒 **Security**

### **1. API Key Authentication**
```python
# Add to sentiment_api.py
from fastapi import HTTPException, Depends
from fastapi.security import HTTPBearer

security = HTTPBearer()

def verify_token(token: str = Depends(security)):
    if token.credentials != "your-secret-key":
        raise HTTPException(status_code=401, detail="Invalid token")
    return token.credentials

@app.post("/predict")
def predict_sentiment(req: TweetRequest, token: str = Depends(verify_token)):
    # ... existing code
```

### **2. Input Validation**
```python
# Add to sentiment_api.py
from pydantic import BaseModel, validator

class TweetRequest(BaseModel):
    text: str
    
    @validator('text')
    def validate_text(cls, v):
        if len(v) > 280:
            raise ValueError('Tweet too long')
        if len(v) < 1:
            raise ValueError('Tweet cannot be empty')
        return v
```

## 📈 **Scaling**

### **1. Load Balancer**
```yaml
# docker-compose.yml
services:
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
    depends_on:
      - sentiment-api
```

### **2. Multiple API Instances**
```yaml
# docker-compose.yml
services:
  sentiment-api:
    deploy:
      replicas: 3
```

## 🧪 **Testing**

### **1. Unit Tests**
```bash
# Install pytest
pip install pytest

# Run tests
pytest tests/
```

### **2. Load Testing**
```bash
# Install locust
pip install locust

# Run load test
locust -f load_test.py
```

## 📝 **Deployment Checklist**

- [ ] Model trained and saved
- [ ] Environment variables configured
- [ ] CORS settings updated
- [ ] Security measures implemented
- [ ] Monitoring set up
- [ ] SSL certificate configured
- [ ] Domain configured
- [ ] Backup strategy in place

## 🆘 **Troubleshooting**

### **Common Issues**

1. **Port Already in Use**
   ```bash
   # Find process using port
   netstat -ano | findstr :8000
   # Kill process
   taskkill /PID <process_id> /F
   ```

2. **Model Not Loading**
   ```bash
   # Retrain model
   python train_sentiment_model.py
   ```

3. **CORS Errors**
   ```bash
   # Check CORS configuration
   # Update allow_origins in sentiment_api.py
   ```

4. **Memory Issues**
   ```bash
   # Optimize model size
   # Use model compression
   ```

## 📞 **Support**

For deployment issues:
1. Check logs: `docker-compose logs -f`
2. Verify health: `curl http://localhost:8000/health`
3. Test API: `python test_api.py`

---

**🎉 Your Tweet Sentiment Analyzer is now ready for production deployment!** 