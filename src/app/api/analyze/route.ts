import { NextRequest, NextResponse } from 'next/server';
import { analyzeSentiment, enhancedSentimentAnalysis } from '../../../utils/sentimentAnalyzer';

export async function POST(request: NextRequest) {
  try {
    const { text, useEnhanced = true } = await request.json();

    if (!text || typeof text !== 'string') {
      return NextResponse.json(
        { error: 'Text is required and must be a string' },
        { status: 400 }
      );
    }

    // Analyze sentiment
    const result = useEnhanced 
      ? enhancedSentimentAnalysis(text)
      : analyzeSentiment(text);

    return NextResponse.json({
      success: true,
      result
    });

  } catch (error) {
    console.error('Sentiment analysis error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze sentiment' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Tweet Sentiment Analyzer API',
    endpoints: {
      POST: '/api/analyze - Analyze sentiment of provided text'
    }
  });
} 