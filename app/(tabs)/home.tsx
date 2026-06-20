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
import { useFocusEffect, router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Bot } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Colors } from "@/constants/colors";
import { Spacing } from "@/constants/spacing";
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
import { useAiAdvice } from "@/hooks/use-ai-advice";
import { parseBulletedLines } from "@/lib/text";
import HomeHeader from "@/components/home/HomeHeader";
import HeroSummaryCard from "@/components/home/HeroSummaryCard";
import StatCardsRow from "@/components/home/StatCardsRow";
import QuickActions from "@/components/home/QuickActions";
import BudgetHealthCard from "@/components/home/BudgetHealthCard";
import EmiLoadCard from "@/components/home/EmiLoadCard";
import AiQuickInsightCard from "@/components/home/AiQuickInsightCard";
import RecentExpensesList from "@/components/home/RecentExpensesList";
import TitledCardSection from "@/components/ui/TitledCardSection";

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const [summary, setSummary] = useState<ExpenseSummary | null>(null);
  const [recentExpenses, setRecentExpenses] = useState<Expense[]>([]);
  const [finance, setFinance] = useState<FinanceOverview | null>(null);
  const [emiOverview, setEmiOverview] = useState<EmiOverview | null>(null);
  const { advice: aiAdvice, loading: aiLoading, refresh: refreshAiAdvice } =
    useAiAdvice(getAIAdvice);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [criticalError, setCriticalError] = useState("");
  const lastLoadedAt = useRef<number>(0);
  const sectionAnims = useRef(
    Array.from({ length: 8 }, () => new Animated.Value(0))
  ).current;
  const ambientPulse = useRef(new Animated.Value(0)).current;
  const scrollY = useRef(new Animated.Value(0)).current;

  const loadHomeData = useCallback(async (silent = false) => {
    // Stale-while-revalidate: skip auto-refetch on tab focus if data is fresh (< 30s old)
    // Pull-to-refresh (silent=true) always forces a full refetch
    const STALE_MS = 30_000;
    if (!silent && Date.now() - lastLoadedAt.current < STALE_MS) return;

    try {
      if (silent) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setCriticalError("");

      // Critical content first — fetch only 5 recent expenses (limit param avoids loading entire history)
      const [summaryData, expensesData] = await Promise.all([
        getSummary(),
        getExpenses({ limit: 5 }),
      ]);

      setSummary(summaryData);
      setRecentExpenses(expensesData || []);
      lastLoadedAt.current = Date.now();

      // Secondary widgets in background, isolated
      getFinanceOverview()
        .then((data) => setFinance(data))
        .catch(() => setFinance(null));

      getEmiOverview()
        .then((data) => setEmiOverview(data))
        .catch(() => setEmiOverview(null));

      refreshAiAdvice();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to load dashboard";
      setCriticalError(message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [refreshAiAdvice]);

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
    const points = parseBulletedLines(aiAdvice);
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
        keyboardShouldPersistTaps="handled"
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => loadHomeData(true)}
            tintColor={Colors.accentTeal}
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
          <TitledCardSection
            title="Budget Health"
            subtitle="Spending stability score"
            cardStyle={styles.sectionCard}
          >
            <BudgetHealthCard finance={finance} />
          </TitledCardSection>
        </Animated.View>

        <Animated.View style={getAnimatedSectionStyle(6)}>
          <TitledCardSection
            title="EMI Load"
            subtitle="Debt pressure check"
            cardStyle={styles.sectionCard}
          >
            <EmiLoadCard emiOverview={emiOverview} />
          </TitledCardSection>
        </Animated.View>

        <Animated.View style={getAnimatedSectionStyle(7)}>
          <TitledCardSection
            title="AI Insight"
            subtitle="One actionable suggestion"
            cardStyle={styles.sectionCard}
          >
            <AiQuickInsightCard
              insight={
                aiLoading
                  ? "Generating AI insight..."
                  : firstAdvice ||
                    "Add more finance data and expenses to generate smarter AI insights."
              }
            />
          </TitledCardSection>
          <View style={styles.recentExpensesWrapper}>
            <RecentExpensesList
              expenses={recentExpenses}
              refreshing={refreshing}
              onRefresh={() => loadHomeData(true)}
            />
          </View>
        </Animated.View>
      </Animated.ScrollView>

      {/* ── AI Copilot FAB ───────────────────────────────────────── */}
      <Pressable
        style={({ pressed }) => [
          styles.fab,
          { bottom: Math.max(insets.bottom + 20, 28) },
          pressed && styles.fabPressed,
        ]}
        onPress={() => router.push("/ai-chat")}
      >
        <LinearGradient
          colors={[Colors.primaryLight, Colors.primary, Colors.primaryDark]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.fabGradient}
        >
          <Bot size={22} color="#0A0C10" strokeWidth={2.2} />
        </LinearGradient>
      </Pressable>
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
    width: 220,
    height: 220,
    borderRadius: 999,
    backgroundColor: "rgba(20, 217, 196, 0.14)",
    shadowColor: Colors.accentTeal,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 36,
    elevation: 10,
  },
  loadingText: {
    color: Colors.mutedText,
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
    padding: Spacing.xl,
    paddingBottom: 54,
  },
  ambientOrbPrimary: {
    position: "absolute",
    top: -80,
    right: -50,
    width: 240,
    height: 240,
    borderRadius: 999,
    backgroundColor: "rgba(0, 214, 143, 0.10)",
    zIndex: 0,
  },
  ambientOrbSecondary: {
    position: "absolute",
    top: 220,
    left: -70,
    width: 180,
    height: 180,
    borderRadius: 999,
    backgroundColor: "rgba(79, 131, 241, 0.08)",
    zIndex: 0,
  },
  sectionCard: {
    marginBottom: Spacing.xs,
  },
  recentExpensesWrapper: {
    marginTop: Spacing.sm,
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

  // FAB
  fab: {
    position: "absolute",
    right: 20,
    borderRadius: 999,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.45,
    shadowRadius: 16,
    elevation: 10,
    zIndex: 99,
  },
  fabPressed: {
    opacity: 0.88,
    transform: [{ scale: 0.93 }],
  },
  fabGradient: {
    width: 56,
    height: 56,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
});