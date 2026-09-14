import { useWindowDimensions } from "react-native";

export function useResponsiveLayout() {
  const { width, height } = useWindowDimensions();

  return {
    width,
    height,
    tiny: false,
    font: (size) => size,
    space: (size) => size,
    boxHeight: (size) => size,
    tableHeight: (_ratio, min) => min,
    contentWidth: "80%",
  };
}
