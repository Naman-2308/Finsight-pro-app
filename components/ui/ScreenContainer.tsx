import { ReactNode } from "react";
import { ScrollView, StyleSheet, View, ViewStyle } from "react-native";
import { Colors } from "@/constants/colors";
import AmbientBackground from "@/components/ui/AmbientBackground";
import FadeIn from "@/components/ui/FadeIn";

interface Props {
  children: ReactNode;
  contentContainerStyle?: ViewStyle;
  /** Default: soft teal/blue ambient glow */
  ambient?: boolean;
  /** Default: subtle fade + slide-up on mount */
  animateEntrance?: boolean;
}

export default function ScreenContainer({
  children,
  contentContainerStyle,
  ambient = true,
  animateEntrance = true,
}: Props) {
  const body = animateEntrance ? <FadeIn>{children}</FadeIn> : children;

  return (
    <View style={styles.shell}>
      {ambient ? <AmbientBackground /> : null}
      <ScrollView
        style={styles.screen}
        contentContainerStyle={[styles.container, contentContainerStyle]}
        showsVerticalScrollIndicator={false}
      >
        {body}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  screen: {
    flex: 1,
  },
  container: {
    padding: 25,
    paddingBottom: 40,
  },
});
