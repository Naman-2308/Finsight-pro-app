import { Alert, Platform } from "react-native";

export async function confirmDestructive(
  title: string,
  message: string,
  confirmLabel = "Delete"
) {
  if (Platform.OS === "web") {
    return window.confirm(message);
  }

  return new Promise<boolean>((resolve) => {
    Alert.alert(title, message, [
      { text: "Cancel", style: "cancel", onPress: () => resolve(false) },
      {
        text: confirmLabel,
        style: "destructive",
        onPress: () => resolve(true),
      },
    ]);
  });
}

