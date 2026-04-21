import { View, Text, SafeAreaView, TouchableOpacity, ScrollView, RefreshControl } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { Search, Flame } from 'lucide-react-native';
import StockCard from '../components/StockCard';
import { useWatchlistStore } from '../store/watchlistStore';

const TRENDING = [
  { symbol: 'RELIANCE.NS', name: 'Reliance Industries' },
  { symbol: 'TCS.NS', name: 'Tata Consultancy Services' },
  { symbol: 'HDFCBANK.NS', name: 'HDFC Bank' },
  { symbol: 'INFY.NS', name: 'Infosys' },
  { symbol: 'ICICIBANK.NS', name: 'ICICI Bank' },
  { symbol: 'BHARTIARTL.NS', name: 'Bharti Airtel' },
];

export default function HomeScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { watchlist } = useWatchlistStore();
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // Usually would trigger a refetch in child components or global state here
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView 
        contentContainerStyle={{ paddingBottom: 20 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#00D09C" />}
      >
        <View className="px-4 py-4 flex-row justify-between items-center">
          <Text className="text-2xl font-bold text-white tracking-tight">Stock<Text className="text-primary">Pulse</Text></Text>
        </View>
        
        <TouchableOpacity 
          className="mx-4 bg-surface p-4 rounded-full flex-row items-center border border-gray-800 shadow-sm"
          onPress={() => navigation.navigate('MainTabs', { screen: 'Search' })}
          activeOpacity={0.7}
        >
          <Search color="#8B92A8" size={20} />
          <Text className="text-textSecondary ml-3 flex-1 font-medium">Search NSE/BSE stocks...</Text>
        </TouchableOpacity>

        <View className="mt-8 px-4">
          <View className="flex-row items-center mb-4">
             <Flame color="#FFA502" size={18} />
             <Text className="text-textSecondary font-bold ml-2 tracking-wide uppercase text-xs">Trending Now</Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {TRENDING.map((stock) => (
              <TouchableOpacity 
                key={stock.symbol}
                className="bg-surface px-5 py-2.5 rounded-full mr-3 border border-gray-800"
                onPress={() => navigation.navigate('StockDetail', { ticker: stock.symbol, name: stock.name })}
                activeOpacity={0.7}
              >
                <Text className="text-white font-semibold">{stock.symbol.replace('.NS', '')}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View className="mt-10 px-4 flex-1">
          <Text className="text-white font-bold text-lg mb-4">Your Watchlist</Text>
          
          {watchlist.length === 0 ? (
            <View className="flex-1 items-center justify-center py-10 mt-10 opacity-60">
              <View className="w-16 h-16 rounded-full bg-surface items-center justify-center mb-4">
                 <Flame color="#8B92A8" size={24} />
              </View>
              <Text className="text-white font-semibold text-lg">Watchlist is Empty</Text>
              <Text className="text-textSecondary text-center mt-2 px-10">Search and add stocks to your watchlist to track their AI sentiment pulse.</Text>
            </View>
          ) : (
            watchlist.map((ticker) => (
               <StockCard key={ticker} ticker={ticker} />
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
