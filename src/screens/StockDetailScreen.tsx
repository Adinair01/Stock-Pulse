import { View, Text, SafeAreaView, TouchableOpacity, ScrollView, ActivityIndicator, Linking } from 'react-native';
import React, { useEffect, useState } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList, StockInfo, SentimentAnalysis } from '../types';
import { ArrowLeft, Star, TrendingUp, TrendingDown, ExternalLink } from 'lucide-react-native';
import { fetchStockQuote } from '../api/stockApi';
import { getSentimentWithCache } from '../services/sentimentService';
import { useWatchlistStore } from '../store/watchlistStore';
import PriceChart from '../components/PriceChart';
import SentimentGauge from '../components/SentimentGauge';

type Props = NativeStackScreenProps<RootStackParamList, 'StockDetail'>;

export default function StockDetailScreen({ route, navigation }: Props) {
  const { ticker, name } = route.params;
  const { watchlist, addStock, removeStock } = useWatchlistStore();
  
  const inWatchlist = watchlist.includes(ticker);
  
  const [stockInfo, setStockInfo] = useState<StockInfo | null>(null);
  const [sentimentData, setSentimentData] = useState<SentimentAnalysis | null>(null);
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const loadAllData = async () => {
      setLoading(true);
      const [quote, { sentiment, news: newsArticles }] = await Promise.all([
        fetchStockQuote(ticker),
        getSentimentWithCache(ticker, name)
      ]);
      
      if (mounted) {
        setStockInfo(quote);
        setSentimentData(sentiment);
        setNews(newsArticles);
        setLoading(false);
      }
    };
    loadAllData();
    return () => { mounted = false; };
  }, [ticker, name]);

  const toggleWatchlist = () => {
    if (inWatchlist) removeStock(ticker);
    else addStock(ticker);
  };

  const getSentimentDotColor = (sentimentStr?: string) => {
      if (sentimentStr === 'positive') return '#00D09C';
      if (sentimentStr === 'negative') return '#FF4757';
      return '#FFA502';
  };

  if (loading || !stockInfo) {
      return (
          <SafeAreaView className="flex-1 bg-background justify-center items-center">
              <ActivityIndicator size="large" color="#00D09C" />
          </SafeAreaView>
      )
  }

  const isPositive = stockInfo.regularMarketChange >= 0;
  const color = isPositive ? '#00D09C' : '#FF4757';

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="px-4 py-4 flex-row justify-between items-center bg-background z-10">
        <TouchableOpacity onPress={() => navigation.goBack()} className="p-2 -ml-2" activeOpacity={0.7}>
          <ArrowLeft color="#FFFFFF" size={24} />
        </TouchableOpacity>
        <View className="flex-1 items-center px-4">
          <Text className="text-lg font-bold text-white tracking-wide" numberOfLines={1}>
             {ticker.replace('.NS', '')}
          </Text>
          <Text className="text-textSecondary text-xs font-medium" numberOfLines={1}>{name}</Text>
        </View>
        <TouchableOpacity className="p-2 -mr-2" onPress={toggleWatchlist} activeOpacity={0.7}>
          <Star color={inWatchlist ? "#FFA502" : "#8B92A8"} fill={inWatchlist ? "#FFA502" : "transparent"} size={22} />
        </TouchableOpacity>
      </View>
      
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Price Header Section */}
        <View className="px-4 pt-6 pb-2 items-center">
             <Text className="text-4xl font-extrabold text-white tracking-tight">₹{stockInfo.regularMarketPrice.toFixed(2)}</Text>
             <View className="flex-row items-center mt-2 bg-surface px-3 py-1 rounded-full border border-gray-800">
                {isPositive ? <TrendingUp color={color} size={16} /> : <TrendingDown color={color} size={16} />}
                <Text style={{ color }} className="text-sm ml-1.5 font-bold">
                  {isPositive ? '+' : ''}{stockInfo.regularMarketChange.toFixed(2)} ({stockInfo.regularMarketChangePercent.toFixed(2)}%)
                </Text>
             </View>
        </View>

        {/* Stats Row */}
        <View className="flex-row justify-between px-6 py-4 mt-2">
            <View className="items-center">
                <Text className="text-textSecondary text-xs mb-1">Day High</Text>
                <Text className="text-white font-semibold">₹{stockInfo.regularMarketDayHigh?.toFixed(2) || '--'}</Text>
            </View>
            <View className="items-center">
                <Text className="text-textSecondary text-xs mb-1">Day Low</Text>
                <Text className="text-white font-semibold">₹{stockInfo.regularMarketDayLow?.toFixed(2) || '--'}</Text>
            </View>
            <View className="items-center">
                <Text className="text-textSecondary text-xs mb-1">Volume</Text>
                <Text className="text-white font-semibold">
                   {stockInfo.regularMarketVolume ? (stockInfo.regularMarketVolume / 1000000).toFixed(2) + 'M' : '--'}
                </Text>
            </View>
        </View>

        {/* Chart Section */}
        <PriceChart ticker={ticker} color={color} />

        {/* Sentiment Analysis Gauge Hero */}
        <View className="mt-6 border-t border-gray-900 pt-8" />
        
        {sentimentData ? (
             <SentimentGauge 
                score={sentimentData.score} 
                label={sentimentData.label} 
                summary={sentimentData.summary} 
             />
        ) : (
            <View className="items-center justify-center py-10 opacity-50 px-8">
                <ActivityIndicator color="#00D09C" className="mb-4" />
                <Text className="text-white font-medium text-center">Analyzing millions of data points with AI...</Text>
            </View>
        )}

        {/* News Section */}
        <View className="mt-8 px-4 border-t border-gray-900 pt-8">
            <Text className="text-white font-bold text-lg mb-4">Recent News</Text>
            {news.length === 0 ? (
                <Text className="text-textSecondary">No recent news available to analyze.</Text>
            ) : (
                news.slice(0, 5).map((article, index) => {
                    // Match headline sentiment if available
                    const articleSentiment = sentimentData?.headline_sentiments?.[index] || 'neutral';
                    const dotColor = getSentimentDotColor(articleSentiment);
                    
                    return (
                        <TouchableOpacity 
                            key={index} 
                            className="bg-surface p-4 rounded-xl mb-3 border border-gray-800"
                            activeOpacity={0.7}
                            onPress={() => Linking.openURL(article.url)}
                        >
                            <View className="flex-row justify-between items-start">
                                <View className="flex-1 pr-3">
                                   <Text className="text-white font-medium text-sm leading-5" numberOfLines={2}>
                                       {article.title}
                                   </Text>
                                   <View className="flex-row items-center mt-2 opacity-70">
                                       <Text className="text-textSecondary text-xs mr-3">{article.source.name}</Text>
                                       <Text className="text-textSecondary text-xs">
                                           {new Date(article.publishedAt).toLocaleDateString()}
                                       </Text>
                                   </View>
                                </View>
                                <View className="items-center pl-2 border-l border-gray-800 h-full justify-center">
                                    <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: dotColor, marginBottom: 8 }} />
                                    <ExternalLink color="#8B92A8" size={14} />
                                </View>
                            </View>
                        </TouchableOpacity>
                    )
                })
            )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
