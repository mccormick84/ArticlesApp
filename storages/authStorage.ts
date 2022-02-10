import AsyncStorage from '@react-native-async-storage/async-storage';
import {AuthResult} from '../api/types';

const key = 'auth';

const authStorage = {
  async get() {
    const rawData = await AsyncStorage.getItem(key);
    if (!rawData) {
      return null;
    }
    try {
      const data: AuthResult = JSON.parse(rawData);
      return data;
    } catch (e) {
      return null;
    }
  },
  set(authResult: AuthResult) {
    return AsyncStorage.setItem(key, JSON.stringify(authResult));
  },
  clear() {
    return AsyncStorage.removeItem(key);
  },
};

// 타입 지원을 위해 AsyncStorage의 기능을 객체로 추상화하여 내보내기??????
export default authStorage;
