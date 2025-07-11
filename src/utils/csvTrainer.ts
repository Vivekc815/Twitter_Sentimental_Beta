import fs from 'fs';
import path from 'path';

export interface TweetData {
  tweet_text: string;
  sentiment: 'positive' | 'negative' | 'neutral';
}

export interface TrainedModel {
  wordWeights: { [word: string]: number };
  emojiWeights: { [emoji: string]: number };
  phraseWeights: { [phrase: string]: number };
  averageScore: {
    positive: number;
    negative: number;
    neutral: number;
  };
}

export class CSVTrainer {
  private tweets: TweetData[] = [];
  private wordCounts: { [word: string]: { positive: number; negative: number; neutral: number } } = {};
  private emojiCounts: { [emoji: string]: { positive: number; negative: number; neutral: number } } = {};
  private phraseCounts: { [phrase: string]: { positive: number; negative: number; neutral: number } } = {};

  // Load CSV data
  loadFromCSV(filePath: string): void {
    try {
      const csvContent = fs.readFileSync(filePath, 'utf-8');
      const lines = csvContent.split('\n').filter(line => line.trim());
      
      // Skip header if it exists
      const dataLines = lines[0].includes('tweet_text') ? lines.slice(1) : lines;
      
      this.tweets = dataLines.map(line => {
        const [tweet_text, sentiment] = line.split(',').map(s => s.trim().replace(/"/g, ''));
        return {
          tweet_text,
          sentiment: this.normalizeSentiment(sentiment)
        };
      });

      console.log(`Loaded ${this.tweets.length} tweets from CSV`);
    } catch (error) {
      console.error('Error loading CSV:', error);
      throw new Error('Failed to load CSV file');
    }
  }

  // Train the model
  train(): TrainedModel {
    console.log('Starting training...');
    
    // Reset counters
    this.wordCounts = {};
    this.emojiCounts = {};
    this.phraseCounts = {};

    // Process each tweet
    this.tweets.forEach(tweet => {
      this.processTweet(tweet);
    });

    // Calculate word weights
    const wordWeights = this.calculateWordWeights();
    const emojiWeights = this.calculateEmojiWeights();
    const phraseWeights = this.calculatePhraseWeights();
    const averageScore = this.calculateAverageScores();

    console.log('Training completed!');
    console.log(`- Learned ${Object.keys(wordWeights).length} word weights`);
    console.log(`- Learned ${Object.keys(emojiWeights).length} emoji weights`);
    console.log(`- Learned ${Object.keys(phraseWeights).length} phrase weights`);

    return {
      wordWeights,
      emojiWeights,
      phraseWeights,
      averageScore
    };
  }

  // Save trained model
  saveModel(model: TrainedModel, outputPath: string): void {
    try {
      fs.writeFileSync(outputPath, JSON.stringify(model, null, 2));
      console.log(`Model saved to ${outputPath}`);
    } catch (error) {
      console.error('Error saving model:', error);
    }
  }

  // Load trained model
  loadModel(filePath: string): TrainedModel {
    try {
      const modelData = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(modelData);
    } catch (error) {
      console.error('Error loading model:', error);
      throw new Error('Failed to load trained model');
    }
  }

  private normalizeSentiment(sentiment: string): 'positive' | 'negative' | 'neutral' {
    const normalized = sentiment.toLowerCase().trim();
    if (['positive', 'pos', '1', 'happy', 'good'].includes(normalized)) {
      return 'positive';
    } else if (['negative', 'neg', '0', 'sad', 'bad'].includes(normalized)) {
      return 'negative';
    } else {
      return 'neutral';
    }
  }

  private processTweet(tweet: TweetData): void {
    const words = this.extractWords(tweet.tweet_text);
    const emojis = this.extractEmojis(tweet.tweet_text);
    const phrases = this.extractPhrases(tweet.tweet_text);

    // Count words
    words.forEach(word => {
      if (!this.wordCounts[word]) {
        this.wordCounts[word] = { positive: 0, negative: 0, neutral: 0 };
      }
      this.wordCounts[word][tweet.sentiment]++;
    });

    // Count emojis
    emojis.forEach(emoji => {
      if (!this.emojiCounts[emoji]) {
        this.emojiCounts[emoji] = { positive: 0, negative: 0, neutral: 0 };
      }
      this.emojiCounts[emoji][tweet.sentiment]++;
    });

    // Count phrases
    phrases.forEach(phrase => {
      if (!this.phraseCounts[phrase]) {
        this.phraseCounts[phrase] = { positive: 0, negative: 0, neutral: 0 };
      }
      this.phraseCounts[phrase][tweet.sentiment]++;
    });
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

  private calculateWordWeights(): { [word: string]: number } {
    const weights: { [word: string]: number } = {};
    
    Object.entries(this.wordCounts).forEach(([word, counts]) => {
      const total = counts.positive + counts.negative + counts.neutral;
      if (total >= 3) { // Only consider words that appear at least 3 times
        const positiveRatio = counts.positive / total;
        const negativeRatio = counts.negative / total;
        
        // Calculate weight: positive words get positive weight, negative words get negative weight
        let weight = 0;
        if (positiveRatio > 0.6) {
          weight = positiveRatio * 2; // Strong positive
        } else if (negativeRatio > 0.6) {
          weight = -negativeRatio * 2; // Strong negative
        } else if (Math.abs(positiveRatio - negativeRatio) > 0.3) {
          weight = (positiveRatio - negativeRatio) * 1.5; // Moderate sentiment
        }
        
        if (Math.abs(weight) > 0.1) {
          weights[word] = weight;
        }
      }
    });

    return weights;
  }

  private calculateEmojiWeights(): { [emoji: string]: number } {
    const weights: { [emoji: string]: number } = {};
    
    Object.entries(this.emojiCounts).forEach(([emoji, counts]) => {
      const total = counts.positive + counts.negative + counts.neutral;
      if (total >= 2) { // Emojis are rarer, so lower threshold
        const positiveRatio = counts.positive / total;
        const negativeRatio = counts.negative / total;
        
        let weight = 0;
        if (positiveRatio > 0.5) {
          weight = positiveRatio * 3; // Emojis are strong indicators
        } else if (negativeRatio > 0.5) {
          weight = -negativeRatio * 3;
        }
        
        if (Math.abs(weight) > 0.5) {
          weights[emoji] = weight;
        }
      }
    });

    return weights;
  }

  private calculatePhraseWeights(): { [phrase: string]: number } {
    const weights: { [phrase: string]: number } = {};
    
    Object.entries(this.phraseCounts).forEach(([phrase, counts]) => {
      const total = counts.positive + counts.negative + counts.neutral;
      if (total >= 2) { // Phrases are rarer
        const positiveRatio = counts.positive / total;
        const negativeRatio = counts.negative / total;
        
        let weight = 0;
        if (positiveRatio > 0.6) {
          weight = positiveRatio * 2.5; // Phrases are strong indicators
        } else if (negativeRatio > 0.6) {
          weight = -negativeRatio * 2.5;
        }
        
        if (Math.abs(weight) > 0.8) {
          weights[phrase] = weight;
        }
      }
    });

    return weights;
  }

  private calculateAverageScores(): { positive: number; negative: number; neutral: number } {
    const sentimentCounts = { positive: 0, negative: 0, neutral: 0 };
    
    this.tweets.forEach(tweet => {
      sentimentCounts[tweet.sentiment]++;
    });

    const total = this.tweets.length;
    return {
      positive: sentimentCounts.positive / total,
      negative: sentimentCounts.negative / total,
      neutral: sentimentCounts.neutral / total
    };
  }

  // Get training statistics
  getStats(): any {
    const sentimentCounts = { positive: 0, negative: 0, neutral: 0 };
    this.tweets.forEach(tweet => {
      sentimentCounts[tweet.sentiment]++;
    });

    return {
      totalTweets: this.tweets.length,
      sentimentDistribution: sentimentCounts,
      uniqueWords: Object.keys(this.wordCounts).length,
      uniqueEmojis: Object.keys(this.emojiCounts).length,
      uniquePhrases: Object.keys(this.phraseCounts).length
    };
  }
} 