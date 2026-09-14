import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  ImageBackground,
  ActivityIndicator,
} from "react-native";
import { useEffect, useState } from "react";
import Header from "../components/Header";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTranslation } from "react-i18next";

const BASE_URL = "https://script.google.com/macros/s/AKfycbxPnfs76U4yKLfIjR8msumNKT3mn7gMDtIGe2sxxXAhA8-1OzY-8mbTSOINMyqDQy94KQ/exec"

const formatPercentage = (value) => {
  if (value === null || value === undefined || value === "") return "";
  if (typeof value === "string" && value.includes("%")) return value;

  const number = Number(String(value).replace(",", "."));
  if (!Number.isFinite(number)) return String(value);

  const percentage = Math.abs(number) <= 1 ? number * 100 : number;
  const rounded = Math.round(percentage * 100) / 100;
  return `${rounded}%`;
};

/* ETIQUETAS FIJAS PARA LA PRIMERA TABLA */

export default function SecondDigitGreaterScreen({ navigation, route }) {
  const { sorteoId, title } = route.params;
  const { t, i18n } = useTranslation();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
 console.log(data?.secondsGreater2?.[3])

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
      source={require("../../assets/image/bg-blue.jpeg")}
      style={styles.background}
      resizeMode="cover"
    >
      <Header title={title} back navigation={navigation} />

      <ScrollView contentContainerStyle={styles.container}>
        {/* CABECERA */}
        <View style={styles.headerRow}>
          <Text style={styles.sheetText}>{data?.title?.[0]?.[0] ?? "-"}</Text>

       {/*    <Pressable
            onPress={loadData}
            disabled={loading}
            style={({ pressed }) => [
              styles.reloadBtn,
              pressed && { opacity: 0.7 },
              loading && { opacity: 0.5 },
            ]}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.reloadText}>{t("Btn.btnUpdate")}</Text>
            )}
          </Pressable> */}
        </View>

        {loading && (
          <ActivityIndicator size="large" style={{ marginTop: 20 }} />
        )}

        {error && <Text style={styles.errorText}>{error}</Text>}


        {/* ================= SEGUNDA TABLA (HARDCODEADA EN COLUMNAS) ================= */}
        {!loading && (
          <View style={styles.tableWrapper}>
            <View style={styles.table}>
              <View style={styles.tableHeaderRow}>
                <Text style={styles.headerCell}>{t("Box7.headerTable2")}</Text>
              </View>
         

              <View style={styles.row}>
                <Text style={styles.columnHeader}>
                  {t("Box7.headerTable4")}
                </Text>
                <Text style={styles.columnHeader}>
                  {t("Box7.headerTable5")}
                </Text>
                <Text style={styles.columnHeader}>
                  {t("Box7.headerTable6")}
                </Text>
              </View>
               

              <View style={styles.row}>
                {data?.secondsGreater2?.[3]
                  ?.slice(0, 3)
                  .map((value, index) => (
                    <Text key={index} style={styles.cell}>
                      {formatPercentage(value)}
                    </Text>
                  ))}
              </View>
            

              <View style={styles.row}>
                <Text style={styles.expectedOk}>{t("Box7.headerTable7")}</Text>
                <Text style={styles.expectedWarn}>
                  {t("Box7.headerTable8")}
                </Text>
                <Text style={styles.expectedOk}>{t("Box7.headerTable9")}</Text>
              </View>

              <View style={styles.noteRow}>
                <Text style={styles.noteText}>{t("Box7.footerTable1")}</Text>
              </View>
              <View style={styles.noteRow}>
                <Text style={styles.noteText}>{t("Box7.footerTable2")}</Text>
              </View>
            </View>
          </View>
        )}

        
        {/* ================= PRIMERA TABLA (JSON + LABELS LOCALES) ================= */}
        {!loading && Array.isArray(data?.secondsGreater) && (
          <View style={styles.tableWrapper}>
            <View style={styles.table}>
              <View style={styles.tableHeaderRow}>
                <Text style={styles.headerCell}>{t("Box7.headerTable1")}</Text>
              </View>

              {data.secondsGreater.map((row, index) => (
                <View key={index} style={styles.row}>
                  <Text style={styles.cell}>{row[0]}</Text>
                  <Text style={styles.cell}>{row[1]}</Text>
                  <Text style={styles.cellDate}>{row[2]}</Text>

                  {/* COLUMNA 4 DEFINIDA EN EL CÓDIGO */}
                  <Text style={styles.cellResult}>
                    {row[3]}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </ScrollView>
    </ImageBackground>
  );
}

/* ================== STYLES ================== */
const styles = StyleSheet.create({
  background: { flex: 1 },

  container: {
    flexGrow: 1,
    padding: 12,
    paddingBottom: 30,
  },

  sheetText: {
    flex: 1,
    fontSize: 16,
    fontWeight: "800",
    textAlign: "center",
    marginLeft: 50,
    color: "white",
  },

  headerRow: {
    flexDirection: "row",
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

  tableWrapper: {
    marginTop: 8,
    alignItems: "center",
  },

  table: {
    width: "90%",
    backgroundColor: "#FFD54F",
    borderRadius: 6,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#000",
  },

  tableHeaderRow: {
    borderBottomWidth: 1,
    borderColor: "#000",
  },

  headerCell: {
    fontSize: 12,
    paddingVertical: 8,
    textAlign: "center",
    fontWeight: "800",
    backgroundColor: "#e4e4e4",
  },

  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#000",
  },

  cell: {
    flex: 1,
    textAlign: "center",
    fontSize: 12,
    fontWeight: "800",
    borderRightWidth: 1,
    borderColor: "#000",
    backgroundColor: "#00ffd5",
  },

  cellDate: {
    flex: 1,
    textAlign: "center",
    fontSize: 10,
    fontWeight: "700",
    borderRightWidth: 1,
    borderColor: "#000",
    backgroundColor: "#fff7cc",
  },

  cellResult: {
    flex: 1,
    textAlign: "center",
    fontSize: 10,
    fontWeight: "900",
    backgroundColor: "#86ddff",
  },

  columnHeader: {
    flex: 1,
    textAlign: "center",
    fontSize: 12,
    fontWeight: "900",
    borderRightWidth: 1,
    borderColor: "#000",
    backgroundColor: "#e0e0e0",
    paddingVertical: 6,
  },

  expectedOk: {
    flex: 1,
    textAlign: "center",
    fontSize: 13,
    fontWeight: "800",
    backgroundColor: "#b9f6ca",
    borderRightWidth: 1,
    borderColor: "#000",
    paddingVertical: 6,
  },

  expectedWarn: {
    flex: 1,
    textAlign: "center",
    fontSize: 13,
    fontWeight: "900",
    backgroundColor: "#ffccbc",
    borderRightWidth: 1,
    borderColor: "#000",
    paddingVertical: 6,
  },

  noteRow: {
    borderTopWidth: 1,
    borderColor: "#000",
    backgroundColor: "#fffde7",
    paddingVertical: 6,
    paddingHorizontal: 6,
  },

  noteText: {
    fontSize: 12,
    fontWeight: "700",
    textAlign: "center",
  },
});
