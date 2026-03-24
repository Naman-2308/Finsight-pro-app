import { Image, StyleSheet } from "react-native";
import AppCard from "@/components/ui/AppCard";
import PrimaryButton from "@/components/ui/PrimaryButton";
import { Colors } from "@/constants/colors";

type Props = {
  image: string;
  loading: boolean;
  onScan: () => void;
};

export default function ImagePreviewCard({
  image,
  loading,
  onScan,
}: Props) {
  return (
    <AppCard style={styles.card}>
      <Image source={{ uri: image }} style={styles.preview} />
      <PrimaryButton
        title={loading ? "Scanning..." : "Scan Receipt"}
        onPress={onScan}
        disabled={loading}
      />
    </AppCard>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
  },
  preview: {
    width: "100%",
    height: 220,
    borderRadius: 12,
    marginBottom: 12,
    backgroundColor: Colors.separator,
  },
});