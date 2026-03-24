import AsyncStorage from "@react-native-async-storage/async-storage";

export interface StoredAuth {
  _id: string;
  name: string;
  email: string;
  token: string;
}

const AUTH_STORAGE_KEY = "finsight_auth";

export async function saveAuth(authData: StoredAuth) {
  await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authData));
}

export async function getAuth() {
  const raw = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
  return raw ? (JSON.parse(raw) as StoredAuth) : null;
}

export async function getToken() {
  const auth = await getAuth();
  return auth?.token || null;
}

export async function clearAuth() {
  await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
}