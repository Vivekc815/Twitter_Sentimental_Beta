import { TrainedModel } from './csvTrainer';

export interface EnhancedSentimentResult {
  sentiment: 'positive' | 'negative' | 'neutral';
  score: number;
  confidence: number;
  analysis: {
    wordScores: { [word: string]: number };
    emojiScores: { [emoji: string]: number };
    phraseScores: { [phrase: string]: number };
    totalWords: number;
    totalEmojis: number;
    totalPhrases: number;
  };
}

export class EnhancedSentimentAnalyzer {
  private model: TrainedModel;

  constructor(model: TrainedModel) {
    this.model = model;
  }

  analyze(text: string): EnhancedSentimentResult {
    const words = this.extractWords(text);
    const emojis = this.extractEmojis(text);
    const phrases = this.extractPhrases(text);

    let totalScore = 0;
    const wordScores: { [word: string]: number } = {};
    const emojiScores: { [emoji: string]: number } = {};
    const phraseScores: { [phrase: string]: number } = {};

    // Score individual words
    words.forEach(word => {
      const weight = this.model.wordWeights[word] || 0;
      if (weight !== 0) {
        wordScores[word] = weight;
        totalScore += weight;
      }
    });

    // Score emojis (emojis are strong indicators)
    emojis.forEach(emoji => {
      const weight = this.model.emojiWeights[emoji] || 0;
      if (weight !== 0) {
        emojiScores[emoji] = weight;
        totalScore += weight * 1.5; // Emojis get extra weight
      }
    });

    // Score phrases (phrases are very strong indicators)
    phrases.forEach(phrase => {
      const weight = this.model.phraseWeights[phrase] || 0;
      if (weight !== 0) {
        phraseScores[phrase] = weight;
        totalScore += weight * 2; // Phrases get double weight
      }
    });

    // Determine sentiment based on score
    let sentiment: 'positive' | 'negative' | 'neutral';
    let confidence: number;

    if (Math.abs(totalScore) < 0.5) {
      sentiment = 'neutral';
      confidence = 0.6;
    } else if (totalScore > 0) {
      sentiment = 'positive';
      confidence = Math.min(0.95, 0.6 + Math.abs(totalScore) * 0.2);
    } else {
      sentiment = 'negative';
      confidence = Math.min(0.95, 0.6 + Math.abs(totalScore) * 0.2);
    }

    // Boost confidence if we have multiple indicators
    const totalIndicators = Object.keys(wordScores).length + 
                           Object.keys(emojiScores).length + 
                           Object.keys(phraseScores).length;
    
    if (totalIndicators >= 3) {
      confidence = Math.min(0.98, confidence + 0.1);
    }

    return {
      sentiment,
      score: totalScore,
      confidence,
      analysis: {
        wordScores,
        emojiScores,
        phraseScores,
        totalWords: Object.keys(wordScores).length,
        totalEmojis: Object.keys(emojiScores).length,
        totalPhrases: Object.keys(phraseScores).length
      }
    };
  }

  private extractWords(text: string): string[] {
    return text.toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 2 && word.length < 20)
      .filter(word => !this.isStopWord(word));
  }

  private extractEmojis(text: string): string[] {
    const emojiRegex = /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu;
    return text.match(emojiRegex) || [];
  }

  private extractPhrases(text: string): string[] {
    const phrases: string[] = [];
    const words = text.toLowerCase().split(/\s+/);
    
    // Extract 2-word phrases
    for (let i = 0; i < words.length - 1; i++) {
      const phrase = `${words[i]} ${words[i + 1]}`;
      if (phrase.length > 5 && phrase.length < 30) {
        phrases.push(phrase);
      }
    }

    // Extract 3-word phrases
    for (let i = 0; i < words.length - 2; i++) {
      const phrase = `${words[i]} ${words[i + 1]} ${words[i + 2]}`;
      if (phrase.length > 8 && phrase.length < 40) {
        phrases.push(phrase);
      }
    }

    return phrases;
  }

  private isStopWord(word: string): boolean {
    const stopWords = new Set([
      'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by',
      'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did',
      'will', 'would', 'could', 'should', 'may', 'might', 'must', 'can', 'this', 'that', 'these', 'those'
    ]);
    return stopWords.has(word);
  }

  // Get model statistics
  getModelStats(): any {
    return {
      totalWords: Object.keys(this.model.wordWeights).length,
      totalEmojis: Object.keys(this.model.emojiWeights).length,
      totalPhrases: Object.keys(this.model.phraseWeights).length,
      averageScores: this.model.averageScore
    };
  }

  // Get top positive and negative words
  getTopWords(limit: number = 10): { positive: string[], negative: string[] } {
    const sortedWords = Object.entries(this.model.wordWeights)
      .sort(([,a], [,b]) => Math.abs(b) - Math.abs(a));

    const positive = sortedWords
      .filter(([, weight]) => weight > 0)
      .slice(0, limit)
      .map(([word]) => word);

    const negative = sortedWords
      .filter(([, weight]) => weight < 0)
      .slice(0, limit)
      .map(([word]) => word);

    return { positive, negative };
  }
} 