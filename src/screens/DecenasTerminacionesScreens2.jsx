import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ImageBackground,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { useEffect, useState, useRef } from "react";
import Header from "../components/Header";
import { useTranslation } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useResponsiveLayout } from "../utils/responsive";


const BASE_URL = "https://script.google.com/macros/s/AKfycbxPnfs76U4yKLfIjR8msumNKT3mn7gMDtIGe2sxxXAhA8-1OzY-8mbTSOINMyqDQy94KQ/exec"

const headerColors = ["#f8a7ff", "#d3d3d3", "#d3d3d3", "#d3d3d3", "#d3d3d3"];
const columnColorsDecenas = ["#FFD54F", "#c2ffdb", "#fcc2ff", "#c2fbff", "#ffccc2"];
const columnColorsTerminacion = [...columnColorsDecenas];

const SCROLL_STEP = 120;

export default function DecenasTerminaciones2Screens({ navigation, route }) {
  const ui = useResponsiveLayout();
  const { sorteoId, title } = route.params;
  const { t, i18n } = useTranslation();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const scrollRef = useRef(null);
  const scrollPos = useRef(0);

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

  const scrollLeft = () => {
    scrollPos.current = Math.max(0, scrollPos.current - SCROLL_STEP);
    scrollRef.current?.scrollTo({ x: scrollPos.current, animated: true });
  };

  const scrollRight = () => {
    scrollPos.current += SCROLL_STEP;
    scrollRef.current?.scrollTo({ x: scrollPos.current, animated: true });
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
          contentContainerStyle={[
            styles.container,
            {
              padding: ui.space(8, { min: 6, max: 8 }),
              paddingBottom: ui.space(20, { min: 14, max: 24 }),
            },
          ]}
        >
          {/* HEADER SUPERIOR */}
          <View style={styles.headerRow}>
            <Text style={[styles.sheetText, { fontSize: ui.font(14, { min: 12, max: 14 }) }]}>
              {data?.title?.[0]?.[0] ?? "-"}
            </Text>

         {/*    <Pressable onPress={loadData} style={styles.reloadBtn}>
              <Text style={styles.reloadText}>
                {loading ? "Actualizando..." : "Recargar"}
              </Text>
            </Pressable> */}
          </View>

          {loading && <ActivityIndicator style={{ marginTop: 10 }} />}
          {error && <Text style={styles.errorText}>{error}</Text>}

          {!loading && Array.isArray(data?.decenasTerminaciones2) && (
            <>
              {/* SCROLL HORIZONTAL */}
              <ScrollView
                horizontal
                ref={scrollRef}
                showsHorizontalScrollIndicator
              >
                <View>
                  {/* TABLAS */}
                  <View style={styles.tablesRow}>
                    {/* DECENAS */}
                    <View style={styles.table}>
                      <View style={styles.row}>
                        <View style={[styles.titleCell, { flex: 1 }]}>
                          <Text style={styles.headerTitle}>
                           {t('Box11.headerTitle')}
                          </Text>
                        </View>
                      </View>

                      <View style={styles.row}>
                        {[t('Box11.headerTable1'), t('Box11.headerTable2'), t('Box11.headerTable3'),t('Box11.headerTable4'), t('Box11.headerTable5')].map(
                          (t, i) => (
                            <View
                              key={i}
                              style={[
                                styles.headerCell,
                                {
                                  width: ui.boxHeight(70, { min: 54, max: 70 }),
                                  backgroundColor: headerColors[i],
                                },
                              ]}
                            >
                              <Text style={[styles.headerText, { fontSize: ui.font(9, { min: 8, max: 9 }) }]}>{t}</Text>
                            </View>
                          )
                        )}
                      </View>

                      {data.decenasTerminaciones2.map((row, index) => (
                        <View key={`d-${index}`} style={styles.row}>
                          {row.slice(0, 5).map((cell, i) => (
                            <View
                              key={i}
                              style={[
                                styles.cell,
                                {
                                  width: ui.boxHeight(70, { min: 54, max: 70 }),
                                  backgroundColor: columnColorsDecenas[i],
                                },
                              ]}
                            >
                              <Text style={[styles.cellText, { fontSize: ui.font(10, { min: 8, max: 10 }) }]}>{cell}</Text>
                            </View>
                          ))}
                        </View>
                      ))}
                    </View>

                    {/* TERMINACIONES */}
                    <View style={styles.table}>
                      <View style={styles.row}>
                        <View style={[styles.titleCell, { flex: 1 }]}>
                          <Text style={styles.headerTitle}>
                           {t('Box11.headerTitle')}
                          </Text>
                        </View>
                      </View>

                      <View style={styles.row}>
                        {[t('Box11.headerTable6'), t('Box11.headerTable7'), t('Box11.headerTable8'), t('Box11.headerTable9'), t('Box11.headerTable10')].map(
                          (t, i) => (
                            <View
                              key={i}
                              style={[
                                styles.headerCell,
                                {
                                  width: ui.boxHeight(70, { min: 54, max: 70 }),
                                  backgroundColor: headerColors[i],
                                },
                              ]}
                            >
                              <Text style={[styles.headerText, { fontSize: ui.font(9, { min: 8, max: 9 }) }]}>{t}</Text>
                            </View>
                          )
                        )}
                      </View>

                      {data.decenasTerminaciones2.map((row, index) => (
                        <View key={`t-${index}`} style={styles.row}>
                          {row.slice(5, 10).map((cell, i) => (
                            <View
                              key={i}
                              style={[
                                styles.cell,
                                {
                                  width: ui.boxHeight(70, { min: 54, max: 70 }),
                                  backgroundColor:
                                    columnColorsTerminacion[i],
                                },
                              ]}
                            >
                              <Text style={[styles.cellText, { fontSize: ui.font(10, { min: 8, max: 10 }) }]}>{cell}</Text>
                            </View>
                          ))}
                        </View>
                      ))}
                    </View>
                  </View>

                  {/* FILAS VERDES (SCROLLEAN EN X) */}
                  <View style={styles.greenRow}>
                    <Text style={[styles.greenText, { fontSize: ui.font(12, { min: 10, max: 12 }) }]}>
                      {t('Box11.footerTable1')}
                    </Text>
                  </View>

                  <View style={styles.greenRow}>
                    <Text style={[styles.greenText, { fontSize: ui.font(12, { min: 10, max: 12 }) }]}>
                      {t('Box11.footerTable2')}

                    </Text>
                  </View>

                  <View style={styles.greenRow}>
                    <Text style={[styles.greenText, { fontSize: ui.font(12, { min: 10, max: 12 }) }]}>
                      {t('Box11.footerTable3')}

                    </Text>
                  </View>
                </View>
              </ScrollView>

              {/* BOTONES */}
              <View style={styles.scrollButtons}>
                <Pressable onPress={scrollLeft} style={styles.scrollBtn}>
                  <Text style={styles.scrollBtnText}>◀</Text>
                </Pressable>
                <Pressable onPress={scrollRight} style={styles.scrollBtn}>
                  <Text style={styles.scrollBtnText}>▶</Text>
                </Pressable>
              </View>
            </>
          )}
        </ScrollView>
      </ImageBackground>
    </View>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  background: { flex: 1 },

  container: {
    padding: 8,
    paddingBottom: 30,
  },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },

  sheetText: {
    flex: 1,
    color: "#fff",
    fontSize: 14,
    fontWeight: "800",
    textAlign: "center",
  },

  reloadBtn: {
    backgroundColor: "#1976d2",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },

  reloadText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "700",
  },

  errorText: {
    color: "red",
    fontSize: 10,
    textAlign: "center",
    marginTop: 6,
  },

  tablesRow: {
    flexDirection: "row",
    paddingHorizontal: 10,
    justifyContent: "center",
  },

  table: {
    marginRight: 12,
    borderWidth: 1,
    borderColor: "#000",
  },

  row: {
    flexDirection: "row",
  },

  titleCell: {
    backgroundColor: "#3ca827",
    borderWidth: 0.5,
    borderColor: "#000",
    justifyContent: "center",
    alignItems: "center",
    minHeight: 24,
    paddingHorizontal: 4,
  },

  headerCell: {
    minHeight: 24,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 0.5,
    borderColor: "#000",
  },

  cell: {
    minHeight: 24,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 0.5,
    borderColor: "#000",
  },

  headerText: {
    fontSize: 9,
    fontWeight: "800",
    textAlign: "center",
  },

  cellText: {
    fontSize: 10,
    fontWeight: "700",
    textAlign: "center",
  },

  headerTitle: {
    fontSize: 12,
    fontWeight: "800",
    textAlign: "center",
  },

  greenRow: {
    backgroundColor: "#29ab1d",
    minHeight: 24,
    paddingHorizontal: 8,
    borderTopWidth: 1,
    borderColor: "#000",
    width: "100%",
  },

  greenText: {
    fontSize: 12,
    fontWeight: "700",
    textAlign: "center",
  },

  scrollButtons: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 8,
  },

  scrollBtn: {
    backgroundColor: "#1976d2",
    paddingHorizontal: 16,
    paddingVertical: 6,
    marginHorizontal: 6,
    borderRadius: 6,
  },

  scrollBtnText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "800",
  },
});
