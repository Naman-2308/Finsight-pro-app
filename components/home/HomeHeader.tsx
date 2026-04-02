import { View, Text, StyleSheet, Animated, Easing } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useRef } from "react";
import { Colors } from "@/constants/colors";
import { Radius } from "@/constants/radius";
import { Spacing } from "@/constants/spacing";
import { Ambient, Motion } from "@/constants/finsightTheme";

function getTimeGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

export default function HomeHeader() {
  const timePhrase = getTimeGreeting();
  
  // Animation refs for staggered entrance
  const cardScale = useRef(new Animated.Value(0.85)).current;
  const cardOpacity = useRef(new Animated.Value(0)).current;
  const titleScale = useRef(new Animated.Value(0.92)).current;
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const subtitleOpacity = useRef(new Animated.Value(0)).current;
  
  // Ambient pulse animation for the greeting card
  const glowPulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Staggered entrance animation
    Animated.stagger(80, [
      // Card entrance: scale + fade
      Animated.parallel([
        Animated.timing(cardScale, {
          toValue: 1,
          duration: Motion.entranceMs,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(cardOpacity, {
          toValue: 1,
          duration: 450,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),
      // Title entrance
      Animated.parallel([
        Animated.timing(titleScale, {
          toValue: 1,
          duration: Motion.entranceMs,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(titleOpacity, {
          toValue: 1,
          duration: 450,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),
      // Subtitle entrance
      Animated.timing(subtitleOpacity, {
        toValue: 1,
        duration: 400,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();

    // Ambient glow pulse (continuous, subtle)
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(glowPulse, {
          toValue: 1,
          duration: 3200,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(glowPulse, {
          toValue: 0,
          duration: 3200,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ])
    );
    pulseAnimation.start();

    return () => {
      pulseAnimation.stop();
    };
  }, [cardScale, cardOpacity, titleScale, titleOpacity, subtitleOpacity, glowPulse]);

  // Interpolate glow opacity for the ambient effect
  const glowOpacity = glowPulse.interpolate({
    inputRange: [0, 1],
    outputRange: [0.4, 0.8],
  });

  const cardTransform = {
    transform: [{ scale: cardScale }],
    opacity: cardOpacity,
  };

  const titleTransform = {
    transform: [{ scale: titleScale }],
    opacity: titleOpacity,
  };

  return (
    <View style={styles.header}>
      {/* Animated Greeting Card with Glass Morphism */}
      <Animated.View style={[styles.greetingCardWrapper, cardTransform]}>
        <LinearGradient
          colors={[
            Ambient.teal,
            "rgba(37, 99, 235, 0.08)",
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.greetingCard}
        >
          {/* Animated Glow Orb Background */}
          <Animated.View
            style={[
              styles.glowOrb,
              {
                opacity: glowOpacity,
              },
            ]}
          />

          {/* Card Content */}
          <View style={styles.cardContent}>
            <Text style={styles.timeTag}>{timePhrase}</Text>
            <View style={styles.helloRow}>
              <Text style={styles.helloText}>Welcome back</Text>
              <Text style={styles.helloIcon}>•</Text>
            </View>
          </View>
        </LinearGradient>
      </Animated.View>

      {/* Animated Title */}
      <Animated.View style={titleTransform}>
        <Text style={styles.title}>Your expense dashboard</Text>
      </Animated.View>

      {/* Animated Subtitle */}
      <Animated.View style={{ opacity: subtitleOpacity }}>
        <Text style={styles.subtitle}>
          Track spending, budget, EMI load, and AI-driven insights.
        </Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    marginBottom: Spacing.xl,
  },

  greetingCardWrapper: {
    marginBottom: Spacing.md,
  },

  greetingCard: {
    alignSelf: "flex-start",
    borderRadius: Radius.card,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: "hidden",
    backgroundColor: Colors.card,
    shadowColor: "#020617",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.22,
    shadowRadius: 18,
    elevation: 6,
  },

  glowOrb: {
    position: "absolute",
    top: -40,
    right: -40,
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: Colors.accentTeal,
    opacity: 0.4,
  },

  cardContent: {
    position: "relative",
    zIndex: 1,
  },

  timeTag: {
    color: Colors.mutedText,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.8,
    textTransform: "uppercase",
    marginBottom: Spacing.xs,
  },

  helloRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
  },

  helloText: {
    color: Colors.text,
    fontSize: 24,
    fontWeight: "700",
    letterSpacing: -0.2,
  },

  helloIcon: {
    color: Colors.accentTeal,
    fontSize: 18,
    fontWeight: "900",
    marginTop: 2,
  },

  title: {
    color: Colors.text,
    fontSize: 32,
    fontWeight: "700",
    marginBottom: Spacing.xs,
    letterSpacing: -0.5,
  },

  subtitle: {
    color: Colors.mutedText,
    fontSize: 15,
    lineHeight: 23,
    letterSpacing: 0.2,
  },
});
