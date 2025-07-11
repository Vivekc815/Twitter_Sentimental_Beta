import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report
import joblib
import os

# 1. Load data
df = pd.read_csv('data/tweets.csv')

# 2. Clean data (optional: more cleaning can be added)
df = df.dropna(subset=['tweet_text', 'sentiment'])
X = df['tweet_text']
y = df['sentiment']

# 3. Split data
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# 4. Vectorize text
vectorizer = TfidfVectorizer(
    ngram_range=(1,3),  # Include 1-3 word combinations
    max_features=3000,  # Limit features to prevent overfitting
    min_df=2,  # Word must appear at least 2 times
    max_df=0.8,  # Word must not appear in more than 80% of documents
    stop_words='english'  # Remove common English words
)
X_train_vec = vectorizer.fit_transform(X_train)
X_test_vec = vectorizer.transform(X_test)

# 5. Train classifier with better parameters
clf = LogisticRegression(
    max_iter=1000,  # More iterations for better convergence
    C=1.0,  # Regularization strength
    random_state=42,  # For reproducible results
    class_weight='balanced'  # Handle imbalanced classes
)
clf.fit(X_train_vec, y_train)

# 6. Evaluate
y_pred = clf.predict(X_test_vec)
print(classification_report(y_test, y_pred))

# 7. Save model and vectorizer
os.makedirs('ml_model', exist_ok=True)
joblib.dump(clf, 'ml_model/sentiment_model.joblib')
joblib.dump(vectorizer, 'ml_model/vectorizer.joblib')
print('Model and vectorizer saved in ml_model/') 