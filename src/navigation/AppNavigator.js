import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../screens/HomeScreen";
import SorteoScreen from "../screens/SorteoScreen";
import StatScreen from "../screens/StatScreen";
import Test from "../screens/Test";
import OldNumbersScreens from "../screens/OldNumbersScreen";
import WithoutAppearingScreen from "../screens/WithoutAppearingScreen";
import DecenasTerminacionesScreens from "../screens/DecenasTerminacionesScreens";
import NumbersWithoutDrawScreens from "../screens/NumbersWithoutDrawScreen";
import MostFrequent23Screen from "../screens/MostFrequent23Screen";
import SecondDigitComparisonScreen from "../screens/SecondDigitComparisonScreen";
import PairsAndOddsScreen from "../screens/PairsAndOddsScreen";
import SecondDigitGreaterScreen from "../screens/SecondDigitGreaterScreen";
import SumDigitsScreen from "../screens/SumDigitsScreen";
import PairCombinationScreen from "../screens/PairCombinationScreen";
import DecenasTerminaciones2Screens from "../screens/DecenasTerminacionesScreens2";
import Last500DrawsScreen from "../screens/Last500DrawsScreen";


const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Sorteo" component={SorteoScreen} />
      <Stack.Screen name="OldNumbers" component={OldNumbersScreens} />
      <Stack.Screen name="WithoutAppearing" component={WithoutAppearingScreen} />
      <Stack.Screen name="DecenasTerminaciones" component={DecenasTerminacionesScreens} />
      <Stack.Screen name="NumbersWithoutDraw" component={NumbersWithoutDrawScreens} />
      <Stack.Screen name="MostFrequent23" component={MostFrequent23Screen} />
      <Stack.Screen name="SecondDigitComparison" component={SecondDigitComparisonScreen} />
      <Stack.Screen name="SumDigits" component={SumDigitsScreen} />
      <Stack.Screen name="PairCombination" component={PairCombinationScreen} />
      <Stack.Screen name="DecenasTerminaciones2" component={DecenasTerminaciones2Screens} />

      <Stack.Screen name="Last500Draws" component={Last500DrawsScreen} />



      <Stack.Screen name="PairsAndOdds" component={PairsAndOddsScreen} />






      <Stack.Screen name="Stat" component={StatScreen} />
      <Stack.Screen name="Test" component={Test} />

      <Stack.Screen name="SecondDigitGreater" component={SecondDigitGreaterScreen} />

    </Stack.Navigator>
  );
}
