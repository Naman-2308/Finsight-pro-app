import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
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
import { registerUser } from "@/services/authService";
import { saveAuth } from "@/lib/auth";
import AmbientBackground from "@/components/ui/AmbientBackground";
import FadeIn from "@/components/ui/FadeIn";

const EMAIL_RE = /^\S+@\S+\.\S+$/;

export default function SignupScreen() {
  const insets = useSafeAreaInsets();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function clearError() {
    if (error) setError("");
  }

  async function handleSignup() {
    if (!name.trim() || !email.trim() || !password.trim()) {
      setError("Please fill in all fields.");
      return;
    }
    if (!EMAIL_RE.test(email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const data = await registerUser({
        name: name.trim(),
        email: email.trim(),
        password,
      });
      await saveAuth(data);
      router.replace("/home" as Href);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Signup failed. Please try again.";
      setError(message);
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
              paddingTop: Math.max(insets.top + 8, 24),
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
              {/* ── Header ───────────────────────────────────────── */}
              <View style={styles.topSection}>
                <View style={styles.logoRow}>
                  <LinearGradient
                    colors={[Colors.primary, Colors.accentViolet]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.logoDot}
                  />
                  <Text style={styles.brand}>FINSIGHT</Text>
                </View>

                <Text style={styles.title}>Create account</Text>
                <Text style={styles.subtitle}>
                  Track expenses, scan receipts, get AI insights
                </Text>
              </View>

              {/* ── Form card ────────────────────────────────────── */}
              <View style={styles.card}>

                {/* Inline error */}
                {error ? (
                  <View style={styles.errorBox}>
                    <Text style={styles.errorText}>⚠ {error}</Text>
                  </View>
                ) : null}

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Full Name</Text>
                  <TextInput
                    value={name}
                    onChangeText={(v) => { setName(v); clearError(); }}
                    placeholder="Enter your full name"
                    placeholderTextColor={Colors.dimText}
                    style={styles.input}
                    {...darkInputProps}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Email</Text>
                  <TextInput
                    value={email}
                    onChangeText={(v) => { setEmail(v); clearError(); }}
                    placeholder="Enter your email"
                    placeholderTextColor={Colors.dimText}
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
                    onChangeText={(v) => { setPassword(v); clearError(); }}
                    placeholder="Create a password (min. 6 chars)"
                    placeholderTextColor={Colors.dimText}
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
                  onPress={handleSignup}
                  disabled={loading}
                >
                  <LinearGradient
                    colors={[Colors.primaryLight, Colors.primary, Colors.primaryDark]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.button}
                  >
                    <Text style={styles.buttonText}>
                      {loading ? "Creating account..." : "Sign Up"}
                    </Text>
                  </LinearGradient>
                </Pressable>

                <View style={styles.footerRow}>
                  <Text style={styles.footerText}>Already have an account?</Text>
                  <Link href={"/login" as Href} style={styles.link}>Sign In</Link>
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
  scroll: { flex: 1 },
  scrollContent: {
    paddingHorizontal: 22,
  },

  topSection: {
    marginBottom: 28,
  },
  logoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 22,
  },
  logoDot: {
    width: 10,
    height: 10,
    borderRadius: 999,
  },
  brand: {
    fontSize: 12,
    fontWeight: "800",
    color: Colors.primary,
    letterSpacing: 2.5,
  },
  title: {
    fontSize: 34,
    fontWeight: "800",
    color: Colors.text,
    letterSpacing: -0.8,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: Colors.mutedText,
    lineHeight: 22,
  },

  card: {
    backgroundColor: Colors.card,
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.25,
    shadowRadius: 24,
    elevation: 8,
  },

  errorBox: {
    backgroundColor: Colors.errorSurface,
    borderWidth: 1,
    borderColor: Colors.errorBorder,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 16,
  },
  errorText: {
    color: Colors.errorText,
    fontSize: 13,
    fontWeight: "600",
    lineHeight: 18,
  },

  inputGroup: { marginBottom: 16 },
  label: {
    fontSize: 13,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: 8,
    letterSpacing: 0.2,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.border,
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
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.38,
    shadowRadius: 14,
    elevation: 7,
  },
  button: {
    minHeight: 54,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonDisabled: { opacity: 0.65 },
  buttonPressed: { opacity: 0.88, transform: [{ scale: 0.985 }] },
  buttonText: {
    color: "#0A0C10",
    fontSize: 15,
    fontWeight: "800",
    letterSpacing: 0.3,
  },

  footerRow: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "center",
    gap: 6,
    flexWrap: "wrap",
  },
  footerText: { color: Colors.mutedText, fontSize: 14 },
  link: { color: Colors.primary, fontSize: 14, fontWeight: "800" },
});
