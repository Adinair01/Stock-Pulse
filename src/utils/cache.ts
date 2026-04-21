import AsyncStorage from '@react-native-async-storage/async-storage';

export const setItemWithTTL = async (key: string, value: any, ttlMinutes: number = 15) => {
  const item = {
    value: value,
    expiry: Date.now() + ttlMinutes * 60 * 1000,
  };
  await AsyncStorage.setItem(key, JSON.stringify(item));
};

export const getItemWithTTL = async (key: string) => {
  const itemStr = await AsyncStorage.getItem(key);
  if (!itemStr) {
    return null;
  }
  const item = JSON.parse(itemStr);
  if (Date.now() > item.expiry) {
    await AsyncStorage.removeItem(key);
    return null;
  }
  return item.value;
};
