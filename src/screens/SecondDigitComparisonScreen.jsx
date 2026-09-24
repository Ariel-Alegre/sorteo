import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ImageBackground,
  ActivityIndicator,
} from "react-native";
import { useEffect, useState } from "react";
import Header from "../components/Header";
import { useTranslation } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";

const BASE_URL = "https://script.google.com/macros/s/AKfycbwOWSGxHp9uuf5dLvSmyyKiM0IAkZuZ8REYgYh6Bc8TNhPg3V1chygLuSiS7IfaBHK4Pg/exec"

export default function SecondDigitComparisonScreen({ navigation, route }) {
  const { sorteoId, title } = route.params;
  const { t, i18n } = useTranslation();

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
    } catch {
      setError("Error al cargar los datos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);
const customLabels = [
 `${t('Box6.headerTable2')}=00,11,22,33,44,55,66,77,88,99`,
  null,
  `${t('Box6.headerTable3')}=01,12,23,34,45,56,67,78,87,90`,
  null,
  `${t('Box6.headerTable4')}=02,13,24,35,46,57,68,79,80,91`,
  null,
  `${t('Box6.headerTable5')}=03,14,25,36,47,58,69,70,81,92`,
  null,
  `${t('Box6.headerTable6')}= 04,15,26,37,48,59,60,71,82,93`,
  null,
  `${t('Box6.headerTable7')}=05,16,27,38,49,50,61,72,83,94`,
  null,
  `${t('Box6.headerTable8')}=06,17,28,39,40,51,62,73,84,95`,
  null,
  `${t('Box6.headerTable9')}s=07,18,29,30,41,52,63,74,85,96`,
  null,
  `${t('Box6.headerTable10')}=08,19,20,31,42,53,64,75,86,97`,
  null,
  `${t('Box6.headerTable11')}= 09,10,21,32,43,54,65,76,87,98`


];
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
      <Header title={`${title}`} back navigation={navigation} />

      <View style={styles.container}>
        {/* CABECERA */}
        <View style={styles.headerRow}>
          <Text style={styles.sheetText}>
            {data?.title?.[0]?.[0] || "-"}
          </Text>

       {/*    <Pressable
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

        {loading && <ActivityIndicator size="large" style={{ marginTop: 20 }} />}
        {error && <Text style={styles.errorText}>{error}</Text>}

        {!loading && Array.isArray(data?.secondDigitComparison) && (
          <View style={styles.tableWrapper}>
            <View style={styles.tableRow}>
              {/* TABLA */}
              <View style={styles.table}>
                <View style={styles.tableHeaderRow}>
                  <Text style={styles.headerCell1}>
                    {t("Box6.headerTable1")}
                  </Text>
                </View>

                <ScrollView
                  style={styles.tableScroll}
                >
                  {data.secondDigitComparison.map((row, index) => {
                    const isFooter =
                      index >= data.secondDigitComparison.length - 3;

                    return (
                      <View
                        key={index}
                        style={[
                          styles.row,
                          isFooter
                            ? styles.footerRow
                            : index % 2 === 0
                              ? { backgroundColor: "#b3ff4fff" }
                              : {
                                  backgroundColor: "#FFD54F",
                                  marginBottom: 5,
                                },
                        ]}
                      >
                        <Text
                          style={[
                            styles.cell1,
                            !isFooter &&
                              index % 2 === 0 &&
                              styles.greenCellText,
                          ]}
                        >
                          {customLabels[index] ?? row[0] ?? ""}{" "}
                          {row[1] ?? ""}
                        </Text>
                      </View>
                    );
                  })}
                </ScrollView>
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
    minHeight: 0,
    padding: 12,
    paddingBottom: 20,
  },

  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },

  sheetText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "800",
    textAlign: "center",
    flex: 1,
    marginLeft: 60,
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
    color: "red",
    textAlign: "center",
    marginTop: 10,
  },

  tableWrapper: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    alignSelf: "center",
    minHeight: 0,
    overflow: "hidden",
  },

  tableRow: {
    flex: 1,
    width: "100%",
    flexDirection: "row",
    alignItems: "stretch",
    justifyContent: "center",
    minHeight: 0,
  },

  table: {
    width: "80%",
    height: "100%",
    maxHeight: "100%",
    borderRadius: 6,
    overflow: "hidden",
    minHeight: 0,
  },

  tableScroll: {
    flex: 1,
  },

  tableHeaderRow: {
    borderBottomWidth: 1,
    borderColor: "#000",
  },

  headerCell1: {
    fontSize: 12,
    textAlign: "center",
    fontWeight: "700",
    backgroundColor: "#00ffddff",
  },

  row: {
    borderBottomWidth: 1,
    borderColor: "#000",
  },

  footerRow: {
    backgroundColor: "#fff",
    marginBottom: 0,
  },

  cell1: {
    fontSize: 10,
    textAlign: "center",
    fontWeight: "800",
  },

  greenCellText: {
    fontSize: 8,
  },
});
