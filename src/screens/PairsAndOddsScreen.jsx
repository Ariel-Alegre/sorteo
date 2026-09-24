import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { useEffect, useState } from "react";
import Header from "../components/Header";
import { useTranslation } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useResponsiveLayout } from "../utils/responsive";

const BASE_URL = "https://script.google.com/macros/s/AKfycbwOWSGxHp9uuf5dLvSmyyKiM0IAkZuZ8REYgYh6Bc8TNhPg3V1chygLuSiS7IfaBHK4Pg/exec"

const formatPercentage = (value, symbol = "%") => {
  if (value === null || value === undefined || value === "") return "";
  if (typeof value === "string" && value.includes("%")) return value;

  let number = Number(String(value).replace(",", "."));
  if (!Number.isFinite(number)) return String(value);

  if (Math.abs(number) <= 1) number *= 100;
  while (Math.abs(number) > 100) number /= 10;

  const percentage = Math.round(number * 100000000) / 100000000;
  return `${percentage} ${String(symbol || "%").trim()}`;
};

export default function PairsAndOddsScreen({ navigation, route }) {
  const { sorteoId, title } = route.params;
  const { t, i18n } = useTranslation();
  const ui = useResponsiveLayout();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const pairsAndOdds = Array.isArray(data?.pairsAndOdds)
    ? data.pairsAndOdds
    : [];
  const hasPairsAndOdds = pairsAndOdds.length > 0;
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

  // 🔹 Loader inicial (pantalla completa)
  if (loading && !data) {
    return (
      <ImageBackground
        source={require("../../assets/image/bg-white.jpeg")}
        style={styles.background}
      >
        <Header title={title} back navigation={navigation} />
        <View style={styles.centerLoader}>
          <ActivityIndicator size="large" />
        </View>
      </ImageBackground>
    );
  }

  const renderBlock = (
    key,
    topRowIndex,
    percentageRowIndex,
    footRowIndex
  ) => {
    const topText = pairsAndOdds[topRowIndex]?.[0];
    const percentageRow = pairsAndOdds[percentageRowIndex];
    const footText = pairsAndOdds[footRowIndex]?.[0];
    const percentage = formatPercentage(
      percentageRow?.[0],
      percentageRow?.[1]
    );

    return (
    <View key={key} style={styles.table}>
      <View style={styles.block}>
        <View style={[styles.row, styles.green]}>
          <Text style={styles.cell}>
            {topText || t(`Box8.blocks.${key}.top`)}
          </Text>
        </View>

        <View style={[styles.row, styles.pink]}>
          <Text style={styles.cell}>
            {percentage || "-"}
          </Text>
        </View>

        {footRowIndex !== undefined && (
          <Text style={styles.footText}>
            {footText || t(`Box8.blocks.${key}.foot`)}
          </Text>
        )}
      </View>
    </View>
    );
  };

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
              { fontSize: ui.font(14, { min: 12, max: 14 }) },
            ]}
            numberOfLines={1}
          >
            {data?.title?.[0]?.[0] ?? "-"}
          </Text>

     {/*      <Pressable
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
              <Text style={styles.reloadText}>
                {t("Btn.btnUpdate")}
              </Text>
            )}
          </Pressable> */}
        </View>

        {/* TITULO */}
        <View style={styles.titleRow}>
          <Text style={[styles.headerTitle, { fontSize: ui.font(13, { min: 10, max: 13 }) }]}>
            {t("Box8.headerTitle")}
          </Text>
        </View>

        <View style={styles.tableHeaderRow}>
          <Text style={[styles.headerCell, { fontSize: ui.font(12, { min: 10, max: 12 }) }]}>
            {t("Box8.tableHeader")}
          </Text>
        </View>

        {error && (
          <Text style={{ color: "red", textAlign: "center", marginTop: 6 }}>
            {error}
          </Text>
        )}

        {!loading && hasPairsAndOdds && (
          <View>
            {renderBlock("b1", 0, 1, 2)}
            {renderBlock("b2", 3, 4, 5)}
            {renderBlock("b3", 6, 7, 8)}
            {renderBlock("b4", 9, 10)}

            <View style={styles.table}>
              <Text style={styles.footText}>
                {pairsAndOdds[11]?.[0] || t("Box8.finalText")}
              </Text>
            </View>

            <View style={styles.table}>
              <Text style={styles.footText}>
                {pairsAndOdds[12]?.[0] || t("Box8.finalText2")}
              </Text>
            </View>
          </View>
        )}

        {!loading && !error && !hasPairsAndOdds && (
          <Text style={styles.emptyText}>{t("Box8.noData")}</Text>
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

  centerLoader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  emptyText: {
    marginTop: 20,
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
    textAlign: "center",
  },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
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

  titleRow: {
    width: "85%",
    alignSelf: "center",
    borderBottomWidth: 1,
    borderColor: "#000",
    backgroundColor: "#f4ff59",
    paddingVertical: 8,
    marginBottom: 4,
  },

  headerTitle: {
    fontSize: 13,
    fontWeight: "800",
    textAlign: "center",
  },

  tableHeaderRow: {
    width: "85%",
    alignSelf: "center",
    marginBottom: 4,
  },

  headerCell: {
    backgroundColor: "#FFD54F",
    textAlign: "center",
    fontWeight: "800",
    fontSize: 12,
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderColor: "#000",
  },

  table: {
    width: "85%",
    alignSelf: "center",
    marginBottom: 4,
    alignItems: "center",
  },

  block: {
    alignItems: "center",
  },

  row: {
    width: "55%",
    borderWidth: 1,
    borderColor: "#ccc",
  },

  green: {
    backgroundColor: "#d9f2d9",
  },

  pink: {
    backgroundColor: "#f2c2f2",
  },

  cell: {
    fontSize: 12,
    fontWeight: "700",
    textAlign: "center",
    paddingVertical: 3,
  },

  footText: {
    fontSize: 11,
    fontWeight: "700",
    textAlign: "center",
    paddingVertical: 2,
    backgroundColor: "#fff",
  },
});
