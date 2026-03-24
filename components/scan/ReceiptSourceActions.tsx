import { View, StyleSheet } from "react-native";
import PrimaryButton from "@/components/ui/PrimaryButton";

type Props = {
  onPickImage: () => void;
  onTakePhoto: () => void;
};

export default function ReceiptSourceActions({
  onPickImage,
  onTakePhoto,
}: Props) {
  return (
    <View style={styles.row}>
      <View style={styles.half}>
        <PrimaryButton title="Pick Image" onPress={onPickImage} />
      </View>
      <View style={styles.half}>
        <PrimaryButton title="Take Photo" onPress={onTakePhoto} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 16,
  },
  half: {
    flex: 1,
  },
});