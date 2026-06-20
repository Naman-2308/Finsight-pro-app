import { useCallback, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { SendHorizonal, Bot, User, X } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Colors } from "@/constants/colors";
import { Spacing } from "@/constants/spacing";
import { api } from "@/lib/api";
import AmbientBackground from "@/components/ui/AmbientBackground";

interface Message {
  id: string;
  role: "user" | "assistant";
  text: string;
  error?: boolean;
}

async function sendCopilotMessage(message: string): Promise<string> {
  const res = await api.post<{ reply: string }>("/copilot/chat", { message });
  return res.data.reply;
}

let msgCounter = 0;
function newId() {
  return String(++msgCounter);
}

const SUGGESTIONS = [
  "How much have I spent this month?",
  "Am I over budget?",
  "How much can I save this month?",
  "What's my biggest spending category?",
];

export default function CopilotModal() {
  const insets = useSafeAreaInsets();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const listRef = useRef<FlatList<Message>>(null);

  const send = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || sending) return;

      const userMsg: Message = { id: newId(), role: "user", text: trimmed };
      setMessages((prev) => [...prev, userMsg]);
      setInput("");
      setSending(true);

      requestAnimationFrame(() =>
        listRef.current?.scrollToEnd({ animated: true })
      );

      try {
        const reply = await sendCopilotMessage(trimmed);
        setMessages((prev) => [
          ...prev,
          { id: newId(), role: "assistant", text: reply },
        ]);
      } catch (err) {
        const errorText =
          err instanceof Error
            ? err.message
            : "Something went wrong. Please try again.";
        setMessages((prev) => [
          ...prev,
          { id: newId(), role: "assistant", text: errorText, error: true },
        ]);
      } finally {
        setSending(false);
        requestAnimationFrame(() =>
          listRef.current?.scrollToEnd({ animated: true })
        );
      }
    },
    [sending]
  );

  const isEmpty = messages.length === 0;

  return (
    <View style={styles.shell}>
      <AmbientBackground />

      {/* ── Header ─────────────────────────────────────── */}
      <View style={[styles.header, { paddingTop: insets.top + 14 }]}>
        <LinearGradient
          colors={[Colors.primary, Colors.accentViolet]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.headerIcon}
        >
          <Bot size={18} color="#0A0C10" strokeWidth={2.2} />
        </LinearGradient>

        <View style={styles.headerText}>
          <Text style={styles.headerTitle}>AI Copilot</Text>
          <Text style={styles.headerSub}>Your personal finance assistant</Text>
        </View>

        <View style={styles.onlineDot} />

        <Pressable
          onPress={() => router.back()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          style={({ pressed }) => [styles.closeBtn, pressed && { opacity: 0.6 }]}
        >
          <X size={18} color={Colors.mutedText} strokeWidth={2} />
        </Pressable>
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        {/* ── Empty state / Messages ───────────────────── */}
        {isEmpty ? (
          <View style={styles.emptyState}>
            <LinearGradient
              colors={["rgba(0,214,143,0.12)", "rgba(0,214,143,0.04)"]}
              style={styles.emptyOrb}
            >
              <Bot size={36} color={Colors.primary} strokeWidth={1.6} />
            </LinearGradient>
            <Text style={styles.emptyTitle}>Ask me anything financial</Text>
            <Text style={styles.emptySub}>
              I have access to your spending, budget, EMIs, and savings.
            </Text>
            <View style={styles.suggestionList}>
              {SUGGESTIONS.map((s) => (
                <Pressable
                  key={s}
                  style={({ pressed }) => [
                    styles.suggestionChip,
                    pressed && styles.suggestionChipPressed,
                  ]}
                  onPress={() => send(s)}
                >
                  <Text style={styles.suggestionText}>{s}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        ) : (
          <FlatList
            ref={listRef}
            data={messages}
            keyExtractor={(m) => m.id}
            contentContainerStyle={styles.messageList}
            showsVerticalScrollIndicator={false}
            onContentSizeChange={() =>
              listRef.current?.scrollToEnd({ animated: true })
            }
            renderItem={({ item }) => <MessageBubble msg={item} />}
          />
        )}

        {/* ── Typing indicator ────────────────────────── */}
        {sending ? (
          <View style={styles.typingRow}>
            <View style={styles.typingBubble}>
              <ActivityIndicator size="small" color={Colors.primary} />
              <Text style={styles.typingText}>Copilot is thinking…</Text>
            </View>
          </View>
        ) : null}

        {/* ── Input bar ───────────────────────────────── */}
        <View
          style={[
            styles.inputBar,
            { paddingBottom: Math.max(insets.bottom + 8, 16) },
          ]}
        >
          <View style={styles.inputWrap}>
            <TextInput
              value={input}
              onChangeText={setInput}
              placeholder="Ask about your finances…"
              placeholderTextColor={Colors.dimText}
              style={styles.textInput}
              multiline
              maxLength={500}
              returnKeyType="send"
              blurOnSubmit={false}
              onSubmitEditing={() => send(input)}
            />
            <Pressable
              style={({ pressed }) => [
                styles.sendBtn,
                (!input.trim() || sending) && styles.sendBtnDisabled,
                pressed && input.trim() && !sending && styles.sendBtnPressed,
              ]}
              onPress={() => send(input)}
              disabled={!input.trim() || sending}
            >
              <LinearGradient
                colors={
                  input.trim() && !sending
                    ? [Colors.primaryLight, Colors.primary]
                    : [Colors.card, Colors.card]
                }
                style={styles.sendGradient}
              >
                <SendHorizonal
                  size={17}
                  color={
                    input.trim() && !sending ? "#0A0C10" : Colors.dimText
                  }
                  strokeWidth={2.2}
                />
              </LinearGradient>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

function MessageBubble({ msg }: { msg: Message }) {
  const isUser = msg.role === "user";
  return (
    <View
      style={[
        styles.bubbleRow,
        isUser ? styles.bubbleRowUser : styles.bubbleRowBot,
      ]}
    >
      {!isUser && (
        <LinearGradient
          colors={[Colors.primary, Colors.accentViolet]}
          style={styles.avatarBot}
        >
          <Bot size={13} color="#0A0C10" strokeWidth={2.4} />
        </LinearGradient>
      )}
      <View
        style={[
          styles.bubble,
          isUser ? styles.bubbleUser : styles.bubbleBot,
          msg.error && styles.bubbleError,
        ]}
      >
        <Text
          style={[
            styles.bubbleText,
            isUser ? styles.bubbleTextUser : styles.bubbleTextBot,
            msg.error && styles.bubbleTextError,
          ]}
        >
          {msg.text}
        </Text>
      </View>
      {isUser && (
        <View style={styles.avatarUser}>
          <User size={13} color={Colors.primary} strokeWidth={2.2} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  shell: { flex: 1, backgroundColor: Colors.background },
  flex: { flex: 1 },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.separator,
    gap: 12,
  },
  headerIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  headerText: { flex: 1 },
  headerTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: Colors.text,
    letterSpacing: -0.3,
  },
  headerSub: { fontSize: 12, color: Colors.mutedText, marginTop: 1 },
  onlineDot: {
    width: 8,
    height: 8,
    borderRadius: 999,
    backgroundColor: Colors.primary,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 999,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: "center",
    justifyContent: "center",
  },

  // Empty state
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: Spacing.xl,
    gap: Spacing.sm,
  },
  emptyOrb: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.xs,
    borderWidth: 1,
    borderColor: "rgba(0,214,143,0.20)",
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: Colors.text,
    letterSpacing: -0.4,
    textAlign: "center",
  },
  emptySub: {
    fontSize: 14,
    color: Colors.mutedText,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: Spacing.sm,
  },
  suggestionList: { width: "100%", gap: Spacing.xs },
  suggestionChip: {
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  suggestionChipPressed: {
    backgroundColor: Colors.cardElevated,
    borderColor: Colors.primary,
  },
  suggestionText: { color: Colors.mutedText, fontSize: 14, lineHeight: 20 },

  // Messages
  messageList: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.lg,
    gap: Spacing.sm,
  },
  bubbleRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 8,
    marginVertical: 3,
  },
  bubbleRowUser: { justifyContent: "flex-end" },
  bubbleRowBot: { justifyContent: "flex-start" },
  avatarBot: {
    width: 26,
    height: 26,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  avatarUser: {
    width: 26,
    height: 26,
    borderRadius: 8,
    backgroundColor: Colors.cardElevated,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  bubble: {
    maxWidth: "78%",
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  bubbleUser: { backgroundColor: Colors.primary, borderBottomRightRadius: 4 },
  bubbleBot: {
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    borderBottomLeftRadius: 4,
  },
  bubbleError: {
    backgroundColor: Colors.errorSurface,
    borderColor: Colors.errorBorder,
  },
  bubbleText: { fontSize: 14, lineHeight: 21 },
  bubbleTextUser: { color: "#0A0C10", fontWeight: "600" },
  bubbleTextBot: { color: Colors.text },
  bubbleTextError: { color: Colors.errorText },

  // Typing
  typingRow: { paddingHorizontal: Spacing.md, paddingBottom: Spacing.xs },
  typingBubble: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignSelf: "flex-start",
  },
  typingText: { color: Colors.mutedText, fontSize: 13 },

  // Input
  inputBar: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.xs,
    borderTopWidth: 1,
    borderTopColor: Colors.separator,
    backgroundColor: Colors.background,
  },
  inputWrap: {
    flexDirection: "row",
    alignItems: "flex-end",
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 20,
    paddingLeft: 14,
    paddingRight: 6,
    paddingVertical: 6,
    gap: 8,
  },
  textInput: {
    flex: 1,
    fontSize: 15,
    color: Colors.text,
    maxHeight: 110,
    paddingVertical: 6,
    lineHeight: 21,
  },
  sendBtn: { borderRadius: 999, overflow: "hidden" },
  sendBtnDisabled: { opacity: 0.4 },
  sendBtnPressed: { opacity: 0.88, transform: [{ scale: 0.94 }] },
  sendGradient: {
    width: 36,
    height: 36,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
});
