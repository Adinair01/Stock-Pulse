import axios from 'axios';
import { StockInfo } from '../types';

// We use raw Yahoo Finance REST APIs because the `yahoo-finance2` npm package 
// relies on Node.js core modules (like 'fs') which are incompatible with React Native.

export const fetchStockQuote = async (ticker: string): Promise<StockInfo | null> => {
  try {
    const symbol = ticker.endsWith('.NS') || ticker.endsWith('.BO') ? ticker : `${ticker}.NS`;
    const response = await axios.get(`https://query1.finance.yahoo.com/v8/finance/chart/${symbol}`);
    
    if (!response.data?.chart?.result?.[0]) return null;

    const result = response.data.chart.result[0];
    const meta = result.meta;
    const indicators = result.indicators.quote[0];

    const currentPrice = meta.regularMarketPrice;
    const previousClose = meta.previousClose;
    const change = currentPrice - previousClose;
    const changePercent = (change / previousClose) * 100;

    return {
      symbol: meta.symbol,
      shortName: meta.shortName || meta.symbol,
      regularMarketPrice: currentPrice || 0,
      regularMarketChangePercent: changePercent || 0,
      regularMarketChange: change || 0,
      regularMarketDayHigh: indicators.high ? Math.max(...indicators.high.filter(Boolean)) : undefined,
      regularMarketDayLow: indicators.low ? Math.min(...indicators.low.filter(Boolean)) : undefined,
      regularMarketVolume: indicators.volume ? indicators.volume[indicators.volume.length - 1] : undefined,
    };
  } catch (error) {
    console.error(`Error fetching quote for ${ticker}:`, error);
    return null;
  }
};

export const fetchStockHistory = async (ticker: string, interval: string = '1d', range: string = '1mo') => {
    try {
        const symbol = ticker.endsWith('.NS') || ticker.endsWith('.BO') ? ticker : `${ticker}.NS`;
        const response = await axios.get(`https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=${interval}&range=${range}`);
        
        const result = response.data?.chart?.result?.[0];
        if (!result || !result.timestamp) return [];

        const timestamps = result.timestamp;
        const closes = result.indicators.quote[0].close;

        return timestamps.map((ts: number, index: number) => ({
            timestamp: ts * 1000,
            price: closes[index] || 0
        })).filter((q: any) => q.price > 0);
    } catch(error) {
        console.error(`Error fetching history for ${ticker}:`, error);
        return [];
    }
}

export const searchStocks = async (query: string) => {
    try {
        const response = await axios.get(`https://query2.finance.yahoo.com/v1/finance/search?q=${query}&quotesCount=10&newsCount=0`);
        const quotes = response.data?.quotes || [];
        
        return quotes
          .filter((q: any) => q.exchange === 'NSI' || q.exchange === 'BSE' || q.symbol.endsWith('.NS') || q.symbol.endsWith('.BO'))
          .map((q: any) => ({
              symbol: q.symbol,
              shortName: q.shortname || q.longname || q.symbol,
              exchange: q.exchange
          }));
    } catch (error) {
        console.error(`Error searching for ${query}:`, error);
        return [];
    }
}
