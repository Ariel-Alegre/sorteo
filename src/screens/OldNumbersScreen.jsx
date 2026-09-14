import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ImageBackground,
  ActivityIndicator,
} from "react-native";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Header from "../components/Header";
import AsyncStorage from "@react-native-async-storage/async-storage";

const BASE_URL = "https://script.google.com/macros/s/AKfycbxPnfs76U4yKLfIjR8msumNKT3mn7gMDtIGe2sxxXAhA8-1OzY-8mbTSOINMyqDQy94KQ/exec"

export default function OldNumbers({ navigation, route }) {
  const { sorteoId, title } = route.params;
  const { t, i18n } = useTranslation();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [tableHeight, setTableHeight] = useState(0);

  const rowCount = data?.masViejos?.length ?? 0;
  const headerTableHeight = tableHeight
    ? Math.max(36, Math.min(52, tableHeight * 0.12))
    : undefined;
  const dataRowHeight = tableHeight && rowCount
    ? Math.max(1, (tableHeight - headerTableHeight) / rowCount)
    : undefined;
  const dataFontSize = dataRowHeight
    ? Math.max(7, Math.min(12, dataRowHeight * 0.45))
    : 12;
  const headerFontSize = headerTableHeight
    ? Math.max(8, Math.min(11, headerTableHeight * 0.24))
    : 11;

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${BASE_URL}?i=${sorteoId}`);
      const json = await response.json();
      setData(json);
    } catch {
      setError("Error al cargar los datos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);
  // Cargar idioma guardado
  useEffect(() => {
    const loadLanguage = async () => {
      const storedLang = await AsyncStorage.getItem("appLanguage");
      if (storedLang && storedLang !== i18n.language) {
        i18n.changeLanguage(storedLang);
      }
    };
    loadLanguage();
  }, []);
  return (
    <ImageBackground
      source={require("../../assets/image/bg-white.jpeg")}
      style={styles.background}
    >
      <Header title={title} back navigation={navigation} />

      <View style={styles.container}>
        {/* CABECERA */}
        <View style={styles.headerRow}>
          <Text style={styles.sheetText} numberOfLines={1}>
            {data?.title?.[0]?.[0] ?? "-"}

          </Text>

      {/*     <Pressable
            onPress={loadData}
            disabled={loading}
            style={({ pressed }) => [
              styles.reloadBtn,
              pressed && { opacity: 0.7 },
              loading && { opacity: 0.5 },
            ]}
          >
            <Text style={styles.reloadText}>
              {loading ? <ActivityIndicator /> : t("Btn.btnUpdate")}
            </Text>
          </Pressable> */}
        </View>

        {loading && <ActivityIndicator size="large" />}

        {error && <Text style={styles.errorText}>{error}</Text>}

        {!loading && Array.isArray(data?.masViejos) && (
          <View
            style={styles.tableWrapper}
            onLayout={(event) => {
              const nextHeight = event.nativeEvent.layout.height;
              if (Math.abs(nextHeight - tableHeight) > 1) {
                setTableHeight(nextHeight);
              }
            }}
          >
            <View style={styles.table}>
              {/* HEADER */}
              <View style={[styles.row, { height: headerTableHeight }] }>
                <View style={styles.headerCell1}>
                  <Text
                    style={[styles.headerText, { fontSize: headerFontSize }]}
                    numberOfLines={3}
                    adjustsFontSizeToFit
                  >
                    {t("Box1.headerTable1")}
                  </Text>
                </View>

                <View style={styles.headerCell2}>
                  <Text
                    style={[styles.headerText, { fontSize: headerFontSize }]}
                    numberOfLines={2}
                    adjustsFontSizeToFit
                  >
                    {t("Box1.headerTable2")}
                  </Text>
                </View>

                <View style={styles.headerCell3}>
                  <Text
                    style={[styles.headerText, { fontSize: headerFontSize }]}
                    numberOfLines={2}
                    adjustsFontSizeToFit
                  >
                    {t("Box1.headerTable3")}
                  </Text>
                </View>
              </View>

              {/* FILAS */}
              {data.masViejos.map((row, index) => (
                <View
                  key={index}
                  style={[styles.row, { height: dataRowHeight }]}
                >
                  <View style={[styles.cell1, { backgroundColor: "yellow" }]}>
                    <Text
                      style={[styles.cellText, { fontSize: dataFontSize }]}
                      numberOfLines={1}
                      adjustsFontSizeToFit
                    >
                      {row[0]}
                    </Text>
                  </View>

                  <View style={[styles.cell2, { backgroundColor: "white" }]}>
                    <Text
                      style={[styles.cellTextRed, { fontSize: dataFontSize }]}
                      numberOfLines={1}
                      adjustsFontSizeToFit
                    >
                      {row[1]}
                    </Text>
                  </View>

                  <View style={[styles.cell3, { backgroundColor: "white" }]}>
                    <Text
                      style={[styles.cellText, { fontSize: dataFontSize }]}
                      numberOfLines={1}
                      adjustsFontSizeToFit
                    >
                      {row[2]}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1 },

  container: {
    flex: 1,
    minHeight: 0,
    padding: 10,
    paddingBottom: 16,
  },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },

  sheetText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "800",
    textAlign: "center",
    letterSpacing: 0.5,
    flex: 1,
    marginLeft: 60,
  },

  reloadBtn: {
    backgroundColor: "#1976d2",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
  },

  reloadText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "700",
  },

  errorText: {
    marginVertical: 8,
    color: "red",
    fontWeight: "700",
    textAlign: "center",
    fontSize: 12,
  },

  /* ================= TABLA ================= */

  tableWrapper: {
    flex: 1,
    minHeight: 0,
    marginTop: 8,
    alignItems: "center",
  },

  table: {
    flex: 1,
    minHeight: 0,
    width: "85%",
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
  },

  row: {
    width: "100%",
    flexDirection: "row",
  },

  headerCell1: {
    flex: 0.3,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#000",
    paddingVertical: 0,
    paddingHorizontal: 4,
    backgroundColor: "#ff86e1",
  },

  headerCell2: {
    flex: 0.25,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#000",
    paddingVertical: 0,
    paddingHorizontal: 4,
    backgroundColor: "#abfd92",
    alignItems: "center",
    justifyContent: "center",
  },

  headerCell3: {
    flex: 0.3,
    borderBottomWidth: 1,
    borderColor: "#000",
    paddingVertical: 0,
    paddingHorizontal: 4,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },

  headerText: {
    fontSize: 11,
    fontWeight: "800",
    textAlign: "center",
  },

  cell1: {
    flex: 0.3,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#000",
    paddingVertical: 0,
    paddingHorizontal: 4,
  },

  cell2: {
    flex: 0.25,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#000",
    paddingVertical: 0,
    paddingHorizontal: 4,
  },

  cell3: {
    flex: 0.3,
    borderBottomWidth: 1,
    borderColor: "#000",
    paddingVertical: 0,
    paddingHorizontal: 4,
  },

  cellText: {
    fontSize: 12,
    fontWeight: "700",
    textAlign: "center",
  },

  cellTextRed: {
    fontSize: 12,
    fontWeight: "800",
    textAlign: "center",
    color: "red",
  },
});
