import { Text, StyleSheet, TouchableOpacity } from "react-native";

export default function SorteoCard({ title, subtitle, flag, onPress }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
    {flag ? flag : null}
         {subtitle && (
        <Text style={styles.title} numberOfLines={1}>
          {subtitle}
        </Text>
      )}
      <Text style={styles.title} numberOfLines={1}>
        {title}
      </Text>
   
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    height: 100,
    backgroundColor: "rgba(255,255,255,0.95)",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
    marginHorizontal: 10,
    paddingVertical: 4,
  },
  title: {
    fontSize: 12,
    fontWeight: "800",
    marginTop: 3,
    textAlign: "center",
  },
});
