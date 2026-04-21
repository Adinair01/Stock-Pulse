import { View, Text, SafeAreaView, TextInput, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { Search, X, TrendingUp } from 'lucide-react-native';
import { searchStocks } from '../api/stockApi';

export default function SearchScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (query.length > 1) {
        setLoading(true);
        const data = await searchStocks(query);
        setResults(data);
        setLoading(false);
      } else {
        setResults([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="px-4 py-4">
          <View className="flex-row items-center border-b border-gray-800 pb-4">
              <View className="flex-1 bg-surface flex-row items-center px-4 py-3 rounded-xl border border-gray-700">
                  <Search color="#8B92A8" size={20} />
                  <TextInput
                    className="flex-1 ml-3 text-white text-base"
                    placeholder="Search stocks (e.g. RELIANCE, TCS)"
                    placeholderTextColor="#8B92A8"
                    value={query}
                    onChangeText={setQuery}
                    autoFocus
                    autoCapitalize="characters"
                  />
                  {query.length > 0 && (
                      <TouchableOpacity onPress={() => setQuery('')}>
                          <X color="#8B92A8" size={20} />
                      </TouchableOpacity>
                  )}
              </View>
          </View>
      </View>

      {loading ? (
          <View className="flex-1 justify-center items-center">
              <ActivityIndicator color="#00D09C" size="large" />
          </View>
      ) : (
          <FlatList
              data={results}
              keyExtractor={(item) => item.symbol}
              contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 20 }}
              renderItem={({ item }) => (
                  <TouchableOpacity 
                      className="bg-surface p-4 rounded-xl mb-3 flex-row justify-between items-center border border-gray-800"
                      activeOpacity={0.7}
                      onPress={() => navigation.navigate('StockDetail', { ticker: item.symbol, name: item.shortName })}
                  >
                      <View className="flex-1">
                          <Text className="text-white font-bold text-lg">{item.symbol.replace('.NS', '').replace('.BO', '')}</Text>
                          <Text className="text-textSecondary text-xs mt-1" numberOfLines={1}>{item.shortName}</Text>
                      </View>
                      <View className="bg-background px-2 py-1 rounded text-xs border border-gray-700">
                          <Text className="text-textSecondary text-xs font-semibold">{item.exchange}</Text>
                      </View>
                  </TouchableOpacity>
              )}
              ListEmptyComponent={() => (
                  query.length > 1 && !loading ? (
                      <View className="flex-1 items-center justify-center pt-10">
                          <Text className="text-textSecondary">No results found for "{query}"</Text>
                      </View>
                  ) : null
              )}
          />
      )}
    </SafeAreaView>
  );
}
