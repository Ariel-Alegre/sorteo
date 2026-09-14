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
import { useTranslation } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";

const BASE_URL = "https://script.google.com/macros/s/AKfycbxPnfs76U4yKLfIjR8msumNKT3mn7gMDtIGe2sxxXAhA8-1OzY-8mbTSOINMyqDQy94KQ/exec"

export default function MostFrequent23Screen({ navigation, route }) {
  const { sorteoId, title } = route.params ?? {};
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
      resizeMode="cover"
    >
      <Header title={title} back navigation={navigation} />

      <ScrollView contentContainerStyle={styles.container}>
        {/* CABECERA */}
        <View style={styles.headerRow}>
          <Text style={styles.sheetText}>
            {data?.title?.[0]?.[0] ?? "-"}
          </Text>

          {/* <Pressable
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

        {loading && (
          <ActivityIndicator size="large" style={{ marginTop: 20 }} />
        )}

        {error && <Text style={styles.errorText}>{error}</Text>}

        {/* TABLA */}
        {!loading && Array.isArray(data?.mostFrequent23) && (
          <View style={styles.tableWrapper}>
            <View style={styles.table}>
              {/* HEADER */}
              <View style={styles.tableHeaderRow}>
                <View style={styles.headerCellLeft}>
                  <Text style={styles.headerText}>{t('Box5.headerTable1')}</Text>
                </View>

                <View style={styles.headerCellRight}>
                  <Text style={styles.headerText}>
                    {t('Box5.headerTable2')}
                  </Text>
                </View>
              </View>

              {/* FILAS */}
              {data.mostFrequent23.map((row, index) => (
                <View key={index} style={styles.row}>
                  <View style={styles.cellLeft}>
                    <Text style={styles.cellText}>{row[0]}</Text>
                  </View>

                  <View style={styles.cellRight}>
                    <Text style={styles.cellText}>{row[1]}</Text>
                  </View>
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
  background: { flex: 1 },

  container: {
    flexGrow: 1,
    padding: 12,
    paddingBottom: 30,
  },

  /* CABECERA */
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
    flex: 1,
    marginLeft: 50,
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

  /* TABLA */
  tableWrapper: {
    marginTop: 6,
    alignItems: "center",
  },

  table: {
    width: "80%",
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 6,
    overflow: "hidden",
    backgroundColor: "#FFD54F",
  },

  tableHeaderRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#000",
  },

  headerCellLeft: {
    flex: 0.4,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
    borderRightWidth: 1,
    borderColor: "#000",
  },

  headerCellRight: {
    flex: 0.6,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 6,
  },

  headerText: {
    fontWeight: "800",
    fontSize: 14,
    textAlign: "center",
  },

  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#000",
  },

  cellLeft: {
    flex: 0.4,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
    borderRightWidth: 1,
    borderColor: "#000",
    backgroundColor: "#94fa59",
  },

  cellRight: {
    flex: 0.6,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
    backgroundColor: "#fabbefff",
  },

  cellText: {
    fontSize: 18,
    fontWeight: "800",
    textAlign: "center",
  },
});
