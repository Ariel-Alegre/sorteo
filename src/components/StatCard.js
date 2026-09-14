import { Pressable, View, Text } from "react-native";

export default function StatCard({ title, id, color, onPress }) {
  const textColor =
    typeof color === "string" && color.trim() ? color.trim() : "#000";

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        pressed && styles.pressed,
      ]}
    >
      <View style={styles.cardContent}>
        <Text style={[styles.cardText, { color: textColor }]}>{title}</Text>
      </View>
    </Pressable>
  );
}

const styles = {
  card: {
    width: "31%",
    margin: "1%",
    backgroundColor: "rgba(255,255,255,0.95)",
    borderRadius: 12,
  },

  pressed: {
    opacity: 0.7,
  },

  cardContent: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    justifyContent: "center",
    alignItems: "center",
  },

  cardText: {
    color: "#000",
    textAlign: "center",
    fontSize: 8,
    fontWeight: "800",
    lineHeight: 12,
  },
};
