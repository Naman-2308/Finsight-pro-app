import { Text, View, StyleSheet } from "react-native";
import { Colors } from "@/constants/colors";

interface Props {
  type: "success" | "error" | "warning";
  message: string;
}

export default function InlineMessage({ type, message }: Props) {
  if (!message) return null;

  return (
    <View
      style={[
        styles.box,
        type === "success" && styles.successBox,
        type === "error" && styles.errorBox,
        type === "warning" && styles.warningBox,
      ]}
    >
      <Text
        style={[
          styles.text,
          type === "success" && styles.successText,
          type === "error" && styles.errorText,
          type === "warning" && styles.warningText,
        ]}
      >
        {message}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
  },
  text: {
    fontSize: 14,
  },
  successBox: {
    backgroundColor: Colors.successSurface,
    borderColor: Colors.successBorder,
  },
  successText: {
    color: Colors.successText,
  },
  errorBox: {
    backgroundColor: Colors.errorSurface,
    borderColor: Colors.errorBorder,
  },
  errorText: {
    color: Colors.errorText,
  },
  warningBox: {
    backgroundColor: Colors.warningSurface,
    borderColor: Colors.warningBorder,
  },
  warningText: {
    color: Colors.warningText,
  },
});