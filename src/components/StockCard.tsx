import { View, Text, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, StockInfo } from '../types';
import { fetchStockQuote } from '../api/stockApi';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react-native';

interface StockCardProps {
  ticker: string;
}

export default function StockCard({ ticker }: StockCardProps) {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [stockInfo, setStockInfo] = useState<StockInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const loadData = async () => {
      const data = await fetchStockQuote(ticker);
      if (mounted) {
        setStockInfo(data);
        setLoading(false);
      }
    };
    loadData();
    return () => { mounted = false; };
  }, [ticker]);

  if (loading) {
    return (
      <View className="bg-surface p-4 rounded-xl mb-3 flex-row justify-between items-center border border-gray-800 opacity-50">
        <View>
           <View className="w-20 h-5 bg-gray-700 rounded mb-2" />
           <View className="w-32 h-3 bg-gray-700 rounded" />
        </View>
        <View className="items-end">
           <View className="w-16 h-5 bg-gray-700 rounded mb-2" />
           <View className="w-12 h-3 bg-gray-700 rounded" />
        </View>
      </View>
    );
  }

  if (!stockInfo) return null;

  const isPositive = stockInfo.regularMarketChange >= 0;
  const color = isPositive ? '#00D09C' : '#FF4757';

  return (
    <TouchableOpacity 
      className="bg-surface p-4 rounded-xl mb-3 flex-row justify-between items-center border border-gray-800"
      onPress={() => navigation.navigate('StockDetail', { ticker: stockInfo.symbol, name: stockInfo.shortName })}
    >
      <View className="flex-1">
        <Text className="text-white font-bold text-lg">{stockInfo.symbol.replace('.NS', '')}</Text>
        <Text className="text-textSecondary text-xs mt-1" numberOfLines={1}>{stockInfo.shortName}</Text>
      </View>

      <View className="items-end pl-4">
        <Text className="text-white font-bold text-lg">₹{stockInfo.regularMarketPrice.toFixed(2)}</Text>
        <View className="flex-row items-center mt-1">
          {isPositive ? <TrendingUp color={color} size={12} /> : <TrendingDown color={color} size={12} />}
          <Text style={{ color }} className="text-xs ml-1 font-medium">
            {isPositive ? '+' : ''}{stockInfo.regularMarketChangePercent.toFixed(2)}%
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
