"use client";

import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ScrollView,
} from "react-native";
import { Link, router, type Href } from "expo-router";
import { Colors } from "@/constants/colors";
import { darkInputProps } from "@/constants/inputProps";
import { registerUser } from "@/services/authService";
import { saveAuth } from "@/lib/auth";
import AmbientBackground from "@/components/ui/AmbientBackground";
import FadeIn from "@/components/ui/FadeIn";

export default function SignupScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSignup() {
    if (!name.trim() || !email.trim() || !password.trim()) {
      Alert.alert("Missing fields", "Please fill in all fields.");
      return;
    }

    try {
      setLoading(true);

      const data = await registerUser({
        name: name.trim(),
        email: email.trim(),
        password,
      });

      await saveAuth(data);
      router.replace("/home" as Href);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Something went wrong";
      Alert.alert("Signup failed", message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.shell}>
        <AmbientBackground />
        <KeyboardAvoidingView
          style={styles.wrapper}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <ScrollView
            contentContainerStyle={styles.container}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <FadeIn>
              <View style={styles.topSection}>
                <Text style={styles.brand}>Finsight</Text>
                <Text style={styles.title}>Create your account</Text>
                <Text style={styles.subtitle}>
                  Start tracking expenses and managing receipts in one place.
                </Text>
              </View>

              <View style={styles.card}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Full Name</Text>
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="Enter your full name"
                placeholderTextColor={Colors.mutedText}
                style={styles.input}
                {...darkInputProps}
              />
            </View>

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
                placeholder="Create a password"
                placeholderTextColor={Colors.mutedText}
                secureTextEntry
                style={styles.input}
                {...darkInputProps}
              />
            </View>

            <Pressable
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleSignup}
              disabled={loading}
            >
              <Text style={styles.buttonText}>
                {loading ? "Creating account..." : "Sign Up"}
              </Text>
            </Pressable>

            <View style={styles.footerRow}>
              <Text style={styles.footerText}>Already have an account?</Text>
              <Link href={"/login" as Href} style={styles.link}>
                Sign In
              </Link>
            </View>
              </View>
            </FadeIn>
          </ScrollView>
        </KeyboardAvoidingView>
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
  wrapper: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingVertical: 32,
  },
  topSection: {
    marginBottom: 28,
  },
  brand: {
    fontSize: 14,
    fontWeight: "700",
    color: Colors.primary,
    marginBottom: 10,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  title: {
    fontSize: 30,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
    color: Colors.mutedText,
  },
  card: {
    backgroundColor: Colors.card,
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: "#020617",
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 8,
  },
  inputGroup: {
    marginBottom: 14,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 15,
    color: Colors.text,
    backgroundColor: Colors.inputSurface,
  },
  button: {
    marginTop: 8,
    backgroundColor: Colors.primary,
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: "center",
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },
  footerRow: {
    marginTop: 16,
    flexDirection: "row",
    justifyContent: "center",
    gap: 6,
  },
  footerText: {
    color: Colors.mutedText,
    fontSize: 14,
  },
  link: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: "700",
  },
});