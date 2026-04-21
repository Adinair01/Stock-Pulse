import AsyncStorage from '@react-native-async-storage/async-storage';
import { analyzeSentiment } from '../api/groqApi';
import { fetchStockNews } from '../api/newsApi';
import { SentimentAnalysis } from '../types';

interface CachedSentiment {
  timestamp: number;
  data: SentimentAnalysis;
}

const CACHE_TTL = 15 * 60 * 1000; // 15 minutes

export const getSentimentWithCache = async (ticker: string, companyName: string): Promise<{ sentiment: SentimentAnalysis | null, news: any[] }> => {
  try {
    const cacheKey = `sentiment_${ticker}`;
    const cachedDataStr = await AsyncStorage.getItem(cacheKey);

    let cachedSentiment: CachedSentiment | null = null;
    if (cachedDataStr) {
      cachedSentiment = JSON.parse(cachedDataStr);
    }

    const now = Date.now();
    const isCacheValid = cachedSentiment && (now - cachedSentiment.timestamp < CACHE_TTL);

    // Fetch fresh news regardless for the feed, but we might not need to re-score
    const news = await fetchStockNews(companyName);
    const headlines = news.slice(0, 8).map((article: any) => article.title);

    if (isCacheValid) {
        // Just return cached sentiment + fresh news
        return { sentiment: cachedSentiment!.data, news };
    }

    // Cache invalid or missing, fetch new sentiment
    if (headlines.length === 0) {
       return { sentiment: null, news: [] };
    }

    const freshSentiment = await analyzeSentiment(ticker, companyName, headlines);

    if (freshSentiment) {
        await AsyncStorage.setItem(cacheKey, JSON.stringify({
            timestamp: now,
            data: freshSentiment
        }));
    }

    return { sentiment: freshSentiment, news };
  } catch (error) {
    console.error("Error in getSentimentWithCache:", error);
    return { sentiment: null, news: [] };
  }
};
