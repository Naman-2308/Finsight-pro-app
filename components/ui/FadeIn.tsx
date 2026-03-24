import { useEffect, useRef, type ReactNode } from "react";
import { Animated, Easing, StyleSheet, View } from "react-native";
import { Motion } from "@/constants/finsightTheme";

type Props = {
  children: ReactNode;
};

export default function FadeIn({ children }: Props) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(10)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: Motion.entranceMs,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: Motion.entranceMs,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, [opacity, translateY]);

  return (
    <Animated.View
      style={[
        styles.wrap,
        {
          opacity,
          transform: [{ translateY }],
        },
      ]}
    >
      <View style={styles.inner}>{children}</View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexGrow: 1,
  },
  inner: {
    flexGrow: 1,
  },
});
