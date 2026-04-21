import { View, Text, SafeAreaView, TouchableOpacity, ScrollView, Alert, Linking } from 'react-native';
import React from 'react';
import { Settings as SettingsIcon, Trash2, Info, Github, User } from 'lucide-react-native';
import { useWatchlistStore } from '../store/watchlistStore';

export default function SettingsScreen() {
  const { clearWatchlist } = useWatchlistStore();

  const handleClearWatchlist = () => {
    Alert.alert(
      "Clear Watchlist",
      "Are you sure you want to remove all stocks from your watchlist?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Clear", style: "destructive", onPress: clearWatchlist }
      ]
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView className="flex-1 px-4 mt-6">
        <View className="mb-8">
            <Text className="text-3xl font-bold text-white mb-2 tracking-tight">Settings</Text>
            <Text className="text-textSecondary text-sm">Manage your preferences and learn more.</Text>
        </View>

        {/* Section 1: Data */}
        <Text className="text-textSecondary font-bold text-xs uppercase tracking-wider mb-3 ml-2">Data & Storage</Text>
        <View className="bg-surface rounded-2xl mb-8 border border-gray-800">
            <TouchableOpacity 
                className="flex-row items-center justify-between p-4"
                activeOpacity={0.7}
                onPress={handleClearWatchlist}
            >
                <View className="flex-row items-center">
                    <Trash2 color="#FF4757" size={20} />
                    <Text className="text-white font-medium ml-3">Clear Watchlist</Text>
                </View>
            </TouchableOpacity>
        </View>

        {/* Section 2: About */}
        <Text className="text-textSecondary font-bold text-xs uppercase tracking-wider mb-3 ml-2">About App</Text>
        <View className="bg-surface rounded-2xl mb-8 border border-gray-800">
            <TouchableOpacity 
                className="flex-row items-center justify-between p-4 border-b border-gray-800"
                activeOpacity={0.7}
            >
                <View className="flex-row items-center">
                    <Info color="#8B92A8" size={20} />
                    <View className="ml-3">
                        <Text className="text-white font-medium">How Sentiment is Calculated</Text>
                        <Text className="text-textSecondary text-xs mt-1" numberOfLines={2}>
                           Uses Groq Llama-3.3-70B to analyze current news headlines and determine a stock's pulse.
                        </Text>
                    </View>
                </View>
            </TouchableOpacity>

            <View className="flex-row items-center justify-between p-4 border-b border-gray-800">
                <View className="flex-row items-center">
                    <SettingsIcon color="#8B92A8" size={20} />
                    <View className="ml-3">
                        <Text className="text-white font-medium">API Attributions</Text>
                        <Text className="text-textSecondary text-xs mt-1">Yahoo Finance Unofficial API & NewsAPI.org</Text>
                    </View>
                </View>
            </View>

            <View className="flex-row items-center justify-between p-4">
                <View className="flex-row items-center">
                    <Info color="#8B92A8" size={20} />
                    <Text className="text-white font-medium ml-3">Version</Text>
                </View>
                <Text className="text-textSecondary font-medium">1.0.0</Text>
            </View>
        </View>

        {/* Section 3: Developer */}
        <Text className="text-textSecondary font-bold text-xs uppercase tracking-wider mb-3 ml-2">Developer</Text>
        <View className="bg-surface rounded-2xl mb-8 border border-gray-800">
            <View className="flex-row items-center justify-between p-4 border-b border-gray-800">
                <View className="flex-row items-center">
                    <User color="#8B92A8" size={20} />
                    <View className="ml-3">
                        <Text className="text-white font-medium">Built by</Text>
                        <Text className="text-textSecondary text-xs mt-1">Aditya Nair</Text>
                    </View>
                </View>
            </View>

            <TouchableOpacity 
                className="flex-row items-center justify-between p-4"
                activeOpacity={0.7}
                onPress={() => Linking.openURL('https://github.com/adityanair')}
            >
                <View className="flex-row items-center">
                    <Github color="#8B92A8" size={20} />
                    <Text className="text-white font-medium ml-3">View on GitHub</Text>
                </View>
            </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
