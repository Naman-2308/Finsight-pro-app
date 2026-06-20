import { useEffect } from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as SystemUI from "expo-system-ui";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Colors } from "@/constants/colors";

export default function RootLayout() {
  useEffect(() => {
    SystemUI.setBackgroundColorAsync(Colors.background);
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: Colors.background },
        }}
      >
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="(auth)/login" />
        <Stack.Screen name="(auth)/signup" />
        <Stack.Screen name="edit-expense/[id]" />
        <Stack.Screen
          name="ai-chat"
          options={{
            presentation: "modal",
            animation: "slide_from_bottom",
            contentStyle: { backgroundColor: Colors.background },
          }}
        />
      </Stack>
    </SafeAreaProvider>
  );
}
