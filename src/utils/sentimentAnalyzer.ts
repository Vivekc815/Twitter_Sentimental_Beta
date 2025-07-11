import natural from 'natural';
import nlp from 'compromise';

// Sentiment lexicon - positive and negative words
const positiveWords = new Set([
  'good', 'great', 'excellent', 'amazing', 'wonderful', 'fantastic', 'awesome', 'love', 'like', 'happy', 'joy', 'pleased', 'satisfied',
  'perfect', 'best', 'outstanding', 'brilliant', 'superb', 'terrific', 'fabulous', 'incredible', 'unbelievable', 'stunning', 'beautiful',
  'gorgeous', 'stunning', 'magnificent', 'splendid', 'marvelous', 'delightful', 'charming', 'lovely', 'sweet', 'nice', 'kind', 'generous',
  'helpful', 'supportive', 'encouraging', 'inspiring', 'motivating', 'exciting', 'thrilling', 'amazing', 'wow', 'yay', 'yes', 'agree',
  'support', 'back', 'favorite', 'favourite', 'win', 'winner', 'winning', 'success', 'successful', 'achieve', 'achievement', 'goal',
  'dream', 'hope', 'wish', 'blessed', 'grateful', 'thankful', 'appreciate', 'enjoy', 'fun', 'entertaining', 'hilarious', 'funny',
  'laugh', 'smile', 'grin', 'cheer', 'celebrate', 'party', 'festival', 'holiday', 'vacation', 'trip', 'journey', 'adventure',
  'explore', 'discover', 'learn', 'grow', 'improve', 'better', 'upgrade', 'enhance', 'boost', 'increase', 'rise', 'gain', 'profit',
  'benefit', 'advantage', 'opportunity', 'chance', 'luck', 'fortune', 'wealth', 'rich', 'money', 'cash', 'gold', 'diamond', 'precious',
  'valuable', 'treasure', 'gem', 'jewel', 'crown', 'king', 'queen', 'prince', 'princess', 'hero', 'heroine', 'champion', 'legend',
  'icon', 'star', 'celebrity', 'famous', 'popular', 'trending', 'viral', 'hit', 'smash', 'blockbuster', 'phenomenon', 'sensation'
]);

const negativeWords = new Set([
  'bad', 'terrible', 'awful', 'horrible', 'dreadful', 'disgusting', 'nasty', 'hate', 'dislike', 'sad', 'angry', 'mad', 'furious',
  'upset', 'disappointed', 'frustrated', 'annoyed', 'irritated', 'bothered', 'worried', 'anxious', 'nervous', 'scared', 'afraid',
  'fearful', 'terrified', 'horrified', 'shocked', 'stunned', 'surprised', 'confused', 'puzzled', 'lost', 'helpless', 'hopeless',
  'desperate', 'depressed', 'miserable', 'unhappy', 'sorrow', 'grief', 'pain', 'hurt', 'injured', 'sick', 'ill', 'disease', 'virus',
  'infection', 'cancer', 'death', 'die', 'dead', 'kill', 'murder', 'suicide', 'accident', 'crash', 'disaster', 'catastrophe',
  'tragedy', 'crisis', 'emergency', 'danger', 'dangerous', 'risky', 'threat', 'threatening', 'attack', 'war', 'battle', 'fight',
  'conflict', 'argument', 'dispute', 'quarrel', 'fight', 'violence', 'abuse', 'bully', 'harass', 'stalk', 'threaten', 'intimidate',
  'scare', 'frighten', 'terrify', 'horrify', 'shock', 'stun', 'surprise', 'confuse', 'puzzle', 'mislead', 'deceive', 'lie', 'fake',
  'fraud', 'scam', 'cheat', 'steal', 'rob', 'burglar', 'thief', 'criminal', 'illegal', 'unlawful', 'forbidden', 'banned', 'prohibited',
  'restricted', 'limited', 'blocked', 'censored', 'hidden', 'secret', 'private', 'confidential', 'sensitive', 'vulnerable', 'weak',
  'fragile', 'delicate', 'tender', 'sore', 'painful', 'hurtful', 'harmful', 'damaging', 'destructive', 'ruinous', 'devastating',
  'catastrophic', 'disastrous', 'tragic', 'sad', 'unfortunate', 'unlucky', 'misfortune', 'bad luck', 'curse', 'doom', 'fate', 'destiny'
]);

// Negation words that can flip sentiment
const negationWords = new Set([
  'not', 'no', 'never', 'none', 'nobody', 'nothing', 'neither', 'nowhere', 'hardly', 'barely', 'scarcely', 'rarely', 'seldom',
  'doesn\'t', 'don\'t', 'didn\'t', 'won\'t', 'wouldn\'t', 'can\'t', 'couldn\'t', 'shouldn\'t', 'isn\'t', 'aren\'t', 'wasn\'t', 'weren\'t',
  'hasn\'t', 'haven\'t', 'hadn\'t', 'mightn\'t', 'mustn\'t', 'shan\'t'
]);

// Intensifier words that amplify sentiment
const intensifierWords = new Set([
  'very', 'really', 'extremely', 'absolutely', 'completely', 'totally', 'entirely', 'thoroughly', 'utterly', 'perfectly',
  'absolutely', 'definitely', 'certainly', 'surely', 'indeed', 'truly', 'genuinely', 'honestly', 'seriously', 'literally',
  'actually', 'really', 'quite', 'rather', 'pretty', 'fairly', 'somewhat', 'kind of', 'sort of', 'a bit', 'a little',
  'so', 'such', 'too', 'enough', 'more', 'most', 'least', 'less', 'fewer', 'many', 'much', 'lots', 'tons', 'loads'
]);

export interface SentimentResult {
  sentiment: 'positive' | 'negative' | 'neutral';
  score: number;
  confidence: number;
  analysis: {
    positiveWords: string[];
    negativeWords: string[];
    negationCount: number;
    intensifierCount: number;
  };
}

export function analyzeSentiment(text: string): SentimentResult {
  // Clean and normalize the text
  const cleanedText = text.toLowerCase()
    .replace(/[^\w\s]/g, ' ') // Remove special characters but keep spaces
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim();

  // Tokenize the text
  const tokens = cleanedText.split(' ');
  
  let positiveScore = 0;
  let negativeScore = 0;
  let negationCount = 0;
  let intensifierCount = 0;
  
  const positiveWordsFound: string[] = [];
  const negativeWordsFound: string[] = [];
  
  // Analyze each token
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    const nextToken = tokens[i + 1];
    const prevToken = tokens[i - 1];
    
    // Check for negation
    if (negationWords.has(token)) {
      negationCount++;
      continue;
    }
    
    // Check for intensifiers
    if (intensifierWords.has(token)) {
      intensifierCount++;
      continue;
    }
    
    // Check for positive words
    if (positiveWords.has(token)) {
      let score = 1;
      
      // Apply intensifier multiplier
      if (prevToken && intensifierWords.has(prevToken)) {
        score *= 1.5;
      }
      
      // Apply negation (flip sentiment)
      if (prevToken && negationWords.has(prevToken)) {
        negativeScore += score;
        negativeWordsFound.push(token);
      } else {
        positiveScore += score;
        positiveWordsFound.push(token);
      }
    }
    
    // Check for negative words
    if (negativeWords.has(token)) {
      let score = 1;
      
      // Apply intensifier multiplier
      if (prevToken && intensifierWords.has(prevToken)) {
        score *= 1.5;
      }
      
      // Apply negation (flip sentiment)
      if (prevToken && negationWords.has(prevToken)) {
        positiveScore += score;
        positiveWordsFound.push(token);
      } else {
        negativeScore += score;
        negativeWordsFound.push(token);
      }
    }
  }
  
  // Calculate final sentiment
  const totalScore = positiveScore - negativeScore;
  const totalWords = positiveWordsFound.length + negativeWordsFound.length;
  
  // Determine sentiment based on score
  let sentiment: 'positive' | 'negative' | 'neutral';
  let confidence: number;
  
  if (totalWords === 0) {
    sentiment = 'neutral';
    confidence = 0.5;
  } else if (totalScore > 0) {
    sentiment = 'positive';
    confidence = Math.min(0.9, 0.5 + (totalScore / totalWords) * 0.4);
  } else if (totalScore < 0) {
    sentiment = 'negative';
    confidence = Math.min(0.9, 0.5 + (Math.abs(totalScore) / totalWords) * 0.4);
  } else {
    sentiment = 'neutral';
    confidence = 0.5;
  }
  
  // Boost confidence if there are many sentiment words
  if (totalWords >= 3) {
    confidence = Math.min(0.95, confidence + 0.1);
  }
  
  return {
    sentiment,
    score: totalScore,
    confidence,
    analysis: {
      positiveWords: positiveWordsFound,
      negativeWords: negativeWordsFound,
      negationCount,
      intensifierCount
    }
  };
}

// Additional analysis using compromise for better text understanding
export function enhancedSentimentAnalysis(text: string): SentimentResult {
  const doc = nlp(text);
  
  // Get sentences and their sentiment
  const sentences = doc.sentences().out('array');
  let overallScore = 0;
  let totalSentences = sentences.length;
  
  sentences.forEach(sentence => {
    const result = analyzeSentiment(sentence);
    overallScore += result.score;
  });
  
  const avgScore = totalSentences > 0 ? overallScore / totalSentences : 0;
  
  // Determine sentiment based on average score
  let sentiment: 'positive' | 'negative' | 'neutral';
  let confidence: number;
  
  if (Math.abs(avgScore) < 0.1) {
    sentiment = 'neutral';
    confidence = 0.6;
  } else if (avgScore > 0) {
    sentiment = 'positive';
    confidence = Math.min(0.9, 0.6 + Math.abs(avgScore) * 0.3);
  } else {
    sentiment = 'negative';
    confidence = Math.min(0.9, 0.6 + Math.abs(avgScore) * 0.3);
  }
  
  const baseResult = analyzeSentiment(text);
  
  return {
    sentiment,
    score: avgScore,
    confidence,
    analysis: baseResult.analysis
  };
} 