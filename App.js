import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { PaperProvider, MD3DarkTheme } from "react-native-paper";
import AppNavigator from "./src/navigation/AppNavigator";
import { SafeAreaView } from "react-native-safe-area-context";
import './src/utils/i18n';

export default function App() {
  return (
<SafeAreaView style={{ flex: 1 }} edges={["top", "bottom"]}>

    <PaperProvider theme={MD3DarkTheme}>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </PaperProvider>
</SafeAreaView>
  );
}
