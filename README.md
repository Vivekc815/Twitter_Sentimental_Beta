# Tweet Sentiment Analyzer

A modern web application that analyzes the sentiment of tweets using machine learning and natural language processing techniques.

## Features

- **Real-time Sentiment Analysis**: Analyze tweets for positive, negative, or neutral sentiment
- **Machine Learning Powered**: Uses natural language processing libraries for accurate analysis
- **Beautiful UI**: Modern, responsive design with Tailwind CSS
- **Detailed Analysis**: Shows confidence scores, sentiment breakdown, and word analysis
- **Sample Tweets**: Try pre-loaded sample tweets to test the system
- **Enhanced Analysis**: Toggle between basic and enhanced sentiment analysis modes

## How It Works

The application uses a lexicon-based approach combined with natural language processing:

1. **Text Preprocessing**: Cleans and normalizes the input text
2. **Sentiment Lexicon**: Uses comprehensive dictionaries of positive and negative words
3. **Negation Handling**: Detects negation words that flip sentiment (e.g., "not good" → negative)
4. **Intensifier Detection**: Identifies words that amplify sentiment (e.g., "very good" → stronger positive)
5. **Confidence Scoring**: Calculates confidence based on the number and strength of sentiment indicators

## Technologies Used

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS 4
- **NLP Libraries**: 
  - `natural` - Natural language processing utilities
  - `compromise` - Advanced text analysis
  - `compromise-numbers` - Number detection
  - `compromise-sentences` - Sentence parsing

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd mlapp
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Building for Production

```bash
npm run build
npm start
```

## Usage

1. **Enter a Tweet**: Paste or type a tweet in the text area
2. **Choose Analysis Mode**: Toggle between basic and enhanced analysis
3. **Analyze**: Click the "Analyze Sentiment" button
4. **View Results**: See the sentiment classification, confidence score, and detailed breakdown

## API Endpoints

The application includes a REST API for programmatic access:

### POST /api/analyze
Analyze the sentiment of provided text.

**Request Body:**
```json
{
  "text": "I love this amazing product!",
  "useEnhanced": true
}
```

**Response:**
```json
{
  "success": true,
  "result": {
    "sentiment": "positive",
    "score": 2.5,
    "confidence": 0.85,
    "analysis": {
      "positiveWords": ["love", "amazing"],
      "negativeWords": [],
      "negationCount": 0,
      "intensifierCount": 0
    }
  }
}
```

## Sentiment Analysis Algorithm

### Lexicon-Based Approach
- **Positive Words**: 100+ positive sentiment words (good, great, love, etc.)
- **Negative Words**: 100+ negative sentiment words (bad, hate, terrible, etc.)
- **Negation Words**: Words that flip sentiment (not, never, doesn't, etc.)
- **Intensifier Words**: Words that amplify sentiment (very, really, extremely, etc.)

### Scoring System
1. **Base Score**: +1 for positive words, -1 for negative words
2. **Intensifier Multiplier**: 1.5x for words preceded by intensifiers
3. **Negation Handling**: Flips sentiment when negation words are detected
4. **Confidence Calculation**: Based on the number and strength of sentiment indicators

### Enhanced Analysis
- Uses sentence-level analysis for better context understanding
- Improved handling of complex sentence structures
- Better negation detection across sentence boundaries

## Sample Results

| Tweet | Sentiment | Confidence | Score |
|-------|-----------|------------|-------|
| "I love this new feature! It's absolutely amazing! 😍" | Positive | 92% | +3.0 |
| "This is the worst experience I've ever had. Terrible service!" | Negative | 89% | -2.5 |
| "The weather is okay today, nothing special." | Neutral | 65% | 0.0 |
| "Can't believe how awesome this product is! Best purchase ever!" | Positive | 95% | +3.5 |
| "I'm so disappointed with the quality. Not worth the money at all." | Negative | 87% | -2.0 |

## Future Enhancements

- **Model Training**: Train custom models on Twitter datasets
- **Emoji Analysis**: Enhanced emoji sentiment detection
- **Context Awareness**: Better handling of sarcasm and context
- **Multi-language Support**: Support for multiple languages
- **Real-time Twitter Integration**: Direct Twitter API integration
- **Batch Analysis**: Analyze multiple tweets at once
- **Export Results**: Download analysis results as CSV/JSON

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Acknowledgments

- Natural language processing libraries for sentiment analysis
- Tailwind CSS for the beautiful UI components
- Next.js team for the excellent framework
