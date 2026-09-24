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
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../components/Header";
import { useTranslation } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useResponsiveLayout } from "../utils/responsive";

const BASE_URL = "https://script.google.com/macros/s/AKfycbwOWSGxHp9uuf5dLvSmyyKiM0IAkZuZ8REYgYh6Bc8TNhPg3V1chygLuSiS7IfaBHK4Pg/exec"

export default function DecenasTerminacionesScreens({ navigation, route }) {
  const ui = useResponsiveLayout();
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
    <View style={{ flex: 1 }}>
      <ImageBackground
        source={require("../../assets/image/bg-white.jpeg")}
        style={styles.background}
        resizeMode="cover"
      >
        <Header title={title} back navigation={navigation} />

        <ScrollView
          contentContainerStyle={[styles.container, { padding: ui.space(12, { min: 8, max: 12 }), paddingBottom: ui.space(20, { min: 14, max: 24 }) }]}
          showsVerticalScrollIndicator={false}
        >
          {/* CABECERA */}
          <View style={styles.headerRow}>
            <Text style={[styles.sheetText, { fontSize: ui.font(18, { min: 14, max: 18 }) }]}>
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

          {/* LOADING */}
          {loading && (
            <ActivityIndicator size="large" style={{ marginTop: 20 }} />
          )}

          {/* ERROR */}
          {error && <Text style={styles.errorText}>{error}</Text>}

          {/* TABLA */}
          {!loading && Array.isArray(data?.decenasTerminaciones) && (
            <View style={styles.tableWrapper}>
              <View
                style={[
                  styles.table,
                  { width: Math.min(ui.width - 40, 420) },
                ]}
              >
                {/* HEADER */}
                <View style={styles.tableHeaderRow}>
                  <View style={styles.headerCellPink}>
                    <Text style={[styles.headerText, { fontSize: ui.font(12, { min: 9, max: 12 }) }]}>{t('Box3.headerTable1')}</Text>
                  </View>

                  <View style={styles.headerCellGray}>
                    <Text style={[styles.headerText, { fontSize: ui.font(12, { min: 9, max: 12 }) }]}>
                     {t('Box3.headerTable2')}
                    </Text>
                  </View>
<View style={styles.separate}>
                    <Text style={styles.headerText}></Text>
                  </View>
                  <View style={styles.headerCellPink}>
                    <Text style={[styles.headerText, { fontSize: ui.font(12, { min: 9, max: 12 }) }]}>{t('Box3.headerTable3')}</Text>
                  </View>

                  <View style={styles.headerCellGray}>
                    <Text style={[styles.headerText, { fontSize: ui.font(12, { min: 9, max: 12 }) }]}>
                     {t('Box3.headerTable4')}
                    </Text>
                  </View>
                </View>

                {/* FILAS */}
                {data.decenasTerminaciones.map((row, index) => (
                  <View key={index} style={styles.row}>
                    <View style={styles.cell}>
                      <Text style={[styles.cellTextBig, { fontSize: ui.font(12, { min: 10, max: 12 }) }]}>{row[0]}</Text>
                    </View>
  
                    <View style={[styles.cell, styles.cyan]}>
                      <Text style={[styles.cellText, { fontSize: ui.font(12, { min: 10, max: 12 }) }]}>{row[1]}</Text>
                    </View>
<View style={styles.cellSeparate}>
                      <Text style={styles.cellText}></Text>
                    </View>
                    <View style={styles.cell}>
                      <Text style={[styles.cellText, { fontSize: ui.font(12, { min: 10, max: 12 }) }]}>{row[2]}</Text>
                    </View>

                    <View style={[styles.cell, styles.cyan]}>
                      <Text style={[styles.cellText, { fontSize: ui.font(12, { min: 10, max: 12 }) }]}>{row[3]}</Text>
                    </View>
                  </View>
                ))}
                  <View style={styles.FooterCell}>
                    <Text style={styles.headerText}>{t('Box3.footerTable1')}</Text>
                  </View>
 

                   <View style={styles.FooterCell}>
                    <Text style={styles.headerText}>{t('Box3.footerTable2')}</Text>
                  </View>

                  <View style={styles.FooterCell}>
                    <Text style={styles.headerText}>{t('Box3.footerTable3')}</Text>
                  </View>
                 
              </View>
            </View>
          )}
        </ScrollView>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1 },

  container: {
    padding: 12,
    paddingBottom: 30,
  },

  /* CABECERA */
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },

  sheetText: {
    flex: 1,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "800",
    color: "#fff",
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
    fontWeight: "700",
    textAlign: "center",
    fontSize: 12,
  },

  /* TABLA */
  tableWrapper: {
    width: "100%",
    marginTop: 6,
    alignItems: "center",
    alignSelf: "center",
  },

  table: {
    width: "90%",
    maxWidth: 420,
    borderRadius: 6,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#000",
  },

  tableHeaderRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#000",
  },

  headerCellPink: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ff86e1",
    borderRightWidth: 1,
    borderColor: "#000",
  },

    separate: {
    flex: 0.1,
    paddingVertical: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffffff00",
    borderRightWidth: 1,
    borderColor: "#00000000",
  },

FooterCell: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#86ff8e",
    borderRightWidth: 1,
    borderColor: "#000",
  },


  headerCellGray: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#e2e2e2",
    borderRightWidth: 1,
    borderColor: "#000",
  },

  headerText: {
    fontSize: 12,
    fontWeight: "800",
    textAlign: "center",
  },

  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#000",
  },

  cell: {
    flex: 1,
    paddingVertical:5,
    alignItems: "center",
    justifyContent: "center",
    borderRightWidth: 1,
    borderColor: "#000",
    backgroundColor: "#FFD54F",
  },
  cellSeparate: {
    flex: 0.1,
    alignItems: "center",
    justifyContent: "center",
    borderRightWidth: 1,
    borderColor: "#000",
    backgroundColor: "transparent",
  },
  cyan: {
    backgroundColor: "#00fff2",
  },

  cellText: {
    fontSize: 12,
    fontWeight: "800",
  },

  cellTextBig: {
    fontSize: 12,
    fontWeight: "800",
  },
});
