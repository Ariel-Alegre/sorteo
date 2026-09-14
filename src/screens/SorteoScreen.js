import { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  ImageBackground,
  Pressable,
  ActivityIndicator,
  ScrollView,
} from "react-native";

import Header from "../components/Header";
import StatCard from "../components/StatCard";
import { useTranslation } from 'react-i18next';
import AsyncStorage from "@react-native-async-storage/async-storage";



const statNavigationMap = {
  1: "OldNumbers",
  2: "WithoutAppearing",
  3: "DecenasTerminaciones",
  4: "NumbersWithoutDraw",
  5: "MostFrequent23",
  6: "SecondDigitComparison",
  7: "SecondDigitGreater",
  8: "PairsAndOdds",
  9: "SumDigits",
  10: "PairCombination",
  11: "DecenasTerminaciones2",
  12: "Last500Draws",
};

const BASE_URL = "https://script.google.com/macros/s/AKfycbxPnfs76U4yKLfIjR8msumNKT3mn7gMDtIGe2sxxXAhA8-1OzY-8mbTSOINMyqDQy94KQ/exec"

export default function SorteoScreen({ navigation, route }) {
  const { title, sorteoId } = route.params;
   const { t, i18n } = useTranslation();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const stats = [
  { id: 1, title: t("Home.box1") },
  { id: 2, title: t("Home.box2") },
  { id: 3, title: t("Home.box3"),  color:"#f82e4f " },
  { id: 4, title: t("Home.box4")},
  { id: 5, title: t("Home.box5") },
  { id: 6, title: t("Home.box6") },
  { id: 7, title: t("Home.box7") },
  { id: 8, title: t("Home.box8") },
  { id: 9, title:  t("Home.box9")  },
  { id: 10, title: t("Home.box10")  },
  { id: 11, title: t("Home.box11")  },
  { id: 12, title: t("Home.box12") },
];
  // Cargar idioma guardado
  useEffect(() => {
    const loadLanguage = async () => {
      const storedLang = await AsyncStorage.getItem('appLanguage');
      if (storedLang && storedLang !== i18n.language) {
        i18n.changeLanguage(storedLang);
      }
    };
    loadLanguage();
  }, []);

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
const headerTitle = data?.title?.[0]?.[0] ?? title ?? "-";

  return (
    <ImageBackground
      source={require("../../assets/image/bg-violet.jpeg")}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <Header title={headerTitle} back navigation={navigation} />
        <Text style={styles.sheetText}>
          {data?.title?.[0]?.[0] ?? "-"}
        </Text>
        {/* TABLA + TEXTO */}
        <View style={styles.horizontalContainer}>
          {/* TABLA */}
          <View style={styles.tableScroll}>
            <Pressable
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
                     </Pressable>

            {loading && (
              <ActivityIndicator size="large" style={{ marginTop: 12 }} />
            )}
            {error && <Text style={styles.errorText}>{error}</Text>}

            {!loading && Array.isArray(data?.ultimos6) && (
              <View style={styles.table}>
                {/* HEADER */}
                <View style={styles.headerRowTable}>
                  <Text style={[styles.headerCell, { flex: 2 }]}>
                    {t('Home.headerTable1')}
                  </Text>
                  <Text style={[styles.headerCell, { flex: 1, backgroundColor: "#5de6f8" }]}>
                                       {t('Home.headerTable2')}

                  </Text>
                </View>

                {/* FILAS */}
                {data.ultimos6.map((row, index) => (
                  <View key={index} style={styles.row}>
                    <Text style={styles.cellColumn1}>{row[0]}</Text>
                    <Text style={styles.cellColumn1}>{row[1]}</Text>
                    <Text style={[styles.cell, styles.cellWhite]}>
                      {row[2]}
                    </Text>
                    <Text style={[styles.cell, styles.cellGreen]}>
                      {row[3]}
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </View>

          {/* TEXTO LATERAL */}
          <View style={styles.textContainer}>
            <Text style={styles.description}>{t('Home.description1')}</Text>
            <Text style={styles.description}>
              {t('Home.description2')}
            </Text>
            <Text style={styles.description}>
              {t('Home.description3')}
            </Text>
          </View>
        </View>

        <View style={styles.centerTextContainer}>
          <Text style={styles.centerText}>
                         {t('Home.titleBox')}

          </Text>
        </View>

        {/* TARJETAS */}
        <View style={styles.container}>
          {stats.map((item) => (
            <StatCard
              key={item.id}
              title={item.title}
              color={item.color}
              onPress={() =>
                navigation.navigate(statNavigationMap[item.id], {
                  statId: item.id,
                  sorteoId,
                  title: headerTitle,
                  id: item.id,
                })
              }
            />
          ))}
        </View>
      </View>
    </ImageBackground>
  );
}

/* ===================== STYLES ===================== */

const styles = StyleSheet.create({
  background: { flex: 1 },

  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
  },

horizontalContainer: {
  flexDirection: "row",
  padding: 10,
  alignItems: "stretch", // que ambos ocupen la misma altura
  gap: 10,
},

  textContainer: {
    flex: 0.45,
    marginTop: 38,
    backgroundColor: "white",
    padding: 10
  },
  tableScroll: {
    flex: 0.8,
  },





  description: {
    color: "red",
    fontSize: 8,
    fontWeight: "600",
  },

  reloadBtn: {
    alignSelf: "flex-start",
    backgroundColor: "#1976d2",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    marginBottom: 6,
  },

  reloadText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 11,
  },

  errorText: {
    marginTop: 8,
    color: "red",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 12,
  },

  table: {

    backgroundColor: "#FFD54F",
    borderWidth: 1,
    borderColor: "#000",
  },

  headerRowTable: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#000",
    backgroundColor: "#95fc59ff",
  },

  headerCell: {
    textAlign: "center",
    fontWeight: "800",
    fontSize: 10,
    borderRightWidth: 1,
    borderColor: "#000",
  },

  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#000",
  },

  cell: {
    flex: 1,
    textAlign: "center",
    fontSize: 9,
    fontWeight: "800",
    borderColor: "#000",
  },

  cellColumn1: {
    flex: 0.5,
    textAlign: "center",
    fontSize: 9,
    fontWeight: "800",
    borderColor: "#000",
    backgroundColor: "#FFD54F",
  },

  cellWhite: {
    backgroundColor: "#fff",
  },

  cellGreen: {
    backgroundColor: "#02ffc8ff",
  },

  centerTextContainer: {
    alignSelf: "center",
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 6,
    marginVertical: 4,
  },

  centerText: {
    fontSize: 12,
    fontWeight: "800",
    color: "#fff",
    textAlign: "center",
  },

  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    padding: 6,
  },
  sheetText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "800",
    textAlign: "center",
  },

});
