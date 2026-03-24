import { useEffect } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { router } from "expo-router";
import { Colors } from "@/constants/colors";
import { getAuth } from "@/lib/auth";

export default function IndexScreen() {
  useEffect(() => {
    async function checkAuth() {
      try {
        const auth = await getAuth();

        if (auth?.token) {
          router.replace("/home");
        } else {
          router.replace("/login");
        }
      } catch {
        router.replace("/login");
      }
    }

    checkAuth();
  }, []);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={Colors.primary} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: "center",
    alignItems: "center",
  },
});