import React, { createContext, useContext, useEffect, useState } from "react";
import mobileAds, { AdsConsent } from "react-native-google-mobile-ads";

const AdsContext = createContext(false);

export function AdsProvider({ children }) {
  const [adsReady, setAdsReady] = useState(false);

  useEffect(() => {
    let mounted = true;
    let initializationStarted = false;

    const initializeMobileAds = async () => {
      if (initializationStarted) return;
      initializationStarted = true;

      try {
        await mobileAds().initialize();
        if (mounted) setAdsReady(true);
      } catch (error) {
        if (__DEV__) console.warn("No se pudo inicializar AdMob", error);
      }
    };

    const prepareAds = async () => {
      try {
        const consentInfo = await AdsConsent.gatherConsent();
        if (consentInfo.canRequestAds) {
          await initializeMobileAds();
        }
      } catch (error) {
        // UMP recomienda intentar cargar anuncios con el consentimiento
        // guardado de la sesión anterior cuando la actualización falla.
        if (__DEV__) console.warn("No se pudo actualizar el consentimiento", error);
        await initializeMobileAds();
      }
    };

    prepareAds();

    return () => {
      mounted = false;
    };
  }, []);

  return <AdsContext.Provider value={adsReady}>{children}</AdsContext.Provider>;
}

export function useAdsReady() {
  return useContext(AdsContext);
}

