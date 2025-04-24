import AsyncStorage from '@react-native-async-storage/async-storage';
import AsyncStorags from '@react-native-async-storage/async-storage';


export function setItem(key, data) {
    data = JSON.stringify(data);
    return AsyncStorags.setItem(key, data);
  }

  export async function getItem(key) {
    try {
      const value = await AsyncStorage.getItem(key);
      return value != null ? JSON.parse(value) : null;
    } catch (e) {
      console.error('Error reading value', e);
      return null;
    }
  }