import AsyncStorage from "@react-native-async-storage/async-storage";

const AI_ADVICE_CACHE_KEY = "finsight_ai_advice_cache";
const AI_ADVICE_CACHE_TTL_MS = 1000 * 60 * 15; // 15 minutes

export interface CachedAIAdvice {
  advice: string;
  timestamp: number;
}

export async function getCachedAIAdvice(): Promise<string | null> {
  try {
    const raw = await AsyncStorage.getItem(AI_ADVICE_CACHE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as CachedAIAdvice;

    if (!parsed?.advice || !parsed?.timestamp) {
      return null;
    }

    const isExpired = Date.now() - parsed.timestamp > AI_ADVICE_CACHE_TTL_MS;
    if (isExpired) {
      return null;
    }

    return parsed.advice;
  } catch {
    return null;
  }
}

export async function setCachedAIAdvice(advice: string) {
  try {
    const payload: CachedAIAdvice = {
      advice,
      timestamp: Date.now(),
    };

    await AsyncStorage.setItem(AI_ADVICE_CACHE_KEY, JSON.stringify(payload));
  } catch {
    // ignore cache write failures
  }
}

export async function clearCachedAIAdvice() {
  try {
    await AsyncStorage.removeItem(AI_ADVICE_CACHE_KEY);
  } catch {
    // ignore cache clear failures
  }
}