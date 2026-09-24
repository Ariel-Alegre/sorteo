import React, { useRef } from "react";
import { Platform, StyleSheet, View } from "react-native";
import {
  BannerAd,
  BannerAdSize,
  TestIds,
  useForeground,
} from "react-native-google-mobile-ads";
import { ADMOB_BANNER_IDS } from "../config/ads";
import { useAdsReady } from "../context/AdsContext";

export default function AdBanner() {
  const bannerRef = useRef(null);
  const adsReady = useAdsReady();
  const productionUnitId = ADMOB_BANNER_IDS[Platform.OS];
  const unitId = __DEV__ || !productionUnitId
    ? TestIds.BANNER
    : productionUnitId;

  useForeground(() => {
    if (Platform.OS === "ios") bannerRef.current?.load();
  });

  if (!adsReady) return null;

  return (
    <View style={styles.container}>
      <BannerAd
        ref={bannerRef}
        unitId={unitId}
        size={BannerAdSize.BANNER}
        onAdFailedToLoad={(error) => {
          if (__DEV__) console.warn("No se pudo cargar el banner", error);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 50,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
});

