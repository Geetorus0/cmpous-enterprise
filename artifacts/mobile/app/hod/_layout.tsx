import { BlurView } from "expo-blur";
import { Redirect, Tabs } from "expo-router";
import { Feather } from "@expo/vector-icons";
import React from "react";
import { ActivityIndicator, Platform, StyleSheet, View, useColorScheme } from "react-native";
import { useColors } from "@/hooks/useColors";
import { useAuth } from "@/context/AuthContext";

export default function HodLayout() {
  const colors = useColors();
  const isDark = useColorScheme() === "dark";
  const isIOS = Platform.OS === "ios";
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!user || user.role !== "hod") {
    return <Redirect href="/login" />;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.mutedForeground,
        tabBarStyle: {
          position: "absolute",
          backgroundColor: isIOS ? "transparent" : colors.background,
          borderTopWidth: 0,
          elevation: 0,
          ...(Platform.OS === "web" ? { height: 84 } : {}),
        },
        tabBarBackground: () =>
          isIOS ? <BlurView intensity={100} tint={isDark ? "dark" : "light"} style={StyleSheet.absoluteFill} /> : null,
        tabBarLabelStyle: { fontFamily: "Inter_500Medium", fontSize: 11, marginBottom: 2 },
      }}
    >
      <Tabs.Screen name="index" options={{ title: "Home", tabBarIcon: ({ color, size }) => <Feather name="home" size={size} color={color} /> }} />
      <Tabs.Screen name="monitor" options={{ title: "Monitor", tabBarIcon: ({ color, size }) => <Feather name="activity" size={size} color={color} /> }} />
      <Tabs.Screen name="approvals" options={{ title: "Approvals", tabBarIcon: ({ color, size }) => <Feather name="check-circle" size={size} color={color} /> }} />
      <Tabs.Screen name="more" options={{ title: "More", tabBarIcon: ({ color, size }) => <Feather name="grid" size={size} color={color} /> }} />
    </Tabs>
  );
}
