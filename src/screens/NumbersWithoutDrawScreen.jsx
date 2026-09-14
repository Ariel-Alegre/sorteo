import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  ImageBackground,
  ActivityIndicator,
} from "react-native";
import { useEffect, useState, useRef } from "react";
import Header from "../components/Header";
import { useTranslation } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";


const BASE_URL = "https://script.google.com/macros/s/AKfycbxPnfs76U4yKLfIjR8msumNKT3mn7gMDtIGe2sxxXAhA8-1OzY-8mbTSOINMyqDQy94KQ/exec"

/* ===== CONFIG COLUMNAS ===== */
const COL_1 = 0.4;
const COL_2 = 0.3;
const COL_3 = 0.3;

const SCROLL_STEP = 120;
const SCROLL_HEIGHT = 500;

export default function NumbersWithoutDrawScreens({ navigation, route }) {
  const { sorteoId, title } = route.params;
  const { t, i18n } = useTranslation();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const scrollRef = useRef(null);
  const scrollPosition = useRef(0);

  const scrollUp = () => {
    scrollPosition.current = Math.max(
      0,
      scrollPosition.current - SCROLL_STEP
    );
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
    <ImageBackground
      source={require("../../assets/image/bg-white.jpeg")}
      style={styles.background}
      resizeMode="cover"
    >
      <Header title={title} back navigation={navigation} />

      <View style={styles.container}>
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

        {loading && <ActivityIndicator size="large" />}
        {error && <Text style={styles.errorText}>{error}</Text>}

        {!loading && Array.isArray(data?.numbersWithoutDraw) && (
          <View style={styles.tableWrapper}>
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
            <View style={styles.table}>
              {/* HEADER */}
              <View style={styles.row}>
                <View
                  style={[
                    styles.headerCell,
                    { flex: COL_1, backgroundColor: "transparent" },
                  ]}
                />
                <View
                  style={[
                    styles.headerCell,
                    { flex: COL_2, backgroundColor: "#FFD54F" },
                  ]}
                >
                  <Text style={styles.headerText}>{t('Box4.headerTable1')}</Text>
                </View>
                <View
                  style={[
                    styles.headerCellLast,
                    { flex: COL_3, backgroundColor: "#70ffff" },
                  ]}
                >
                  <Text style={styles.headerText}>{t('Box4.headerTable2')}</Text>
                </View>
              </View>

              {/* FILAS */}
              <ScrollView
                ref={scrollRef}
                style={{ maxHeight: SCROLL_HEIGHT }}
                onScroll={(e) => {
                  scrollPosition.current =
                    e.nativeEvent.contentOffset.y;
                }}
                scrollEventThrottle={16}
              >
                {data.numbersWithoutDraw.map((row, index) => (
                  <View key={index} style={styles.row}>
                    <View
                      style={[
                        styles.cell,
                        { flex: COL_1, backgroundColor: "#FFD54F" },
                      ]}
                    >
                      <Text style={styles.cellText}>
                        {row[0]} {row[1]}
                      </Text>
                    </View>

                    <View
                      style={[
                        styles.cell,
                        { flex: COL_2, backgroundColor: "#3affa3" },
                      ]}
                    >
                      <Text style={styles.cellText}>{row[2]}</Text>
                    </View>

                    <View
                      style={[
                        styles.cellLast,
                        { flex: COL_3, backgroundColor: "#ffc7ff" },
                      ]}
                    >
                      <Text style={styles.cellText}>{row[3]}</Text>
                    </View>
                  </View>
                ))}
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
      </View>
    </ImageBackground>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  background: { flex: 1 },

  container: {
    flex: 1,
    padding: 12,
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
    fontSize: 11,
    fontWeight: "700",
  },

  errorText: {
    color: "red",
    textAlign: "center",
    fontWeight: "700",
  },

  tableWrapper: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "center",
    marginTop: 6,
  },

  table: {
    width: "80%",
    maxWidth: 420,
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 6,
    overflow: "hidden",
  },

  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#000",
  },

  headerCell: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 8,
    borderRightWidth: 1,
    borderColor: "#000",
  },

  headerCellLast: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 8,
  },

  headerText: {
    fontSize: 13,
    fontWeight: "800",
    textAlign: "center",
  },

  cell: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
    borderRightWidth: 1,
    borderColor: "#000",
  },

  cellLast: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
  },

  cellText: {
    fontSize: 16,
    fontWeight: "800",
    textAlign: "center",
  },

  arrowsSide: {
    height: SCROLL_HEIGHT,
    width: 50,
    justifyContent: "center",
    alignItems: "center",
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
