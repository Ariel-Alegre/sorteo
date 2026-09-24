import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ImageBackground,
  ActivityIndicator,
  Dimensions,
  ScrollView,
} from "react-native";
import { useEffect, useState } from "react";
import Header from "../components/Header";
import { useTranslation } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useResponsiveLayout } from "../utils/responsive";

const BASE_URL = "https://script.google.com/macros/s/AKfycbwOWSGxHp9uuf5dLvSmyyKiM0IAkZuZ8REYgYh6Bc8TNhPg3V1chygLuSiS7IfaBHK4Pg/exec"

const BASE_WIDTH = 360;

export default function PairCombinationScreen({ navigation, route }) {
  const ui = useResponsiveLayout();
  const { sorteoId, title } = route.params;
  const { t, i18n } = useTranslation();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

  const scale = Math.min(screenWidth / BASE_WIDTH, 1);
  const heightScale = Math.max(0.62, Math.min(1, screenHeight / 760));

  const rowColors = [
    "#FFD54F",
    "#00fff2ff",
    "#46f881ff",
    "#92ffb6ff",
    "#ffffff",
  ];

  /** NOMBRES DE COLUMNAS (FILA INFERIOR) */
  const columnLabels = ["Columna 1", "Columna 2", "Columna 3", "Columna 4"];

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

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.container,
          {
            padding: ui.space(12, { min: 8, max: 12 }),
            paddingBottom: Math.max(10, 20 * heightScale),
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* CABECERA */}
        <View style={styles.headerRow}>
          <Text
            style={[
              styles.sheetText,
              { fontSize: ui.font(18, { min: 14, max: 18 }) },
            ]}
          >
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
            <Text style={[styles.reloadText, { fontSize: 11 * scale }]}>
              {loading ? "Actualizando..." : "Recargar"}
            </Text>
          </Pressable> */}
        </View>

        {loading && (
          <ActivityIndicator size="large" style={{ marginTop: 20 }} />
        )}
        {error && <Text style={styles.errorText}>{error}</Text>}

        {!loading && Array.isArray(data?.pairCombination) && (
          <View
            style={[
              styles.tableWrapper,
              {
                width: Math.min(screenWidth * 0.92, 420),
                marginTop: 6 * heightScale,
              },
            ]}
          >
            <View style={styles.table}>
              {/* HEADER */}
              <View style={styles.tableHeaderRow}>
                <View style={styles.headerCell} />
                <View
                  style={[styles.headerCell, { backgroundColor: "#8ec6ffff" }]}
                >
                  <Text style={[styles.headerText, { fontSize: ui.font(11, { min: 9, max: 11 }) }]}>
                    {t("Box10.headerTable1")}
                  </Text>
                </View>
                <View
                  style={[styles.headerCell, { backgroundColor: "#fffd8eff" }]}
                >
                  <Text style={[styles.headerText, { fontSize: ui.font(11, { min: 9, max: 11 }) }]}>
                    {t("Box10.headerTable2")}
                  </Text>
                </View>
                <View
                  style={[styles.headerCell, { backgroundColor: "#ff9b8eff" }]}
                >
                  <Text style={[styles.headerText, { fontSize: ui.font(11, { min: 9, max: 11 }) }]}>
                    {t("Box10.headerTable3")}
                  </Text>
                </View>
              </View>

              {/* CUERPO */}
              <View>
                {data.pairCombination.map((row, index) => {
                  const rowColor = rowColors[index % rowColors.length];
                  const firstCellColor =
                    index === 0
                      ? "#ffb703"
                      : index === 1
                        ? "#8ecae6"
                        : index === 2
                          ? "#90db8a"
                          : "#a0f79a";

                  return (
                    <View key={index}>
                      {/* FILA DE DATOS */}
                      <View
                        style={[
                          styles.row,
                          {
                            backgroundColor: rowColor,
                            minHeight: 42 * heightScale,
                          },
                        ]}
                      >
                        {[0, 1, 2, 3].map((i) => (
                          <View
                            key={i}
                            style={[
                              styles.cell,
                              i === 0 && { backgroundColor: firstCellColor },
                            ]}
                          >
                            <Text
                              style={[
                                styles.cellText,
                                {
                                  fontSize: Math.max(8, 11 * heightScale),
                                  paddingVertical: 4 * heightScale,
                                },
                              ]}
                            >
                              {row[i]}
                            </Text>
                          </View>
                        ))}
                      </View>
                    </View>
                  );
                })}
                {/* FILA INFERIOR CON NOMBRES */}
                <View
                  style={[
                    styles.row,
                    styles.subRow,
                    { minHeight: 42 * heightScale },
                  ]}
                >
                  <View style={[styles.cellNone, { backgroundColor: "#fa7979" }]}>
                    <Text
                      style={[
                        styles.subRowText,
                        { fontSize: ui.font(11, { min: 9, max: 11 }), fontWeight: "800" },
                      ]}
                    >
                      {t("Box10.headerFooter1")}
                    </Text>
                  </View>
                  <View style={[styles.cell, { backgroundColor: "#fa7979" }]}>
                    <Text
                      style={[
                        styles.subRowText,
                        { fontSize: ui.font(11, { min: 9, max: 11 }), fontWeight: "800" },
                      ]}
                    >
                      1, 3, 5, 7, 9
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.cell,
                      {
                        justifyContent: "flex-start",
                        paddingTop: 2,
                        backgroundColor: "#fff",
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.subRowText,
                        { fontSize: ui.font(11, { min: 9, max: 11 }), fontWeight: "800" },
                      ]}
                    >
                      100%
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.cell,
                      {
                        justifyContent: "flex-start",
                        paddingTop: 2,
                        backgroundColor: "#fff",
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.subRowText,
                        { fontSize: ui.font(11, { min: 9, max: 11 }), fontWeight: "800" },
                      ]}
                    >
                      100%
                    </Text>
                  </View>
                </View>

                <View
                  style={[
                    styles.row,
                    styles.subRow,
                    { minHeight: 42 * heightScale },
                  ]}
                >
                  <View style={[styles.cellNone, { backgroundColor: "#fa7979" }]}>
                    <Text
                      style={[
                        styles.subRowText,
                        { fontSize: ui.font(11, { min: 9, max: 11 }), fontWeight: "800" },
                      ]}
                    >
                      {t("Box10.headerFooter2")}
                    </Text>
                  </View>
                  <View style={[styles.cell, { backgroundColor: "#fa7979" }]}>
                    <Text
                      style={[
                        styles.subRowText,
                        { fontSize: ui.font(11, { min: 9, max: 11 }), fontWeight: "800" },
                      ]}
                    >
                      0, 2, 4, 6, 8
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.cell,
                      {
                        justifyContent: "flex-start",
                        paddingTop: 2,
                        backgroundColor: "transparent",
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.subRowText,
                        { fontSize: 11, fontWeight: "800" },
                      ]}
                    ></Text>
                  </View>
                  <View
                    style={[
                      styles.cell,
                      {
                        justifyContent: "flex-start",
                        paddingTop: 2,
                        backgroundColor: "transparent",
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.subRowText,
                        { fontSize: 11, fontWeight: "800" },
                      ]}
                    ></Text>
                  </View>
                </View>
              </View>
            </View>

            {/* INFO */}
            {[
              t("Box10.headerFooter3"),
              t("Box10.headerFooter4"),
              t("Box10.headerFooter5"),
              t("Box10.headerFooter6"),
              t("Box10.headerFooter7"),
            ].map((text, i) => (
              <View
                key={i}
                style={[
                  styles.infoRow,
                  { paddingVertical: 6 * heightScale },
                ]}
              >
                <Text
                  style={[
                    styles.cellText,
                    {
                      fontSize: Math.max(8, 11 * heightScale),
                      paddingVertical: 4 * heightScale,
                    },
                  ]}
                  numberOfLines={2}
                  adjustsFontSizeToFit
                >
                  {text}
                </Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1 },

  scrollView: {
    flex: 1,
  },

  container: {
    flexGrow: 1,
    padding: 12,
    paddingBottom: 30,
  },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },

  sheetText: {
    color: "#fff",
    fontWeight: "800",
    textAlign: "center",
    flex: 1,
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
  },

  errorText: {
    marginTop: 10,
    color: "red",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 12,
  },

  tableWrapper: {
    marginTop: 6,
    alignItems: "center",
    alignSelf: "center",
  },

  table: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 6,
    overflow: "hidden",
  },

  tableHeaderRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#000",
  },

  headerCell: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRightWidth: 1,
    borderColor: "#000",
    paddingHorizontal: 4,
  },

  headerText: {
    fontWeight: "800",
    textAlign: "center",
  },

  row: {
    flexDirection: "row",
    minHeight: 42,
    borderBottomWidth: 1,
    borderColor: "#000",
  },

  subRow: {
    backgroundColor: "transparent",
  },

  cell: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRightWidth: 1,
    borderColor: "#000",
    paddingHorizontal: 4,
  },

   cellNone: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderColor: "#000",
    paddingHorizontal: 4,
  },

  cellText: {
    fontWeight: "800",
    textAlign: "center",
    paddingVertical: 4,
  },

  subRowText: {
    fontWeight: "700",
    textAlign: "center",
    color: "#444",
    paddingVertical: 2,
  },

  infoRow: {
    backgroundColor: "#fff",
    width: "100%",
    borderBottomWidth: 1,
    borderColor: "#000",
    paddingVertical: 6,
    alignItems: "center",
  },
});
