import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ImageBackground,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { useEffect, useState } from "react";
import Header from "../components/Header";
import { useTranslation } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useResponsiveLayout } from "../utils/responsive";

const BASE_URL = "https://script.google.com/macros/s/AKfycbxPnfs76U4yKLfIjR8msumNKT3mn7gMDtIGe2sxxXAhA8-1OzY-8mbTSOINMyqDQy94KQ/exec"

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export default function DecenasTerminacionesScreens({ navigation, route }) {
  const ui = useResponsiveLayout();
  const { sorteoId, title } = route.params;
  const { t, i18n } = useTranslation();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const anotacionesPorFila = [
    "0",
    "01 10",
    "02 20 11",
    "03 30 12 21",
    "04 40 13 31 22",
    "05 50 14 41 23 32",
    "06 60 15 51 24 42 33",
    "07 70 16 61 25 52 34 43",
    "08 80 17 71 26 62 35 53 44",
    "09 90 18 81 26 62 35 53 45 54",
    "19 91 28 82 37 73 46 64 55",
    "29 92 38 83 47 74 56 65",
    "39 93 48 84 57 75 66",
    "49 94 58 85 67 76",
    "59 95 68 86 77",
    "69 96 78 87",
    "79 97 88",
    "87 78",
    "99",
  ];

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

      <View
        style={[
          styles.container,
          {
            paddingHorizontal: ui.space(8, { min: 6, max: 8 }),
            paddingBottom: ui.space(16, { min: 12, max: 20 }),
          },
        ]}
      >
        {/* CABECERA */}
        <View style={styles.headerRow}>
          <Text
            style={[
              styles.sheetText,
              { fontSize: ui.font(16, { min: 13, max: 16 }) },
            ]}
          >
            {data?.title?.[0]?.[0] ?? "-"}
          </Text>

       {/*    <Pressable
            onPress={loadData}
            disabled={loading}
            style={({ pressed }) => [
              styles.reloadBtn,
              pressed && { opacity: 0.7 },
            ]}
          >
            <Text style={styles.reloadText}>
              {loading ? "Actualizando..." : "Recargar"}
            </Text>
          </Pressable> */}
        </View>

        {loading && (
          <ActivityIndicator size="large" style={{ marginTop: 20 }} />
        )}
        {error && <Text style={styles.errorText}>{error}</Text>}

        {!loading && Array.isArray(data?.sumDigits) && (
          <View style={styles.tableWrapper}>
            <View style={styles.table}>
              {/* HEADER */}
              <View style={styles.row}>
                <View style={[styles.headerCell, { backgroundColor: "#9fffd2" }]}>
                    <Text style={[styles.headerText, { fontSize: ui.font(10, { min: 8, max: 10 }) }]}>
                    {t('Box9.headerTable1')}
                  </Text>
                </View>
                <View style={[styles.headerCell, { backgroundColor: "#ffc0d8" }]}>
                  <Text style={[styles.headerText, { fontSize: ui.font(10, { min: 8, max: 10 }) }]}>
                    {t('Box9.headerTable2')}
                  </Text>
                </View>
                <View style={[styles.headerCell, { backgroundColor: "#fff" }]}>
                  <Text style={[styles.headerText, { fontSize: ui.font(10, { min: 8, max: 10 }) }]}>
                    {t('Box9.headerTable3')}
                  </Text>
                </View>
                <View style={[styles.headerCellWide, { backgroundColor: "#d0ff00" }]}>
                  <Text style={[styles.headerText, { fontSize: ui.font(10, { min: 8, max: 10 }) }]}>
                    {t('Box9.headerTable4')}
                  </Text>
                </View>
              </View>

              {/* FILAS */}
              {data.sumDigits.map((row, index) => (
                <View key={index} style={styles.row}>
                  <View style={[styles.cell, { backgroundColor: "#3affa3" }]}>
                    <Text style={[styles.cellText, { fontSize: ui.font(12, { min: 9, max: 12 }) }]}>{row[0]}</Text>
                  </View>
                  <View style={[styles.cell, { backgroundColor: "#f0c0ff" }]}>
                    <Text style={[styles.cellText, { fontSize: ui.font(12, { min: 9, max: 12 }) }]}>{row[1]}</Text>
                  </View>
                  <View style={[styles.cell, { backgroundColor: "#fff" }]}>
                    <Text style={[styles.cellText, { fontSize: ui.font(12, { min: 9, max: 12 }) }]}>{row[2]}</Text>
                  </View>
                  <View style={[styles.cellWide, { backgroundColor: "#00fff2" }]}>
                    <Text
                      style={[styles.fixedText, { fontSize: ui.font(9, { min: 7, max: 9 }) }]}
               
                    >
                      {anotacionesPorFila[index] ?? "-"}
                    </Text>
                  </View>
                </View>
              ))}

              {/* INFO */}
              <View style={styles.infoRow}>
                <Text style={[styles.infoText, { fontSize: ui.font(12, { min: 9, max: 12 }) }]}>
                {t('Box9.headerFooter1')}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={[styles.infoText, { fontSize: ui.font(12, { min: 9, max: 12 }) }]}>
                                {t('Box9.headerFooter2')}

                </Text>
              </View>
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
    paddingHorizontal: 8,
    paddingBottom: 20,
  },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },

  sheetText: {
    flex: 1,
    fontSize: 16,
    fontWeight: "800",
    textAlign: "center",
    color: "white"
  },

  reloadBtn: {
    backgroundColor: "#1976d2",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },

  reloadText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 10,
  },

  errorText: {
    marginTop: 8,
    color: "red",
    fontSize: 11,
    fontWeight: "700",
    textAlign: "center",
  },

  tableWrapper: {
    alignItems: "center",
    marginTop: 4,
    alignSelf: "center",
  },

  table: {
    width: "95%",
    borderWidth: 1,
    borderColor: "#000",
  },

  row: {
    flexDirection: "row",
  },

  headerCell: {
    flex: 1,
    minHeight: 34,
    justifyContent: "center",
    alignItems: "center",
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#000",
    paddingHorizontal: 2,
  },

  headerCellWide: {
    flex: 4,
    justifyContent: "center",
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: "#000",
    paddingHorizontal: 4,
  },

  headerText: {
    fontSize: 10,
    fontWeight: "800",
    textAlign: "center",
  },

  cell: {
    flex: 1,
    height: 22,
    justifyContent: "center",
    alignItems: "center",
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#000",
  },

  cellWide: {
    flex: 4,
    justifyContent: "center",
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: "#000",
    paddingHorizontal: 2,
  },

  cellText: {
    fontSize: 12,
    fontWeight: "700",
  },

  fixedText: {
    fontSize: 9,
    fontWeight: "700",
    textAlign: "center",
  },

  infoRow: {
    justifyContent: "center",
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: "#000",
    backgroundColor: "#fff",
    width: "100%"
  },

  infoText: {
    fontSize: 12,
    fontWeight: "800",
    textAlign: "center",
  },
});
