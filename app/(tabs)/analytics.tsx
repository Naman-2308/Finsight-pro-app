import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Pressable,
  Dimensions,
  Animated,
  Easing,
} from "react-native";
import { useFocusEffect } from "expo-router";
import { PieChart, BarChart } from "react-native-gifted-charts";
import { Colors } from "@/constants/colors";
import {
  getAnalytics,
  getAIAdvice,
  type ExpenseAnalytics,
} from "@/services/expenseService";
import { useAiAdvice } from "@/hooks/use-ai-advice";
import ScreenContainer from "@/components/ui/ScreenContainer";
import AppCard from "@/components/ui/AppCard";
import SectionHeader from "@/components/ui/SectionHeader";
import PrimaryButton from "@/components/ui/PrimaryButton";
import EmptyState from "@/components/ui/EmptyState";
import { formatCurrencyINR } from "@/lib/formatters";
import { parseBulletedLines } from "@/lib/text";

const PIE_COLORS = [
  "#2563EB",
  "#16A34A",
  "#F59E0B",
  "#DC2626",
  "#7C3AED",
  "#0891B2",
  "#EA580C",
  "#4F46E5",
  "#64748B",
];

export default function AnalyticsScreen() {
  const [analytics, setAnalytics] = useState<ExpenseAnalytics | null>(null);
  const { advice, loading: aiLoading, refresh: refreshAiAdvice } = useAiAdvice(getAIAdvice);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const entrance = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(entrance, {
      toValue: 1,
      duration: 500,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [entrance]);

  const chartWidth = Math.max(Dimensions.get("window").width - 64, 280);

  const loadDashboard = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const analyticsData = await getAnalytics();
      setAnalytics(analyticsData);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to load dashboard";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadDashboard();
      refreshAiAdvice();
    }, [loadDashboard, refreshAiAdvice])
  );

  const pieData = useMemo(() => {
    if (!analytics?.categoryBreakdown?.length) return [];

    return analytics.categoryBreakdown.map((item, index) => ({
      value: item.total,
      color: PIE_COLORS[index % PIE_COLORS.length],
      text: `${item.percentage}%`,
      label: item.category,
    }));
  }, [analytics]);

  const barData = useMemo(() => {
    if (!analytics?.monthlyTrend?.length) return [];

    return analytics.monthlyTrend.slice(-6).map((item) => ({
      value: item.total,
      label: item.label,
      frontColor: "#2563EB",
    }));
  }, [analytics]);

  const advicePoints = useMemo(() => parseBulletedLines(advice), [advice]);

  return (
    <ScreenContainer>
      <Animated.View
        style={[
          styles.header,
          {
            opacity: entrance,
            transform: [
              {
                translateY: entrance.interpolate({
                  inputRange: [0, 1],
                  outputRange: [18, 0],
                }),
              },
            ],
          },
        ]}
      >
        <Text style={styles.title}>Analytics & AI Insights</Text>
        <Text style={styles.subtitle}>
          Track your spending visually and get Gemini-powered financial advice
          in one place.
        </Text>
      </Animated.View>

      {loading ? (
        <AppCard style={styles.infoCard}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.infoText}>Loading analytics...</Text>
        </AppCard>
      ) : error ? (
        <AppCard style={styles.infoCard}>
          <Text style={styles.errorTitle}>Could not load dashboard</Text>
          <Text style={styles.errorText}>{error}</Text>
          <PrimaryButton title="Retry" onPress={loadDashboard} />
        </AppCard>
      ) : !analytics ? (
        <EmptyState message="No analytics available yet." />
      ) : (
        <>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Total Expense</Text>
            <Text style={styles.summaryAmount}>
              {formatCurrencyINR(analytics.totalExpense)}
            </Text>
            <Text style={styles.summaryHint}>
              Complete financial snapshot from your saved data
            </Text>
          </View>

          <SectionHeader
            title="Category Breakdown"
            rightSlot={
              <Pressable onPress={loadDashboard}>
                <Text style={styles.refreshText}>Refresh</Text>
              </Pressable>
            }
          />

          {pieData.length === 0 ? (
            <EmptyState message="Add some expenses to see your category distribution." />
          ) : (
            <AppCard style={styles.chartCard}>
              <PieChart
                data={pieData}
                donut
                radius={110}
                innerRadius={55}
                textColor="white"
                textSize={12}
                showText
                focusOnPress
              />

              <View style={styles.legendWrap}>
                {analytics.categoryBreakdown.map((item, index) => (
                  <View key={item.category} style={styles.legendRow}>
                    <View
                      style={[
                        styles.legendDot,
                        {
                          backgroundColor:
                            PIE_COLORS[index % PIE_COLORS.length],
                        },
                      ]}
                    />
                    <View style={styles.legendTextWrap}>
                      <Text style={styles.legendTitle}>{item.category}</Text>
                      <Text style={styles.legendSubtext}>
                        {formatCurrencyINR(item.total)} • {item.percentage}%
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            </AppCard>
          )}

          <SectionHeader title="Monthly Trend" />

          {barData.length === 0 ? (
            <EmptyState message="Save expenses across dates to generate trend charts." />
          ) : (
            <AppCard style={styles.chartCard}>
              <BarChart
                data={barData}
                width={chartWidth}
                height={240}
                barWidth={28}
                spacing={20}
                roundedTop
                hideRules={false}
                xAxisLabelTextStyle={styles.axisLabel}
                yAxisTextStyle={styles.axisLabel}
                noOfSections={4}
                isAnimated
              />
            </AppCard>
          )}

          <SectionHeader title="Gemini Advice" />

          {aiLoading ? (
            <AppCard style={styles.infoCard}>
              <Text style={styles.infoText}>Generating AI advice...</Text>
            </AppCard>
          ) : advicePoints.length > 0 ? (
            advicePoints.map((point, index) => (
              <AppCard key={index} style={styles.insightCard}>
                <Text style={styles.insightNumber}>{index + 1}</Text>
                <View style={styles.insightContent}>
                  <Text style={styles.insightTitle}>Insight {index + 1}</Text>
                  <Text style={styles.insightBody}>{point}</Text>
                </View>
              </AppCard>
            ))
          ) : (
            <EmptyState message="Add more financial data to generate better recommendations." />
          )}
        </>
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#E6EEFF",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 21,
    color: "#8FA2CC",
  },
  summaryCard: {
    backgroundColor: "rgba(37, 99, 235, 0.88)",
    borderRadius: 22,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#1D4ED8",
    shadowOffset: { width: 0, height: 18 },
    shadowOpacity: 0.28,
    shadowRadius: 24,
    elevation: 9,
  },
  summaryLabel: {
    color: "#DBEAFE",
    fontSize: 14,
    marginBottom: 8,
  },
  summaryAmount: {
    color: "#FFFFFF",
    fontSize: 32,
    fontWeight: "700",
    marginBottom: 6,
  },
  summaryHint: {
    color: "#DBEAFE",
    fontSize: 13,
  },
  refreshText: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: "700",
  },
  chartCard: {
    marginBottom: 22,
    alignItems: "center",
  },
  legendWrap: {
    width: "100%",
    marginTop: 18,
  },
  legendRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 999,
    marginRight: 10,
  },
  legendTextWrap: {
    flex: 1,
  },
  legendTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#E6EEFF",
  },
  legendSubtext: {
    fontSize: 13,
    color: "#8FA2CC",
  },
  axisLabel: {
    color: "#8FA2CC",
    fontSize: 10,
  },
  insightCard: {
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "flex-start",
  },
  insightNumber: {
    width: 32,
    height: 32,
    borderRadius: 999,
    backgroundColor: Colors.primary,
    color: "#fff",
    textAlign: "center",
    lineHeight: 32,
    fontWeight: "700",
    fontSize: 14,
    marginRight: 12,
    overflow: "hidden",
  },
  insightContent: {
    flex: 1,
  },
  insightTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#E6EEFF",
    marginBottom: 6,
  },
  insightBody: {
    fontSize: 14,
    lineHeight: 22,
    color: "#9AA8C7",
  },
  infoCard: {
    marginBottom: 16,
    alignItems: "center",
    gap: 10,
  },
  infoText: {
    color: "#9AA8C7",
    fontSize: 14,
  },
  errorTitle: {
    color: "#FEE2E2",
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
  },
  errorText: {
    color: "#FECACA",
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 12,
  },
});