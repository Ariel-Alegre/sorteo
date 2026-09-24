import React, { useEffect } from "react";
import { Text, TouchableOpacity, StyleSheet } from "react-native";
import { Appbar } from "react-native-paper";
import { useTranslation } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AdBanner from "./AdBanner";

const LANGUAGE_KEY = "appLanguage";

export default function Header({ title, back = false, navigation }) {
  const { i18n } = useTranslation();

  // Cargar idioma guardado
  useEffect(() => {
    const loadLanguage = async () => {
      try {
        const storedLang = await AsyncStorage.getItem(LANGUAGE_KEY);
        if (storedLang && storedLang !== i18n.language) {
          await i18n.changeLanguage(storedLang);
        }
      } catch (e) {
        console.log("Error cargando idioma", e);
      }
    };

    loadLanguage();
  }, []);

  // Alternar idioma
  const toggleLanguage = async () => {
    const newLang = i18n.language === "es" ? "en" : "es";

    try {
      await i18n.changeLanguage(newLang);
      await AsyncStorage.setItem(LANGUAGE_KEY, newLang);
    } catch (e) {
      console.log("Error cambiando idioma", e);
    }
  };

  // Bandera a mostrar
  const flag = i18n.language === "es" ? "🇬🇧" : "🇪🇸";

  return (
    <>
      <Appbar.Header>
        {back && <Appbar.BackAction onPress={() => navigation.goBack()} />}

        <Appbar.Content title={title} />

        <TouchableOpacity onPress={toggleLanguage}>
          <Text style={styles.flag}>{flag}</Text>
        </TouchableOpacity>
      </Appbar.Header>
      <AdBanner />
    </>
  );
}

const styles = StyleSheet.create({
  flag: {
    fontSize: 22,
    marginRight: 14,
  },
});
