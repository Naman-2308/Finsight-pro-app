import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Pressable,
  Animated,
  Easing,
  RefreshControl,
} from "react-native";
import { useFocusEffect } from "expo-router";
import { Colors } from "@/constants/colors";
import {
  getSummary,
  getExpenses,
  getFinanceOverview,
  getEmiOverview,
  getAIAdvice,
  type Expense,
  type ExpenseSummary,
  type FinanceOverview,
  type EmiOverview,
} from "@/services/expenseService";
import { getCachedAIAdvice, setCachedAIAdvice } from "@/lib/aiCache";
import HomeHeader from "@/components/home/HomeHeader";
import HeroSummaryCard from "@/components/home/HeroSummaryCard";
import StatCardsRow from "@/components/home/StatCardsRow";
import QuickActions from "@/components/home/QuickActions";
import BudgetHealthCard from "@/components/home/BudgetHealthCard";
import EmiLoadCard from "@/components/home/EmiLoadCard";
import AiQuickInsightCard from "@/components/home/AiQuickInsightCard";
import RecentExpensesList from "@/components/home/RecentExpensesList";

function parseAdvice(advice: string) {
  return advice
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => line.replace(/^[-*•]\s*/, ""))
    .filter(Boolean);
}

export default function HomeScreen() {
  const [summary, setSummary] = useState<ExpenseSummary | null>(null);
  const [recentExpenses, setRecentExpenses] = useState<Expense[]>([]);
  const [finance, setFinance] = useState<FinanceOverview | null>(null);
  const [emiOverview, setEmiOverview] = useState<EmiOverview | null>(null);
  const [aiAdvice, setAiAdvice] = useState("");
  const [aiLoading, setAiLoading] = useState(false);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [criticalError, setCriticalError] = useState("");
  const sectionAnims = useRef(
    Array.from({ length: 8 }, () => new Animated.Value(0))
  ).current;
  const ambientPulse = useRef(new Animated.Value(0)).current;
  const scrollY = useRef(new Animated.Value(0)).current;

  const loadAIAdvice = useCallback(async () => {
    try {
      setAiLoading(true);

      const cached = await getCachedAIAdvice();
      if (cached) {
        setAiAdvice(cached);
        return;
      }

      const aiData = await getAIAdvice();
      const advice = aiData?.advice || "";

      setAiAdvice(advice);

      if (advice) {
        await setCachedAIAdvice(advice);
      }
    } catch {
      // Do not fail screen because of AI
      setAiAdvice("");
    } finally {
      setAiLoading(false);
    }
  }, []);

  const loadHomeData = useCallback(async (silent = false) => {
    try {
      if (silent) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setCriticalError("");

      // Critical content first
      const [summaryData, expensesData] = await Promise.all([
        getSummary(),
        getExpenses(),
      ]);

      setSummary(summaryData);
      setRecentExpenses((expensesData || []).slice(0, 5));

      // Secondary widgets in background, isolated
      getFinanceOverview()
        .then((data) => setFinance(data))
        .catch(() => setFinance(null));

      getEmiOverview()
        .then((data) => setEmiOverview(data))
        .catch(() => setEmiOverview(null));

      loadAIAdvice();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to load dashboard";
      setCriticalError(message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [loadAIAdvice]);

  useFocusEffect(
    useCallback(() => {
      loadHomeData();
    }, [loadHomeData])
  );

  useEffect(() => {
    const entranceAnimation = Animated.stagger(
      70,
      sectionAnims.map((value) =>
        Animated.timing(value, {
          toValue: 1,
          duration: 520,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        })
      )
    );

    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(ambientPulse, {
          toValue: 1,
          duration: 2600,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(ambientPulse, {
          toValue: 0,
          duration: 2600,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ])
    );

    entranceAnimation.start();
    pulseAnimation.start();

    return () => {
      pulseAnimation.stop();
    };
  }, [ambientPulse, sectionAnims]);

  const firstAdvice = useMemo(() => {
    const points = parseAdvice(aiAdvice);
    return points[0] || "";
  }, [aiAdvice]);

  if (loading) {
    return (
      <View style={styles.loadingScreen}>
        <View style={styles.loadingGlow} />
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Loading your Finsight dashboard...</Text>
      </View>
    );
  }

  const ambientScale = ambientPulse.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.14],
  });

  const ambientOpacity = ambientPulse.interpolate({
    inputRange: [0, 1],
    outputRange: [0.28, 0.55],
  });

  const headerTranslateY = scrollY.interpolate({
    inputRange: [0, 140],
    outputRange: [0, -14],
    extrapolate: "clamp",
  });

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 140],
    outputRange: [1, 0.86],
    extrapolate: "clamp",
  });

  const topGlowOpacity = scrollY.interpolate({
    inputRange: [0, 220],
    outputRange: [0.45, 0.12],
    extrapolate: "clamp",
  });

  const getAnimatedSectionStyle = (index: number) => {
    const baseTranslateY = sectionAnims[index].interpolate({
      inputRange: [0, 1],
      outputRange: [22, 0],
    });
    const baseScale = sectionAnims[index].interpolate({
      inputRange: [0, 1],
      outputRange: [0.98, 1],
    });

    if (index === 0) {
      return {
        opacity: Animated.multiply(sectionAnims[index], headerOpacity),
        transform: [{ translateY: baseTranslateY }, { translateY: headerTranslateY }, { scale: baseScale }],
      };
    }

    return {
      opacity: sectionAnims[index],
      transform: [{ translateY: baseTranslateY }, { scale: baseScale }],
    };
  };

  return (
    <View style={styles.screen}>
      <Animated.View
        pointerEvents="none"
        style={[
          styles.ambientOrbPrimary,
          {
            opacity: topGlowOpacity,
            transform: [{ scale: ambientScale }],
          },
        ]}
      />
      <Animated.View
        pointerEvents="none"
        style={[
          styles.ambientOrbSecondary,
          {
            opacity: ambientOpacity.interpolate({
              inputRange: [0.28, 0.55],
              outputRange: [0.14, 0.3],
            }),
            transform: [{ scale: ambientScale }],
          },
        ]}
      />

      <Animated.ScrollView
        style={styles.screen}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => loadHomeData(true)}
            tintColor="#93C5FD"
            colors={[Colors.primary]}
          />
        }
      >
        <Animated.View style={getAnimatedSectionStyle(0)}>
          <HomeHeader />
        </Animated.View>

        {criticalError ? (
          <Animated.View style={[styles.errorCard, getAnimatedSectionStyle(1)]}>
            <Text style={styles.errorTitle}>Could not load dashboard</Text>
            <Text style={styles.errorText}>{criticalError}</Text>
            <Pressable
              style={({ pressed }) => [
                styles.retryButton,
                pressed && styles.retryButtonPressed,
              ]}
              onPress={() => loadHomeData(true)}
            >
              <Text style={styles.retryButtonText}>
                {refreshing ? "Refreshing..." : "Retry"}
              </Text>
            </Pressable>
          </Animated.View>
        ) : null}

        <Animated.View style={getAnimatedSectionStyle(2)}>
          <HeroSummaryCard
            monthExpense={summary?.monthExpense || 0}
            todayExpense={summary?.todayExpense || 0}
            weekExpense={summary?.weekExpense || 0}
          />
        </Animated.View>

        <Animated.View style={getAnimatedSectionStyle(3)}>
          <StatCardsRow
            todayExpense={summary?.todayExpense || 0}
            expenseCount={summary?.expenseCount || 0}
          />
        </Animated.View>

        <Animated.View style={getAnimatedSectionStyle(4)}>
          <QuickActions />
        </Animated.View>

        <Animated.View style={getAnimatedSectionStyle(5)}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Budget Health</Text>
            <Text style={styles.sectionSubtitle}>Spending stability score</Text>
          </View>
          <View style={styles.glassCard}>
            <BudgetHealthCard finance={finance} />
          </View>
        </Animated.View>

        <Animated.View style={getAnimatedSectionStyle(6)}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>EMI Load</Text>
            <Text style={styles.sectionSubtitle}>Debt pressure check</Text>
          </View>
          <View style={styles.glassCard}>
            <EmiLoadCard emiOverview={emiOverview} />
          </View>
        </Animated.View>

        <Animated.View style={getAnimatedSectionStyle(7)}>
          <View style={styles.glassCard}>
            <AiQuickInsightCard
              insight={
                aiLoading
                  ? "Generating AI insight..."
                  : firstAdvice ||
                    "Add more finance data and expenses to generate smarter AI insights."
              }
            />
          </View>
          <View style={styles.recentExpensesWrapper}>
            <RecentExpensesList
              expenses={recentExpenses}
              refreshing={refreshing}
              onRefresh={() => loadHomeData(true)}
            />
          </View>
        </Animated.View>
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  loadingScreen: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
  },
  loadingGlow: {
    position: "absolute",
    width: 210,
    height: 210,
    borderRadius: 999,
    backgroundColor: "rgba(56, 189, 248, 0.16)",
    shadowColor: "#38BDF8",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 32,
    elevation: 10,
  },
  loadingText: {
    color: "#A8B3CF",
    fontSize: 13,
    fontWeight: "600",
    letterSpacing: 0.3,
  },
  screen: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    position: "relative",
    padding: 25,
    paddingBottom: 54,
  },
  ambientOrbPrimary: {
    position: "absolute",
    top: -90,
    right: -50,
    width: 220,
    height: 220,
    borderRadius: 999,
    backgroundColor: "#2DD4BF",
    zIndex: 0,
  },
  ambientOrbSecondary: {
    position: "absolute",
    top: 200,
    left: -80,
    width: 170,
    height: 170,
    borderRadius: 999,
    backgroundColor: "#1D4ED8",
    zIndex: 0,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    marginTop: 16,
  },
  sectionTitle: {
    color: "#E6EEFF",
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 0.2,
  },
  sectionSubtitle: {
    color: "#8FA2CC",
    fontSize: 12,
    fontWeight: "600",
  },
  glassCard: {
    backgroundColor: "rgba(15, 23, 42, 0.62)",
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "rgba(125, 147, 188, 0.24)",
    padding: 10,
    marginBottom: 8,
    shadowColor: "#020617",
    shadowOffset: { width: 0, height: 18 },
    shadowOpacity: 0.35,
    shadowRadius: 26,
    elevation: 10,
  },
  recentExpensesWrapper: {
    marginTop: 10,
  },
  errorCard: {
    backgroundColor: "rgba(127, 29, 29, 0.48)",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(252, 165, 165, 0.5)",
    padding: 16,
    marginBottom: 16,
    shadowColor: "#7F1D1D",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 6,
  },
  errorTitle: {
    color: "#FEE2E2",
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 6,
  },
  errorText: {
    color: "#FECACA",
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  retryButton: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
  },
  retryButtonPressed: {
    opacity: 0.88,
    transform: [{ scale: 0.98 }],
  },
  retryButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
  },
});