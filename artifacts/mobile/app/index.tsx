import { Redirect } from "expo-router";
import { ActivityIndicator, View } from "react-native";
import { useAuth } from "@/context/AuthContext";
import { useColors } from "@/hooks/useColors";

export default function Index() {
  const { user, isLoading } = useAuth();
  const colors = useColors();

  if (isLoading) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!user) return <Redirect href="/login" />;

  if (user.role === "student") return <Redirect href={"/student/" as any} />;
  if (user.role === "parent") return <Redirect href={"/parent/" as any} />;
  if (user.role === "faculty") return <Redirect href={"/faculty/" as any} />;
  if (user.role === "hod") return <Redirect href={"/hod/" as any} />;
  if (user.role === "principal") return <Redirect href={"/principal/" as any} />;
  if (user.role === "super_admin") return <Redirect href={"/super_admin/" as any} />;
  return <Redirect href={"/admin/" as any} />;
}
