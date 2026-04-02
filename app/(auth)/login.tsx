"use client";

import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ScrollView,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { Link, router, type Href } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

import { Colors } from "@/constants/colors";
import { darkInputProps } from "@/constants/inputProps";
import { loginUser } from "@/services/authService";
import { saveAuth } from "@/lib/auth";
import AmbientBackground from "@/components/ui/AmbientBackground";
import FadeIn from "@/components/ui/FadeIn";

export default function LoginScreen() {
  const insets = useSafeAreaInsets();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Missing fields", "Please enter email and password.");
      return;
    }

    try {
      setLoading(true);

      const data = await loginUser({
        email: email.trim(),
        password,
      });

      await saveAuth(data);
      router.replace("/home" as Href);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Something went wrong";
      Alert.alert("Login failed", message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      <View style={styles.shell}>
        <AmbientBackground />

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={[
            styles.scrollContent,
            {
              paddingTop: Math.max(insets.top + 12, 28),
              paddingBottom: Math.max(insets.bottom + 28, 36),
            },
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={20}
          >
            <FadeIn>
              <View style={styles.topSection}>
                <LinearGradient
                  colors={["rgba(45,212,191,0.18)", "rgba(59,130,246,0.10)"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.badge}
                >
                  <View style={styles.badgeGlow} />
                  <Text style={styles.brand}>Finsight Pro</Text>
                  <Text style={styles.badgeArrow}>→</Text>
                </LinearGradient>

                <Text style={styles.title}>Welcome back</Text>
                <Text style={styles.subtitle}>
                  Sign in to manage your expenses, track insights, and scan
                  receipts with a premium, seamless workflow.
                </Text>
              </View>

              <View style={styles.card}>
                <View style={styles.cardGlow} />

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Email</Text>
                  <TextInput
                    value={email}
                    onChangeText={setEmail}
                    placeholder="Enter your email"
                    placeholderTextColor={Colors.mutedText}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    style={styles.input}
                    {...darkInputProps}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Password</Text>
                  <TextInput
                    value={password}
                    onChangeText={setPassword}
                    placeholder="Enter your password"
                    placeholderTextColor={Colors.mutedText}
                    secureTextEntry
                    style={styles.input}
                    {...darkInputProps}
                  />
                </View>

                <Pressable
                  style={({ pressed }) => [
                    styles.buttonWrap,
                    loading && styles.buttonDisabled,
                    pressed && !loading && styles.buttonPressed,
                  ]}
                  onPress={handleLogin}
                  disabled={loading}
                >
                  <LinearGradient
                    colors={[Colors.primary, Colors.accentTeal || Colors.primary]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.button}
                  >
                    <Text style={styles.buttonText}>
                      {loading ? "Signing in..." : "Sign In"}
                    </Text>
                  </LinearGradient>
                </Pressable>

                <View style={styles.footerRow}>
                  <Text style={styles.footerText}>
                    Don&apos;t have an account?
                  </Text>
                  <Link href={"/signup" as Href} style={styles.link}>
                    Sign Up
                  </Link>
                </View>
              </View>
            </FadeIn>
          </KeyboardAvoidingView>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  shell: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 22,
  },

  topSection: {
    marginBottom: 30,
  },
  badge: {
    alignSelf: "flex-start",
    minHeight: 50,
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    overflow: "hidden",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 22,
    backgroundColor: "rgba(15, 23, 42, 0.62)",
  },
  badgeGlow: {
    position: "absolute",
    top: -30,
    right: -24,
    width: 120,
    height: 120,
    borderRadius: 999,
    backgroundColor: "rgba(45,212,191,0.18)",
  },
  brand: {
    fontSize: 13,
    fontWeight: "800",
    color: Colors.text,
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
  badgeArrow: {
    marginLeft: 10,
    fontSize: 18,
    fontWeight: "700",
    color: Colors.primary,
  },

  title: {
    fontSize: 32,
    lineHeight: 38,
    fontWeight: "800",
    color: Colors.text,
    marginBottom: 10,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 24,
    color: Colors.mutedText,
  },

  card: {
    backgroundColor: Colors.card,
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    shadowColor: "#020617",
    shadowOffset: { width: 0, height: 18 },
    shadowOpacity: 0.28,
    shadowRadius: 24,
    elevation: 8,
    overflow: "hidden",
  },
  cardGlow: {
    position: "absolute",
    top: -40,
    right: -30,
    width: 140,
    height: 140,
    borderRadius: 999,
    backgroundColor: "rgba(59,130,246,0.10)",
  },

  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: 8,
    letterSpacing: 0.2,
  },
  input: {
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 16,
    fontSize: 15,
    color: Colors.text,
    backgroundColor: Colors.inputSurface,
  },

  buttonWrap: {
    marginTop: 8,
    borderRadius: 16,
    overflow: "hidden",
  },
  button: {
    minHeight: 54,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 18,
  },
  buttonDisabled: {
    opacity: 0.72,
  },
  buttonPressed: {
    transform: [{ scale: 0.985 }],
    opacity: 0.94,
  },
  buttonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "800",
    letterSpacing: 0.2,
  },

  footerRow: {
    marginTop: 18,
    flexDirection: "row",
    justifyContent: "center",
    gap: 6,
    flexWrap: "wrap",
  },
  footerText: {
    color: Colors.mutedText,
    fontSize: 14,
  },
  link: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: "800",
  },
});