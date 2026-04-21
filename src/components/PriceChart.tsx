import React, { useState, useEffect } from 'react';
import { View, Text, Dimensions, ActivityIndicator, TouchableOpacity } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { fetchStockHistory } from '../api/stockApi';

interface PriceChartProps {
  ticker: string;
  color: string;
}

const RANGES = [
  { label: '1W', interval: '1d', range: '1mo', displayRange: 7 }, // Approx 1 week from 1mo data
  { label: '1M', interval: '1d', range: '1mo', displayRange: 30 },
  { label: '3M', interval: '1wk', range: '3mo', displayRange: 90 },
  { label: '1Y', interval: '1mo', range: '1y', displayRange: 365 },
] as const;

export default function PriceChart({ ticker, color }: PriceChartProps) {
  const [data, setData] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeRangeIndex, setActiveRangeIndex] = useState(1); // Default 1M

  useEffect(() => {
    let mounted = true;
    const loadChartData = async () => {
      setLoading(true);
      const rangeSelect = RANGES[activeRangeIndex];
      const history = await fetchStockHistory(ticker, rangeSelect.interval as any, rangeSelect.range as any);
      
      if (mounted) {
        if (history && history.length > 0) {
            // Trim to display length if it's 1W
            let sliceStart = 0;
            if (activeRangeIndex === 0 && history.length > 7) {
                sliceStart = history.length - 7;
            }
            setData(history.slice(sliceStart).map(h => h.price));
        } else {
            setData([]);
        }
        setLoading(false);
      }
    };
    loadChartData();
    return () => { mounted = false; };
  }, [ticker, activeRangeIndex]);

  return (
    <View className="my-6">
      <View className="h-[220px] justify-center items-center">
        {loading ? (
            <ActivityIndicator size="large" color={color} />
        ) : data.length > 0 ? (
            <LineChart
              data={{
                  labels: [], // No labels for cleaner look
                  datasets: [{ data }]
              }}
              width={Dimensions.get('window').width} // from react-native
              height={220}
              withDots={false}
              withInnerLines={false}
              withOuterLines={false}
              withHorizontalLabels={false}
              withVerticalLabels={false}
              yAxisInterval={1} 
              chartConfig={{
                  backgroundColor: '#0A0E1A',
                  backgroundGradientFrom: '#0A0E1A',
                  backgroundGradientTo: '#0A0E1A',
                  decimalPlaces: 2, 
                  color: (opacity = 1) => color,
                  labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                  style: { borderRadius: 16 },
                  propsForDots: { r: "0" }
              }}
              bezier
              style={{ paddingRight: 0, paddingLeft: 0, marginLeft: -10 }}
            />
        ) : (
            <Text className="text-textSecondary">Chart data not available</Text>
        )}
      </View>

      {/* Range Selectors */}
      <View className="flex-row justify-center mt-4 space-x-2">
         {RANGES.map((r, i) => {
             const isActive = activeRangeIndex === i;
             return (
                 <TouchableOpacity 
                    key={r.label}
                    onPress={() => setActiveRangeIndex(i)}
                    className={`px-4 py-1.5 rounded-full mx-1 ${isActive ? 'bg-surface border border-gray-700' : 'bg-transparent'}`}
                 >
                     <Text className={`font-medium ${isActive ? 'text-white' : 'text-textSecondary'}`}>
                         {r.label}
                     </Text>
                 </TouchableOpacity>
             );
         })}
      </View>
    </View>
  );
}
