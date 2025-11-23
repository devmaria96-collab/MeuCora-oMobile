// app/(tabs)/_layout.tsx
import { Tabs } from "expo-router";
import React from "react";
import { Image } from "react-native";

import { HapticTab } from "@/components/haptic-tab";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
        tabBarButton: HapticTab,
      }}
      initialRouteName="explore"
    >
      <Tabs.Screen
        name="explore"
        options={{
          title: "Início",
          tabBarIcon: ({ color, size }) => (
            <Image
              source={require("@/assets/images/heart.png")}
              style={{ width: size, height: size, tintColor: color }}
              resizeMode="contain"
            />
          ),
        }}
      />

      <Tabs.Screen
        name="index"
        options={{
          href: null, // Hide this tab from the tab bar
          title: "Home",
        }}
      />
    </Tabs>
  );
}
