import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  ImageBackground,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { useEffect, useState } from "react";
import Header from "../components/Header";
import AsyncStorage from "@react-native-async-storage/async-storage";

const BASE_URL = "https://script.google.com/macros/s/AKfycbwOWSGxHp9uuf5dLvSmyyKiM0IAkZuZ8REYgYh6Bc8TNhPg3V1chygLuSiS7IfaBHK4Pg/exec";

const { height } = Dimensions.get("window");

export default function Test({ navigation, route }) {
  const { sorteoId, title } = route.params;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${BASE_URL}?i=${sorteoId}`);
      const json = await response.json();

      setData(json);
    } catch (e) {
      setError("Error al cargar los datos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <ImageBackground
      source={require("../../assets/image/bg-white.jpeg")}
      style={styles.background}
      resizeMode="cover"
    >
      <Header
        title={`${title}`}
        back
        navigation={navigation}
      />

      <ScrollView contentContainerStyle={styles.container}>
        {/* CABECERA */}
        <View style={styles.headerRow}>
          <Text style={styles.sheetText}>
            Hoja: {data?.sheet || "-"}
          </Text>

          <Pressable
            onPress={loadData}
            disabled={loading}
            style={({ pressed }) => [
              styles.reloadBtn,
              pressed && { opacity: 0.7 },
              loading && { opacity: 0.5 },
            ]}
          >
            <Text style={styles.reloadText}>
              {loading ? "Actualizando..." : "Recargar"}
            </Text>
          </Pressable>
        </View>

        {/* LOADING */}
        {loading && (
          <ActivityIndicator size="large" style={{ marginTop: 20 }} />
        )}

        {/* ERROR */}
        {error && <Text style={styles.errorText}>{error}</Text>}

{/* TABLA */}
{!loading && Array.isArray(data?.masViejos) && (
  <View style={styles.tableWrapper}>
    <View style={styles.table}>

      {/* HEADER DIVIDIDO */}
      <View style={styles.tableHeaderRow}>
        <Text style={styles.headerCell1}>Lista de los 15 más viejos en salir</Text>
        <Text style={styles.headerCell2}>Número de sorteos</Text>
        <Text style={styles.headerCell3}>Fecha</Text>
      </View>

      {/* FILAS */}
      {data.masViejos.map((row, index) => (
        <View key={index} style={styles.row}>
          <Text style={styles.cell1}>{row[0]}</Text>
          <Text style={styles.cell2}>{row[1]}</Text>
          <Text style={styles.cell3}>{row[2]}</Text>
        </View>
      ))}

    </View>
  </View>
)}

      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },

  container: {
    flexGrow: 1,
    padding: 12,
    paddingBottom: 30,
  },

  sheetText: {
    color: "#fff",
    fontSize: 12,
  },

  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },

  reloadBtn: {
    backgroundColor: "#1976d2",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },

  reloadText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 11,
  },

  errorText: {
    marginTop: 10,
    color: "red",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 12,
  },

  /* ================= TABLA ================= */

  tableWrapper: {
    marginTop: 6,
    alignItems: "center",
  },

  table: {
    width: "80%",
    backgroundColor: "#FFD54F",
    borderRadius: 6,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#000",
  },

  /* HEADER DIVIDIDO */
  tableHeaderRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#000",
  },

  headerCell1: {
    flex: 1.4,
    fontSize: 10,
    paddingVertical: 8,     // ⬆ más alto
    textAlign: "center",
    fontWeight: "700",
    borderRightWidth: 1,
    borderColor: "#000",
    backgroundColor: "#ff86e1ff",
  },

  headerCell2: {
    flex: 0.8,
    fontSize: 10,
    paddingVertical: 8,     // ⬆ más alto
    textAlign: "center",
    fontWeight: "700",
    borderRightWidth: 1,
    borderColor: "#000",
    backgroundColor: "#abfd92ff",
  },

  headerCell3: {
    flex: 0.8,
    fontSize: 10,
    paddingVertical: 8,     // ⬆ más alto
    textAlign: "center",
    fontWeight: "700",
    backgroundColor: "#fff",
  },

  /* FILAS */
  row: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: "#000",
    backgroundColor: "#FFD54F",
  },

  cell1: {
    flex: 1.4,
    textAlign: "center",
    fontSize: 15,
    paddingVertical: 10,     // ⬆ más alto
    borderRightWidth: 1,
    borderColor: "#000",
    fontWeight: "800"

  },

  cell2: {
    flex: 0.8,
    textAlign: "center",
    fontSize: 15,
    paddingVertical: 10,     // ⬆ más alto
    borderRightWidth: 1,
    borderColor: "#000",
    backgroundColor: "#fff",
    color: "red",
    fontWeight: "800"
  },

  cell3: {
    flex: 0.8,
    textAlign: "center",
    fontSize: 15,
    paddingVertical: 10,     // ⬆ más alto
    backgroundColor: "#fff",
    fontWeight: "800"

  },
});
