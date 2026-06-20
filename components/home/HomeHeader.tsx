import { useEffect, useState } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Bell, CalendarDays, TrendingUp } from "lucide-react-native";
import { Colors } from "@/constants/colors";
import { Spacing } from "@/constants/spacing";
import { getAuth } from "@/lib/auth";

function getGreeting() {
  const h = new Date().getHours();
  if (h < 5)  return { emoji: "🌙", text: "Night owl mode" };
  if (h < 12) return { emoji: "☀️", text: "Good morning" };
  if (h < 17) return { emoji: "👋", text: "Good afternoon" };
  if (h < 21) return { emoji: "🌆", text: "Good evening" };
  return { emoji: "🌙", text: "Good night" };
}

function getFormattedDate() {
  const now = new Date();
  const weekday = now.toLocaleDateString("en-IN", { weekday: "long" });
  const day = now.getDate();
  const month = now.toLocaleDateString("en-IN", { month: "long" });
  return `${weekday}, ${day} ${month}`;
}

function getInitials(fullName: string) {
  return fullName
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0] ?? "")
    .join("")
    .toUpperCase();
}

export default function HomeHeader() {
  const [fullName, setFullName] = useState("");

  useEffect(() => {
    getAuth().then((auth) => {
      if (auth?.name) setFullName(auth.name);
    });
  }, []);

  const firstName = fullName.split(" ")[0] || "there";
  const initials  = fullName ? getInitials(fullName) : "FP";
  const greeting  = getGreeting();

  return (
    <View style={styles.header}>
      {/* ── Top bar ──────────────────────────────────── */}
      <View style={styles.topRow}>

        {/* Logo lockup: icon mark + wordmark */}
        <View style={styles.logoLockup}>
          <LinearGradient
            colors={[Colors.primaryLight, Colors.primary]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.logoMark}
          >
            <TrendingUp size={14} color="#0A0C10" strokeWidth={2.5} />
          </LinearGradient>
          <View style={styles.wordmark}>
            <Text style={styles.wordmarkFin}>Fin</Text>
            <Text style={styles.wordmarkSight}>sight</Text>
          </View>
        </View>

        {/* Right: bell + avatar */}
        <View style={styles.rightActions}>
          <Pressable
            style={styles.bellWrap}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Bell size={19} color={Colors.mutedText} strokeWidth={1.8} />
            <View style={styles.bellDot} />
          </Pressable>

          <LinearGradient
            colors={[Colors.primary, Colors.accentViolet]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.avatar}
          >
            <Text style={styles.avatarText}>{initials}</Text>
          </LinearGradient>
        </View>
      </View>

      {/* ── Greeting block ───────────────────────────── */}
      <View style={styles.greetingBlock}>

        {/* Greeting pill */}
        <View style={styles.greetingPill}>
          <Text style={styles.greetingEmoji}>{greeting.emoji}</Text>
          <Text style={styles.greetingText}>{greeting.text}</Text>
        </View>

        {/* Name */}
        <Text style={styles.nameLine}>
          Hey, <Text style={styles.nameAccent}>{firstName}</Text>
        </Text>

        {/* Date row */}
        <View style={styles.dateRow}>
          <CalendarDays size={13} color={Colors.dimText} strokeWidth={1.8} />
          <Text style={styles.dateLine}>{getFormattedDate()}</Text>
        </View>
      </View>
    </View>
  );
}

const AVATAR_SIZE = 38;

const styles = StyleSheet.create({
  header: {
    marginBottom: Spacing.lg,
  },

  // ── Top bar ──────────────────────────────────────────────────────────────
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },

  logoLockup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  logoMark: {
    width: 30,
    height: 30,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.45,
    shadowRadius: 6,
    elevation: 5,
  },
  wordmark: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  wordmarkFin: {
    fontSize: 22,
    fontWeight: "800",
    color: Colors.primary,
    letterSpacing: -0.3,
  },
  wordmarkSight: {
    fontSize: 22,
    fontWeight: "800",
    color: Colors.text,
    letterSpacing: -0.3,
  },

  rightActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  bellWrap: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  bellDot: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 7,
    height: 7,
    borderRadius: 999,
    backgroundColor: Colors.primary,
    borderWidth: 1.5,
    borderColor: Colors.background,
  },

  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.38,
    shadowRadius: 8,
    elevation: 5,
  },
  avatarText: {
    color: "#0A0C10",
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 0.5,
  },

  // ── Greeting block ────────────────────────────────────────────────────────
  greetingBlock: {
    gap: 6,
  },

  greetingPill: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: Colors.successSurface,
    borderWidth: 1,
    borderColor: Colors.successBorder,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
    gap: 5,
    marginBottom: 2,
  },
  greetingEmoji: {
    fontSize: 13,
  },
  greetingText: {
    fontSize: 12,
    fontWeight: "600",
    color: Colors.primary,
    letterSpacing: 0.2,
  },

  nameLine: {
    fontSize: 28,
    fontWeight: "700",
    color: Colors.mutedText,
    letterSpacing: -0.5,
    lineHeight: 34,
  },
  nameAccent: {
    color: Colors.text,
    fontWeight: "800",
  },

  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginTop: 2,
  },
  dateLine: {
    fontSize: 13,
    fontWeight: "500",
    color: Colors.dimText,
    letterSpacing: 0.1,
  },
});
