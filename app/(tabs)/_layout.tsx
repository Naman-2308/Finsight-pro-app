import { Tabs } from "expo-router";
import {
  House,
  PlusCircle,
  ScanLine,
  History,
  User,
  BarChart3,
} from "lucide-react-native";
import { Colors } from "@/constants/colors";
import { FinsightTabBarButton } from "@/components/ui/FinsightTabBarButton";

const TAB_ICON_SIZE = 22;

/** Tab bar tooltips (web: hover; native: long-press) */
const TAB_LABELS: Record<string, string> = {
  home: "Home",
  "add-expense": "Add",
  scan: "Scan",
  history: "History",
  analytics: "Insights",
  "profile/index": "Profile",
};

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: "#93C5FD",
        tabBarInactiveTintColor: "#64748B",
        tabBarHideOnKeyboard: true,
        tabBarShowLabel: false,
        tabBarButton: (props) => (
          <FinsightTabBarButton
            {...props}
            tooltipLabel={TAB_LABELS[route.name] ?? ""}
          />
        ),
        tabBarStyle: {
          backgroundColor: "#0B1120",
          borderTopColor: Colors.border,
          borderTopWidth: 1,
        },
        tabBarItemStyle: {
          justifyContent: "center",
        },
      })}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <House color={color} size={TAB_ICON_SIZE} />
          ),
        }}
      />

      <Tabs.Screen
        name="add-expense"
        options={{
          title: "Add",
          tabBarIcon: ({ color }) => (
            <PlusCircle color={color} size={TAB_ICON_SIZE} />
          ),
        }}
      />

      <Tabs.Screen
        name="scan"
        options={{
          title: "Scan",
          tabBarIcon: ({ color }) => (
            <ScanLine color={color} size={TAB_ICON_SIZE} />
          ),
        }}
      />

      <Tabs.Screen
        name="history"
        options={{
          title: "History",
          tabBarIcon: ({ color }) => (
            <History color={color} size={TAB_ICON_SIZE} />
          ),
        }}
      />

      <Tabs.Screen
        name="analytics"
        options={{
          title: "Analytics",
          tabBarLabel: "Insights",
          tabBarIcon: ({ color }) => (
            <BarChart3 color={color} size={TAB_ICON_SIZE} />
          ),
        }}
      />

      <Tabs.Screen
        name="profile/index"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => (
            <User color={color} size={TAB_ICON_SIZE} />
          ),
        }}
      />

      <Tabs.Screen
        name="profile/finance"
        options={{
          href: null,
        }}
      />

      <Tabs.Screen
        name="profile/emi"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
