import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Image,
  Pressable,
  Linking,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { useCallback, useState, useEffect, useRef } from "react";
import Header from "../components/Header";
import SorteoCard from "../components/SorteoCard";
import { useFocusEffect } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";

const BASE_URL = "https://script.google.com/macros/s/AKfycbwOWSGxHp9uuf5dLvSmyyKiM0IAkZuZ8REYgYh6Bc8TNhPg3V1chygLuSiS7IfaBHK4Pg/exec";

const SCROLL_STEP = 80;

/* =========================
   UTIL
========================= */
const chunk = (arr, size) =>
  arr.reduce((rows, item, index) => {
    if (index % size === 0) rows.push([item]);
    else rows[rows.length - 1].push(item);
    return rows;
  }, []);

const normalizePhone = (phone) => phone.replace(/\D/g, "");

export default function HomeScreen({ navigation }) {
  const [contactos, setContactos] = useState([]);
  const [contactoAutor, setContactoAutor] = useState(null);
  const [loterias, setLoterias] = useState([]);
  const [loterias2, setLoterias2] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { t, i18n } = useTranslation();
  /* ===== SCROLL CONTACTOS ===== */
  const listRef = useRef(null);
  const scrollOffset = useRef(0);
/* =========================
   SORTEOS
========================= */
const sorteos = [
  { id: 0, title: "Tica", iso: "cr" },
  { id: 1, title: "Nueva York", iso: "us" },
  { id: 2, title: "Honduras", iso: "hn" },
  { id: 3, title: "Nicaragua", iso: "ni" },
  { id: 4, title: "Primera", iso: "do" },
  { id: 5, title: "Florida", iso: "us" },
  { id: 6, title: "Dominicana", iso: "do" },
{ id: 7, title: loterias[0]?.nombre ?? "Lotería", subtitle: loterias2[0]?.nombre ?? "Lotería",  iso: "" },
{ id: 8, title: loterias[1]?.nombre ?? "Lotería 9",subtitle: loterias2[1]?.nombre ?? "Lotería", iso: "" },

];


  const filas = chunk(sorteos, 3);
  const scrollUp = () => {
    scrollOffset.current = Math.max(0, scrollOffset.current - SCROLL_STEP);
    listRef.current?.scrollToOffset({
      offset: scrollOffset.current,
      animated: true,
    });
  };

  const scrollDown = () => {
    scrollOffset.current += SCROLL_STEP;
    listRef.current?.scrollToOffset({
      offset: scrollOffset.current,
      animated: true,
    });
  };

  /* =========================
     DATA
  ========================= */
  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(BASE_URL);
      const data = await res.json();

      if (Array.isArray(data.contactAutor) && data.contactAutor.length > 0) {
        const autor = data.contactAutor[0];
        setContactoAutor({
          nombre: autor[0],
          telefono: String(autor[1]),
        });
      }

      if (Array.isArray(data.contact)) {
        setContactos(
          data.contact.map((item, index) => ({
            id: index,
            nombre: item[0],
            telefono: String(item[1]),
          }))
        );
      }
      if (Array.isArray(data.nameLoterias)) {
        setLoterias(
          data.nameLoterias.map((item, index) => ({
            id: index,
            nombre: item[0],
          }))
        );

       
      }
if (Array.isArray(data.nameLoterias2)) {
       setLoterias2(
          data.nameLoterias2.map((item, index) => ({
            id: index,
            nombre: item[0],
          }))
        );

       
      }
      
    } catch {
      setError("No se pudieron cargar los contactos");
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  useEffect(() => {
    const loadLanguage = async () => {
      const storedLang = await AsyncStorage.getItem("appLanguage");
      if (storedLang && storedLang !== i18n.language) {
        i18n.changeLanguage(storedLang);
      }
    };
    loadLanguage();
  }, []);

  /* =========================
     UI
  ========================= */
  return (
    <ImageBackground
      source={require("../../assets/image/bg.jpeg")}
      style={styles.background}
      resizeMode="cover"
    >
      <Header title="Loterías" />
  {/* TITULO */}
      <View style={styles.card}>
        <Text style={styles.title}>{t('home.title')}</Text>
      </View>

      {/* GRID */}
      <View style={styles.grid}>
        {filas.map((fila, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            {fila.map((item) => (
              <SorteoCard
                key={item.id}
                title={item.title}
                subtitle={item.subtitle}
                flag={
                  <Image
                    source={{
                      uri: `https://flagcdn.com/w80/${item.iso}.png`,
                    }}
                    style={styles.flag}
                  />
                }
                onPress={() =>
                  navigation.navigate("Sorteo", {
                    title: item.title,
                    subtitle: item.subtitle,

                    sorteoId: item.id,
                  })
                }
              />
            ))}
          </View>
        ))}
      </View>

      {/* CONTACTO AUTOR */}
      {contactoAutor && (
        <Pressable
          style={styles.autorCard}
          onPress={() =>
            Linking.openURL(`https://wa.me/${contactoAutor?.telefono}`)
          }
        >
          <Text style={styles.autorName}>{contactoAutor?.nombre}</Text>
          <Text style={styles.autorPhone}>{contactoAutor?.telefono}</Text>
        </Pressable>
      )}

      {/* LISTA CONTACTOS + FLECHAS */}
      <View style={styles.contactsRow}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>{contactos[0]?.nombre}</Text>
          {loading && <ActivityIndicator />}
          {error && <Text style={styles.errorText}>{error}</Text>}

          {!loading && !error && (
            <FlatList
              ref={listRef}
              data={contactos.slice(1)}
              keyExtractor={(item) => item.id.toString()}
              onScroll={(e) => {
                scrollOffset.current = e.nativeEvent.contentOffset.y;
              }}
              scrollEventThrottle={16}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => (
                <Pressable
                  style={styles.contactRow}
                  onPress={() =>
                    Linking.openURL(
                      `https://wa.me/${normalizePhone(item.telefono)}`
                    )
                  }
                >
                  <Text style={styles.contactName}>{item.nombre}</Text>
                  <Text style={styles.contactPhone}>{item.telefono}</Text>
                </Pressable>
              )}
            />
          )}
        </View>

        {/* FLECHAS */}
        <View style={styles.arrowsSide}>
          <Pressable style={styles.arrowBtn} onPress={scrollUp}>
            <Text style={styles.arrowText}>▲</Text>
          </Pressable>

          <Pressable style={styles.arrowBtn} onPress={scrollDown}>
            <Text style={styles.arrowText}>▼</Text>
          </Pressable>
        </View>
      </View>
    </ImageBackground>
  );
}

/* =========================
   ESTILOS
========================= */
const styles = StyleSheet.create({
  background: { flex: 1 },

  /* ===== GRID SORTEOS ===== */
  grid: { marginTop: 20 },

  row: {
    flexDirection: "row",
    marginBottom: 8,
  },

  flag: {
    width: 36,
    height: 24,
    borderRadius: 3,
  },

  /* ===== TITULO ===== */
  card: {
    alignSelf: "center",
    backgroundColor: "rgba(255,255,255,0.95)",
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 14,
    marginTop: 8,
    elevation: 2,
  },

  title: {
    fontSize: 16,
    fontWeight: "800",
    color: "red",
  },

  /* ===== CONTACTO AUTOR ===== */
  autorCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: 5,
    paddingHorizontal: 14,
    borderRadius: 10,
    alignSelf: "center",
    elevation: 2,
    gap: 8,
  },

  autorName: {
    fontSize: 10,
    fontWeight: "600",
  },

  autorPhone: {
    fontSize: 10,
    color: "#555",
  },

  /* ===== CONTENEDOR LISTA + FLECHAS ===== */
  contactsRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  /* ===== LISTA CONTACTOS ===== */
  modalContent: {
    backgroundColor: "#fff",
    width: "75%",
    margin: 12,
    borderRadius: 16,
    padding: 12,
    maxHeight: 170,
    alignItems: "center",

  },

  modalTitle: {
    fontSize: 12,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 12,
  },

  contactRow: {
    flexDirection: "row",
    alignItems: "center",
    textAlign: "center",
    paddingVertical: 0,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    gap: 8,
  },

  contactName: {
    fontSize: 10,
    fontWeight: "600",
  },

  contactPhone: {
    fontSize: 10,
    color: "#666",
    marginLeft: 8,
  },

  /* ===== FLECHAS ===== */
  arrowsSide: {
    justifyContent: "center",
    alignItems: "center",
    width: 44,
  },

  arrowBtn: {
    backgroundColor: "#1976d2",
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 6,
  },

  arrowText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "900",
  },

  /* ===== ERROR ===== */
  errorText: {
    textAlign: "center",
    color: "red",
  },
});
