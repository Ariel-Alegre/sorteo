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

const LINE = StyleSheet.hairlineWidth;
const SCROLL_STEP = 120;

export default function Last500DrawsScreen({ navigation, route }) {
  const ui = useResponsiveLayout();
  const { sorteoId, title } = route.params;
  const { t, i18n } = useTranslation();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const scrollRef = useRef(null);
  const scrollPosition = useRef(0);

  const scrollUp = () => {
    scrollPosition.current = Math.max(0, scrollPosition.current - SCROLL_STEP);
    scrollRef.current?.scrollTo({
      y: scrollPosition.current,
      animated: true,
    });
  };

  const scrollDown = () => {
    scrollPosition.current += SCROLL_STEP;
    scrollRef.current?.scrollTo({
      y: scrollPosition.current,
      animated: true,
    });
  };

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
          contentContainerStyle={[styles.container, { padding: ui.space(10, { min: 8, max: 10 }), paddingBottom: ui.space(20, { min: 14, max: 24 }) }]}
          showsVerticalScrollIndicator={false}
        >
          {/* CABECERA */}
          <View style={styles.headerRow}>
            <Text style={[styles.sheetText, { fontSize: ui.font(14, { min: 12, max: 14 }) }]}>
              {data?.title?.[0]?.[0] ?? "-"}
            </Text>

 
          </View>

          {loading && <ActivityIndicator style={{ marginTop: 12 }} />}
          {error && <Text style={styles.errorText}>{error}</Text>}
          {!loading && Array.isArray(data?.last500Draws) && (
            <View style={styles.tableRow}>
              {/* FLECHAS IZQUIERDA */}
              <View style={styles.arrowsSide}>
                <Pressable onPress={scrollUp} style={styles.arrowBtn}>
                  <Text style={styles.arrowText}>▲</Text>
                </Pressable>

                <Pressable onPress={scrollDown} style={styles.arrowBtn}>
                  <Text style={styles.arrowText}>▼</Text>
                </Pressable>
              </View>

              {/* TABLA */}
              <View style={[styles.table, { width: ui.contentWidth, maxWidth: 420 }]}>
                <View style={styles.titleRow}>
                  <Text style={[styles.headerTitle, { fontSize: ui.font(14, { min: 11, max: 14 }), paddingVertical: ui.space(8, { min: 6, max: 8 }) }]}>{t('Box12.headerTitle')}</Text>
                </View>

                <ScrollView
                  ref={scrollRef}
                  style={[
                    styles.innerScroll,
                    { height: Math.max(280, ui.height - 255) },
                  ]}
                  showsVerticalScrollIndicator={true}
                >
                  {data.last500Draws.map((row, index) => {
                    const isLast =
                      index === data.last500Draws.length - 1;

                    return (
                      <View key={index} style={styles.row}>
                        <View
                          style={[
                            styles.cell1,
                            !isLast && styles.rowDivider,
                          ]}
                        >
                          <Text style={[styles.cellText, { fontSize: ui.font(14, { min: 11, max: 14 }) }]}>{row[0]}</Text>
                        </View>

                        <View
                          style={[
                            styles.cell2,
                            !isLast && styles.rowDivider,
                          ]}
                        >
                          <Text style={[styles.cellText, { fontSize: ui.font(14, { min: 11, max: 14 }) }]}>{row[1]}</Text>
                        </View>

                        <View
                          style={[
                            styles.cell3,
                            !isLast && styles.rowDivider,
                          ]}
                        >
                          <Text style={[styles.cellTextDate, { fontSize: ui.font(13, { min: 10, max: 13 }) }]}>
                            {row[2]}
                          </Text>
                        </View>
                      </View>
                    );
                  })}
                </ScrollView>
              </View>

              {/* FLECHAS DERECHA */}
              <View style={styles.arrowsSide}>
                <Pressable onPress={scrollUp} style={styles.arrowBtn}>
                  <Text style={styles.arrowText}>▲</Text>
                </Pressable>

                <Pressable onPress={scrollDown} style={styles.arrowBtn}>
                  <Text style={styles.arrowText}>▼</Text>
                </Pressable>
              </View>
            </View>
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
    padding: 10,
    paddingBottom: 30,
  },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
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
    fontWeight: "700",
    fontSize: 10,
  },

  errorText: {
    marginTop: 8,
    color: "red",
    fontWeight: "700",
    textAlign: "center",
    fontSize: 11,
  },

  tableRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 6,
    alignSelf: "center",
  },

  table: {
    width: "80%",
    maxWidth: 420,
    borderWidth: LINE,
    borderColor: "#000",
    borderRadius: 6,
    overflow: "hidden",
  },

  titleRow: {
    backgroundColor: "#98b7fa",
    borderBottomWidth: LINE,
    borderColor: "#000",
  },

  headerTitle: {
    paddingVertical: 8,
    textAlign: "center",
    fontWeight: "800",
    fontSize: 14,
  },

  innerScroll: {
    width: "100%",
  },

  row: {
    flexDirection: "row",
  },

  rowDivider: {
    borderBottomWidth: LINE,
    borderColor: "#000",
  },

  cell1: {
    flex: 1,
    backgroundColor: "#3affa3",
    alignItems: "center",
    justifyContent: "center",
    padding: 6,
  },

  cell2: {
    flex: 1,
    backgroundColor: "#3affa3",
    alignItems: "center",
    justifyContent: "center",
    padding: 6,
    borderRightWidth: LINE,
    borderColor: "#000",
  },

  cell3: {
    flex: 2,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    padding: 6,
  },

  cellText: {
    fontSize: 14,
    fontWeight: "800",
    color: "red",
  },

  cellTextDate: {
    fontSize: 13,
    fontWeight: "800",
  },

  arrowsSide: {
    alignSelf: "stretch",
    justifyContent: "center",
    alignItems: "center",
    width: 50,
  },

  arrowBtn: {
    backgroundColor: "#1976d2",
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 6,
  },

  arrowText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "900",
  },
});
