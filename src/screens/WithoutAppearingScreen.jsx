


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
import { useTranslation } from "react-i18next";

const BASE_URL = "https://script.google.com/macros/s/AKfycbwOWSGxHp9uuf5dLvSmyyKiM0IAkZuZ8REYgYh6Bc8TNhPg3V1chygLuSiS7IfaBHK4Pg/exec"

export default function SecondDigitGreaterScreen({ navigation, route }) {
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
    } catch (e) {
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
      <Header title={`${title}`} back navigation={navigation} />

      <ScrollView contentContainerStyle={styles.container}>
        {/* CABECERA */}
        <View style={styles.headerRow}>
           <Text style={styles.sheetText}>
                      {data?.title?.[0]?.[0] ?? "-"}
                    </Text>

        {/*  <Pressable
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

        {/* LOADING */}
        {loading && (
          <ActivityIndicator size="large" style={{ marginTop: 20 }} />
        )}

        {/* ERROR */}
        {error && <Text style={styles.errorText}>{error}</Text>}

        {/* TABLA */}
        {!loading && Array.isArray(data?.withoutAppearing) && (
          <View style={styles.tableWrapper}>
            <View style={styles.table}>
            
              {/* HEADER DIVIDIDO */}
              <View style={styles.tableHeaderRow}>
                <Text style={styles.headerCell1}>
                  {t("Box2.headerTable1")}
                </Text>
                <Text style={styles.headerCell2}>
                  {t("Box2.headerTable2")}
                </Text>
              </View>

              {/* FILAS */}
              {data.withoutAppearing.map((row, index) => (
                <View key={index} style={styles.row}>
                  <Text style={styles.cell1}>{row[0]}</Text>
                  <Text style={styles.cell2}>{row[1]}</Text>
                </View>
              ))}
              <View >
                <Text style={styles.footer}>
                  {t("Box2.footerTable1")}
                </Text>
           
              </View>

               <View >
                <Text style={styles.footer}>
                {t("Box2.footerTable2")}
                </Text>

                     <Text style={styles.footer}>
           {t("Box2.footerTable3")}

                </Text>
              </View>
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
    flex: 1,
    fontSize: 16,
    fontWeight: "800",
    textAlign: "center",
    marginLeft: 50,
    color: "white"
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
 footer: {
    fontSize: 12,
    textAlign: "center",
    fontWeight: "700",
    borderRightWidth: 1,
    borderColor: "#000",
    backgroundColor: "#1aff62",
    width: "100%",
  },

  headerCell1: {
     flex: 0.8,
    fontSize: 12,
    paddingVertical: 8,
    textAlign: "center",
    fontWeight: "700",
    borderRightWidth: 1,
    borderColor: "#000",
    backgroundColor: "#ff86e1ff",
  },

  headerCell2: {
    flex: 0.8,
    fontSize: 12,
    paddingVertical: 8,
    textAlign: "center",
    fontWeight: "700",
    borderRightWidth: 1,
    borderColor: "#000",
    backgroundColor: "#e4e4e4ff",
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
    flex:0.8,
    textAlign: "center",
    fontSize: 17,
    borderRightWidth: 1,
    borderColor: "#000",
    fontWeight: "800",
  },

  cell2: {
    flex: 0.8,
    textAlign: "center",
    fontSize: 17,
    borderRightWidth: 1,
    borderColor: "#000",
    backgroundColor: "#fff",
    fontWeight: "800",
    backgroundColor: "#00ffd5ff",
  },

   headerTitle: {
    flex: 0.5,
    paddingVertical: 8,
    textAlign: "center",
    fontWeight: "700",
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#000",
    backgroundColor: "#86ddffff",
  },
});
