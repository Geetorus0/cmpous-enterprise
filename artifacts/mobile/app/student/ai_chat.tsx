import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";
import React, { useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "@/context/TranslationContext";
import { useColors } from "@/hooks/useColors";

interface ChatMessage {
  id: string;
  text: string;
  sender: "user" | "ai";
  time: string;
}

const SUGGESTIONS = [
  { key: "ai_suggest_fees", query: "What is my pending fee?" },
  { key: "ai_suggest_att", query: "Is my attendance safe?" },
  { key: "ai_suggest_exam", query: "Show my CA1 marks" },
];

export default function StudentAIChat() {
  const colors = useColors();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const flatListRef = useRef<FlatList>(null);
  
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: "1", text: "Hello Arjun! I am your AEC Campus Intelligence Bot. " + t("ai_greeting"), sender: "ai", time: "12:00" },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const topPad = Platform.OS === "web" ? 67 : insets.top;

  const getAIResponse = (query: string): string => {
    const q = query.toLowerCase();
    if (q.includes("fee") || q.includes("pay")) {
      return "Your pending tuition fee for Semester 5 is ₹35,000. You have paid ₹50,000 so far. The final deadline is 15 Jan 2026. You can pay via the Fees tab.";
    }
    if (q.includes("attendance") || q.includes("safe")) {
      return "Your overall attendance is 81% (Safe). However, your attendance in Operating Systems is 65% (Below the 75% limit). You must attend at least 3 more consecutive classes to avoid exam shortage.";
    }
    if (q.includes("marks") || q.includes("ca1") || q.includes("grade")) {
      return "Your CA1 Marks:\n• Data Structures: 24/25\n• Computer Networks: 21/25\n• Database Management: 24/25\n• Web Technologies: 22/25\n• Operating Systems: 19/25";
    }
    if (q.includes("placement") || q.includes("job") || q.includes("internship")) {
      return "Geetorus Technologies is hiring Software Engineer Interns (CTC: ₹12 LPA). The drive is on June 15. You are eligible and have applied!";
    }
    return "I am the AEC AI Assistant. I can fetch your live records. Try asking me about 'fees', 'attendance', 'marks', or 'placements'!";
  };

  const handleSend = (textToSend: string) => {
    if (!textToSend.trim()) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      text: textToSend,
      sender: "user",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);

    // Simulate AI thinking and reply
    setTimeout(() => {
      setIsTyping(false);
      const aiReply: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: getAIResponse(textToSend),
        sender: "ai",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, aiReply]);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }, 1200);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ flex: 1, backgroundColor: colors.background }}
    >
      {/* Header */}
      <View style={[styles.header, { paddingTop: topPad + 12, backgroundColor: colors.navy }]}>
        <View style={styles.headerRow}>
          <Pressable onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); router.back(); }} style={styles.backBtn}>
            <Feather name="arrow-left" size={20} color="#FFF" />
          </Pressable>
          <View style={{ flex: 1, paddingLeft: 12 }}>
            <Text style={styles.title}>{t("ai_assistant")}</Text>
            <Text style={styles.subtitle}>Geetorus Intelligence Core</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: colors.success + "20" }]}>
            <View style={[styles.statusDot, { backgroundColor: colors.success }]} />
            <Text style={[styles.statusText, { color: colors.success }]}>Online</Text>
          </View>
        </View>
      </View>

      {/* Messages Feed */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={[styles.bubbleWrapper, item.sender === "user" ? styles.userWrapper : styles.aiWrapper]}>
            <View
              style={[
                styles.bubble,
                item.sender === "user"
                  ? { backgroundColor: colors.primary }
                  : { backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1 },
              ]}
            >
              <Text style={[styles.bubbleText, { color: item.sender === "user" ? "#FFF" : colors.foreground }]}>
                {item.text}
              </Text>
              <Text style={[styles.bubbleTime, { color: item.sender === "user" ? "#FFFFFFB3" : colors.mutedForeground }]}>
                {item.time}
              </Text>
            </View>
          </View>
        )}
        ListFooterComponent={() => (
          isTyping ? (
            <View style={[styles.bubbleWrapper, styles.aiWrapper]}>
              <View style={[styles.bubble, styles.typingBubble, { backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1 }]}>
                <ActivityIndicator size="small" color={colors.primary} />
                <Text style={[styles.typingText, { color: colors.mutedForeground }]}>AEC Assistant is processing...</Text>
              </View>
            </View>
          ) : null
        )}
      />

      {/* Suggestions Row */}
      {messages.length === 1 && (
        <View style={styles.suggestionsWrapper}>
          {SUGGESTIONS.map((s) => (
            <Pressable
              key={s.key}
              onPress={() => handleSend(s.query)}
              style={({ pressed }) => [styles.suggestBtn, { backgroundColor: colors.card, borderColor: colors.border, opacity: pressed ? 0.8 : 1 }]}
            >
              <Feather name="help-circle" size={12} color={colors.primary} style={{ marginRight: 6 }} />
              <Text style={[styles.suggestText, { color: colors.foreground }]}>{t(s.key)}</Text>
            </Pressable>
          ))}
        </View>
      )}

      {/* Input Bar */}
      <View style={[styles.inputBar, { borderTopColor: colors.border, backgroundColor: colors.card, paddingBottom: insets.bottom + 8 }]}>
        <TextInput
          value={input}
          onChangeText={setInput}
          placeholder={t("ai_placeholder")}
          placeholderTextColor={colors.mutedForeground}
          style={[styles.input, { backgroundColor: colors.muted, color: colors.foreground, borderColor: colors.border }]}
          onSubmitEditing={() => handleSend(input)}
        />
        <Pressable
          onPress={() => handleSend(input)}
          disabled={!input.trim()}
          style={({ pressed }) => [
            styles.sendBtn,
            { backgroundColor: colors.primary, opacity: !input.trim() ? 0.5 : pressed ? 0.85 : 1 }
          ]}
        >
          <Feather name="send" size={16} color="#FFF" />
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: 16, paddingBottom: 16 },
  headerRow: { flexDirection: "row", alignItems: "center" },
  backBtn: { width: 36, height: 36, borderRadius: 12, alignItems: "center", justifyContent: "center", backgroundColor: "#FFFFFF15" },
  title: { fontSize: 16, color: "#FFF", fontFamily: "Inter_700Bold" },
  subtitle: { fontSize: 11, color: "#93C5FD", fontFamily: "Inter_400Regular", marginTop: 1 },
  statusBadge: { flexDirection: "row", alignItems: "center", gap: 5, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4 },
  statusDot: { width: 6, height: 6, borderRadius: 3 },
  statusText: { fontSize: 10, fontFamily: "Inter_600SemiBold" },
  listContainer: { padding: 16, gap: 12, paddingBottom: 24 },
  bubbleWrapper: { flexDirection: "row", width: "100%", marginVertical: 2 },
  userWrapper: { justifyContent: "flex-end" },
  aiWrapper: { justifyContent: "flex-start" },
  bubble: { maxWidth: "80%", borderRadius: 16, paddingHorizontal: 14, paddingVertical: 10 },
  bubbleText: { fontSize: 14, fontFamily: "Inter_400Regular", lineHeight: 20 },
  bubbleTime: { fontSize: 9, fontFamily: "Inter_400Regular", alignSelf: "flex-end", marginTop: 4 },
  typingBubble: { flexDirection: "row", alignItems: "center", gap: 8 },
  typingText: { fontSize: 12, fontFamily: "Inter_500Medium" },
  suggestionsWrapper: { paddingHorizontal: 16, flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 12 },
  suggestBtn: { flexDirection: "row", alignItems: "center", borderWidth: 1, borderRadius: 18, paddingHorizontal: 12, paddingVertical: 8 },
  suggestText: { fontSize: 12, fontFamily: "Inter_600SemiBold" },
  inputBar: { flexDirection: "row", borderTopWidth: 1, padding: 10, gap: 8, alignItems: "center" },
  input: { flex: 1, borderRadius: 20, borderWidth: 1, paddingHorizontal: 16, paddingVertical: 8, fontSize: 14, maxHeight: 40 },
  sendBtn: { width: 38, height: 38, borderRadius: 19, justifyContent: "center", alignItems: "center" },
});
