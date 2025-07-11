import requests
import json

def test_sentiment_api():
    url = "http://localhost:8000/predict"
    
    test_tweets = [
        "I love this new feature! It's absolutely amazing! 😍",
        "Ugh, this app keeps crashing. So annoying!",
        "The weather is okay today, nothing special.",
        "Can't believe how awesome this product is! Ugh, this app keeps crashing. So annoying!"
    ]
    
    print("🧪 Testing Sentiment Analysis API...")
    print("=" * 50)
    
    for i, tweet in enumerate(test_tweets, 1):
        try:
            response = requests.post(url, json={"text": tweet})
            if response.status_code == 200:
                result = response.json()
                print(f"Tweet {i}: {tweet[:50]}...")
                print(f"  Sentiment: {result['sentiment']}")
                print(f"  Confidence: {result['confidence']}")
                if 'message' in result:
                    print(f"  Message: {result['message']}")
            else:
                print(f"Tweet {i}: Error - Status {response.status_code}")
                print(f"  Response: {response.text}")
        except requests.exceptions.ConnectionError:
            print(f"Tweet {i}: Connection Error - Make sure the FastAPI server is running!")
        except Exception as e:
            print(f"Tweet {i}: Error - {str(e)}")
        print("-" * 30)
    
    print("\n✅ Test completed!")

if __name__ == "__main__":
    test_sentiment_api() 