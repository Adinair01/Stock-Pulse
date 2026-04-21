import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { WatchlistStore } from '../types';

export const useWatchlistStore = create<WatchlistStore>()(
  persist(
    (set) => ({
      watchlist: [],
      addStock: (ticker) => set((state) => {
        if (!state.watchlist.includes(ticker)) {
          return { watchlist: [...state.watchlist, ticker] };
        }
        return state;
      }),
      removeStock: (ticker) => set((state) => ({
        watchlist: state.watchlist.filter((item) => item !== ticker)
      })),
      clearWatchlist: () => set({ watchlist: [] }),
    }),
    {
      name: 'stockpulse-watchlist',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
