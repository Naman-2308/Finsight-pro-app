import { useCallback, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Platform,
  type GestureResponderEvent,
} from "react-native";
import { PlatformPressable } from "@react-navigation/elements";
import type { BottomTabBarButtonProps } from "@react-navigation/bottom-tabs";
import { Colors } from "@/constants/colors";

type Props = BottomTabBarButtonProps & {
  tooltipLabel: string;
};

/**
 * Centers the icon vertically in the tab bar and shows the tab name:
 * - Web: on hover (pointer enter/leave)
 * - Native: brief tooltip on long-press (hover does not exist on touch devices)
 */
export function FinsightTabBarButton({
  tooltipLabel,
  style,
  children,
  onLongPress,
  ...rest
}: Props) {
  const [hovered, setHovered] = useState(false);
  const [tipFromPress, setTipFromPress] = useState(false);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isWeb = Platform.OS === "web";

  const showTip =
    Boolean(tooltipLabel) && (hovered || (!isWeb && tipFromPress));

  useEffect(() => {
    return () => {
      if (hideTimer.current) clearTimeout(hideTimer.current);
    };
  }, []);

  const handleLongPress = useCallback(
    (e: GestureResponderEvent) => {
      if (!isWeb) {
        if (hideTimer.current) clearTimeout(hideTimer.current);
        setTipFromPress(true);
        hideTimer.current = setTimeout(() => setTipFromPress(false), 1600);
      }
      onLongPress?.(e);
    },
    [isWeb, onLongPress]
  );

  const pointerProps =
    isWeb && tooltipLabel
      ? {
          onPointerEnter: () => setHovered(true),
          onPointerLeave: () => setHovered(false),
        }
      : {};

  return (
    <View style={styles.wrapper} {...pointerProps}>
      {showTip ? (
        <View style={styles.tooltip} pointerEvents="none">
          <Text style={styles.tooltipText}>{tooltipLabel}</Text>
        </View>
      ) : null}
      <PlatformPressable
        {...rest}
        onLongPress={handleLongPress}
        style={[style, styles.pressableCentered]}
      >
        {children}
      </PlatformPressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    minWidth: 56,
  },
  pressableCentered: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    alignSelf: "stretch",
    width: "100%",
  },
  tooltip: {
    position: "absolute",
    bottom: "100%",
    marginBottom: 6,
    zIndex: 1000,
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: "#0F172A",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    elevation: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.35,
    shadowRadius: 5,
  },
  tooltipText: {
    color: "#E6EEFF",
    fontSize: 12,
    fontWeight: "600",
  },
});
