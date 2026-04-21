export type RootStackParamList = {
  MainTabs: undefined;
  StockDetail: { ticker: string; name: string };
};

export type TabParamList = {
  Watchlist: undefined;
  Search: undefined;
  Settings: undefined;
};

export interface StockInfo {
  symbol: string;
  shortName: string;
  regularMarketPrice: number;
  regularMarketChangePercent: number;
  regularMarketChange: number;
  regularMarketDayHigh?: number;
  regularMarketDayLow?: number;
  regularMarketVolume?: number;
}

export interface NewsArticle {
  title: string;
  url: string;
  publishedAt: string;
  source: { name: string };
}

export type SentimentLabel = "Bullish" | "Neutral" | "Bearish";

export interface SentimentAnalysis {
  score: number;
  label: SentimentLabel;
  summary: string;
  headline_sentiments: ("positive" | "neutral" | "negative")[];
}

export interface WatchlistStore {
  watchlist: string[];
  addStock: (ticker: string) => void;
  removeStock: (ticker: string) => void;
  clearWatchlist: () => void;
}
