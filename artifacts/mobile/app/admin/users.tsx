import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useState } from "react";
import { Alert, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";

type Role = "all" | "student" | "faculty" | "hod";

const USERS = [
  { id: "1", name: "Arjun Kumar", role: "student", dept: "CSE", meta: "22CS001 · Sem 5A", status: "active" },
  { id: "2", name: "Dr. Priya Sharma", role: "faculty", dept: "CSE", meta: "FAC001 · Asst. Prof", status: "active" },
  { id: "3", name: "Dr. Rajesh Kumar", role: "hod", dept: "CSE", meta: "HOD001 · HOD", status: "active" },
  { id: "4", name: "Priya Devi S", role: "student", dept: "CSE", meta: "22CS012 · Sem 5A", status: "active" },
  { id: "5", name: "Mr. S. Rajan", role: "faculty", dept: "CSE", meta: "FAC002 · Asst. Prof", status: "active" },
  { id: "6", name: "Dr. Meena V", role: "hod", dept: "ECE", meta: "HOD002 · HOD", status: "active" },
  { id: "7", name: "Karthik R", role: "student", dept: "ECE", meta: "22EC014 · Sem 3B", status: "inactive" },
  { id: "8", name: "Ms. T. Nair", role: "faculty", dept: "ECE", meta: "FAC010 · Sr. Lecturer", status: "active" },
  { id: "9", name: "Deepika V", role: "student", dept: "CSE", meta: "22CS014 · Sem 5A", status: "active" },
  { id: "10", name: "Dr. A. Kumar", role: "faculty", dept: "CSE", meta: "FAC003 · Prof", status: "active" },
  { id: "11", name: "Muthu Kumar", role: "student", dept: "Mech", meta: "22ME007 · Sem 5C", status: "active" },
  { id: "12", name: "Dr. R. Suresh", role: "hod", dept: "Mech", meta: "HOD003 · HOD", status: "active" },
];

const ROLE_COLORS: Record<string, string> = {
  student: "#1565C0",
  faculty: "#7C3AED",
  hod: "#059669",
};

export default function AdminUsers() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [roleFilter, setRoleFilter] = useState<Role>("all");
  const [search, setSearch] = useState("");
  const topPad = Platform.OS === "web" ? 67 : insets.top;

  const filtered = USERS.filter((u) => {
    const matchRole = roleFilter === "all" || u.role === roleFilter;
    const matchSearch =
      search === "" ||
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.meta.toLowerCase().includes(search.toLowerCase()) ||
      u.dept.toLowerCase().includes(search.toLowerCase());
    return matchRole && matchSearch;
  });

  const handleUserAction = (user: typeof USERS[0]) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Alert.alert(
      user.name,
      `${user.role.charAt(0).toUpperCase() + user.role.slice(1)} · ${user.dept}\n${user.meta}`,
      [
        { text: "View Profile", onPress: () => {} },
        { text: user.status === "active" ? "Deactivate" : "Activate", style: "destructive", onPress: () => Alert.alert("Done", `${user.name} account updated.`) },
        { text: "Cancel", style: "cancel" },
      ]
    );
  };

  const counts = { all: USERS.length, student: USERS.filter((u) => u.role === "student").length, faculty: USERS.filter((u) => u.role === "faculty").length, hod: USERS.filter((u) => u.role === "hod").length };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={[styles.header, { paddingTop: topPad + 12, backgroundColor: colors.navy }]}>
        <Text style={styles.title}>User Management</Text>
        <Text style={styles.subtitle}>{USERS.length} total users across all roles</Text>
      </View>

      {/* Search */}
      <View style={[styles.searchRow, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <View style={[styles.searchBox, { backgroundColor: colors.muted, borderColor: colors.border }]}>
          <Feather name="search" size={14} color={colors.mutedForeground} />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search by name, ID or dept..."
            placeholderTextColor={colors.mutedForeground}
            style={[styles.searchInput, { color: colors.foreground }]}
          />
          {search.length > 0 && (
            <Pressable onPress={() => setSearch("")}>
              <Feather name="x" size={14} color={colors.mutedForeground} />
            </Pressable>
          )}
        </View>
      </View>

      {/* Role filter */}
      <View style={[styles.filterRow, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 12, gap: 8, paddingVertical: 10 }}>
          {(["all", "student", "faculty", "hod"] as Role[]).map((r) => {
            const color = r === "all" ? colors.primary : ROLE_COLORS[r];
            return (
              <Pressable
                key={r}
                onPress={() => setRoleFilter(r)}
                style={[styles.roleChip, { backgroundColor: roleFilter === r ? color : colors.muted, borderColor: roleFilter === r ? color : colors.border }]}
              >
                <Text style={[styles.roleChipText, { color: roleFilter === r ? "#FFF" : colors.mutedForeground }]}>
                  {r.charAt(0).toUpperCase() + r.slice(1)} ({counts[r]})
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: insets.bottom + 90 }} showsVerticalScrollIndicator={false}>
        {filtered.map((user) => {
          const roleColor = ROLE_COLORS[user.role] ?? colors.primary;
          return (
            <Pressable
              key={user.id}
              onPress={() => handleUserAction(user)}
              style={({ pressed }) => [styles.userRow, { backgroundColor: colors.card, borderBottomColor: colors.border, opacity: pressed ? 0.7 : 1 }]}
            >
              <View style={[styles.userAvatar, { backgroundColor: roleColor + "20" }]}>
                <Text style={[styles.userAvatarText, { color: roleColor }]}>{user.name.charAt(0)}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.userName, { color: colors.foreground }]}>{user.name}</Text>
                <Text style={[styles.userMeta, { color: colors.mutedForeground }]}>{user.meta} · {user.dept}</Text>
              </View>
              <View style={{ alignItems: "flex-end", gap: 6 }}>
                <View style={[styles.roleBadge, { backgroundColor: roleColor + "20" }]}>
                  <Text style={[styles.roleBadgeText, { color: roleColor }]}>{user.role.charAt(0).toUpperCase() + user.role.slice(1)}</Text>
                </View>
                <View style={[styles.statusDot, { backgroundColor: user.status === "active" ? colors.success : colors.mutedForeground }]} />
              </View>
            </Pressable>
          );
        })}
        {filtered.length === 0 && (
          <View style={styles.emptyState}>
            <Feather name="users" size={40} color={colors.mutedForeground} />
            <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>No users found</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: 20, paddingBottom: 16 },
  title: { fontSize: 22, color: "#FFF", fontFamily: "Inter_700Bold" },
  subtitle: { fontSize: 13, color: "#93C5FD", fontFamily: "Inter_400Regular", marginTop: 2 },
  searchRow: { padding: 12, borderBottomWidth: 1 },
  searchBox: { flexDirection: "row", alignItems: "center", gap: 8, borderRadius: 10, borderWidth: 1, paddingHorizontal: 12, paddingVertical: 10 },
  searchInput: { flex: 1, fontSize: 14, fontFamily: "Inter_400Regular" },
  filterRow: { borderBottomWidth: 1 },
  roleChip: { borderRadius: 10, borderWidth: 1, paddingHorizontal: 14, paddingVertical: 7 },
  roleChipText: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  userRow: { flexDirection: "row", alignItems: "center", padding: 14, paddingHorizontal: 16, borderBottomWidth: 1, gap: 12 },
  userAvatar: { width: 44, height: 44, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  userAvatarText: { fontSize: 18, fontFamily: "Inter_700Bold" },
  userName: { fontSize: 14, fontFamily: "Inter_600SemiBold", marginBottom: 2 },
  userMeta: { fontSize: 12, fontFamily: "Inter_400Regular" },
  roleBadge: { borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 },
  roleBadgeText: { fontSize: 11, fontFamily: "Inter_600SemiBold" },
  statusDot: { width: 8, height: 8, borderRadius: 4 },
  emptyState: { alignItems: "center", paddingTop: 60, gap: 12 },
  emptyText: { fontSize: 15, fontFamily: "Inter_500Medium" },
});
