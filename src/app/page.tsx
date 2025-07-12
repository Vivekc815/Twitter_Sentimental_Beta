'use client';

import { useState } from 'react';

export default function Home() {
  const [tweet, setTweet] = useState('');
  const [result, setResult] = useState<{ sentiment: string; confidence: number; message?: string } | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = async () => {
    if (!tweet.trim()) return;
    setIsAnalyzing(true);
    setResult(null);

    try {
      // Use environment variable for production, localhost for development
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const fullUrl = `${apiUrl}/predict`;
      console.log('🔗 Connecting to API at:', apiUrl); // Debug log
      console.log('🔗 Full URL:', fullUrl); // Debug log
      
      const response = await fetch(fullUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: tweet }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setResult({ 
        sentiment: data.sentiment, 
        confidence: data.confidence,
        message: data.message 
      });
    } catch (error) {
      console.error('❌ API Error:', error); // Debug log
      setResult({ 
        sentiment: 'error', 
        confidence: 0,
        message: `Failed to connect to the sentiment analysis server. Error: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'text-green-600 bg-green-100 border-green-300';
      case 'negative': return 'text-red-600 bg-red-100 border-red-300';
      case 'neutral': return 'text-gray-600 bg-gray-100 border-gray-300';
      default: return 'text-gray-600 bg-gray-100 border-gray-300';
    }
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return '😊';
      case 'negative': return '😞';
      case 'neutral': return '😐';
      default: return '🤔';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600';
    if (confidence >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const sampleTweets = [
    "I love this new feature! It's absolutely amazing! 😍",
    "This is the worst experience I've ever had. Terrible service!",
    "The weather is okay today, nothing special.",
    "Can't believe how awesome this product is! Ugh, this app keeps crashing. So annoying!",
    "I'm so disappointed with the quality. Not worth the money at all."
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Tweet Sentiment Analyzer <span className="text-blue-500">Beta</span>
          </h1>
          <p className="text-gray-600 text-lg">
            Analyze the sentiment of any tweet using a real machine learning model
          </p>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          {/* Input Section */}
          <div className="mb-6">
            <label htmlFor="tweet" className="block text-sm font-medium text-gray-700 mb-2">
              Enter your tweet:
            </label>
            <textarea
              id="tweet"
              value={tweet}
              onChange={(e) => setTweet(e.target.value)}
              placeholder="Paste your tweet here to analyze its sentiment..."
              className="w-full h-32 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              maxLength={280}
            />
            <div className="flex justify-between items-center mt-2">
              <span className="text-sm text-gray-500">
                {tweet.length}/280 characters
              </span>
            </div>
          </div>

          {/* Analyze Button */}
          <button
            onClick={handleAnalyze}
            disabled={!tweet.trim() || isAnalyzing}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
          >
            {isAnalyzing ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Analyzing...</span>
              </>
            ) : (
              <>
                <span>🔍</span>
                <span>Analyze Sentiment</span>
              </>
            )}
          </button>

          {/* Sample Tweets */}
          <div className="mt-6">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Try these sample tweets:</h3>
            <div className="flex flex-wrap gap-2">
              {sampleTweets.map((sample, index) => (
                <button
                  key={index}
                  onClick={() => setTweet(sample)}
                  className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-full transition-colors duration-200"
                >
                  {sample.substring(0, 30)}...
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Section */}
        {result && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Analysis Results</h2>
            
            {/* Error Message */}
            {result.sentiment === 'error' && result.message && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <h3 className="text-red-800 font-semibold mb-2">⚠️ Error</h3>
                <p className="text-red-700">{result.message}</p>
                <div className="mt-3 text-sm text-red-600">
                  <p><strong>To fix this:</strong></p>
                  <ol className="list-decimal list-inside mt-1 space-y-1">
                    <li>Make sure you've run: <code className="bg-red-100 px-1 rounded">python train_sentiment_model.py</code></li>
                    <li>Start the FastAPI server: <code className="bg-red-100 px-1 rounded">uvicorn sentiment_api:app --reload --port 8000</code></li>
                    <li>Check that the server is running at <a href="http://localhost:8000" className="underline">http://localhost:8000</a></li>
                  </ol>
                </div>
              </div>
            )}
            
            {/* Main Result */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {/* Sentiment */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Sentiment</h3>
                <div className={`inline-flex items-center space-x-3 px-4 py-2 rounded-full border ${getSentimentColor(result.sentiment)}`}>
                  <span className="text-2xl">{getSentimentIcon(result.sentiment)}</span>
                  <span className="font-semibold capitalize">{result.sentiment}</span>
                </div>
              </div>

              {/* Confidence */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Confidence</h3>
                <div className="flex items-center space-x-3">
                  <div className="flex-1 bg-gray-200 rounded-full h-3">
                    <div 
                      className={`h-3 rounded-full ${getConfidenceColor(result.confidence)}`}
                      style={{ width: `${result.confidence * 100}%` }}
                    ></div>
                  </div>
                  <span className={`font-semibold ${getConfidenceColor(result.confidence)}`}>
                    {Math.round(result.confidence * 100)}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-8 text-gray-500">
          <p className="text-sm">
            Powered by a real Machine Learning model (Python + scikit-learn)
          </p>
          <p className="text-xs mt-2 text-gray-400">
            This is a <span className="font-semibold text-blue-500">beta version</span> of the Tweet Sentiment Analyzer. Results may not be fully accurate and improvements are ongoing.
          </p>
        </div>
      </div>
    </div>
  );
}
