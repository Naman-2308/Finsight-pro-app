import { useCallback, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useFocusEffect, router, type Href } from "expo-router";
import { Colors } from "@/constants/colors";
import { clearAuth, getAuth } from "@/lib/auth";
import ScreenContainer from "@/components/ui/ScreenContainer";
import AmbientBackground from "@/components/ui/AmbientBackground";

export default function ProfileScreen() {
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  const loadProfile = useCallback(async () => {
    try {
      setLoading(true);
      const auth = await getAuth();

      setUserName(auth?.name || "");
      setUserEmail(auth?.email || "");
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadProfile();
    }, [loadProfile])
  );

  async function handleLogout() {
    try {
      setLoggingOut(true);
      await clearAuth();
      router.replace("/login" as Href);
    } catch {
      Alert.alert("Error", "Failed to log out. Please try again.");
    } finally {
      setLoggingOut(false);
    }
  }

  if (loading) {
    return (
      <View style={styles.centered}>
        <AmbientBackground />
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <ScreenContainer>
        <Text style={styles.title}>Profile</Text>
        <Text style={styles.subtitle}>
          View your account details, manage finance settings, and sign out safely.
        </Text>

        <View style={styles.card}>
          <Text style={styles.label}>Name</Text>
          <Text style={styles.value}>{userName || "Unknown User"}</Text>

          <Text style={[styles.label, styles.spacingTop]}>Email</Text>
          <Text style={styles.value}>{userEmail || "No email found"}</Text>
        </View>

        <Pressable
          style={({ pressed }) => [styles.primaryButton, pressed && styles.buttonPressed]}
          onPress={() => router.push("/profile/finance" as Href)}
        >
          <Text style={styles.primaryButtonText}>Finance Setup</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [styles.primaryButton, pressed && styles.buttonPressed]}
          onPress={() => router.push("/profile/emi" as Href)}
        >
          <Text style={styles.primaryButtonText}>Manage EMI</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.logoutButton,
            loggingOut && styles.logoutButtonDisabled,
            pressed && styles.buttonPressed,
          ]}
          onPress={handleLogout}
          disabled={loggingOut}
        >
          <Text style={styles.logoutButtonText}>
            {loggingOut ? "Logging out..." : "Logout"}
          </Text>
        </Pressable>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#E6EEFF",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 21,
    color: "#8FA2CC",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "rgba(15, 23, 42, 0.62)",
    borderWidth: 1,
    borderColor: "rgba(125, 147, 188, 0.24)",
    borderRadius: 20,
    padding: 18,
    marginBottom: 20,
    shadowColor: "#020617",
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.3,
    shadowRadius: 22,
    elevation: 8,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#9AA8C7",
    marginBottom: 6,
  },
  value: {
    fontSize: 16,
    fontWeight: "700",
    color: "#E9EEFF",
  },
  spacingTop: {
    marginTop: 18,
  },
  primaryButton: {
    backgroundColor: Colors.primary,
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: "center",
    marginBottom: 12,
  },
  primaryButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },
  logoutButton: {
    backgroundColor: "#DC2626",
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 4,
  },
  logoutButtonDisabled: {
    opacity: 0.7,
  },
  buttonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  logoutButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },
});