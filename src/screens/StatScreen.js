import { View, StyleSheet } from "react-native";
import { Text } from "react-native-paper";
import Header from "../components/Header";

export default function StatScreen({ navigation, route }) {
  return (
    <>
      <Header title="Estadística" back navigation={navigation} />
      <View style={styles.container}>
        <Text variant="titleMedium">
          Sorteo {route.params.sorteoId}
        </Text>
        <Text variant="bodyMedium">
          Estadística #{route.params.statId}
        </Text>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
});
