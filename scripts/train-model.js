const { CSVTrainer } = require('../src/utils/csvTrainer');
const path = require('path');

async function trainModel() {
  console.log('🚀 Starting Tweet Sentiment Model Training...\n');

  // Create trainer instance
  const trainer = new CSVTrainer();

  try {
    // Load your CSV file
    const csvPath = path.join(__dirname, '../data/tweets.csv');
    console.log(`📁 Loading CSV data from: ${csvPath}`);
    trainer.loadFromCSV(csvPath);

    // Show initial stats
    const stats = trainer.getStats();
    console.log('\n📊 Dataset Statistics:');
    console.log(`- Total tweets: ${stats.totalTweets}`);
    console.log(`- Positive: ${stats.sentimentDistribution.positive}`);
    console.log(`- Negative: ${stats.sentimentDistribution.negative}`);
    console.log(`- Neutral: ${stats.sentimentDistribution.neutral}`);

    // Train the model
    console.log('\n🧠 Training model...');
    const model = trainer.train();

    // Save the trained model
    const modelPath = path.join(__dirname, '../data/trained-model.json');
    trainer.saveModel(model, modelPath);

    console.log('\n✅ Training completed successfully!');
    console.log(`📁 Model saved to: ${modelPath}`);
    console.log('\n🎯 Model Statistics:');
    console.log(`- Learned ${Object.keys(model.wordWeights).length} word weights`);
    console.log(`- Learned ${Object.keys(model.emojiWeights).length} emoji weights`);
    console.log(`- Learned ${Object.keys(model.phraseWeights).length} phrase weights`);

    // Show some example word weights
    console.log('\n📝 Sample Word Weights:');
    const sortedWords = Object.entries(model.wordWeights)
      .sort(([,a], [,b]) => Math.abs(b) - Math.abs(a))
      .slice(0, 10);

    sortedWords.forEach(([word, weight]) => {
      const sentiment = weight > 0 ? 'positive' : 'negative';
      console.log(`  ${word}: ${weight.toFixed(3)} (${sentiment})`);
    });

    console.log('\n🎉 Your model is ready to use!');
    console.log('💡 You can now use this model in your sentiment analyzer for much better accuracy!');

  } catch (error) {
    console.error('❌ Training failed:', error.message);
    console.log('\n💡 Make sure you have a CSV file at data/tweets.csv with columns: tweet_text,sentiment');
    console.log('📝 Example CSV format:');
    console.log('tweet_text,sentiment');
    console.log('"I love this product!",positive');
    console.log('"This is terrible!",negative');
    console.log('"The weather is okay.",neutral');
  }
}

// Run training if this script is executed directly
if (require.main === module) {
  trainModel();
}

module.exports = { trainModel }; 